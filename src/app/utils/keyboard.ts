export default abstract class KeyboardUtils {
  private static _pressed: string[] = [];
  private static _timestamp: number = 0;

  static get keys_pressed() {
    return [...this._pressed];
  }

  static get last_pressed(): string | undefined {
    return this._pressed.at(-1);
  }

  private static _hasKey(key: string): boolean {
    return this._pressed.includes(key);
  }

  static setKeyboardHandler(element: HTMLElement): void {
    element.onkeydown = e => {
      const code = e.code;

      if (this._hasKey(code)) return;

      this._pressed.push(code);

      this._timestamp = Date.now();
    };

    element.onkeyup = e => {
      const code = e.code;

      if (!this._hasKey(code)) return;

      this._pressed.splice(this._pressed.indexOf(code));

      console.log(this.last_pressed);
    };
  }
}
