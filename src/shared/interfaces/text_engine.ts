export default interface ITextEngine {
  reset(): void;
  showMenu(): void;
  showLoadMenu(): void;
  showSaveMenu(): void;
  setTexture(textureI: number): void;
  update(
    down: number,
    held: number,
    touchPosition: { x: number; y: number }
  ): void;
  onButtonPressed(button: any): void;
  drawBackground(): void;
  drawForeground(): void;

  getTextPane(): any;
  getChoiceView(): any;

  setBackgroundColor(c: number): void;
}
