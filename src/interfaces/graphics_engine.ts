export default interface IGraphicsEngine {
  isImageCached(path: string): boolean;
  getBackgroundPath(): string;
  getSprites(): any;
  getNumberOfSprites(): number;

  reset(): void;
  flush(quickread: boolean): void;
  clearCache(): void;
  isBackgroundChanged(): boolean;
  setBackground(filename: string, fadeTime: number): void;
  setForeground(filename: string, x: number, y: number): void;
}
