import { ITextEngine, IVNDS } from "~/shared/interfaces";
import { DomUtils } from "~/shared/utils";

export default class TextEngine implements ITextEngine {
  constructor(private readonly _vnds: IVNDS) {}

  reset(): void {
    return;

    throw new Error("Method not implemented.");
  }

  showMenu(): void {
    return;

    throw new Error("Method not implemented.");
  }

  showLoadMenu(): void {
    return;

    throw new Error("Method not implemented.");
  }

  showSaveMenu(): void {
    return;

    throw new Error("Method not implemented.");
  }

  setTexture(textureI: number): void {
    return;

    throw new Error("Method not implemented.");
  }

  update(
    down: number,
    held: number,
    touchPosition: { x: number; y: number }
  ): void {
    return;

    throw new Error("Method not implemented.");
  }

  onButtonPressed(button: any): void {
    return;

    throw new Error("Method not implemented.");
  }

  drawBackground(): void {
    return;

    throw new Error("Method not implemented.");
  }

  drawForeground(): void {
    return;

    throw new Error("Method not implemented.");
  }

  getTextPane() {
    return;

    throw new Error("Method not implemented.");
  }

  getChoiceView() {
    return;

    throw new Error("Method not implemented.");
  }

  setBackgroundColor(c: number): void {
    return;

    throw new Error("Method not implemented.");
  }

  appendText(text: string): void {
    const text_container = DomUtils.getTextPane();
    const history_container = DomUtils.getHistoryPane();
    const text_container_bounding = text_container.getBoundingClientRect();

    const element = document.createElement("p");

    element.innerHTML = text || "&nbsp;";

    const element_2 = element.cloneNode(true);

    text_container.append(element);
    history_container.append(element_2);

    const element_bounding = element.getBoundingClientRect();

    if (element_bounding.bottom >= text_container_bounding.bottom) {
      while (text_container.childElementCount > 1) {
        const child = text_container.firstChild;

        if (child) text_container.removeChild(child);
      }
    }

    history_container.scrollTo({ top: history_container.scrollHeight });
  }
}
