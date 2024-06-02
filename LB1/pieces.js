class Piece {
    constructor(ctx, params = {color:'red', matrix:[[1,1,0], [0,1,1], [0,0,0],], row:0, col:0 }) {
        this.ctx = ctx;
        this.p_color = params.color;
        this.shape = params.matrix;

        this.x = params.col;
        this.y = params.row;
    }

    draw(ctx = this.ctx){
        this.ctx.fillStyle = this.p_color;
        for(let y = 0; y < this.shape.length; y++){
            for(let x = 0; x < this.shape[y].length; x++){
                if(this.shape[y][x])
                    this.ctx.fillRect(this.x + x, this.y + y, 1, 1);
            }
        }
    }

    rotate(){
        let result = [];
        for(let i = this.shape.length - 1; i >= 0; --i){
            for(let j = 0; j < this.shape[i].length; ++j){
                if(!result[j]){
                    result[j] = []
                }
                result[j].push(this.shape[i][j]);
            }
        }
        return result;
    }
}