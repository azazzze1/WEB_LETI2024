import { mapManager } from "./mapManager.js";
import { SpriteManager} from "./spriteManager.js";
import { gameManager } from "./gameManager.js";


let canvas = document.getElementById("canvasID");
let ctx = canvas.getContext("2d");
canvas.width = 640; canvas.height = 640;

let mainMapManager = new mapManager("/home/azazzzel/WEB_LETI2024/CW/public/map/levels/firstMap.json");

let spriteManager = new SpriteManager(mainMapManager);
spriteManager.loadAtlas("/public/sprites/tileSprites.json", "/public/sprites/tilesImage.png")

let mainGameManager = new gameManager(ctx, mainMapManager, spriteManager);

let rAF = null; 

document.addEventListener('keydown', (event) => {
    const KeyName = event.key;

    if(KeyName == 'ArrowLeft' || KeyName == 'ArrowRight'){
        console.log("LEFT");
        mainGameManager.player.posX = KeyName == 'ArrowLeft' ? mainGameManager.player.posX - 3 : mainGameManager.player.posX + 3;
    }

    if(KeyName == "ArrowUp"){
        console.log("UP")
        mainGameManager.player.posY-=3;
    }

    if(KeyName == "ArrowDown"){
        console.log("DOWN")
        mainGameManager.player.posY+=3;
    }
});


function loop(){
    rAF = requestAnimationFrame(loop);
    mainGameManager.update();
    mainGameManager.draw(ctx);
}

function play(){
    cancelAnimationFrame(rAF);
    rAF = requestAnimationFrame(loop);
}

play();