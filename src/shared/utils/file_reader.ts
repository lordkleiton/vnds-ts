import {
  FILE_FONT,
  FILE_MAIN,
  FILE_SCRIPT,
  FILE_SCRIPT_MAIN,
  FOLDER_SCRIPT,
} from "~/shared/consts";
import ZipReaderUtils from "./zip_reader";

export default abstract class FileReaderUtils {
  static async read(
    file: File,
    start: number = 0,
    end?: number
  ): Promise<ArrayBuffer> {
    const buffer = await file.arrayBuffer();
    const result = buffer.slice(start, end);

    return result;
  }

  static async readFullFile(file: File): Promise<ArrayBuffer> {
    return this.read(file);
  }

  private static async _getFile(
    dir_handle: FileSystemDirectoryHandle,
    filename: string
  ): Promise<File | undefined> {
    try {
      const file_handle = await dir_handle.getFileHandle(filename);
      const file = await file_handle.getFile();

      return file;
    } catch {
      return;
    }
  }

  private static async _getScriptZip(
    dir_handle: FileSystemDirectoryHandle
  ): Promise<File | undefined> {
    try {
      const zipped = await this._getFile(dir_handle, FILE_SCRIPT);

      if (zipped) {
        const read = ZipReaderUtils.readZippedFile(zipped);
        const entries = await read.getEntries();
        const entry = entries.find(e => e.filename == FILE_SCRIPT_MAIN);

        if (entry) {
          return await ZipReaderUtils.getFile(entry);
        }
      }
    } catch {}
  }

  private static async _getScriptFolder(
    dir_handle: FileSystemDirectoryHandle
  ): Promise<File | undefined> {
    try {
      const script_handler = await dir_handle.getDirectoryHandle(FOLDER_SCRIPT);
      const file = await this._getFile(script_handler, FILE_MAIN);

      return file;
    } catch {
      return;
    }
  }

  static async getInitialScript(
    dir_handle: FileSystemDirectoryHandle
  ): Promise<File | undefined> {
    const zipped = await this._getScriptZip(dir_handle);

    if (!zipped) {
      return await this._getScriptFolder(dir_handle);
    }

    return zipped;
  }

  static async getFont(
    dir_handle: FileSystemDirectoryHandle
  ): Promise<File | undefined> {
    try {
      const file_handle = await dir_handle.getFileHandle(FILE_FONT);
      const file = await file_handle.getFile();

      return file;
    } catch {
      return;
    }
  }
}
