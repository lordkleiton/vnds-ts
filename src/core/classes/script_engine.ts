import { CommandType } from "~/shared/enums";
import {
  ICommand,
  IScriptEngine,
  IScriptInterpreter,
  IVNDS,
} from "~/shared/interfaces";
import {
  CC_NEW_LINE,
  CMD_OPTIONS_BUFFER_LENGTH,
  CMD_OPTIONS_MAX_OPTIONS,
  COMMAND_BGLOAD,
  COMMAND_CHOICE,
  COMMAND_CLEARTEXT,
  COMMAND_DELAY,
  COMMAND_ENDSCRIPT,
  COMMAND_FI,
  COMMAND_GOTO,
  COMMAND_GSETVAR,
  COMMAND_IF,
  COMMAND_JUMP,
  COMMAND_LABEL,
  COMMAND_MUSIC,
  COMMAND_RANDOM,
  COMMAND_SETIMG,
  COMMAND_SETVAR,
  COMMAND_SOUND,
  COMMAND_TEXT,
  SCRIPT_READ_BUFFER_SIZE,
  SC_NEW_LINE,
} from "~/shared/consts";
import { FileReaderUtils } from "~/shared/utils";
import ScriptInterpreter from "./script_interpreter";
import Logger from "./logger";

export default class ScriptEngine implements IScriptEngine {
  private _interpreter: IScriptInterpreter;

  private _file?: File;
  private _fileLine: number = 0;
  private _textSkip: number = 0;

  private _readBufferOffset: number = 0;

  private _eofCommand: ICommand = { id: CommandType.END_OF_FILE } as ICommand;
  private _commands: ICommand[] = [];

  private _eof: boolean = false;

  constructor(private readonly _vnds: IVNDS) {
    this._interpreter = new ScriptInterpreter(_vnds);

    this.reset();
  }

  private async _readFileChunk(file?: File): Promise<ArrayBuffer> {
    if (!file && !this._file) throw new Error("no file to read");

    const file_to_read = file ? file : this._file;

    return await FileReaderUtils.read(
      file_to_read!,
      this._readBufferOffset,
      this._readBufferOffset + SCRIPT_READ_BUFFER_SIZE
    );
  }

  private async _readNextCommands(): Promise<void> {
    if (this._eof || !this._file) {
      Logger.log("eof reached");

      if (!this._commands.find(c => c.id == CommandType.END_OF_FILE))
        this._commands.push(this._eofCommand);

      return;
    }

    const read = await this._readFileChunk();
    const buffer = new Uint8Array(read);
    const last_line_index = Array.from(buffer)
      .reverse()
      .findIndex(el => el == CC_NEW_LINE);
    const current_commands = buffer.slice(0, buffer.length - last_line_index);
    const eof =
      current_commands.length == buffer.length &&
      buffer.length < SCRIPT_READ_BUFFER_SIZE;

    if (eof) {
      this._eof = true;
    }

    this._readBufferOffset += current_commands.length;

    const decoder = new TextDecoder();
    const decoded = decoder.decode(current_commands);
    const commands = decoded
      .split(RegExp(SC_NEW_LINE, "gi"))
      .map(command => command.trim())
      .filter(command => !!command);

    this._commands = commands.map(c => this._parseCommand(c));

    Logger.log(this._commands);
  }

