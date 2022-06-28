type ConsoleMethods = "log" | "warn" | "error";

export default abstract class Logger {
  static enabled = true;

  private static _handle(
    method: ConsoleMethods,
    message?: any,
    ...optionalParams: any[]
  ) {
    if (this.enabled) console[method](message, optionalParams);
  }

  static log(message?: any, ...optionalParams: any[]): void {
    this._handle("log", message, optionalParams);
  }

  static warn(message?: any, ...optionalParams: any[]): void {
    this._handle("warn", message, optionalParams);
  }

  static error(message?: any, ...optionalParams: any[]): void {
    this._handle("error", message, optionalParams);
  }
}
