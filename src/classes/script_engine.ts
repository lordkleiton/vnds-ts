import { CommandType } from "~enums";
import {
  ICommand,
  IScriptEngine,
  IScriptInterpreter,
  IVNDS,
} from "~interfaces";

export default class ScriptEngine implements IScriptEngine {
  private _interpreter: IScriptInterpreter;
  private _filePath?: string;
  private _fileLine: number = 0;
  private _textSkip: number = 0;

  private _eof?: boolean;
  private _readBuffer?: string;
  private _readBufferL?: number;
  private _readBufferOffset?: number;

  private _commands: ICommand[] = [];
  private _eofCommand?: ICommand;

  constructor(private readonly _vnds: IVNDS) {
    this._interpreter = {} as IScriptInterpreter;

    this.reset();
  }

  private _readNextCommand(): void {
    throw new Error("Method not implemented.");
  }

  private _parseCommand(cmd: ICommand, data: string): void {
    throw new Error("Method not implemented.");
  }

  /* interface stuff */

  reset(): void {
    throw new Error("Method not implemented.");
  }

  executeNextCommand(): void {
    throw new Error("Method not implemented.");
  }

  quickRead(): void {
    throw new Error("Method not implemented.");
  }

  skipCommands(num: number): void {
    while (this._commands.length <= num) {
      this._readNextCommand();
    }

    this._fileLine += num;

    this._commands.splice(0, num);
  }

  skipTextCommands(num: number): void {
    while (this._textSkip < num) {
      if (this._commands.length <= 0) {
        this._readNextCommand();
      }

      const c = this._commands.shift();

      this._fileLine++;

      if (!c || c.id == CommandType.END_OF_FILE) {
        return;
      } else if (c.id == CommandType.TEXT) {
        this._textSkip++;

        this._interpreter.execute(c, true);
      }
    }
  }

  jumpToLabel(lbl: number): boolean {
    this.setScriptFile(this._vnds.scriptEngine.getOpenFile());

    let c: ICommand;

    while (true) {
      c = this._vnds.scriptEngine.getCommand(0);

      if (c.id == CommandType.LABEL && c.label?.label == lbl) {
        return true;
      } else if (c.id == CommandType.TEXT) {
        this._textSkip++;
      } else if (c.id == CommandType.END_OF_FILE) {
        console.log("goto cannot find label", lbl);

        return false;
      }

      this.skipCommands(1);
    }
  }

  getCommand(offset: number): ICommand {
    while (this._commands.length <= offset) {
      this._readNextCommand();
    }

    return this._commands[offset];
  }

  getOpenFile(): string {
    throw new Error("Method not implemented.");
  }

  getCurrentLine(): number {
    return this._fileLine;
  }

  getTextSkip(): number {
    return this._textSkip;
  }

  setScriptFile(filename: string): void {
    throw new Error("Method not implemented.");
  }
}
