import { MAP_HEIGHT, MAP_WIDTH, TILE_SIZE } from "./configuration.js";
import { Block, Bullet, House, Player, Stone, Zombie } from "./entity.js";

export class gameManager{
    constructor(ctx, mapManager, spriteManager){
        this.mapManager = mapManager;
        this.spriteManager = spriteManager; 
        this.houseLifes = 3;
        this.ctx = ctx;
        this.factory = {};
        this.entities = [];
        this.fireNum = 0;
        this.player = null; 
        this.laterKill = [];       

        this.loadAll();
    }

    initPlayer(obj){
        this.player = obj;
    }

    kill(obj){
        this.laterKill.push(obj); 
    }

    draw(ctx){
        for(let ent = 0; ent < this.entities.length; ++ent){
            this.entities[ent].draw(ctx, this.spriteManager);
        }
    }

    gameOver(){
        alert("GAME OVER!"); 
    }

    update(){
        if(!this.houseLifes){
            this.gameOver();
        }

        if(this.player === null){
            return;
        }
        for(let ent of this.entities){
            try{
                ent.update(this);
            }catch(error){}
        }

        for(let i = 0; i < this.laterKill.length; ++i){
            let idx = this.entities.indexOf(this.laterKill[i]);
            if(idx > -1){
                this.entities.splice(idx,1); 
            }
        }

        if(this.laterKill.length > 0){
            this.laterKill.length = 0;
        }

        this.mapManager.draw(this.ctx);
        this.draw(this.ctx);
    }

    // 1
    //0  2
    // 3
    spawnZombie(){
        let wallId = Math.floor(Math.random() * 4);
        let zName;
        
        let widthSpawn = Math.floor(Math.random() * (MAP_WIDTH-TILE_SIZE*4)) + TILE_SIZE*2 + 16; //
        let heightSpawn = Math.floor(Math.random() * (MAP_HEIGHT-TILE_SIZE*4)) + TILE_SIZE*2 + 16;
        if(wallId in [1,3]){
            heightSpawn = wallId === 1 ? 65 : MAP_HEIGHT - 120;
            zName = wallId === 1 ? 'zDown1' : 'zUp1'; 
        }else{
            widthSpawn = wallId === 0 ? 50 : MAP_WIDTH - 120;
            zName = wallId === 0 ? 'zRight1' : 'zLeft1'; 
        }

        let obj = new this.factory['Zombie']();
        obj.entName = zName;
        obj.posX = widthSpawn;
        obj.posY = heightSpawn;
        obj.sizeX = TILE_SIZE;
        obj.sizeY = TILE_SIZE;

        if(this.entityAtXY(obj, obj.posX, obj.posY) !== null){
            this.spawnZombie();
            return;
        }

        this.entities.push(obj);
    }

    entityAtXY(obj, x, y){
        for(let i = 0; i < this.entities.length; ++i){
            let ent = this.entities[i];
            if(ent.entName !== obj.entName){
                if(x + obj.sizeX < ent.posX ||
                    y + obj.sizeY < ent.posY ||
                    x > ent.posX + ent.sizeX ||
                    y > ent.posY + ent.sizeY){
                        continue;
                    }
                return ent;
            }
        }
        return null; 
    }

    calculateDistance(x1, y1, x2, y2){
        return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
    }

    checkNewPos(obj,newX,newY){
        let ent = this.entityAtXY(obj, newX, newY);
        if(ent !== null && obj.onTouchEntity){
            if(obj.onTouchEntity(ent, this)){
                obj.posX = newX;
                obj.posY = newY;
                return true;
            }
        }else if(ent === null){
            obj.posX = newX;
            obj.posY = newY;
            return true;
        }
        return false;
    }

    loadAll(){
        this.factory['Player'] = Player;
        this.factory['Stone'] = Stone;
        this.factory['House'] = House;
        this.factory['Bullet'] = Bullet;
        this.factory['Block'] = Block;
        this.factory['Zombie'] = Zombie;
        this.mapManager.parseEntities(this);
        this.mapManager.draw(this.ctx);
    }
}