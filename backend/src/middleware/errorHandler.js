const { Logger } = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  Logger.error('Unhandled error', err);

  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};

const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
