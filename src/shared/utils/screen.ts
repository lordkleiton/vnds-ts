export default abstract class ScreenUtils {
  private static _fps = 0;

  static get fps(): number {
    return this._fps;
  }

  static get frametime(): number {
    if (!this.fps) {
      this.setFps();

      return 0;
    }

    return this.checkApproxFrameTime(this.fps);
  }

  static async checkApproxFps(): Promise<number> {
    return new Promise(resolve =>
      requestAnimationFrame(t1 =>
        requestAnimationFrame(t2 => resolve(Math.round(1000 / (t2 - t1))))
      )
    );
  }

  static checkApproxFrameTime(fps: number): number {
    return 1000 / fps;
  }

  static async setFps(): Promise<void> {
    this._fps = await this.checkApproxFps();
  }
}
