export default interface IVNChoice {
  get is_active(): boolean;

  activate(): void;
  deactivate(): void;
  removeAllItems(): void;
  removeItems(num: number): void;
  update(key: string): void;
  onButtonPressed(button: HTMLLinkElement): void;
  appendText(str: string, color: number, stripSpaces: boolean): void;
  drawListItemBg(index: number): void;
  drawListItemFg(index: number): void;
  setSelectedIndex(selected: number): void;
}
