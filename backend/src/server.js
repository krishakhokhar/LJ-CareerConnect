const app = require('./app');
const connectDB = require('./config/db');
const env = require('./config/env');

const startServer = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.error('See backend/README.md -> "Troubleshooting MongoDB connectivity" for how to diagnose this.');
    process.exit(1);
  }

  const server = app.listen(env.PORT, () => {
    console.log(`LJ CareerConnect API running on port ${env.PORT} [${env.NODE_ENV}]`);
  });

  // A clear, actionable message instead of a raw stack trace when the port
  // is already taken - most often a previous `npm run dev`/`npm start` that
  // wasn't fully stopped (nodemon restarts can also leave a stale child
  // process behind on some setups).
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\nPort ${env.PORT} is already in use - another process is listening on it.`);
      console.error(`Find it with:  netstat -ano | findstr :${env.PORT}   (note the PID in the last column)`);
      console.error(`Stop it with:  taskkill /PID <pid> /F`);
      console.error('Then run `npm run dev` again. To use a different port instead, set PORT in backend/.env.\n');
      process.exit(1);
    }
    console.error('Server error:', err.message);
    process.exit(1);
  });

  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err.message);
    server.close(() => process.exit(1));
  });
};

startServer();
