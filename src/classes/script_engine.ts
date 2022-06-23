import {
  ICommand,
  IScriptEngine,
  IScriptInterpreter,
  IVNDS,
} from "~interfaces";

export default class ScriptEngine implements IScriptEngine {
  private scriptInterpreter?: IScriptInterpreter;
  private filePath?: string;
  private fileLine?: number;
  private textSkip?: number;

  private eof?: boolean;
  private readBuffer?: string;
  private readBufferL?: number;
  private readBufferOffset?: number;

  private eofCommand?: ICommand;

  constructor(private readonly vnds: IVNDS) {}

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
    throw new Error("Method not implemented.");
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
