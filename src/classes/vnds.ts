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
import TextEngine from "./text_engine";

export default class VNDS implements IVNDS {
  private _quit: boolean = false;
  private _waitForInput: boolean = false;
  private _delay: number = 0;

  globals: Record<string, IVariable> = {};
  variables: Record<string, IVariable> = {};
  textEngine: ITextEngine;
  graphicsEngine: IGraphicsEngine;
  scriptEngine: IScriptEngine;
  soundEngine: ISoundEngine = {} as ISoundEngine;

  constructor(novelInfo: INovelInfo) {
    this.scriptEngine = new ScriptEngine(this);

    this.graphicsEngine = new GraphicsEngine();

    this.textEngine = new TextEngine();
  }

  private _setVariable(
    obj: Record<string, IVariable>,
    name: string,
    op: string,
    value: string
  ): void {
    console.log(name, op, value);

    if (op == SC_TILDE) {
      obj = {};

      return;
    }

    let right: Variable;

    if (this.variables[value]) {
      right = this.variables[value];
    } else {
      if (this.globals[value]) {
        right = this.globals[value];
      } else {
        right = new Variable(value);
      }
    }

    let left: Variable;

    if (obj[name]) {
      left = obj[name];
    } else {
      const aux = new Variable("");

      aux.strval = aux.strval;

      left = aux;
    }

    console.log(right.intval, right.strval);
    console.log(left.intval, left.strval);

    switch (left.type) {
      case VarType.VT_int:
        switch (op) {
          case "+":
            left.intval! += right.intval!;
            break;
          case "-":
            left.intval! -= right.intval!;
            break;
          case "=":
            left.intval! = right.intval!;
            break;
          default:
            console.log(
              "setvar :: Unsupported operator '%c' for target type int",
              op
            );

            return;
        }

        console.log(right.intval, right.strval);
        console.log(left.intval, left.strval);

        left.strval = left.intval!.toString();

        break;
      case VarType.VT_string:
        switch (op) {
          case "+":
            left.strval += right.strval;

            break;
          case "=":
            left.strval = right.strval;

            break;
          default:
            console.log(
              "setvar :: Unsupported operator '%c' for target type string",
              op
            );

            return;
        }

        const parsed = parseInt(left.strval);

        left.intval = parsed;

        break;
      case VarType.VT_null:
        // noop

        break;
    }

    console.log("-------");

    //console.log("(g)setvar %s %c %s", name, op, right.strval);

    obj[name] = left;
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
