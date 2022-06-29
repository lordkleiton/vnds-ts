import { ITextEngine, IVNDS } from "~/shared/interfaces";

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
    const text_container_name = "#history-text-area";
    const history_container_name = "#current-text-area";

    const text_container = document.querySelector(
      text_container_name
    ) as HTMLDivElement;
    const history_container = document.querySelector(
      history_container_name
    ) as HTMLDivElement;

    const element = document.createElement("p");

    element.innerHTML = text || "&nbsp;";

    const element_2 = element.cloneNode(true);

    text_container.append(element);
    history_container.append(element_2);
  }
}
