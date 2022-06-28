import { ISoundEngine } from "~/shared/interfaces";

export default class SoundEngine implements ISoundEngine {
  reset(): void {
    return;
    throw new Error("Method not implemented.");
  }

  update(): void {
    return;

    throw new Error("Method not implemented.");
  }

  setMusic(path: string): void {
    return;

    throw new Error("Method not implemented.");
  }

  stopMusic(): void {
    return;

    throw new Error("Method not implemented.");
  }

  playSound(path: string, times?: number | undefined): void {
    return;

    throw new Error("Method not implemented.");
  }

  stopSound(): void {
    return;

    throw new Error("Method not implemented.");
  }

  replaySound(): void {
    return;

    throw new Error("Method not implemented.");
  }

  setMuted(m: boolean): void {
    return;

    throw new Error("Method not implemented.");
  }

  isMuted(): boolean {
    return false;

    throw new Error("Method not implemented.");
  }

  getMusicPath(): string {
    return "";

    throw new Error("Method not implemented.");
  }

  setSoundVolume(v: number): void {
    return;

    throw new Error("Method not implemented.");
  }

  setMusicVolume(v: number): void {
    return;

    throw new Error("Method not implemented.");
  }
}
