import ICommand from "./command";

export default interface IScriptInterpreter {
  cmdText(cmd: ICommand, quickread: boolean, skipread: boolean): void;
  execute(cmd: ICommand, quickread: boolean): void;
}
