import { VarType } from "~/enums";

export default interface IVariable {
  type: VarType;
  intval?: number;
  strval?: string;

  equal(other: IVariable): boolean;
  diff(other: IVariable): boolean;
  gte(other: IVariable): boolean;
  lte(other: IVariable): boolean;
  gt(other: IVariable): boolean;
  lt(other: IVariable): boolean;
}
