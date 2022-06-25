import { ICommand, IScriptInterpreter, IVNDS } from "~interfaces";

export default class ScriptInterpreter implements IScriptInterpreter {
  constructor(private readonly _vnds: IVNDS) {}

  private _cmd_setimg(cmd: ICommand, quickread: boolean = false): void {}

  private _cmd_bgload(cmd: ICommand, quickread: boolean = false): void {}

  private _cmd_sound(cmd: ICommand, quickread: boolean = false): void {}

  private _cmd_music(cmd: ICommand, quickread: boolean = false): void {}

  private _cmd_skip(cmd: ICommand, quickread: boolean = false): void {}

  private _cmd_choice(cmd: ICommand, quickread: boolean = false): void {}

  private _cmd_setvar(cmd: ICommand, quickread: boolean = false): void {}

  private _cmd_gsetvar(cmd: ICommand, quickread: boolean = false): void {}

  private _cmd_if(cmd: ICommand, quickread: boolean = false): void {}

  private _cmd_fi(cmd: ICommand, quickread: boolean = false): void {}

  private _cmd_jump(cmd: ICommand, quickread: boolean = false): void {}

  private _cmd_delay(cmd: ICommand, quickread: boolean = false): void {}

  private _cmd_random(cmd: ICommand, quickread: boolean = false): void {}

  private _cmd_endscript(cmd: ICommand, quickread: boolean = false): void {}

  private _cmd_label(cmd: ICommand, quickread: boolean = false): void {}

  private _cmd_goto(cmd: ICommand, quickread: boolean = false): void {}

  private _cmd_cleartext(cmd: ICommand, quickread: boolean = false): void {}

  private _cmd_eof(cmd: ICommand, quickread: boolean = false): void {}

  private _evaluateIf(expr1: string, op: string, expr2: string): boolean {
    return false;
  }

  private _replaceVars(text: string): void {}

  /* interface stuff */

  cmdText(cmd: ICommand, quickread: boolean, skipread: boolean): void {
    throw new Error("Method not implemented.");
  }
  execute(cmd: ICommand, quickread: boolean): void {
    throw new Error("Method not implemented.");
  }
}
