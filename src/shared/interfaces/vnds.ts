import IGraphicsEngine from "./graphics_engine";
import IScriptEngine from "./script_engine";
import ISoundEngine from "./sound_engine";
import ITextEngine from "./text_engine";
import IVariable from "./variable";

export default interface IVNDS {
  root_folder: FileSystemDirectoryHandle;
  globals: Record<string, IVariable>;
  variables: Record<string, IVariable>;

  textEngine: ITextEngine;
  graphicsEngine: IGraphicsEngine;
  scriptEngine: IScriptEngine;
  soundEngine: ISoundEngine;

  continue(quickread: boolean): void;
  reset(): void;
  quit(): void;
  run(): void;

  isWaitingForInput(): boolean;
  getDelay(): number;
  setDelay(d: number): void;
  setWaitForInput(b: boolean): void;
  setVariable(name: string, op: string, value: string): void;
  setGlobal(name: string, op: string, value: string): void;

  getBgFile(filename: string): Promise<File | undefined>;
  getFgFile(filename: string): Promise<File | undefined>;
  getScriptFile(path: string): Promise<File | undefined>;
  getAudioFile(path: string): Promise<File | undefined>;
}
