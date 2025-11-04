class Logger {
  static info(message, meta) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [INFO] ${message}`, meta ? JSON.stringify(meta) : '');
  }

  static error(message, error) {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [ERROR] ${message}`, error ? error.stack || error : '');
  }

  static warn(message, meta) {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] [WARN] ${message}`, meta ? JSON.stringify(meta) : '');
  }
}

module.exports = { Logger };
