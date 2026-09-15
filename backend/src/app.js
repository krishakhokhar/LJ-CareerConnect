const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');

const env = require('./config/env');
const apiRoutes = require('./routes');
const { notFound, errorHandler } = require('./middleware/error.middleware');
const { apiLimiter } = require('./middleware/rateLimiter.middleware');

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());

if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Serve locally-stored uploads (used only when Cloudinary is not configured)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api', apiLimiter, apiRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'LJ CareerConnect API', docs: '/api/health' });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
