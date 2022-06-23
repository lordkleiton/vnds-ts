import { ScriptEngine } from "~/classes";
import { IVNDS } from "~/interfaces";

const button = document.querySelector("#botao") as HTMLButtonElement;

button.onclick = () => {
  window.showOpenFilePicker().then(async files => {
    const vnds = {} as IVNDS;
    const engine = new ScriptEngine(vnds);
    const file_handle = files[0];
    const file = await file_handle.getFile();

    engine.setScriptFile(file);
  });
};
