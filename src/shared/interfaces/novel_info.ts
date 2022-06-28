export default interface INovelInfo {
  getPath(): string;
  getTitle(): string;
  getFontSize(): number;
  getIcon(): number;
  getThumbnail(): number;

  setPath(p: string): void;
  setTitle(t: string): void;
  setFontsize(s: number): void;
}
