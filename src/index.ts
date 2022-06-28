import { ScriptEngine } from "~/classes";
import { INovelInfo } from "~/interfaces";
import VNDS from "~/classes/vnds";
import Logger from "~/classes/logger";
import { FILE_MAIN } from "~/consts/files";

const file_name = FILE_MAIN;

const button = document.querySelector("#botao") as HTMLButtonElement;

const vnds = new VNDS({} as INovelInfo);

Object.assign(window, { engine: vnds.scriptEngine });

button.onclick = async () => {
  const dir_handle = await window.showDirectoryPicker();
  const engine: ScriptEngine = vnds.scriptEngine as ScriptEngine;

  vnds.root_folder = dir_handle;

  try {
    const file_handle = await dir_handle.getFileHandle(file_name);
    const file = await file_handle.getFile();

    await engine.setScriptFile(file);
  } catch (e) {
    Logger.error(`Cannot find '${file_name}':`, e);
  }
};
