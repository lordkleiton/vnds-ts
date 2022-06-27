import { CommandType, Operations } from "~/enums";
import { ICommand, IScriptInterpreter, IVariable, IVNDS } from "~/interfaces";
import {
  FOLDER_BG,
  FOLDER_FG,
  FOLDER_SCRIPTS,
  FOLDER_SOUND,
  REGEX_MATCH_VAR_CURLY_BRACES,
  REGEX_MATCH_VAR_SIMPLE,
  SC_AT,
  SC_EXCLAMATION,
  SC_LEFT_BRACE,
  SC_RIGHT_BRACE,
  SC_TILDE,
} from "~/consts";
import Variable from "./variable";
import { NumberUtils } from "~/utils";

export default class ScriptInterpreter implements IScriptInterpreter {
  constructor(private readonly _vnds: IVNDS) {}

  private _getVariables(name: string): IVariable | undefined {
    const local = this._vnds.variables[name];

    if (local) return local;

    const global = this._vnds.globals[name];

    if (global) return global;
  }

  private _cmd_setimg(cmd: ICommand): void {
    if (!cmd.setimg) return;

    const path = this._replaceVars(cmd.setimg.path);
    const full_path = `${FOLDER_FG}/${path}`;

    this._vnds.graphicsEngine.setForeground(
      full_path,
      cmd.setimg.x,
      cmd.setimg.y
    );
  }

  private _cmd_bgload(cmd: ICommand, quickread: boolean = false): void {
    if (!cmd.bgload) return;

    if (this._vnds.graphicsEngine.isBackgroundChanged()) {
      this._vnds.graphicsEngine.flush(quickread);
    }

    const path = this._replaceVars(cmd.bgload.path);
    const full_path = `${FOLDER_BG}/${path}`;

    this._vnds.graphicsEngine.setBackground(full_path, cmd.bgload.fadeTime);
  }

  private _cmd_sound(cmd: ICommand, quickread: boolean = false): void {
    if (!cmd.sound) return;

    if (!quickread) {
      const path = this._replaceVars(cmd.sound.path);
      const full_path = `${FOLDER_SOUND}/${path}`;

      this._vnds.soundEngine.playSound(full_path, cmd.sound.repeats);
    }
  }

  private _cmd_music(cmd: ICommand): void {
    if (!cmd.music) return;

    const path = this._replaceVars(cmd.music.path);
    const full_path = `${FOLDER_SOUND}/${path}`;

    this._vnds.soundEngine.setMusic(full_path);
  }

  private _cmd_skip(): void {
    // noop
  }

  private _cmd_choice(cmd: ICommand, quickread: boolean = false): void {
    if (!cmd.choice) return;

    this._vnds.graphicsEngine.flush(quickread);

    const cv = this._vnds.textEngine.getChoiceView();

    cv.activate();

    cv.removeAllItems();

    cmd.choice.options.forEach(o => {
      const choice = this._replaceVars(o);

      cv.appendText(choice);
    });

    cv.setSelectedIndex(0);

    cv.setScroll(0);
  }

  private _cmd_setvar(cmd: ICommand): void {
    if (!cmd.setvar) return;

    this._vnds.setVariable(cmd.setvar.name, cmd.setvar.op, cmd.setvar.value);
  }

  private _cmd_gsetvar(cmd: ICommand): void {
    if (!cmd.setvar) return;

    this._vnds.setGlobal(cmd.setvar.name, cmd.setvar.op, cmd.setvar.value);
  }

