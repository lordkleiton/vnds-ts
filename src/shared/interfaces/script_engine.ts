import ICommand from "./command";

export default interface IScriptEngine {
  reset(): void;
  executeNextCommand(quickread: boolean): Promise<void>;
  quickRead(): void;
  skipCommands(num: number): void;
  skipTextCommands(num: number): void;
  jumpToLabel(lbl: string): Promise<boolean>;

  getCommand(offset: number): Promise<ICommand>;
  getOpenFile(): File;
  getCurrentLine(): number;
  getTextSkip(): number;

  setScriptFile(file: File): void;
}
