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

  private static async _getScriptZip(
    dir_handle: FileSystemDirectoryHandle
  ): Promise<File | undefined> {
    try {
      const file_handle = await dir_handle.getFileHandle(FILE_SCRIPT);
      const file = await file_handle.getFile();

      const read = ZipReaderUtils.readZippedFile(file);
      const entries = await read.getEntries();
      const entry = entries.find(e => e.filename == FILE_SCRIPT_MAIN);

      if (entry) {
        return await ZipReaderUtils.getFile(entry);
      }
    } catch {
      return;
    }
  }

  private static async _getScriptFolder(
    dir_handle: FileSystemDirectoryHandle
  ): Promise<File | undefined> {
    try {
      const script_handler = await dir_handle.getDirectoryHandle(FOLDER_SCRIPT);
      const file_handle = await script_handler.getFileHandle(FILE_MAIN);
      const file = file_handle.getFile();

      return file;
    } catch {
      return;
    }
  }

  static async getInitialScript(
    dir_handle: FileSystemDirectoryHandle
  ): Promise<File | undefined> {
    const zip = await this._getScriptZip(dir_handle);

    if (!zip) {
      return await this._getScriptFolder(dir_handle);
    }

    return zip;
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