  private async _cmd_if(cmd: ICommand): Promise<void> {
    if (!cmd.vif) return;

    const result = this._evaluateIf(cmd.vif.expr1, cmd.vif.op, cmd.vif.expr2);

    if (!result) {
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

  private _cmd_fi(): void {
    // noop
  }

  private _cmd_jump(cmd: ICommand): void {
    if (!cmd.jump) return;

    const path = this._replaceVars(cmd.jump.path);
    const full_path = `${FOLDER_SCRIPTS}/${path}`;

    //this._vnds.scriptEngine.setScriptFile(full_path);

    if (cmd.jump.label) {
      const command = {
        id: CommandType.GOTO,
        lgoto: { label: cmd.jump.label },
      } as ICommand;

      this._cmd_goto(command);
    }
  }

  private _cmd_delay(cmd: ICommand, quickread: boolean = false): void {
    if (!cmd.delay) return;

    if (!quickread) {
      this._vnds.graphicsEngine.flush(quickread);

      this._vnds.setDelay(cmd.delay.time);
    }
  }

  private _cmd_random(cmd: ICommand): void {
    if (!cmd.random) return;

    const high = cmd.random.high + 1;
    const low = cmd.random.low;
    const value = NumberUtils.randomInt(low, high);

    this._vnds.setVariable(cmd.random.name, "=", value.toString());
  }

  private _cmd_endscript(): void {
    //this._vnds.scriptEngine.setScriptFile("script/main.scr")
  }

  private _cmd_label(): void {
    // noop
  }

  private _cmd_goto(cmd: ICommand): void {
    if (!cmd.lgoto) return;

    const label = this._replaceVars(cmd.lgoto.label);

    this._vnds.scriptEngine.jumpToLabel(label);
  }

  private _cmd_cleartext(cmd: ICommand): void {
    if (!cmd.clearText) return;

    if (cmd.clearText.clearType == "!") {
      this._vnds.textEngine.reset();
    } else {
      const max_lines = this._vnds.textEngine.getTextPane().getVisibleItems();

      for (let i = 0; i <= max_lines; i++) {
        this._vnds.textEngine.getTextPane().appendText("");
      }
    }
  }

  private _cmd_eof(): void {
    //this._vnds.scriptEngine.setScriptFile("script/main.scr")
  }

  private _evaluateIf(expr1: string, op: string, expr2: string): boolean {
    const left_var = this._getVariables(expr1);
    const right_var = this._getVariables(expr2);

    const left: IVariable = left_var ? left_var : new Variable(expr1);
    const right: IVariable = right_var ? right_var : new Variable(expr2);

    console.log("eval_if", expr1, op, expr2);

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

  private _replaceVars(text: string): string {
    let result = text;

    const braces_matches = text.match(
      RegExp(REGEX_MATCH_VAR_CURLY_BRACES, "gi")
    );

    braces_matches?.forEach(m => {
      const name = m.replace(SC_LEFT_BRACE, "").replace(SC_RIGHT_BRACE, "");
      const variable = this._getVariables(name);

      if (variable) result = result.replace(m, variable.str);
    });

    const normal_matches = text.match(RegExp(REGEX_MATCH_VAR_SIMPLE, "gi"));

    normal_matches?.forEach(m => {
      const variable = this._getVariables(m);

      if (variable) result = result.replace(m, variable.str);
    });

    return result;
  }

  /* interface stuff */

  cmdText(
    cmd: ICommand,
    quickread: boolean = false,
    skipread: boolean = false
  ): void {
    if (!cmd.text) return;

    if (!skipread) {
      this._vnds.graphicsEngine.flush(quickread);
    }

    const text = cmd.text.text;
    const first_char = text[0];

    let output: string | undefined;
    let wait_input: boolean;

    if (first_char == SC_TILDE) {
      output = "";

      wait_input = false;
    } else {
      if (first_char == SC_EXCLAMATION) {
        output = undefined;

        wait_input = true;
      } else {
        output = text;

        wait_input = first_char != SC_AT;
      }
    }

    const result = this._replaceVars(output || "");

    this._vnds.textEngine.getTextPane()?.appendText(result);

    this._vnds.setWaitForInput(wait_input);

    console.log(result);
  }

  execute(cmd: ICommand, quickread: boolean): void {
    switch (cmd.id) {
      case CommandType.TEXT:
        this.cmdText(cmd, quickread, false);
        return;
      case CommandType.SETIMG:
        this._cmd_setimg(cmd);
        return;
      case CommandType.BGLOAD:
        this._cmd_bgload(cmd, quickread);
        return;
      case CommandType.SOUND:
        this._cmd_sound(cmd, quickread);
        return;
      case CommandType.MUSIC:
        this._cmd_music(cmd);
        return;
      case CommandType.SKIP:
        this._cmd_skip();
        return;
      case CommandType.CHOICE:
        this._cmd_choice(cmd, quickread);
        return;
      case CommandType.SETVAR:
        this._cmd_setvar(cmd);
        return;
      case CommandType.GSETVAR:
        this._cmd_gsetvar(cmd);
        return;
      case CommandType.IF:
        this._cmd_if(cmd);
        return;
      case CommandType.FI:
        this._cmd_fi();
        return;
      case CommandType.JUMP:
        this._cmd_jump(cmd);
        return;
      case CommandType.DELAY:
        this._cmd_delay(cmd, quickread);
        return;
      case CommandType.RANDOM:
        this._cmd_random(cmd);
        return;
      case CommandType.LABEL:
        this._cmd_label();
        return;
      case CommandType.GOTO:
        this._cmd_goto(cmd);
        return;
      case CommandType.CLEARTEXT:
        this._cmd_cleartext(cmd);
        return;
      case CommandType.ENDSCRIPT:
        this._cmd_endscript();
        return;
      case CommandType.END_OF_FILE:
        this._cmd_eof();
        return;
    }
  }
}
