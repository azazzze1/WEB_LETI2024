var mapManager = {
    mapData: null,
    tLayer: new Array(),
    xCount: 20,
    yCount: 20,
    tSize: {x: 32, y: 32}, 
    mapSize: {x: 640, y: 640},
    tilesets: new Array(),
    imgLoadCount: 0,
    imgLoaded: false,
    jsonLoaded: false,
    view: {x:0, y: 0, w: 640, h: 640},

    loadMap(path){
        let request = new XMLHttpRequest();
        request.onreadystatechange = function(){
            if(request.readyState === 4 && request.status === 200){
                mapManager.parseMap(request.responseText) 
            }
        };
        request.open("GET", path, true);
        request.send(); 
    },

    parseMap(tilesJSON){
        this.mapData = JSON.parse(tilesJSON);
        this.xCount = this.mapData.width;
        this.yCount = this.mapData.height;
        this.tSize.x = this.mapData.tilewidth;
        this.tSize.y = this.mapData.tileheight;
        this.mapSize.x = this.xCount * this.tSize.x;
        this.mapSize.y = this.yCount * this.tSize.y;
    
        for(let i = 0; i < this.mapData.tilesets.length; ++i){
            let img = new Image();
            img.onload = function(){
                mapManager.imgLoadCount++; 
                if(mapManager.imgLoadCount === mapManager.mapData.tilesets.length){
                    mapManager.imgLoaded = true; 
                }
            };
            
            img.src = this.mapData.tilesets[i].source;
            let t = this.mapData.tilesets[i];
            let ts = {
                firstgid: t.firstgid,
                image: img, 
                name: t.name,
                xCount: Math.floor(t.imagewidth / mapManager.tSize.x),
                yCount: Math.floor(t.imageheight / mapManager.tSize.y)
            };
            this.tilesets.push(ts);
        };
    
        this.jsonLoaded = true;
    },

    getTileset(tileIndex){
        for(let i = mapManager.tilesets.length - 1; i >= 0; --i){
            if(mapManager.tilesets[i].firstgid <= tileIndex){
                return mapManager.tilesets[i];
            }
        }
        return null; 
    },

    getTile(tileIndex){ 
        let tile = {
            img: null,
            px: 0,
            py: 0
        }; 
        let tileset = this.getTileset(tileIndex);
        tile.img = tileset.image;
        let.id = tileIndex - tileset.firstgid;
        let x = id % tileset.xCount;
        let y = Math.floor(id / tileset.xCount);
        tile.px = x * mapManager.tSize.x;
        tile.py = y * mapManager.tSize.y;
        return tile;
    },

    isVisible(x,y,width,height){
        let returnValue = (x + width < this.view.w || y + height < this.view.y || x > this.view.x + this.view.w || y > this.view.y + this.view.h ) ? false : true;
        return returnValue;
    },


    draw(ctx){
    if(!mapManager.imgLoaded || !mapManager.jsonLoaded){
        setTimeout(function(){mapManager.draw(ctx);}, 100);
    }else{
        if(this.tLayer === null){
            for(let id = 0; id < this.mapData.layers.length; ++id){
                let layer = this.mapData.layers[id];
                if(layer.type === "tilelayer"){
                    this.tLayer = layer;
                    break;
                }
            }
            for(let i = 0; i < this.tLayer.data.length; ++i){
                if(this.tLayer.data[i] !== 0){
                    let tile = this.getTile(this.tLayer.data[i]);
                    let pX = (i % this.xCount) * this.tSize.x;
                    let pY = Math.floor(i / this.xCount) * this.tSize.y;
                    if(!this.isVisible(pX, pY, this.tSize.x, this.tSize.y)){
                        continue;
                    }
                    pX -= this.view.x;
                    pY -= this.view.y; 
                    ctx.drawImage(tile.img, tile.px, tile.py, this.tSize.x, this.tSize.y, pX, pY, this.tSize.x, this.tSize.y);
                }
            }
        }
    }
}
}; 

