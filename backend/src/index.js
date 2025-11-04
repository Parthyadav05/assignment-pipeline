const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDatabase } = require('./utils/database');
const contactRoutes = require('./routes/contactRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { Logger } = require('./utils/logger');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  } catch (error) {
    Logger.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
