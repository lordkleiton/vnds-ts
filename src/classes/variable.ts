import { IVariable } from "~/interfaces";
import { VarType } from "~/enums";

export default class Variable implements IVariable {
  _strval: string = "";

  get type(): VarType {
    if (!this.str) return VarType.VT_null;

    return isNaN(this.num) ? VarType.VT_string : VarType.VT_int;
  }

  get str(): string {
    return this._strval;
  }

  set str(value: string) {
    this._strval = value;
  }

  get num(): number {
    if (!this.str) return 0;

    return parseInt(this.str);
  }

  set num(value: number) {
    if (typeof value != "number") return;

    this.str = value.toString();
  }

  constructor(value: string) {
    const parsed = parseFloat(value);

    if (isNaN(parsed)) {
      this.str = value.replace(/\"/gi, "");
    } else {
      this.num = parsed;
    }
  }

  /* interface stuff */

  equal(other: IVariable): boolean {
    if (this.type == VarType.VT_int && other.type == VarType.VT_int) {
      return this.num == other.num;
    }

    return this.str == other.str;
  }

  diff(other: IVariable): boolean {
    return !this.equal(other);
  }

  gte(other: IVariable): boolean {
    return !this.lt(other);
  }

  lte(other: IVariable): boolean {
    return !this.gt(other);
  }

  gt(other: IVariable): boolean {
    if (this.type == VarType.VT_int && other.type == VarType.VT_int) {
      return this.num > other.num;
    }

    return this.str > this.str;
  }

  lt(other: IVariable): boolean {
    if (this.type == VarType.VT_int && other.type == VarType.VT_int) {
      return this.num < other.num;
    }

    return this.str < this.str;
  }
}
