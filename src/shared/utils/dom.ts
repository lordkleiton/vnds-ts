import { ELEMENT_TEXT_CURRENT, ELEMENT_TEXT_HISTORY } from "~/shared/consts";

export default abstract class DomUtils {
  private static _getDomElement<T>(selector: string): T | null {
    const selected = document.querySelector(selector);

    if (selected) {
      return selected as unknown as T;
    }

    return null;
  }

  private static _getElement<T>(
    selector: string,
    fallback: keyof HTMLElementTagNameMap
  ): T | HTMLElement {
    const element = this._getDomElement<T>(selector);

    return element || document.createElement(fallback);
  }

  static getHistoryPane(): HTMLDivElement {
    const element = this._getElement<HTMLDivElement>(
      ELEMENT_TEXT_HISTORY,
      "div"
    );

    return element as HTMLDivElement;
  }

  static getCurrentPane(): HTMLDivElement {
    const element = this._getElement<HTMLDivElement>(
      ELEMENT_TEXT_CURRENT,
      "div"
    );

    return element as HTMLDivElement;
  }

  static getCanvas(): HTMLCanvasElement {
    const element = this._getElement<HTMLCanvasElement>(
      ELEMENT_TEXT_CURRENT,
      "canvas"
    );

    return element as HTMLCanvasElement;
  }
}
