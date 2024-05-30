import { MAP_HEIGHT, MAP_WIDTH, TILE_SIZE } from "./configuration.js";
import { Block, Bonus, Bullet, House, Player, Stone, Zombie } from "./entity.js";
import { rAF } from "./main.js";

export class gameManager{
    constructor(ctx, mapManager, spriteManager, audioManager){
        this.mapManager = mapManager;
        this.spriteManager = spriteManager; 
        this.audioManager = audioManager;
        this.score = 0;
        this.zombieKill = 0;
        this.houseLifes = 3;
        this.ctx = ctx;
        this.factory = {};
        this.entities = [];
        this.fireNum = 0;
        this.player = null; 
        this.laterKill = [];     
        this.recordList = JSON.parse(localStorage.getItem("recordList")) || [];    

        this.loadAll();
    }

    initPlayer(obj){
        this.player = obj;
    }

    kill(obj){
        this.laterKill.push(obj); 
        if(obj instanceof Zombie){
            this.audioManager.dieZombieF();
            document.getElementById("score").textContent = ++this.score;
        }
    }

    draw(ctx){
        for(let ent = 0; ent < this.entities.length; ++ent){
            this.entities[ent].draw(ctx, this.spriteManager);
        }
    }

    gameOver(){
        cancelAnimationFrame(rAF);
        
        let recordPlayer = {
            name: localStorage.getItem("username"),
            score: this.score
        };

        const existingRecordIndex = this.recordList.findIndex(record => record.name === recordPlayer.name);
        if(existingRecordIndex !== -1){
            if(recordPlayer.score > this.recordList[existingRecordIndex].score){
                this.recordList[existingRecordIndex].score = recordPlayer.score;
            }
        }else{
            this.recordList.push(recordPlayer);
            this.recordList.sort(function (a,b){
                return b.score - a.score;
            })
        }
        localStorage.setItem('recordList', JSON.stringify(this.recordList));

        const table = document.createElement('table');
        const caption = document.createElement('caption');
        caption.textContent = "Таблица рекордов:";
        table.append(caption);
        table.setAttribute('class', 'record-table');
        document.body.append(table);

        for (let i = 0; i < 10 && i !== this.recordList.length; ++i) {
            const row = document.createElement('tr');
            table.append(row);
            for (let j = 0; j < 3; ++j) {
                const cell = document.createElement('td');
                row.append(cell);

                let text;
                if(j === 0)
                    text = document.createTextNode(`${i+1})`);
                else if(j === 1)
                    text = document.createTextNode(`${this.recordList[i].name}:`);
                else
                    text = document.createTextNode(`${this.recordList[i].score}`);

                cell.append(text);
            }
        } 
    }

    update(){
        if(!this.houseLifes){
            this.gameOver();
        }
        if(this.houseLifes == 1){
            this.player.speed = 10;
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
        
        let widthSpawn = Math.floor(Math.random() * (MAP_WIDTH-TILE_SIZE*4)) + TILE_SIZE*2 + 16; 
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
        this.factory['Bonus'] = Bonus; 
        this.mapManager.parseEntities(this);
        this.mapManager.draw(this.ctx);
    }
}