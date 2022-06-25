export default interface ISoundEngine {
  reset(): void;
  update(): void;
  setMusic(path: string): void;
  stopMusic(): void;
  playSound(path: string, times: number): void;
  stopSound(): void;
  replaySound(): void;
  setMuted(m: boolean): void;

  isMuted(): boolean;
  getMusicPath(): string;

  setSoundVolume(v: number): void;
  setMusicVolume(v: number): void;
}
