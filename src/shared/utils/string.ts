export default abstract class StringUtils {
  static equals(first: string, second: string): boolean {
    return first.toLocaleLowerCase() == second.toLocaleLowerCase();
  }
}
