import {
  ICommand,
  IScriptEngine,
  IScriptInterpreter,
  IVNDS,
} from "~interfaces";

export default class ScriptEngine implements IScriptEngine {
  private _interpreter: IScriptInterpreter;
  private _filePath?: string;
  private _fileLine?: number;
  private _textSkip?: number;

  private _eof?: boolean;
  private _readBuffer?: string;
  private _readBufferL?: number;
  private _readBufferOffset?: number;

  private _commands: ICommand[] = [];
  private _eofCommand?: ICommand;

  constructor(private readonly vnds: IVNDS) {
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
    throw new Error("Method not implemented.");
  }

  skipTextCommands(num: number): void {
    throw new Error("Method not implemented.");
  }

  jumpToLabel(lbl: number): boolean {
    throw new Error("Method not implemented.");
  }

  getCommand(offset: number): ICommand {
    while (this._commands.length <= offset) {
      this._readNextCommand();
    }

    return this._commands[offset];
  }

  getOpenFile(): number {
    throw new Error("Method not implemented.");
  }

  getCurrentLine(): number {
    throw new Error("Method not implemented.");
  }

  getTextSkip(): number {
    throw new Error("Method not implemented.");
  }

  setScriptFile(filename: string): void {
    throw new Error("Method not implemented.");
  }
}
