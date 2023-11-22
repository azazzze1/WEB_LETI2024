import {mapManager} from "./mapManager.js";

let canvas = document.getElementById("canvasID");
let ctx = canvas.getContext("2d");
canvas.width = 640; canvas.height = 640;

let mainMapManager = new mapManager("/home/azazzzel/WEB_LETI2024/CW/public/map/levels/firstMap.json");
mainMapManager.draw(ctx);

// mapManager.loadMap("/home/azazzzel/WEB_LETI2024/CW/public/map/levels/firstMap.json");
// mapManager.draw(ctx);