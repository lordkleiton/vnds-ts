import { ScriptEngine } from "~/classes";
import { IVNDS } from "~/interfaces";

const button = document.querySelector("#botao") as HTMLButtonElement;

const vnds = {} as IVNDS;
const engine = new ScriptEngine(vnds);

Object.assign(window, { engine });

button.onclick = () => {
  window.showOpenFilePicker().then(async files => {
    const file_handle = files[0];
    const file = await file_handle.getFile();

    engine.setScriptFile(file);
  });
};
