export class mapManager{
    constructor(path){
        this.dataJSON; 

        fetch(path, {method: 'GET'}).then(response => {
            response.json().then(value => {this.parseMap(value)});
        }).catch( error => {
            console.log("JSON LOAD ERROR: " + error);
        });

        this.mapData = null;
        this.tLayer = new Array();
        this.xCount = 0;
        this.yCount = 0;
        this.tSize = {x: 32, y: 32};
        this.mapSize = {x: 32, y: 32};
        this.tilesets = new Array();
        this.imgLoadCount = 0;
        this.imgLoaded = false;
        this.imgs = [];
    }

    parseMap(tilesJSON){
        this.mapData = tilesJSON;
        this.xCount = this.mapData.width;
        this.yCount = this.mapData.height;
        this.tSize.x = this.mapData.tilewidth;
        this.tSize.y = this.mapData.tileheight;
        this.mapSize.x = this.xCount * this.tSize.x;
        this.mapSize.y = this.yCount * this.tSize.y;
        
        for(let i = 0; i < this.mapData.tilesets.length; ++i){
            let img = new Image();
            let self = this;
            img.onload = function(){
                self.imgLoadCount++; 
                if(self.imgLoadCount === self.mapData.tilesets.length){
                    self.imgLoaded = true; 
                }
            };            
            
            img.src = this.mapData.tilesets[i].image;
            let t = this.mapData.tilesets[i];

            let ts = {
                firstgid: t.firstgid,
                image: img,
                name: t.name,
                xCount: Math.floor(t.imagewidth / this.tSize.x),
                yCount: Math.floor(t.imageheight / this.tSize.y)
            };

            this.tilesets.push(ts);
        };
        this.jsonLoaded = true; 
    }

    getTileset(tileIndex){
        for(let i = this.tilesets.length - 1; i >= 0; --i){
            if(this.tilesets[i].firstgid <= tileIndex){
                return this.tilesets[i];
            }
        }
        return null; 
    }

    getTile(tileIndex){ 
        let tile = {
            img: null,
            px: 0,
            py: 0
        }; 
        let tileset = this.getTileset(tileIndex);
        tile.img = tileset.image;
        let id = tileIndex - tileset.firstgid;
        let x = id % tileset.xCount;
        let y = Math.floor(id / tileset.xCount);
        tile.px = x * this.tSize.x;
        tile.py = y * this.tSize.y;
        console.log(tileset);
        return tile;
    }

    isVisible(x,y,width,height){
        let returnValue = (x + width < this.view.w || y + height < this.view.y || x > this.view.x + this.view.w || y > this.view.y + this.view.h ) ? false : true;
        return returnValue;
    }

    draw(ctx){
    if(!this.imgLoaded || !this.jsonLoaded){
        setTimeout(() => {this.draw(ctx);}, 500);
    }else{
        if(this.tLayer.length === 0){
            for(let id = 0; id < this.mapData.layers.length; ++id){
                let layer = this.mapData.layers[id];
                if(layer.type === "tilelayer"){
                    this.tLayer.push(layer);
                }
            }

            console.log(this.tLayer);

            for(let j = 0; j < this.tLayer.length; ++j){
                for(let i = 0; i < this.tLayer[j].data.length; ++i){
                    if(this.tLayer[j].data[i] !== 0){
                        let tile = this.getTile(this.tLayer[j].data[i]);
                        let pX = (i % this.xCount) * this.tSize.x;
                        let pY = Math.floor(i / this.xCount) * this.tSize.y;
                        console.log(tile.img, tile.px, tile.py, this.tSize.x, this.tSize.y, pX, pY, this.tSize.x, this.tSize.y);
                        ctx.drawImage(tile.img, tile.px, tile.py, this.tSize.x, this.tSize.y, pX, pY, this.tSize.x, this.tSize.y);
                    }
                }
            }
        }
    }
}
};
