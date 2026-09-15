# LJ CareerConnect — Backend

Express + MongoDB REST API for LJ CareerConnect. See the [root README](../README.md) for the full project overview, and [`../documentation/`](../documentation/) for architecture, database schema, API reference and setup guide.

## Quick start

```bash
npm install
cp .env.example .env    # then fill in MONGO_URI, JWT_SECRET, etc.
npm run seed             # creates the admin account + realistic demo data
npm run dev               # starts the API on http://localhost:5000
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the API with nodemon (auto-restart on file change) |
| `npm start` | Start the API with plain node (production) |
| `npm run seed` | Populate the database with demo data (admin, companies, students, jobs, applications, drives, alumni...) |
| `npm run seed:destroy` | Wipe all collections |

## Structure

```
src/
├── config/       env, MongoDB connection, Cloudinary
├── models/       Mongoose schemas
├── middleware/   auth, error handling, file upload, validation, rate limiting
├── controllers/  request handlers
├── services/     AI engine (Gemini + local fallback), file storage, notifications
├── routes/       REST route definitions, mounted under /api
├── utils/        ApiError, ApiResponse, token generation, match scoring
├── validators/   express-validator chains
├── app.js        Express app setup
└── server.js     entry point
seed/             demo data generator
uploads/          local file storage fallback (used only without Cloudinary)
```

## Troubleshooting MongoDB connectivity

If `npm run dev` or `npm run seed` fails with something like:
```
MongoNetworkError: connect ETIMEDOUT <IP>:27017
```
or
```
querySrv ETIMEOUT _mongodb._tcp.<cluster>.mongodb.net
```

This means one specific replica member is intermittently unreachable over TCP/DNS from this network at that moment — not a bad connection string, bad credentials, wrong database name, or a code bug. It's not necessarily a blanket firewall block either: a raw `Test-NetConnection <host> -Port 27017` can succeed while a real app still hits this, because `mongodb+srv://` requires the driver to first do a DNS **SRV** lookup (host discovery) and a **TXT** lookup (default options) — both less common query types than the plain A-record lookup a one-off ping/TCP test uses — and because a real connection is opened/reused repeatedly over a run, it's exposed to more intermittent windows than a single manual test.

The app is already hardened against this in three layers (`backend/src/config/db.js` and `backend/seed/seed.js`):
1. It resolves the SRV + TXT records itself and connects via the equivalent standard `mongodb://host1,host2,host3/...` form, bypassing the driver's own internal SRV lookup step entirely.
2. It retries the connection itself up to 3 times with generous timeouts (`serverSelectionTimeoutMS`/`connectTimeoutMS`/`socketTimeoutMS`).
3. `npm run seed` additionally retries the **entire seed run** (not just the connect step) up to 3 times, since a write can still hit an unreachable node even after a successful connect — every attempt starts clean (it clears collections again before repopulating), so a retry never leaves half-seeded data.

If it still fails after all of that:

1. **Identify exactly which host is consistently the problem.** Atlas SRV clusters resolve to 3 shard hosts named like `<id>-shard-00-00/01/02.<cluster>.mongodb.net`. Watch which specific IP shows up in repeated `ETIMEDOUT <IP>:27017` errors across several runs — if it's the *same* IP every time, that member is your actual primary and is the one with the unreliable path; the other members being fine doesn't help since writes must reach the primary specifically.
2. **Confirm the cluster itself is fine**: log into MongoDB Atlas → your cluster should show a green "Active" status, not "Paused" or "Provisioning" (a paused cluster refuses all connections outright, distinct from the intermittent timeouts above), and check that node's own health/activity feed in Atlas for any ongoing maintenance.
3. If one node is persistently bad while the app's built-in retries only paper over it slowly, that's a signal to raise with your network provider (or MongoDB Atlas support, if the pattern also shows up from other networks) about routing to that specific IP — it's no longer something client-side code can route around, since retries just keep landing on the same primary.

