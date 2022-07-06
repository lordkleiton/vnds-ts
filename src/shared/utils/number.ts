export default abstract class NumberUtils {
  static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  static normalize(value: number, max: number, min: number) {
    return (value - min) / (max - min);
  }
}
