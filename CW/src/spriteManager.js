import { mapManager } from "./mapManager.js";

export class SpriteManager{
    constructor(mapManager){
        this.mapManager = mapManager;
        this.image = new Image();
        this.sprites = new Array();
        this.imgLoaded = false;
        this.jsonLoaded = false;  
    }

    loadAtlas(atlasJson, atlasImg){
        fetch(atlasJson, {method: 'GET'}).then(response => {
            response.json().then(value => {this.parseAtlas(value)});
        }).catch( error => {
            console.log("JSON ATLAS LOAD ERROR: " + error);
        });
        this.loadImg(atlasImg);
    }

    loadImg(imgName){
        let self = this;
        this.image.onload = function(){
            self.imgLoaded = true;
        }
        this.image.src = imgName; 
    }

    parseAtlas(atlasJSON){
        let atlas = atlasJSON;
        for(let name in atlas.frames){
            let frame = atlas.frames[name].frame; 
            this.sprites.push({name: name, x: frame.x, y: frame.y, w: frame.w, h: frame.h});
        }
        this.jsonLoaded = true; 
    }

    getSprite(name){
        for(let i = 0; i < this.sprites.length; ++i){
            let s = this.sprites[i];
            if(s.name === name){
                return s;
            }
        }
        return null;
    }

    drawSprite(ctx, name, x, y){
        if(!this.imgLoaded || !this.jsonLoaded){
            setTimeout(()=>{this.drawSprite(ctx, name, x, y)}, 500);
        }else{
            let sprite = this.getSprite(name);
            ctx.drawImage(this.image, sprite.x, sprite.y, sprite.w, sprite.h, x, y, sprite.w, sprite.h);
        }
    }
}