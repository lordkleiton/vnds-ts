import { INovelInfo } from "~/shared/interfaces";
import VNDS from "~/core/classes/vnds";
import { Logger } from "~/app/other";
import { ScriptEngine } from "~/app/engines";
import { DomUtils, FileReaderUtils, StringUtils } from "~/shared/utils";

const button = document.querySelector("#botao") as HTMLButtonElement;

const vnds = new VNDS({} as INovelInfo);

Object.assign(window, { engine: vnds.scriptEngine });

button.onclick = async () => {
  const dir_handle = await window.showDirectoryPicker();
  const engine: ScriptEngine = vnds.scriptEngine as ScriptEngine;

  vnds.root_folder = dir_handle;

  try {
    const file = await FileReaderUtils.getFont(dir_handle);

    if (file) DomUtils.setFont(file);
  } catch {}

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
