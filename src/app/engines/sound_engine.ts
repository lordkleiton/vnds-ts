import { ISoundEngine, IVNDS } from "~/shared/interfaces";
import { Logger } from "~/app/other";

export default class SoundEngine implements ISoundEngine {
  private _musicAudio?: HTMLAudioElement;
  private _soundAudio?: HTMLAudioElement;

  private _musicPath: string = "\0";
  private _soundPath: string = "\0";

  private _mute: boolean = false;

  constructor(private readonly _vnds: IVNDS) {}

  reset(): void {
    this.stopMusic();
    this.stopSound();
    this._musicAudio = undefined;
    this._soundAudio = undefined;
    this._musicPath = "\0";
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
      this._musicPath = "\0";
      return;
    }

    this._vnds
      .getAudioFile(path)
      .then(audioFile => {
        if (audioFile) {
          this.stopMusic();

          this._musicPath = path;
          const musicUrl = window.URL.createObjectURL(audioFile);

          this._musicAudio = new Audio(musicUrl);
          this._musicAudio.play();

          Logger.log("Starting music: ", path);
        }
      })
      .catch(_ => {
        Logger.error("Can't find music file: ", path);
      });
  }

  stopMusic(): void {
    this._stopAudio(this._musicAudio);
    Logger.log("Stoping music: ", this._musicPath);
  }

  playSound(path: string, times?: number | undefined): void {
    if (this._pathContainsStop(path)) {
      this.stopSound();
      this._soundPath = "\0";
      return;
    }

    this._vnds
      .getAudioFile(path)
      .then(audioFile => {
        if (audioFile) {
          this.stopSound();

          this._soundPath = path;
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
          Logger.log("Playing sound: ", path, times);
        }
      })
      .catch(_ => {
        Logger.error("Can't find sound file: ", path);
      });
  }

  stopSound(): void {
    this._stopAudio(this._soundAudio);
    Logger.log("Stopping sound: ", this._soundPath);
  }

  replaySound(): void {
    this.stopSound();
    this.setMuted(false);
    this.playSound(this._soundPath);
  }

  setMuted(m: boolean): void {
    this._mute = m;
    this.setSoundVolume(m ? 0 : 0.5);
    this.setMusicVolume(m ? 0 : 0.5);
  }

  isMuted(): boolean {
    return this._mute;
  }

  getMusicPath(): string {
    return this._musicPath;
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
