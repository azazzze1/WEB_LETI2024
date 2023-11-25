import { Block, Bullet, House, Player, Stone } from "./entity.js";

export class gameManager{
    constructor(ctx, mapManager, spriteManager){
        this.mapManager = mapManager;
        this.spriteManager = spriteManager; 
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

    update(){
        if(this.player === null){
            return;
        }
        for(let ent of this.entities){
            try{
                ent.update();
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

    loadAll(){
        this.factory['Player'] = Player;
        this.factory['Stone'] = Stone;
        this.factory['House'] = House;
        this.factory['Bullet'] = Bullet;
        this.factory['Block'] = Block;
        this.mapManager.parseEntities(this);
        this.mapManager.draw(this.ctx);
    }
}