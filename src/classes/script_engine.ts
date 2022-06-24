import { CommandType } from "~/enums";
import {
  ICommand,
  IScriptEngine,
  IScriptInterpreter,
  IVNDS,
} from "~/interfaces";
import {
  CC_NEW_LINE,
  CC_NUL,
  READ_BUFFER_SIZE,
  SCRIPT_READ_BUFFER_SIZE,
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

  private _timesRead: number = 0;

  constructor(private readonly _vnds: IVNDS) {
    this._interpreter = {} as IScriptInterpreter;

    this.reset();
  }

  private get _readBufferL(): number {
    return this._readBuffer.length;
  }

  private get _eof(): boolean {
    return this._readBufferL < SCRIPT_READ_BUFFER_SIZE;
  }

  private async _readFileChunk(): Promise<ArrayBuffer> {
    if (!this._file) throw new Error("no file to read");

    return await FileReaderUtils.read(
      this._file,
      this._readBufferOffset,
      this._readBufferOffset + SCRIPT_READ_BUFFER_SIZE
    );
  }

  private async _readNextCommand(): Promise<void> {
    if (this._eof || !this._file) {
      this._commands.push(this._eofCommand);

      return;
    }

    const buffer = new Uint8Array(READ_BUFFER_SIZE);
    const maxRead = READ_BUFFER_SIZE - 1;

    let t = 0;
    let overflow = false;
    let counter = 0;

    while (counter < maxRead && t < maxRead) {
      console.log(t);
      counter++;

      if (this._readBufferOffset >= this._readBufferL) {
        this._readBufferOffset = 0;

        const read = await this._readFileChunk();

        this._timesRead++;

        this._readBuffer = new Uint8Array(read);

        if (this._readBufferL <= 0) {
          break;
        }
      }

      const current_head = this._readBufferOffset * this._timesRead;

      const newline_index = this._readBuffer.find(el => el == CC_NEW_LINE);

      let wantToCopy: number;

      if (!newline_index) {
        wantToCopy = this._readBufferL - this._readBufferOffset;
      } else {
        wantToCopy = newline_index - current_head - this._readBufferOffset;
      }

      const copyL = Math.min(maxRead - t, wantToCopy);

      const begin = current_head + this._readBufferOffset;

      for (let i = 0; i < copyL; i++) {
        const current = begin + i;

        buffer[t + i] = this._readBuffer[current];
      }

      t += copyL;

      this._readBufferOffset += copyL;

      if (wantToCopy > copyL) {
        t = 0;

        overflow = true;
      } else {
        if (newline_index) {
          this._readBufferOffset++;

          break;
        }
      }
    }

    if (t < maxRead) {
      buffer[t] = CC_NUL;
    } else {
      buffer[maxRead] = CC_NUL;
    }

    if (overflow) {
      console.log(
        "Command line is too long (> %d characters)",
        READ_BUFFER_SIZE
      );

      const command = { id: CommandType.SKIP } as ICommand;

      this._commands.push(command);

      return;
    }

    const command = { id: CommandType.SKIP } as ICommand;

    // ParseCommand(&command, buffer);

    this._commands.push(command);

    console.log(this._commands);

    console.log(this._readBuffer);

    console.log(this._eof);
  }

  private _parseCommand(cmd: ICommand, data: string): void {
    throw new Error("Method not implemented.");
  }

  /* interface stuff */

  reset(): void {
    this._file = undefined;

    this._fileLine = 0;

    this._textSkip = 0;

    this._readBuffer = new Uint8Array();

    this._readBufferOffset = 0;

    this._commands = [];

    this._timesRead = 0;
  }

  executeNextCommand(quickread: boolean): void {
    if (!this._commands.length) {
      this._readNextCommand();
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
      this._readNextCommand();
    }

    this._fileLine += num;

    this._commands.splice(0, num);
  }

  skipTextCommands(num: number): void {
    while (this._textSkip < num) {
      if (this._commands.length <= 0) {
        this._readNextCommand();
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
      this._readNextCommand();
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

    if (this._readBufferL >= 2 && first == 0xfe && second == 0xff) {
      console.log("Script encoding is UTF-16 BE. Only UTF-8 is supported.");

      return;
    }

    if (this._readBufferL >= 2 && first == 0xff && second == 0xfe) {
      console.log("Script encoding is UTF-16 LE. Only UTF-8 is supported.");

      return;
    }

    this._file = file;

    console.log("script set", file.name);

    if (
      this._readBufferL >= 3 &&
      first == 0xef &&
      second == 0xbb &&
      third == 0xbf
    ) {
      this._readBufferOffset += 3;
    }
  }
}
