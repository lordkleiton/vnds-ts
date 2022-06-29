import {
  ELEMENT_CANVAS,
  ELEMENT_PLAY_AREA,
  ELEMENT_TEXT_CURRENT,
  ELEMENT_TEXT_HISTORY,
} from "~/shared/consts";

export default abstract class DomUtils {
  private static get _text_panel_shown(): boolean {
    return !this.getTextPane().classList.contains("hide");
  }

  private static get _history_panel_shown(): boolean {
    return !this.getHistoryPane().classList.contains("hide");
  }

  static get text_area_shown(): boolean {
    return this._text_panel_shown || this._history_panel_shown;
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

  static getPlayArea(): HTMLDivElement {
    const element = this._getElement<HTMLDivElement>(ELEMENT_PLAY_AREA, "div");

    return element as HTMLDivElement;
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

  private static _hideHistoryPane(): void {
    this._addClassHide(this.getHistoryPane());
  }

  private static _hideTextPane(): void {
    this._addClassHide(this.getTextPane());
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

  static async setFont(font: File): Promise<void> {
    const font_family = "custom novel font";
    const font_face = new FontFace(
      font_family,
      `url(${window.URL.createObjectURL(font)})`
    );
    const loaded_face = await font_face.load();
    const play_area = this.getPlayArea();

    document.fonts.add(loaded_face);

    play_area.style.fontFamily = `"${font_family}", Arial`;
  }

  static toggleTextPane(): void {
    if (this._text_panel_shown) {
      DomUtils.showHistoryPane();
    } else {
      DomUtils.showTextPane();
    }
  }

  static toggleTextArea(): void {
    if (this._text_panel_shown || this._history_panel_shown) {
      this._hideHistoryPane();

      this._hideTextPane();
    } else {
      this.showTextPane();
    }
  }
}
