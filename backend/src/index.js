const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDatabase } = require('./utils/database');
const contactRoutes = require('./routes/contactRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { idempotencyMiddleware, cleanupExpiredKeys } = require('./middleware/idempotency');
const { Logger } = require('./utils/logger');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply idempotency middleware globally
app.use(idempotencyMiddleware);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

app.use('/contacts', contactRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      Logger.info(`Server running on port ${PORT}`);
    });

    // Run cleanup of expired idempotency keys every hour
    setInterval(async () => {
      try {
        await cleanupExpiredKeys();
      } catch (error) {
        Logger.error('Scheduled cleanup failed', error);
      }
    }, 60 * 60 * 1000); // Run every hour

    // Run initial cleanup on startup
    setTimeout(async () => {
      try {
        await cleanupExpiredKeys();
      } catch (error) {
        Logger.error('Initial cleanup failed', error);
      }
    }, 5000); // Run 5 seconds after startup
  } catch (error) {
    Logger.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
