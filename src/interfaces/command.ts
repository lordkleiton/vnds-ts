import { CommandType } from "~/enums";

export default interface ICommand {
  id: CommandType;

  bgload?: {
    path?: string;
    fadeTime?: number;
  };

  setimg?: {
    x?: number;
    y?: number;
    path?: number;
  };

  sound?: {
    repeats?: number;
    path?: number;
  };

  music?: {
    path?: number;
  };

  text?: {
    text?: number;
  };

  choice?: {
    optionsL?: number;
    optionsOffset?: number;
    optionsBuffer?: number;
  };

  setvar?: {
    name?: number;
    op?: number;
    value?: number;
  };

  vif?: {
    expr1?: number;
    op?: number;
    expr2?: number;
  };

  jump?: {
    path?: number;
    label?: number;
  };

  delay?: {
    time?: number;
  };

  label?: {
    label?: number;
  };

  lgoto?: {
    label?: number;
  };

  clearText?: {
    clearType?: number;
  };

  random?: {
    name?: number;
    low?: number;
    high?: number;
  };
}
