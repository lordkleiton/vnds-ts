import { CC_NEW_LINE, CC_NUL } from "./char_codes";
import {
  COMMAND_BGLOAD,
  COMMAND_CHOICE,
  COMMAND_CLEARTEXT,
  COMMAND_DELAY,
  COMMAND_ENDSCRIPT,
  COMMAND_FI,
  COMMAND_GOTO,
  COMMAND_GSETVAR,
  COMMAND_IF,
  COMMAND_JUMP,
  COMMAND_LABEL,
  COMMAND_RANDOM,
  COMMAND_SETIMG,
  COMMAND_SETVAR,
  COMMAND_SOUND,
  COMMAND_TEXT,
  COMMAND_MUSIC,
} from "./commands";
import {
  FILE_BG,
  FILE_FG,
  FILE_FONT,
  FILE_MAIN,
  FILE_SCRIPT,
  FILE_SCRIPT_MAIN,
  FILE_SOUND,
} from "./files";
import { FOLDER_BG, FOLDER_FG, FOLDER_SCRIPT, FOLDER_SOUND } from "./folders";
import { REGEX_MATCH_VAR_CURLY_BRACES, REGEX_MATCH_VAR_SIMPLE } from "./regex";
import {
  CMD_OPTIONS_BUFFER_LENGTH,
  CMD_OPTIONS_MAX_OPTIONS,
  CMD_TEXT_LENGTH,
  SCRIPT_READ_BUFFER_SIZE,
  VAR_NAME_LENGTH,
  VAR_OP_LENGTH,
  VAR_STRING_LENGTH,
  READ_BUFFER_SIZE,
} from "./script_engine";
import {
  SC_LEFT_BRACE,
  SC_NEW_LINE,
  SC_NUL,
  SC_RIGHT_BRACE,
  SC_AT,
  SC_EXCLAMATION,
  SC_TILDE,
  SC_QUOTE,
  SC_DOLLAR,
} from "./special_chars";
import { SIZE_CANVAS_WIDTH, SIZE_CANVAS_HEIGHT } from "./sizes";
import {
  ELEMENT_CANVAS,
  ELEMENT_PLAY_AREA,
  ELEMENT_TEXT_CURRENT,
  ELEMENT_TEXT_HISTORY,
  ELEMENT_TEXT_AREA,
} from "./elements";

export { CMD_OPTIONS_BUFFER_LENGTH, CMD_OPTIONS_MAX_OPTIONS, CMD_TEXT_LENGTH };

export {
  SCRIPT_READ_BUFFER_SIZE,
  VAR_NAME_LENGTH,
  VAR_OP_LENGTH,
  VAR_STRING_LENGTH,
  READ_BUFFER_SIZE,
  SC_NEW_LINE,
  CC_NEW_LINE,
  SC_NUL,
  CC_NUL,
  SC_AT,
  SC_EXCLAMATION,
  SC_TILDE,
  SC_QUOTE,
  SC_DOLLAR,
};

export {
  COMMAND_BGLOAD,
  COMMAND_CHOICE,
  COMMAND_CLEARTEXT,
  COMMAND_DELAY,
  COMMAND_ENDSCRIPT,
  COMMAND_FI,
  COMMAND_GOTO,
  COMMAND_GSETVAR,
  COMMAND_IF,
  COMMAND_JUMP,
  COMMAND_LABEL,
  COMMAND_RANDOM,
  COMMAND_SETIMG,
  COMMAND_SETVAR,
  COMMAND_SOUND,
  COMMAND_TEXT,
  COMMAND_MUSIC,
};

export { REGEX_MATCH_VAR_CURLY_BRACES, REGEX_MATCH_VAR_SIMPLE };

export { SC_LEFT_BRACE, SC_RIGHT_BRACE };

export { FOLDER_BG, FOLDER_FG, FOLDER_SCRIPT, FOLDER_SOUND };

export {
  FILE_BG,
  FILE_FG,
  FILE_MAIN,
  FILE_SCRIPT,
  FILE_SCRIPT_MAIN,
  FILE_SOUND,
  FILE_FONT,
};

export { SIZE_CANVAS_WIDTH, SIZE_CANVAS_HEIGHT };

export {
  ELEMENT_CANVAS,
  ELEMENT_TEXT_CURRENT,
  ELEMENT_TEXT_HISTORY,
  ELEMENT_PLAY_AREA,
  ELEMENT_TEXT_AREA,
};
