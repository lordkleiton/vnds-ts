import { IVariable } from "~/interfaces";
import { VarType } from "~/enums";

export default class Variable implements IVariable {
  _str: string = "";
  _num: number = 0;
  _type: VarType = VarType.VT_null;

  get num(): number {
    if (this._type != VarType.VT_int) return parseInt(this._str) || 0;

    return this._num;
  }

  set num(v: number) {
    this._num = v;
  }

  get str(): string {
    if (this._type != VarType.VT_string) return this.num.toString();

    return this._str;
  }

  set str(v: string) {
    this._str = v;
  }

  get type(): VarType {
    return this._type;
  }

  constructor(value: string | number) {
    if (typeof value == "number") {
      this._type = VarType.VT_int;

      this._num = value;
    }

    if (typeof value == "string") {
      const parsed = parseInt(value);

      if (isNaN(parsed)) {
        this._type = VarType.VT_string;

        this._str = value;
      } else {
        this._type = VarType.VT_int;

        this._num = parsed;
      }
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
