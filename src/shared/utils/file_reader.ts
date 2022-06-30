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

  private static async _getFileFromFolder(
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

  private static async _getFileFromZip(
    zipped: File,
    filename: string
  ): Promise<File | undefined> {
    try {
      const read = ZipReaderUtils.readZippedFile(zipped);
      const entries = await read.getEntries();
      const entry = entries.find(e => e.filename == filename);

      if (entry) {
        return await ZipReaderUtils.getFile(entry);
      }
    } catch {}
  }

  private static async _getZipFile(
    dir_handle: FileSystemDirectoryHandle,
    zipname: string,
    filename: string
  ): Promise<File | undefined> {
    try {
      const zipped = await this._getFileFromFolder(dir_handle, zipname);

      if (zipped) {
        return await this._getFileFromZip(zipped, filename);
      }
    } catch {}
  }

  private static async _getFileFromSubfolder(
    dir_handle: FileSystemDirectoryHandle,
    subfolder: string,
    filename: string
  ): Promise<File | undefined> {
    try {
      const script_handler = await dir_handle.getDirectoryHandle(subfolder);
      const file = await this._getFileFromFolder(script_handler, filename);

      return file;
    } catch {
      return;
    }
  }

  static async getScriptFile(
    dir_handle: FileSystemDirectoryHandle,
    path: string
  ): Promise<File | undefined> {
    const zipped = await this._getZipFile(dir_handle, FILE_SCRIPT, path);

    if (!zipped) {
      const split = path.split("/", 2);
      const filename = split[1];

      return await this._getFileFromSubfolder(
        dir_handle,
        FOLDER_SCRIPT,
        filename
      );
    }

    return zipped;
  }

  static async getInitialScript(
    dir_handle: FileSystemDirectoryHandle
  ): Promise<File | undefined> {
    return await this.getScriptFile(dir_handle, FILE_SCRIPT_MAIN);
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
