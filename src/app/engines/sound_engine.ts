import { ISoundEngine, IVNDS } from "~/shared/interfaces";

export default class SoundEngine implements ISoundEngine {
  private _musicAudio?: HTMLAudioElement;
  private _soundAudio?: HTMLAudioElement;

  constructor(private readonly _vnds: IVNDS) {}

  reset(): void {
    this._musicAudio = undefined;
    this._soundAudio = undefined;
  }

  update(): void {
    return;

    throw new Error("Method not implemented.");
  }

  private _stopAudio(audio?: HTMLAudioElement) {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  private _pathContainsStop(path: string): boolean {
    // For music and sound, if the file is ~ means it must stop execution.
    return path.split("/")[1] === "~";
  }

  /* interface stuff */

  setMusic(path: string): void {
    if (this._pathContainsStop(path)) {
      this.stopMusic();
      return;
    }

    this._vnds.getAudioFile(path).then(audioFile => {
      if (audioFile) {
        this.stopMusic();

        const musicUrl = window.URL.createObjectURL(audioFile);

        this._musicAudio = new Audio(musicUrl);
        this._musicAudio.play();
      }
    });
  }

  stopMusic(): void {
    this._stopAudio(this._musicAudio);
  }

  playSound(path: string, times?: number | undefined): void {
    if (this._pathContainsStop(path)) {
      this.stopSound();
      return;
    }

    this._vnds.getAudioFile(path).then(audioFile => {
      if (audioFile) {
        this.stopSound();

        const soundUrl = window.URL.createObjectURL(audioFile);

        this._soundAudio = new Audio(soundUrl);

        if (times) {
          this._soundAudio.loop = true;

          if (times > 0) {
            let playbackCount = 0;
            this._soundAudio.onended = () => {
              if (times && playbackCount < times) {
                playbackCount += 1;
              } else {
                this.stopSound();
              }
            };
          }
        }

        this._soundAudio.play();
      }
    });
  }

  stopSound(): void {
    // Not tested.
    this._stopAudio(this._soundAudio);
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
    // Not tested.
    if (!this._soundAudio) return;
    this._soundAudio.volume = v;
  }

  setMusicVolume(v: number): void {
    // Not tested.
    if (!this._musicAudio) return;
    this._musicAudio.volume = v;
  }
}