  private _parseCommand(line: string): ICommand {
    if (!line || line[0] == "#" || line[0] == "/")
      return { id: CommandType.SKIP };

    const splitLine = (l: string, c: string) => l.split(c, 2);
    const toData = (s: string) => s.split(/\s/gi);

    if (line.match(COMMAND_BGLOAD)) {
      const split = splitLine(line, COMMAND_BGLOAD);
      const data = toData(split[1]);
      const path = data.shift()!;

      return {
        id: CommandType.BGLOAD,
        bgload: { path, fadeTime: parseInt(data[0]) || 16 },
      };
    }

    if (line.match(COMMAND_SETIMG)) {
      const split = splitLine(line, COMMAND_SETIMG);
      const data = toData(split[1]);
      const path = data.shift()!;

      return {
        id: CommandType.SETIMG,
        setimg: {
          path,
          x: parseInt(data[0]),
          y: parseInt(data[1]),
        },
      };
    }

    if (line.match(COMMAND_SOUND)) {
      const split = splitLine(line, COMMAND_SOUND);
      const data = toData(split[1]);
      const path = data.shift()!;

      return {
        id: CommandType.SOUND,
        sound: {
          path,
          repeats: parseInt(data[0]) || 1,
        },
      };
    }

    if (line.match(COMMAND_MUSIC)) {
      const split = splitLine(line, COMMAND_MUSIC);
      const data = toData(split[1]);
      const path = data.shift()!;

      return {
        id: CommandType.MUSIC,
        music: {
          path,
        },
      };
    }

    if (line.match(COMMAND_TEXT)) {
      const split = splitLine(line, COMMAND_TEXT);
      const text = split[1];

      return {
        id: CommandType.TEXT,
        text: {
          text,
        },
      };
    }

    if (line.match(COMMAND_CHOICE)) {
      const toChoiceData = (s: string) => s.split(/\|/gi);
      const split = splitLine(line, COMMAND_CHOICE);
      const data = toChoiceData(split[1]);

      if (data.length >= CMD_OPTIONS_MAX_OPTIONS) {
        Logger.log("too many choices", line);

        return { id: CommandType.SKIP };
      }

      if (data.some(c => c.length > CMD_OPTIONS_BUFFER_LENGTH)) {
        Logger.log("choices are too large", line);

        return { id: CommandType.SKIP };
      }

      return {
        id: CommandType.CHOICE,
        choice: {
          options: data,
        },
      };
    }

    if (line.match(COMMAND_SETVAR) || line.match(COMMAND_GSETVAR)) {
      const match = line.match(COMMAND_SETVAR)
        ? COMMAND_SETVAR
        : COMMAND_GSETVAR;
      const split = splitLine(line, match);
      const data = toData(split[1]);

      return {
        id: line.match(COMMAND_SETVAR)
          ? CommandType.SETVAR
          : CommandType.GSETVAR,
        setvar: {
          name: data[0],
          op: data[1],
          value: data[2],
        },
      };
    }

    if (line.match(COMMAND_IF)) {
      const split = splitLine(line, COMMAND_IF);
      const data = toData(split[1]);

      return {
        id: CommandType.IF,
        vif: {
          expr1: data[0],
          expr2: data[2],
          op: data[1],
        },
      };
    }

    if (line.match(RegExp(COMMAND_FI))) {
      return {
        id: CommandType.FI,
      };
    }

    if (line.match(COMMAND_JUMP)) {
      const split = splitLine(line, COMMAND_JUMP);
      const data = toData(split[1]);
      const path = data.shift()!;

      return {
        id: CommandType.JUMP,
        jump: {
          path,
          label: data[0],
        },
      };
    }

    if (line.match(COMMAND_DELAY)) {
      const split = splitLine(line, COMMAND_DELAY);
      const time = parseInt(split[1]);

      return {
        id: CommandType.DELAY,
        delay: {
          time,
        },
      };
    }

    if (line.match(COMMAND_RANDOM)) {
      const split = splitLine(line, COMMAND_RANDOM);
      const data = toData(split[1]);
      const name = data.shift()!;

      return {
        id: CommandType.RANDOM,
        random: {
          name,
          low: parseFloat(data[0]),
          high: parseFloat(data[1]),
        },
      };
    }

    if (line.match(COMMAND_LABEL)) {
      const split = splitLine(line, COMMAND_DELAY);
      const label = split[1];

      return {
        id: CommandType.LABEL,
        label: {
          label,
        },
      };
    }

    if (line.match(COMMAND_GOTO)) {
      const split = splitLine(line, COMMAND_DELAY);
      const label = split[1];

      return {
        id: CommandType.GOTO,
        lgoto: {
          label,
        },
      };
    }

    if (line.match(COMMAND_CLEARTEXT)) {
      const split = splitLine(line, COMMAND_DELAY);
      const type = split[1];

      return {
        id: CommandType.CLEARTEXT,
        clearText: {
          clearType: type,
        },
      };
    }

    if (line.match(COMMAND_ENDSCRIPT)) {
      return {
        id: CommandType.ENDSCRIPT,
      };
    }

    Logger.log("unknow method", line);

    return { id: CommandType.SKIP };
  }

