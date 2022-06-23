import { VarType } from "~enums";

export default interface IVariable {
  type: VarType;
  intval: number;
  strval: string;
}
