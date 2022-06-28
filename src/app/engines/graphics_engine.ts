import { IGraphicsEngine, IVNDS } from "~/shared/interfaces";

export default class GraphicsEngine implements IGraphicsEngine {
  constructor(private readonly _vnds: IVNDS) {}

  isImageCached(path: string): boolean {
    return false;

    throw new Error("Method not implemented.");
  }

  getBackgroundPath(): string {
    return "";

    throw new Error("Method not implemented.");
  }

  getSprites() {
    return;

    throw new Error("Method not implemented.");
  }

  getNumberOfSprites(): number {
    return 0;

    throw new Error("Method not implemented.");
  }

  reset(): void {
    return;

    throw new Error("Method not implemented.");
  }

  flush(quickread: boolean): void {
    return;

    throw new Error("Method not implemented.");
  }

  clearCache(): void {
    return;

    throw new Error("Method not implemented.");
  }

  isBackgroundChanged(): boolean {
    return false;

    throw new Error("Method not implemented.");
  }

  setBackground(filename: string, fadeTime?: number): void {
    return;

    throw new Error("Method not implemented.");
  }

  setForeground(filename: string, x: number, y: number): void {
    return;

    throw new Error("Method not implemented.");
  }
}
