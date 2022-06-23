import ICommand from "./command";

export default interface IScriptEngine {
  reset(): void;
  executeNextCommand(quickread: boolean): void;
  quickRead(): void;
  skipCommands(num: number): void;
  skipTextCommands(num: number): void;
  jumpToLabel(lbl: number): boolean;

  getCommand(offset: number): ICommand;
  getOpenFile(): File;
  getCurrentLine(): number;
  getTextSkip(): number;

  setScriptFile(file: File): void;
}
