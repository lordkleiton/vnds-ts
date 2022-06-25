import { CommandType } from "~/enums";
import {
  ICommand,
  IScriptEngine,
  IScriptInterpreter,
  IVNDS,
} from "~/interfaces";
import {
  CC_NEW_LINE,
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

    console.log(commands);
  }

  private _parseCommand(line: string): ICommand {
    if (!line || line[0] == "#" || line[0] == "/")
      return { id: CommandType.SKIP };

    if (line.match(COMMAND_BGLOAD)) {
      const split = line.split(COMMAND_BGLOAD, 2);

      return {
        id: CommandType.BGLOAD,
        bgload: { path: split[1] },
      };
    }

    if (line.match(COMMAND_SETIMG)) {
      const split = line.split(COMMAND_SETIMG, 2);

      return {
        id: CommandType.SETIMG,
      };
    }

    if (line.match(COMMAND_SOUND)) {
      return {
        id: CommandType.SOUND,
      };
    }

    if (line.match(COMMAND_MUSIC)) {
      return {
        id: CommandType.MUSIC,
      };
    }

    if (line.match(COMMAND_TEXT)) {
      return {
        id: CommandType.TEXT,
      };
    }

    if (line.match(COMMAND_CHOICE)) {
      return {
        id: CommandType.CHOICE,
      };
    }

    if (line.match(COMMAND_SETVAR) || line.match(COMMAND_GSETVAR)) {
      return {
        id: line.match(COMMAND_SETVAR)
          ? CommandType.SETVAR
          : CommandType.GSETVAR,
      };
    }

    if (line.match(COMMAND_IF)) {
      return {
        id: CommandType.IF,
      };
    }

    if (line.match(COMMAND_FI)) {
      return {
        id: CommandType.FI,
      };
    }

    if (line.match(COMMAND_JUMP)) {
      return {
        id: CommandType.JUMP,
      };
    }

    if (line.match(COMMAND_DELAY)) {
      return {
        id: CommandType.DELAY,
      };
    }

    if (line.match(COMMAND_RANDOM)) {
      return {
        id: CommandType.RANDOM,
      };
    }

    if (line.match(COMMAND_LABEL)) {
      return {
        id: CommandType.LABEL,
      };
    }

    if (line.match(COMMAND_GOTO)) {
      return {
        id: CommandType.GOTO,
      };
    }

    if (line.match(COMMAND_CLEARTEXT)) {
      return {
        id: CommandType.CLEARTEXT,
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

  jumpToLabel(lbl: number): boolean {
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
