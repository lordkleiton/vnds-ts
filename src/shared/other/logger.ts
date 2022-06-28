type ConsoleMethods = "log" | "warn" | "error";

export default abstract class Logger {
  static enabled = true;

  private static _wrapper(method: ConsoleMethods) {
    return this.enabled ? console[method] : () => {};
  }

  static log(...params: any[]): void {
    this._wrapper("log")(...params);
  }

  static warn(...params: any[]): void {
    this._wrapper("warn")(...params);
  }

  static error(...params: any[]): void {
    this._wrapper("error")(...params);
  }
}
