import { INovelInfo } from "~/shared/interfaces";
import VNDS from "~/core/classes/vnds";
import { Logger } from "~/app/other";
import { ScriptEngine } from "~/app/engines";
import { FileReaderUtils } from "~/shared/utils";

const button = document.querySelector("#botao") as HTMLButtonElement;

const vnds = new VNDS({} as INovelInfo);

Object.assign(window, { engine: vnds.scriptEngine });

button.onclick = async () => {
  const dir_handle = await window.showDirectoryPicker();
  const engine: ScriptEngine = vnds.scriptEngine as ScriptEngine;

  vnds.root_folder = dir_handle;

  try {
    const file = await FileReaderUtils.getInitialScript(dir_handle);

    if (file) {
      await engine.setScriptFile(file);
    } else {
      throw new Error("couldnt find 'main.scr'");
    }
  } catch (e) {
    Logger.error(e);
  }
};
