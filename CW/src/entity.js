import { MAP_HEIGHT, MAP_WIDTH, TILE_SIZE } from "./configuration.js";

export class Entity{
    constructor(){
        this.entName = "";
        this.posX = 0; this.posY = 0; 
        this.sizeX = 0; this.sizeY = 0;
        this.directive = "";
    }
}

export class Stone extends Entity{
    constructor(){
        super();
    }

    draw(ctx, spriteManager){spriteManager.drawSprite(ctx,this.entName, this.posX, this.posY);}
}

export class House extends Entity{
    constructor(){
        super();
    }

    draw(ctx, spriteManager){spriteManager.drawSprite(ctx, this.entName, this.posX, this.posY);}
}

export class Block extends Entity{
    constructor(){
        super();
    }

    draw(ctx, spriteManager){}
}

export class Player extends Entity{
    constructor(){
        super(); 
        this.lifes = 3; 
        this.speed = 3;
        this.moveX = 0; this.moveY = 0; 
    }

    draw(ctx, spriteManager){spriteManager.drawSprite(ctx, this.entName, this.posX, this.posY);}

    update(){}

    onTouchEntity(obj){
        if(obj instanceof House){
            return true;            
        }
    }

    fire(){
        let bullet = Object.create(Bullet);
        bullet.sizeX = 32; 
        bullet.sizeY = 32;
        bullet.moveX = this.moveX;
        bullet.moveY = this.moveY;
        switch(this.moveX + 2*this.moveY){
            case -1:
                bullet.posX = this.posX - bullet.sizeX;
                bullet.posY = this.posY;
                break;
            case 1: 
                bullet.posX = this.posX + bullet.sizeX;
                bullet.posY = this.posY;
                break;
            case -2:
                bullet.posX = this.posX;
                bullet.posY = this.posY - bullet.sizeY;
                break;
            case 2: 
                bullet.posX = this.posX;
                bullet.posY = this.posY + bullet.sizeY;
                break;
            default:
                return;
        }
    }
}

export class Bullet extends Entity{
    constructor(spriteManager){
        super(spriteManager); 
        this.speed = 3;
        this.moveX = 0; this.moveY = 0; 
    }

    draw(ctx, spriteManager){spriteManager.drawSprite(ctx);}

    update(){}

    onTouchEntity(obj, gameManager){}
}

export class Zombie extends Entity{
    constructor(){
        super(); 
        this.lifes = 1; 
        this.speed = 1;
    }

    draw(ctx, spriteManager){
        spriteManager.drawSprite(ctx, this.entName, this.posX, this.posY);
    }

    //Сделать ИИ для зомби, чтобы шёл к дому.
    update(gameManager){
        let ent;
        for(let x = -1; x < MAP_WIDTH; x+=32){
            for(let y = -1; y < MAP_HEIGHT; y+=32){
                ent = gameManager.entityAtXY(this, x, y);
                if(ent instanceof House){
                    break;
                }
            }
            if(ent instanceof House){
                break;
            }
        }

        let newX = this.posX;
        let newY = this.posY;

        if(ent.posY !== this.posY && gameManager.calculateDistance(ent.posX, ent.posY, this.posX, this.posY - this.speed) < 
        gameManager.calculateDistance(ent.posX, ent.posY, this.posX, this.posY + this.speed)){
            newY-=this.speed;
            this.directive = 'UP';
        }
        
        else if(ent.posY !== this.posY){
            newY+=this.speed;
            this.directive = 'DOWN';
        }

        else if(ent.posX !== this.posX && gameManager.calculateDistance(ent.posX, ent.posY, this.posX - this.speed, this.posY) < 
        gameManager.calculateDistance(ent.posX, ent.posY, this.posX + this.speed, this.posY)){
            newX-=this.speed;
            this.directive = 'LEFT';
        }

        else if(ent.posX !== this.posX){
            newX+=this.speed;
            this.directive = 'RIGHT';
        }

        let flag = true;
        if(!gameManager.checkNewPos(this, newX, newY)){

            console.log(this.directive, this.posX, this.posY);

            switch(this.directive){
                case 'UP': 
                    while(!gameManager.checkNewPos(this, this.posX, this.posY - this.speed)){
                        gameManager.checkNewPos(this, ++this.posX, this.posY);
                    }
                break;

                case 'DOWN': 
                    while(!gameManager.checkNewPos(this, this.posX, this.posY + this.speed)){
                        gameManager.checkNewPos(this, ++this.posX, this.posY);
                    }
                break;

                case 'RIGHT': 
                    while(!gameManager.checkNewPos(this, this.posX + this.speed, this.posY)){
                        gameManager.checkNewPos(this, this.posX, ++this.posY);
                    }
                    while(!gameManager.checkNewPos(this, this.posX, this.posY - this.speed)){
                        gameManager.checkNewPos(this, ++this.posX, this.posY);
                    }
                    break;
                
                case 'LEFT': 
                    while(!gameManager.checkNewPos(this, this.posX - this.speed, this.posY)){
                        gameManager.checkNewPos(this, this.posX, ++this.posY);
                    }
                    while(!gameManager.checkNewPos(this, this.posX, this.posY - this.speed)){
                        gameManager.checkNewPos(this, --this.posX, this.posY);
                    }
                    break;
            }
        }
    }

    onTouchEntity(obj, gameManager){
        if(obj instanceof House){
            gameManager.kill(this);
            return true;            
        }
        return false; 
    }

    kill(){}
}