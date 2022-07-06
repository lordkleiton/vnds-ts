import {
  IGraphicsEngine,
  INovelInfo,
  IScriptEngine,
  ISoundEngine,
  ITextEngine,
  IVariable,
  IVNDS,
} from "~/shared/interfaces";
import { SC_DOLLAR, SC_QUOTE, SC_TILDE } from "~/shared/consts";
import { VarType } from "~/shared/enums";
import Variable from "./variable";
import {
  TextEngine,
  SoundEngine,
  GraphicsEngine,
  ScriptEngine,
} from "~/app/engines";
import { Logger } from "~/app/other";
import { FileReaderUtils, StringUtils, ZipReaderUtils } from "~/shared/utils";

export default class VNDS implements IVNDS {
  private _quit: boolean = false;
  private _waitForInput: boolean = false;
  private _delay: number = 0;

  private _root_folder?: FileSystemDirectoryHandle;

  get root_folder() {
    if (!this._root_folder) throw new Error("no root folder set");

    return this._root_folder;
  }

  set root_folder(folder: FileSystemDirectoryHandle) {
    this._root_folder = folder;
  }

  globals: Record<string, IVariable> = {};
  variables: Record<string, IVariable> = {};
  textEngine: ITextEngine;
  graphicsEngine: IGraphicsEngine;
  scriptEngine: IScriptEngine;
  soundEngine: ISoundEngine;

  constructor(novelInfo: INovelInfo) {
    this.scriptEngine = new ScriptEngine(this);

    this.graphicsEngine = new GraphicsEngine(this);

    this.textEngine = new TextEngine(this);

    this.soundEngine = new SoundEngine(this);
  }

  private _copy(v: IVariable): any {
    return JSON.parse(JSON.stringify({ str: v.str, num: v.num, type: v.type }));
  }

  private _getVariables(name: string): IVariable | undefined {
    const local = this.variables[name];

    if (local) return local;

    const global = this.globals[name];

    if (global) return global;
  }

  private _setVariable(
    obj: Record<string, IVariable>,
    name: string,
    op: string,
    value: string
  ): void {
    if (op == SC_TILDE) {
      obj = {};

      return;
    }

    const clean_right_value = value
      .replace(RegExp(SC_QUOTE, "gi"), "")
      .replace(SC_DOLLAR, "");

    const right: IVariable =
      this._getVariables(clean_right_value) || new Variable(clean_right_value);

    const exists = obj[name];
    const left = !!exists
      ? exists
      : new Variable(right.type == VarType.VT_int ? 0 : "");
    const work_with_strings =
      left.type == VarType.VT_string || right.type == VarType.VT_string;
    const inferred_type = work_with_strings
      ? VarType.VT_string
      : VarType.VT_int;

    switch (inferred_type) {
      case VarType.VT_int:
        switch (op) {
          case "+":
            left.num += right.num;
            break;
          case "-":
            left.num -= right.num;
            break;
          case "=":
            left.num = right.num;
            break;
          default:
            Logger.log(
              "setvar :: Unsupported operator for target type int",
              op
            );
            return;
        }
        break;
      case VarType.VT_string:
        switch (op) {
          case "+":
            left.str += right.str;
            break;
          case "=":
            left.str = right.str;
            break;
          default:
            Logger.log(
              "setvar :: Unsupported operator for target type string",
              op
            );
            return;
        }
        break;
    }

    obj[name] = left;
  }

  private _update(): void {
    if (this._delay > 0) {
      this._delay--;
    }
  }

  /* interface stuff */

  continue(quickread: boolean): void {
    this._delay = 0;

    this._waitForInput = false;

    this.scriptEngine.executeNextCommand(quickread);
  }

  reset(): void {
    this.textEngine.reset();
    this.graphicsEngine.reset();
    this.scriptEngine.reset();
    this.soundEngine.reset();

    this.globals = {};
    this.variables = {};

    this._quit = false;
    this._waitForInput = false;
    this._delay = 0;
  }

  quit(): void {
    this._quit = true;
  }

  async run(): Promise<void> {
    this._quit = false;

    while (!this._quit) {
      this._update();
    }
  }

  isWaitingForInput(): boolean {
    return this._waitForInput;
  }

  getDelay(): number {
    return this._delay;
  }

  setDelay(d: number): void {
    this._delay = d;
  }

  setWaitForInput(b: boolean): void {
    this._waitForInput = b;
  }

  setVariable(name: string, op: string, value: string): void {
    this._setVariable(this.variables, name, op, value);
  }

  setGlobal(name: string, op: string, value: string): void {
    this._setVariable(this.globals, name, op, value);
  }

  async getBgFile(filename: string): Promise<File | undefined> {
    const bg = await this.root_folder.getFileHandle("background.zip");
    const read = ZipReaderUtils.readZippedFile(await bg.getFile());
    const entries = await read.getEntries();
    const entry = entries.find(e => StringUtils.equals(e.filename, filename));

    if (entry) {
      const result = await ZipReaderUtils.getFile(entry);

      return result;
    }
  }

  async getFgFile(filename: string): Promise<File | undefined> {
    const bg = await this.root_folder.getFileHandle("foreground.zip");
    const read = ZipReaderUtils.readZippedFile(await bg.getFile());
    const entries = await read.getEntries();
    const entry = entries.find(e => StringUtils.equals(e.filename, filename));

    if (entry) {
      const result = await ZipReaderUtils.getFile(entry);

      return result;
    }
  }

  async getScriptFile(path: string): Promise<File | undefined> {
    const file = await FileReaderUtils.getScriptFile(this.root_folder, path);

    return file;
  }

  async getAudioFile(path: string): Promise<File | undefined> {
    const sound = await this.root_folder.getFileHandle("sound.zip");
    const read = ZipReaderUtils.readZippedFile(await sound.getFile());
    const entries = await read.getEntries();
    const entry = entries.find(e => StringUtils.equals(e.filename, path));

    if (entry) {
      return await ZipReaderUtils.getFile(entry);
    }
  }
}
