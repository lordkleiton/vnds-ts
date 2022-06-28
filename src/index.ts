import { ScriptEngine } from "~/core/classes";
import { INovelInfo } from "~/shared/interfaces";
import VNDS from "~/core/classes/vnds";
import Logger from "~/core/classes/logger";
import { FILE_MAIN } from "~/shared/consts/files";
import { ZipReaderUtils } from "~/shared/utils";
import * as zip from "@zip.js/zip.js";

const file_name = FILE_MAIN;

const button = document.querySelector("#botao") as HTMLButtonElement;
const canvas = document.querySelector("#canvas") as HTMLCanvasElement;

const vnds = new VNDS({} as INovelInfo);

Object.assign(window, { engine: vnds.scriptEngine });

button.onclick = async () => {
  const dir_handle = await window.showDirectoryPicker();
  const engine: ScriptEngine = vnds.scriptEngine as ScriptEngine;

  vnds.root_folder = dir_handle;

  const bg = await dir_handle.getFileHandle("background.zip");

  const read = ZipReaderUtils.readZippedFile(await bg.getFile());
  const entries = await read.getEntries();

  entries.forEach(async e => {
    if (e.filename == "background/genshi.jpg") {
      const aa = await ZipReaderUtils.getFile(e);

      if (aa) {
        const url = window.URL;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          const img = new Image();

          console.log(url.createObjectURL(aa));

          img.src = url.createObjectURL(aa);

          img.onload = () => {
            ctx.drawImage(img, 0, 0, 500, 300);
          };
        }
      }
    }
  });

  // try {
  //   const file_handle = await dir_handle.getFileHandle(file_name);
  //   const file = await file_handle.getFile();

  //   await engine.setScriptFile(file);
  // } catch (e) {
  //   Logger.error(`Cannot find '${file_name}':`, e);
  // }
};
