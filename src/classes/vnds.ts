import {
  IGraphicsEngine,
  INovelInfo,
  IScriptEngine,
  ISoundEngine,
  ITextEngine,
  IVariable,
  IVNDS,
} from "~/interfaces";
import { SC_TILDE } from "~/consts";
import { VarType } from "~/enums";
import Variable from "./variable";
import ScriptEngine from "./script_engine";
import GraphicsEngine from "./graphics_engine";

export default class VNDS implements IVNDS {
  private _quit: boolean = false;
  private _waitForInput: boolean = false;
  private _delay: number = 0;

  globals: Record<string, IVariable> = {};
  variables: Record<string, IVariable> = {};
  textEngine: ITextEngine = {} as ITextEngine;
  graphicsEngine: IGraphicsEngine;
  scriptEngine: IScriptEngine;
  soundEngine: ISoundEngine = {} as ISoundEngine;

  constructor(novelInfo: INovelInfo) {
    this.scriptEngine = new ScriptEngine(this);

    this.graphicsEngine = new GraphicsEngine();
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

    let left: Variable;

    if (this.variables[value]) {
      left = this.variables[value];
    } else {
      if (this.globals[value]) {
        left = this.globals[value];
      } else {
        left = new Variable(value);
      }
    }

    let right: Variable;

    if (obj[name]) {
      right = obj[name];
    } else {
      const aux = new Variable("");
      const type_str = left.type == VarType.VT_string;

      aux.type = left.type;

      aux.intval = type_str ? undefined : 0;
      aux.strval = type_str ? "" : aux.intval!.toString();

      right = aux;
    }

    switch (right.type) {
      case VarType.VT_int:
        switch (op) {
          case "+":
            right.intval! += left.intval!;
            break;
          case "-":
            right.intval! -= left.intval!;
            break;
          case "=":
            right.intval! = left.intval!;
            break;
          default:
            console.log(
              "setvar :: Unsupported operator '%c' for target type int",
              op
            );

            return;
        }

        right.strval = right.intval!.toString();

        break;
      case VarType.VT_string:
        switch (op) {
          case "+":
            right.strval += left.strval;

            break;
          case "=":
            right.strval = left.strval;

            break;
          default:
            console.log(
              "setvar :: Unsupported operator '%c' for target type string",
              op
            );

            return;
        }

        const parsed = parseInt(right.strval);

        right.intval = isNaN(parsed) ? undefined : parsed;

        break;
      case VarType.VT_null:
        // noop

        break;
    }

    console.log("(g)setvar %s %c %s", name, op, right.strval);

    obj[name] = right;
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
