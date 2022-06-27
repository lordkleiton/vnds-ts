import { IVariable } from "~/interfaces";
import { VarType } from "~/enums";

export default class Variable implements IVariable {
  type: VarType = VarType.VT_null;
  strval: string = "";

  get intval(): number {
    return parseInt(this.strval);
  }

  set intval(value: number) {
    if (typeof value != "number") return;

    this.strval = value.toString();
  }

  constructor(value: string) {
    if (!value) return;

    const parsed = parseFloat(value);

    if (isNaN(parsed)) {
      this.type = VarType.VT_string;

      this.strval = value.replace(/\"/gi, "");
    } else {
      this.type = VarType.VT_int;

      this.intval = parsed;
    }
  }

  /* interface stuff */

  equal(other: IVariable): boolean {
    if (this.type == VarType.VT_int && other.type == VarType.VT_int) {
      return this.intval == other.intval;
    }

    return this.strval == other.strval;
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
      return this.intval! > other.intval!;
    }

    return this.strval! > this.strval!;
  }

  lt(other: IVariable): boolean {
    if (this.type == VarType.VT_int && other.type == VarType.VT_int) {
      return this.intval! < other.intval!;
    }

    return this.strval! < this.strval!;
  }
}
