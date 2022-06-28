import { VarType } from "~/shared/enums";

export default interface IVariable {
  type: VarType;
  str: string;
  num: number;

  equal(other: IVariable): boolean;
  diff(other: IVariable): boolean;
  gte(other: IVariable): boolean;
  lte(other: IVariable): boolean;
  gt(other: IVariable): boolean;
  lt(other: IVariable): boolean;
}
