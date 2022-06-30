import { INovelInfo } from "~/shared/interfaces";
import VNDS from "~/core/classes/vnds";
import { Logger } from "~/app/other";
import { ScriptEngine } from "~/app/engines";
import { DomUtils, FileReaderUtils, StringUtils } from "~/shared/utils";
import { CC_NEW_LINE, SCRIPT_READ_BUFFER_SIZE } from "~/shared/consts";

const button = document.querySelector("#botao") as HTMLButtonElement;

const vnds = new VNDS({} as INovelInfo);

Object.assign(window, { engine: vnds.scriptEngine });

button.onclick = async () => {
  const dir_handle = await window.showDirectoryPicker();
  const engine: ScriptEngine = vnds.scriptEngine as ScriptEngine;

  vnds.root_folder = dir_handle;

  // título

  try {
    const file = await FileReaderUtils.getInfoFile(dir_handle);

    if (file) {
      const read = await FileReaderUtils.read(file, 0, SCRIPT_READ_BUFFER_SIZE);
      const buffer = new Uint8Array(read);

      const last_line_index = Array.from(buffer)
        .reverse()
        .findIndex(el => el == CC_NEW_LINE);
      const current_text = buffer.slice(0, buffer.length - last_line_index);

      const decoder = new TextDecoder();
      const decoded = decoder.decode(current_text);
      const split = decoded
        .split(RegExp("title=", "gi"))
        .map(command => command.trim());

      const title = split[1];

      if (title) {
        document.title = `VNDS: ${title}`;
      }
    }
  } catch {}

  // favicon

  try {
    const file = await FileReaderUtils.getFavicon(dir_handle);

    if (file) {
      const url = window.URL.createObjectURL(file);

      DomUtils.changeFavicon(url);
    }
  } catch {}

  // fonte

  try {
    const file = await FileReaderUtils.getFont(dir_handle);

    if (file) DomUtils.setFont(file);
  } catch {}

  // script

  try {
    const file = await FileReaderUtils.getInitialScript(dir_handle);

    if (file) {
      await engine.setScriptFile(file);

      const body = document.querySelector("body");

      if (body) {
        body.onkeyup = e => {
          if (StringUtils.equals(e.key, "enter")) {
            engine.executeNextCommand(false);
          }

          if (StringUtils.equals(e.key, "h")) {
            DomUtils.toggleTextPane();
          }

          if (StringUtils.equals(e.key, "escape")) {
            DomUtils.toggleTextArea();
          }
        };
      }
    } else {
      throw new Error("couldnt find 'main.scr'");
    }
  } catch (e) {
    Logger.error(e);
  }
};
