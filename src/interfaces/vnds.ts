import IScriptEngine from "./script_engine";
import IVariable from "./variable";

export default interface IVNDS {
  globals: Record<string, IVariable>;
  variables: Record<string, IVariable>;
  scriptEngine: IScriptEngine;

  continue(quickread: boolean): void;
  reset(): void;
  quit(): void;
  run(): void;

  isWaitingForInput(): boolean;
  getDelay(): number;
  setDelay(d: number): void;
  setWaitForInput(b: boolean): void;
  setVariable(name: string, op: number, value: string): void;
  setGlobal(name: string, op: number, value: string): void;
}
