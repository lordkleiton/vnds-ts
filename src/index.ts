import { ScriptEngine } from "~/classes";
import { INovelInfo } from "~/interfaces";
import VNDS from "~/classes/vnds";

const button = document.querySelector("#botao") as HTMLButtonElement;

const vnds = new VNDS({} as INovelInfo);

Object.assign(window, { engine: vnds.scriptEngine });

button.onclick = () => {
  window.showOpenFilePicker().then(async files => {
    const engine: ScriptEngine = vnds.scriptEngine as ScriptEngine;
    const file_handle = files[0];
    const file = await file_handle.getFile();

    await engine.setScriptFile(file);
  });
};
