import { CommandType } from "~/enums";
import {
  ICommand,
  IScriptEngine,
  IScriptInterpreter,
  IVNDS,
} from "~/interfaces";
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
} from "~/consts";
import { FileReaderUtils } from "~/utils";

export default class ScriptEngine implements IScriptEngine {
  private _interpreter: IScriptInterpreter;

  private _file?: File;
  private _fileLine: number = 0;
  private _textSkip: number = 0;

  private _readBuffer: Uint8Array = new Uint8Array();
  private _readBufferOffset: number = 0;

  private _eofCommand: ICommand = { id: CommandType.END_OF_FILE } as ICommand;
  private _commands: ICommand[] = [];

  private _eof: boolean = false;

  constructor(private readonly _vnds: IVNDS) {
    this._interpreter = {} as IScriptInterpreter;

    this.reset();
  }

  private get _readBufferLength(): number {
    return this._readBuffer.length;
  }

  private async _readFileChunk(): Promise<ArrayBuffer> {
    if (!this._file) throw new Error("no file to read");

    return await FileReaderUtils.read(
      this._file,
      this._readBufferOffset,
      this._readBufferOffset + SCRIPT_READ_BUFFER_SIZE
    );
  }

  private async _readNextCommands(): Promise<void> {
    if (this._eof || !this._file) {
      console.log("eof reached");

      this._commands.push(this._eofCommand);

      return;
    }

    const read = await this._readFileChunk();
    const buffer = new Uint8Array(read);
    const last_line_index = Array.from(buffer)
      .reverse()
      .findIndex(el => el == CC_NEW_LINE);

    if (buffer.length < SCRIPT_READ_BUFFER_SIZE) this._eof = true;

    const current_commands = buffer.slice(0, buffer.length - last_line_index);

    this._readBufferOffset += current_commands.length;

    const decoder = new TextDecoder();
    const decoded = decoder.decode(current_commands);
    const commands = decoded
      .split(RegExp(SC_NEW_LINE, "gi"))
      .map(command => command.trim())
      .filter(command => !!command);

    this._commands = commands.map(c => this._parseCommand(c));

    console.log(this._commands);
  }

  private _parseCommand(line: string): ICommand {
    if (!line || line[0] == "#" || line[0] == "/")
      return { id: CommandType.SKIP };

    const splitLine = (l: string, c: string) => l.split(c, 2);
    const toData = (s: string) => s.split(/\s/gi);

    if (line.match(COMMAND_BGLOAD)) {
      const split = splitLine(line, COMMAND_BGLOAD);
      const data = toData(split[1]);
      const path = data.shift();

      return {
        id: CommandType.BGLOAD,
        bgload: { path, fadeTime: parseInt(data[0]) || 16 },
      };
    }

    if (line.match(COMMAND_SETIMG)) {
      const split = splitLine(line, COMMAND_SETIMG);
      const data = toData(split[1]);
      const path = data.shift();

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
      const path = data.shift();

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
      const path = data.shift();

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
        console.log("too many choices", line);

        return { id: CommandType.SKIP };
      }

      if (data.some(c => c.length > CMD_OPTIONS_BUFFER_LENGTH)) {
        console.log("choices are too large", line);

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
      const path = data.shift();

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
      const name = data.shift();

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

    console.log("unknow method", line);

    return { id: CommandType.SKIP };
  }

  /* interface stuff */

  reset(): void {
    this._file = undefined;

    this._fileLine = 0;

    this._textSkip = 0;

    this._readBuffer = new Uint8Array();

    this._readBufferOffset = 0;

    this._commands = [];

    this._eof = false;
  }

  executeNextCommand(quickread: boolean): void {
    if (!this._commands.length) {
      this._readNextCommands();
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

  skipCommands(num: number): void {
    while (this._commands.length <= num) {
      this._readNextCommands();
    }

    this._fileLine += num;

    this._commands.splice(0, num);
  }

  skipTextCommands(num: number): void {
    while (this._textSkip < num) {
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

  jumpToLabel(lbl: string): boolean {
    this.setScriptFile(this._vnds.scriptEngine.getOpenFile());

    let c: ICommand;

    while (true) {
      c = this._vnds.scriptEngine.getCommand(0);

      if (c.id == CommandType.LABEL && c.label?.label == lbl) {
        return true;
      } else if (c.id == CommandType.TEXT) {
        this._textSkip++;
      } else if (c.id == CommandType.END_OF_FILE) {
        console.log("goto cannot find label", lbl);

        return false;
      }

      this.skipCommands(1);
    }
  }

  getCommand(offset: number): ICommand {
    while (this._commands.length <= offset) {
      this._readNextCommands();
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

    const buffer = await file.arrayBuffer();

    const slice = buffer.slice(this._readBufferOffset, SCRIPT_READ_BUFFER_SIZE);

    this._readBuffer = new Uint8Array(slice);

    const first = this._readBuffer[0];
    const second = this._readBuffer[1];
    const third = this._readBuffer[2];

    if (this._readBufferLength >= 2 && first == 0xfe && second == 0xff) {
      console.log("Script encoding is UTF-16 BE. Only UTF-8 is supported.");

      return;
    }

    if (this._readBufferLength >= 2 && first == 0xff && second == 0xfe) {
      console.log("Script encoding is UTF-16 LE. Only UTF-8 is supported.");

      return;
    }

    this._file = file;

    console.log("script set", file.name);

    if (
      this._readBufferLength >= 3 &&
      first == 0xef &&
      second == 0xbb &&
      third == 0xbf
    ) {
      this._readBufferOffset += 3;
    }
  }
}
