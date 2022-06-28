import { SC_NEW_LINE, SC_NUL } from "./special_chars";

const getCode = (s: string) => s.charCodeAt(0);

export const CC_NEW_LINE = getCode(SC_NEW_LINE);

export const CC_NUL = getCode(SC_NUL);
