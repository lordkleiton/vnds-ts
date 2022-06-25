import {
  IGraphicsEngine,
  INovelInfo,
  IScriptEngine,
  ISoundEngine,
  ITextEngine,
  IVariable,
  IVNDS,
} from "~/interfaces";
import { SC_TILDE } from "~consts";
import Variable from "./variable";

export default class VNDS implements IVNDS {
  private _quit: boolean = false;
  private _waitForInput: boolean = false;
  private _delay: number = 0;

  globals: Record<string, IVariable> = {};
  variables: Record<string, IVariable> = {};
  textEngine: ITextEngine = {} as ITextEngine;
  graphicsEngine: IGraphicsEngine = {} as IGraphicsEngine;
  scriptEngine: IScriptEngine = {} as IScriptEngine;
  soundEngine: ISoundEngine = {} as ISoundEngine;

  constructor(novelInfo: INovelInfo) {}

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

  run(): void {
    throw new Error("Method not implemented.");
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
}
