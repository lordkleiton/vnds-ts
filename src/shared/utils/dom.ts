import {
  ELEMENT_CANVAS,
  ELEMENT_TEXT_CURRENT,
  ELEMENT_TEXT_HISTORY,
} from "~/shared/consts";

export default abstract class DomUtils {
  static get text_panel_shown(): boolean {
    return !this.getTextPane().classList.contains("hide");
  }

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

  static getTextPane(): HTMLDivElement {
    const element = this._getElement<HTMLDivElement>(
      ELEMENT_TEXT_CURRENT,
      "div"
    );

    return element as HTMLDivElement;
  }

  static getCanvas(): HTMLCanvasElement {
    const element = this._getElement<HTMLCanvasElement>(
      ELEMENT_CANVAS,
      "canvas"
    );

    return element as HTMLCanvasElement;
  }

  private static _addClassHide(element: HTMLElement): void {
    element.classList.add("hide");
  }

  private static _removeClassHide(element: HTMLElement): void {
    element.classList.remove("hide");
  }

  private static _togglePanes(show: HTMLElement, hide: HTMLElement): void {
    this._addClassHide(hide);
    this._removeClassHide(show);
  }

  static showHistoryPane(): void {
    const show = this.getHistoryPane();
    const hide = this.getTextPane();

    this._togglePanes(show, hide);
  }

  static showTextPane(): void {
    const show = this.getTextPane();
    const hide = this.getHistoryPane();

    this._togglePanes(show, hide);
  }
}
