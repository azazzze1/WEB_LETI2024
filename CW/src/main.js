let canvas = document.getElementById("canvasID");
let ctx = canvas.getContext("2d");
canvas.width = 640; canvas.height = 640;

mapManager.loadMap("/home/azazzzel/WEB_LETI2024/CW/public/map/firstLevel/firstMap.json");
mapManager.draw(ctx);