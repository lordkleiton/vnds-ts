import { CommandType, Operations } from "~/enums";
import { ICommand, IScriptInterpreter, IVariable, IVNDS } from "~/interfaces";
import Variable from "./variable";

export default class ScriptInterpreter implements IScriptInterpreter {
  constructor(private readonly _vnds: IVNDS) {}

  private _getVariables(name: string): IVariable | undefined {
    const local = this._vnds.variables[name];

    if (local) return local;

    const global = this._vnds.globals[name];

    if (global) return global;
  }

  private _cmd_setimg(cmd: ICommand, quickread: boolean = false): void {}

  private _cmd_bgload(cmd: ICommand, quickread: boolean = false): void {}

  private _cmd_sound(cmd: ICommand, quickread: boolean = false): void {}

  private _cmd_music(cmd: ICommand, quickread: boolean = false): void {}

  private _cmd_skip(cmd: ICommand, quickread: boolean = false): void {}

  private _cmd_choice(cmd: ICommand, quickread: boolean = false): void {}

  private _cmd_setvar(cmd: ICommand, quickread: boolean = false): void {}

  private _cmd_gsetvar(cmd: ICommand, quickread: boolean = false): void {}

  private async _cmd_if(cmd: ICommand): Promise<void> {
    if (!cmd.vif) return;

    if (!this._evaluateIf(cmd.vif.expr1, cmd.vif.op, cmd.vif.expr2)) {
      let nesting = 1;

      let next_cmd: ICommand;

      do {
        next_cmd = await this._vnds.scriptEngine.getCommand(0);

        if (next_cmd.id == CommandType.IF) {
          nesting++;
        } else {
          if (next_cmd.id == CommandType.FI) {
            nesting--;
          }

          this._vnds.scriptEngine.skipCommands(1);
        }
      } while (nesting > 0 && cmd.id != CommandType.END_OF_FILE);

      if (nesting > 0) {
        console.log(
          "Invalid nesting of if's. Reached the end of the file before encountering the required number of fi's"
        );
      }
    }
  }

  private _cmd_fi(cmd: ICommand, quickread: boolean = false): void {
    // noop
  }

  private _cmd_jump(cmd: ICommand, quickread: boolean = false): void {}

  private _cmd_delay(cmd: ICommand, quickread: boolean = false): void {}

  private _cmd_random(cmd: ICommand, quickread: boolean = false): void {}

  private _cmd_endscript(cmd: ICommand, quickread: boolean = false): void {}

  private _cmd_label(cmd: ICommand, quickread: boolean = false): void {}

  private _cmd_goto(cmd: ICommand, quickread: boolean = false): void {}

  private _cmd_cleartext(cmd: ICommand, quickread: boolean = false): void {}

  private _cmd_eof(cmd: ICommand, quickread: boolean = false): void {}

  private _evaluateIf(expr1: string, op: string, expr2: string): boolean {
    const left_var = this._getVariables(expr1);
    const right_var = this._getVariables(expr2);

    const left: IVariable = left_var ? left_var : new Variable(expr1);
    const right: IVariable = right_var ? right_var : new Variable(expr2);

    console.log("eval_if ", expr1, op, expr2);

    switch (op) {
      case Operations.EQUAL:
        return left.equal(right);
      case Operations.DIFF:
        return left.diff(right);
      case Operations.GTE:
        return left.gte(right);
      case Operations.LTE:
        return left.lte(right);
      case Operations.GT:
        return left.gt(right);
      case Operations.LT:
        return left.lt(right);
      default:
        console.log("unknown operator", op);

        return false;
    }
  }

  private _replaceVars(text: string): void {}

  /* interface stuff */

  cmdText(cmd: ICommand, skipread: boolean): void {
    if (!cmd.text) return;

    if (!skipread) {
      //this._vnds.graphicsEngine.flush(quickread);
    }

    const text = cmd.text.text;
    const first_char = text[0];

    let output: string | undefined;
    let wait_input: boolean;

    if (first_char == "~") {
      output = "";

      wait_input = false;
    } else {
      if (first_char == "!") {
        output = undefined;

        wait_input = true;
      } else {
        output = text;

        wait_input = first_char != "@";
      }
    }

    console.log(output, wait_input);
  }

  execute(cmd: ICommand, quickread: boolean): void {
    switch (cmd.id) {
      case CommandType.TEXT:
        this.cmdText(cmd, false);
        return;
      case CommandType.SETIMG:
        this._cmd_setimg(cmd, quickread);
        return;
      case CommandType.BGLOAD:
        this._cmd_bgload(cmd, quickread);
        return;
      case CommandType.SOUND:
        this._cmd_sound(cmd, quickread);
        return;
      case CommandType.MUSIC:
        this._cmd_music(cmd, quickread);
        return;
      case CommandType.SKIP:
        this._cmd_skip(cmd, quickread);
        return;
      case CommandType.CHOICE:
        this._cmd_choice(cmd, quickread);
        return;
      case CommandType.SETVAR:
        this._cmd_setvar(cmd, quickread);
        return;
      case CommandType.GSETVAR:
        this._cmd_gsetvar(cmd, quickread);
        return;
      case CommandType.IF:
        this._cmd_if(cmd);
        return;
      case CommandType.FI:
        this._cmd_fi(cmd, quickread);
        return;
      case CommandType.JUMP:
        this._cmd_jump(cmd, quickread);
        return;
      case CommandType.DELAY:
        this._cmd_delay(cmd, quickread);
        return;
      case CommandType.RANDOM:
        this._cmd_random(cmd, quickread);
        return;
      case CommandType.LABEL:
        this._cmd_label(cmd, quickread);
        return;
      case CommandType.GOTO:
        this._cmd_goto(cmd, quickread);
        return;
      case CommandType.CLEARTEXT:
        this._cmd_cleartext(cmd, quickread);
        return;
      case CommandType.ENDSCRIPT:
        this._cmd_endscript(cmd, quickread);
        return;
      case CommandType.END_OF_FILE:
        this._cmd_eof(cmd, quickread);
        return;
    }
  }
}
