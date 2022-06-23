import ICommand from "./command";

export default interface IScriptEngine {
  reset(): void;
  executeNextCommand(): void;
  quickRead(): void;
  skipCommands(num: number): void;
  skipTextCommands(num: number): void;
  jumpToLabel(lbl: number): boolean;

  getCommand(offset: number): ICommand;
  getOpenFile(): string;
  getCurrentLine(): number;
  getTextSkip(): number;

  setScriptFile(filename: string): void;
}
