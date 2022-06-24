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
}
