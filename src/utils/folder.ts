export default abstract class FolderUtils {
  private static async _readDirectory(
    directory: FileSystemDirectoryHandle,
    out_result: Record<string, any>
  ): Promise<any> {
    for await (const entry of directory.values()) {
      if (entry.kind === "file") {
        const file = await entry.getFile();

        out_result[file.name] = file;
      }

      if (entry.kind === "directory") {
        const newHandle = await directory.getDirectoryHandle(entry.name, {
          create: false,
        });

        const newOut = (out_result[entry.name] = {});

        await this._readDirectory(newHandle, newOut);
      }
    }
  }

  static async readDirectory(
    directory: FileSystemDirectoryHandle
  ): Promise<any> {
    const result: Record<string, any> = {};

    await this._readDirectory(directory, result);

    return result;
  }
}
