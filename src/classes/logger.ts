type ConsoleMethods = "log" | "warn" | "error";

export default abstract class Logger {
  static enabled = true;

  private static _handle(method: ConsoleMethods, message: any) {
    if (this.enabled) console[method](message);
  }

  static log(message: any): void {
    this._handle("log", message);
  }

  static warn(message: any): void {
    this._handle("warn", message);
  }

  static error(message: any): void {
    this._handle("error", message);
  }
}
