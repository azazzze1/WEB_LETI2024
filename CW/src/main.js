import { mapManager } from "./mapManager.js";
import { SpriteManager} from "./spriteManager.js";
import { gameManager } from "./gameManager.js";
import { MAP_HEIGHT, MAP_WIDTH, SPEED, ZOMBIE_TIME_SPAWN } from "./configuration.js"
import { AudioManager } from "./audioManager.js";

let canvas = document.getElementById("canvasID");
let ctx = canvas.getContext("2d");
canvas.width = MAP_WIDTH; canvas.height = MAP_HEIGHT;

document.getElementById("user").textContent += localStorage.getItem("username");
document.getElementById("level").textContent = localStorage.getItem("level");

let mainMapManager
if(localStorage.getItem("level") == "1"){
    mainMapManager = new mapManager("/home/azazzzel/WEB_LETI2024/CW/public/map/levels/firstMap.json");
}else if(localStorage.getItem("level") == "2"){
    mainMapManager = new mapManager("/home/azazzzel/WEB_LETI2024/CW/public/map/levels/secondMap.json");
}

let spriteManager = new SpriteManager(mainMapManager);
spriteManager.loadAtlas("/public/sprites/tileSprites.json", "/public/sprites/tilesImage.png")

let audioManager = new AudioManager();

let mainGameManager = new gameManager(ctx, mainMapManager, spriteManager, audioManager);


export let rAF = null; 
let count = 0;

document.addEventListener('keydown', (event) => {
    const KeyName = event.key;

    if(KeyName == 'ArrowLeft'){
        mainGameManager.checkNewPos(mainGameManager.player, mainGameManager.player.posX - mainGameManager.player.speed, mainGameManager.player.posY);
        mainGameManager.player.directive = "LEFT";
    }

    if(KeyName == 'ArrowRight'){
        mainGameManager.checkNewPos(mainGameManager.player, mainGameManager.player.posX + mainGameManager.player.speed, mainGameManager.player.posY);
        mainGameManager.player.directive = "RIGHT";
    }

    if(KeyName == "ArrowUp"){
        mainGameManager.checkNewPos(mainGameManager.player, mainGameManager.player.posX, mainGameManager.player.posY - mainGameManager.player.speed);
        mainGameManager.player.directive = "UP";
    }

    if(KeyName == "ArrowDown"){
        mainGameManager.checkNewPos(mainGameManager.player, mainGameManager.player.posX, mainGameManager.player.posY + mainGameManager.player.speed);
        mainGameManager.player.directive = "DOWN";
    }

    if(KeyName == "Control"){
        mainGameManager.player.fire(mainGameManager); 
    }
});

function loop(){
    rAF = requestAnimationFrame(loop);
    if(++count === ZOMBIE_TIME_SPAWN){
        count = 0;
        mainGameManager.spawnZombie();
        document.getElementById("score").textContent = ++mainGameManager.score;
    }
    mainGameManager.update();
    mainGameManager.draw(ctx);
}

function play(){
    cancelAnimationFrame(rAF);
    rAF = requestAnimationFrame(loop);
}

play();