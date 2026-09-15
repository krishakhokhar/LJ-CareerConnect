const mongoose = require('mongoose');
const dns = require('dns').promises;
const env = require('./env');

const DB_NAME = 'lj_careerconnect';

/** Redacts the password out of a Mongo connection string for safe logging. */
const sanitizeUri = (uri) => uri.replace(/:\/\/([^:/@]+):([^@]+)@/, '://$1:***@');

const CONNECT_OPTIONS = {
  dbName: DB_NAME, // explicit, so the DB used never depends on the URI's path segment
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  maxPoolSize: 10,
};

/**
 * `mongodb+srv://` URIs require the driver to do a DNS **SRV** lookup (host
 * discovery) plus a **TXT** lookup (default options like replicaSet/authSource)
 * before it can even attempt a real connection. Those are far less common
 * DNS query types than the plain A-record lookups a ping/TCP test uses, and
 * plenty of consumer routers/resolvers handle them unreliably even when
 * A-record + raw TCP:27017 work perfectly - which is exactly the pattern
 * observed here (TCP reachability confirmed on all 3 shard hosts, yet the
 * srv-based driver connect intermittently times out).
 *
 * This resolves the SRV + TXT records ourselves (under our own timeout/retry
 * control, using plain A-record lookups for the actual hosts afterward) and
 * builds the equivalent standard `mongodb://host1,host2,host3/db?...` URI -
 * the same connection Atlas's own UI offers as the "Standard Connection
 * String" alternative to SRV. This removes the driver's internal SRV/TXT
 * step from the critical path entirely. Falls back to the raw srv:// URI
 * unchanged if manual resolution itself fails for any reason.
 */
const resolveStandardUri = async (srvUri) => {
  if (!srvUri.startsWith('mongodb+srv://')) return srvUri; // already a standard URI - nothing to do

  const parsed = new URL(srvUri.replace('mongodb+srv://', 'https://'));
  const host = parsed.hostname;

  const [srvRecords, txtRecords] = await Promise.all([
    dns.resolveSrv(`_mongodb._tcp.${host}`),
    dns.resolveTxt(host).catch(() => []), // TXT is optional - the driver can still auto-discover the replica set without it
  ]);

  if (!srvRecords?.length) throw new Error('SRV lookup returned no hosts');

  const hostList = srvRecords.map((r) => `${r.name}:${r.port}`).join(',');

  const txtParams = new URLSearchParams((txtRecords[0] || []).join(''));
  const query = new URLSearchParams(parsed.search);
  query.set('tls', 'true'); // mongodb+srv implies TLS by default; the standard mongodb:// form does not, so it must be set explicitly
  query.set('authSource', query.get('authSource') || txtParams.get('authSource') || 'admin');
  const replicaSet = query.get('replicaSet') || txtParams.get('replicaSet');
  if (replicaSet) query.set('replicaSet', replicaSet);
  if (!query.has('retryWrites')) query.set('retryWrites', 'true');
  if (!query.has('w')) query.set('w', 'majority');

  const dbPath = parsed.pathname && parsed.pathname !== '/' ? parsed.pathname : `/${DB_NAME}`;
  const userinfo = parsed.username ? `${parsed.username}:${parsed.password}@` : '';

  return `mongodb://${userinfo}${hostList}${dbPath}?${query.toString()}`;
};

const RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 3000;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connectOnce = async (uri) => {
  mongoose.set('strictQuery', true);
  const conn = await mongoose.connect(uri, CONNECT_OPTIONS);
  console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
};

/**
 * Connects to MongoDB with generous timeouts, an SRV-bypass (see above) and
 * a short retry loop. Throws on total failure rather than exiting the
 * process itself - callers (server.js for the API, seed.js for the seed
 * script) decide what "give up" should mean for them.
 */
const connectDB = async () => {
  if (!env.MONGO_URI) {
    throw new Error('MONGO_URI is not set. Copy backend/.env.example to backend/.env and fill it in.');
  }

  let connectUri = env.MONGO_URI;
  try {
    connectUri = await resolveStandardUri(env.MONGO_URI);
    if (connectUri !== env.MONGO_URI) {
      console.log('Resolved mongodb+srv:// to a standard multi-host connection string (bypasses in-driver SRV lookup).');
    }
  } catch (resolveError) {
    console.warn(`Manual SRV/TXT resolution failed (${resolveError.code || resolveError.message}); falling back to the srv:// URI as given.`);
  }

  for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt += 1) {
    try {
      await connectOnce(connectUri);
      return;
    } catch (error) {
      const isLastAttempt = attempt === RETRY_ATTEMPTS;
      console.error(
        `MongoDB connection attempt ${attempt}/${RETRY_ATTEMPTS} failed ` +
          `(${error.code || error.name || 'error'}: ${error.message}) ` +
          `for ${sanitizeUri(connectUri)}`
      );

      if (isLastAttempt) {
        throw error;
      }

      await sleep(RETRY_DELAY_MS * attempt);
    }
  }
};

module.exports = connectDB;
