export class Entity{
    constructor(){
        this.entName = "";
        this.posX = 0; this.posY = 0; 
        this.sizeX = 0; this.sizeY = 0;
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
        this.speed = 1;
        this.moveX = 0; this.moveY = 0; 
    }

    draw(ctx, spriteManager){spriteManager.drawSprite(ctx, this.entName, this.posX, this.posY);}

    update(){}

    onTouchEntity(obj){}

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

    onTouchEntity(obj){}
}

export class Zombie extends Entity{
    constructor(){
        super(); 
        this.lifes = 1; 
        this.speed = 0.5;
    }

    draw(ctx, spriteManager){
        spriteManager.drawSprite(ctx,"zRight1", this.posX, this.posY);
    }

    update(){}

    onTouchEntity(obj){}

    kill(){}
}