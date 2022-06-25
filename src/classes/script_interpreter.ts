import { CommandType } from "~enums";
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
    switch (cmd.id) {
      case CommandType.TEXT:
        this.cmdText(cmd, quickread, false);
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
        this._cmd_if(cmd, quickread);
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
