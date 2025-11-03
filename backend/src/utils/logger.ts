export class Logger {
  static info(message: string, meta?: any): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [INFO] ${message}`, meta ? JSON.stringify(meta) : '');
  }

  static error(message: string, error?: any): void {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [ERROR] ${message}`, error ? error.stack || error : '');
  }

  static warn(message: string, meta?: any): void {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] [WARN] ${message}`, meta ? JSON.stringify(meta) : '');
  }
}
