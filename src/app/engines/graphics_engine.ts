import { IGraphicsEngine, IVNDS } from "~/shared/interfaces";
import { SIZE_CANVAS_HEIGHT, SIZE_CANVAS_WIDTH } from "~/shared/consts";
import { DomUtils } from "~/shared/utils";

export default class GraphicsEngine implements IGraphicsEngine {
  private _canvas = DomUtils.getCanvas();

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

  async setBackground(filename: string, fadeTime?: number): Promise<void> {
    const file = await this._vnds.getBgFile(filename);

    if (file) {
      const url = window.URL;
      const ctx = this._canvas.getContext("2d");

      if (ctx) {
        const img = new Image();

        img.src = url.createObjectURL(file);

        img.onload = () => {
          ctx.drawImage(img, 0, 0, SIZE_CANVAS_WIDTH, SIZE_CANVAS_HEIGHT);
        };
      }
    }
  }

  async setForeground(filename: string, x: number, y: number): Promise<void> {
    const file = await this._vnds.getFgFile(filename);

    if (file) {
      const url = window.URL;
      const ctx = this._canvas.getContext("2d");

      if (ctx) {
        const img = new Image();

        img.src = url.createObjectURL(file);

        img.onload = () => {
          ctx.drawImage(img, x, y);
        };
      }
    }
  }
}
