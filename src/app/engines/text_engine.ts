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
}
