import { ScriptEngine } from "~/classes";
import { INovelInfo } from "~/interfaces";
import VNDS from "~/classes/vnds";
import Logger from "~/classes/logger";

const button = document.querySelector("#botao") as HTMLButtonElement;

const vnds = new VNDS({} as INovelInfo);

Object.assign(window, { engine: vnds.scriptEngine });

button.onclick = async () => {
  const dir_handle = await window.showDirectoryPicker();
  const engine: ScriptEngine = vnds.scriptEngine as ScriptEngine;

  try {
    const file_handle = await dir_handle.getFileHandle("main.scr");
    const file = await file_handle.getFile();

    await engine.setScriptFile(file);
  } catch (e) {
    Logger.error("Cannot find 'main.scr':", e);
  }
};
