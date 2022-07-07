import { ScreenUtils } from "~/shared/utils";

export default abstract class KeyboardUtils {
  private static _pressed: string[] = [];
  private static _last_let_go?: string;
  private static _timestamp: number = 0;

  static get keys_pressed() {
    return [...this._pressed];
  }

  static get last_held(): string | undefined {
    return this._pressed.at(-1);
  }

  static get last_pressed(): string | undefined {
    const frametime = ScreenUtils.frametime;
    const delta = Date.now() - this._timestamp;

    if (delta > frametime * 2) return;

    return this._last_let_go;
  }

  private static _hasKey(key: string): boolean {
    return this._pressed.includes(key);
  }

  static setKeyboardHandler(element: HTMLElement): void {
    element.onkeydown = e => {
      const { code } = e;

      if (this._hasKey(code)) return;

      this._pressed.push(code);
    };

    element.onkeyup = e => {
      const { code } = e;

      if (!this._hasKey(code)) return;

      const pressed = this._pressed.splice(this._pressed.indexOf(code));

      this._timestamp = Date.now();

      this._last_let_go = pressed[0];
    };
  }
}
