import {
  ELEMENT_CANVAS,
  ELEMENT_CHOICE_AREA,
  ELEMENT_GAME_AREA,
  ELEMENT_TEXT_AREA,
  ELEMENT_TEXT_CURRENT,
  ELEMENT_TEXT_HISTORY,
} from "~/shared/consts";

export default abstract class DomUtils {
  private static get _text_panel_shown(): boolean {
    return !this.getTextPane().classList.contains("hide");
  }

  static get text_area_shown(): boolean {
    return !this.getTextArea().classList.contains("hide");
  }

  static get choice_area_shown(): boolean {
    return !this.getChoiceArea().classList.contains("hide");
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

    return element!;
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

  private static _getGameArea(): HTMLDivElement {
    const element = this._getElement<HTMLDivElement>(ELEMENT_GAME_AREA, "div");

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

  static getTextArea(): HTMLDivElement {
    const element = this._getElement<HTMLDivElement>(ELEMENT_TEXT_AREA, "div");

    return element as HTMLDivElement;
  }

  static async setFont(font: File): Promise<void> {
    const font_family = "custom novel font";
    const font_face = new FontFace(
      font_family,
      `url(${window.URL.createObjectURL(font)})`
    );
    const loaded_face = await font_face.load();
    const play_area = this._getGameArea();

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
    if (this.text_area_shown) {
      this.hideTextArea();
    } else {
      this.showTextArea();
    }
  }

  static hideTextArea(): void {
    const element = this.getTextArea();

    this._addClassHide(element);
  }

  static showTextArea(): void {
    const element = this.getTextArea();

    this._removeClassHide(element);
  }

  static getChoiceArea(): HTMLDivElement {
    const element = this._getElement<HTMLDivElement>(
      ELEMENT_CHOICE_AREA,
      "div"
    );

    return element as HTMLDivElement;
  }

  static showChoiceArea(): void {
    const element = this.getChoiceArea();

    this.hideTextArea();

    this._removeClassHide(element);
  }

  static hideChoiceArea(): void {
    const element = this.getChoiceArea();

    this._addClassHide(element);

    this.showTextArea();
  }

  static changeFavicon(url: string): void {
    const icon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;

    if (icon) {
      icon.href = url;
    } else {
      const new_icon = document.createElement("link");

      new_icon.rel = "icon";

      new_icon.href = url;

      document.head.append(new_icon);
    }
  }
}
