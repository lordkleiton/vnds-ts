import * as zip from "@zip.js/zip.js";

export default abstract class ZipReaderUtils {
  static readZippedFile(zipped: File): zip.ZipReader {
    const result = new zip.ZipReader(new zip.BlobReader(zipped));

    return result;
  }

  static async getFile(entry: zip.Entry): Promise<File | undefined> {
    const data = await entry.getData?.(new zip.BlobWriter());
    const result: File = data || undefined;

    return result;
  }
}
