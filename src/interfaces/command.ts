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
    path?: string;
  };

  sound?: {
    repeats?: number;
    path?: string;
  };

  music?: {
    path?: string;
  };

  text?: {
    text?: string;
  };

  choice?: {
    options: string[];
  };

  setvar?: {
    name?: string;
    op?: string;
    value?: string;
  };

  vif?: {
    expr1?: string;
    op?: string;
    expr2?: string;
  };

  jump?: {
    path?: string;
    label?: string;
  };

  delay?: {
    time?: number;
  };

  label?: {
    label?: string;
  };

  lgoto?: {
    label?: string;
  };

  clearText?: {
    clearType?: string;
  };

  random?: {
    name?: string;
    low?: number;
    high?: number;
  };
}