  /* interface stuff */

  reset(): void {
    this._file = undefined;

    this._fileLine = 0;

    this._textSkip = 0;

    this._readBufferOffset = 0;

    this._commands = [];

    this._eof = false;
  }

  async executeNextCommand(quickread: boolean): Promise<void> {
    if (!this._commands.length) {
      await this._readNextCommands();
    }

    const c = this._commands.shift();

    if (!c) throw new Error("no command was found");

    this._fileLine++;

    if (c.id == CommandType.TEXT) this._textSkip++;

    this._interpreter.execute(c, quickread);
  }

  quickRead(): void {
    throw new Error("Method not implemented.");
  }

  async skipCommands(num: number): Promise<void> {
    while (this._commands.length < num) {
      Logger.log("while skipcommands");

      this._readNextCommands();
    }

    this._fileLine += num;

    this._commands.splice(0, num);
  }

  async skipTextCommands(num: number): Promise<void> {
    while (this._textSkip < num) {
      Logger.log("while skiptextcommands");

      if (this._commands.length <= 0) {
        this._readNextCommands();
      }

      const c = this._commands.shift();

      this._fileLine++;

      if (!c || c.id == CommandType.END_OF_FILE) {
        return;
      } else if (c.id == CommandType.TEXT) {
        this._textSkip++;

        this._interpreter.execute(c, true);
      }
    }
  }

  async jumpToLabel(lbl: string): Promise<boolean> {
    this.setScriptFile(this._vnds.scriptEngine.getOpenFile());

    let c: ICommand;

    while (true) {
      Logger.log("while jumptolabel");

      c = await this._vnds.scriptEngine.getCommand(0);

      if (c.id == CommandType.LABEL && c.label?.label == lbl) {
        return true;
      } else if (c.id == CommandType.TEXT) {
        this._textSkip++;
      } else if (c.id == CommandType.END_OF_FILE) {
        Logger.log("goto cannot find label", lbl);

        return false;
      }

      this.skipCommands(1);
    }
  }

  async getCommand(offset: number): Promise<ICommand> {
    while (this._commands.length <= offset) {
      Logger.log("while getcommand");

      await this._readNextCommands();
    }

    return this._commands[offset];
  }

  getOpenFile(): File {
    if (this._file) return this._file;

    throw new Error("no file loaded");
  }

  getCurrentLine(): number {
    return this._fileLine;
  }

  getTextSkip(): number {
    return this._textSkip;
  }

  async setScriptFile(file: File): Promise<void> {
    this.reset();

    const chunk = await this._readFileChunk(file);
    const buffer = new Uint8Array(chunk);

    const first = buffer[0];
    const second = buffer[1];
    const third = buffer[2];

    if (buffer.length >= 2 && first == 0xfe && second == 0xff) {
      Logger.log("Script encoding is UTF-16 BE. Only UTF-8 is supported.");

      return;
    }

    if (buffer.length >= 2 && first == 0xff && second == 0xfe) {
      Logger.log("Script encoding is UTF-16 LE. Only UTF-8 is supported.");

      return;
    }

    this._file = file;

    Logger.log("script set", file.name);

    if (
      buffer.length >= 3 &&
      first == 0xef &&
      second == 0xbb &&
      third == 0xbf
    ) {
      this._readBufferOffset += 3;
    }
  }
}
