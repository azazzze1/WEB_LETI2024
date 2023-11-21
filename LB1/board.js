class Board{
    constructor(ctx) {
        this.piece = new Piece(ctx);
        this.p_ctx = ctx;
    }
    reset(){
        this.grid = this.getEmptyBoard();
    }

    getEmptyBoard(){
        return Array.from(
            {length: ROWS}, () => Array(COLS).fill(0)
        );
    }

    checkFilledRow(cur_row){
        let full_flag = 0;
        for(let col = 0; col < COLS; ++col){
            if(this.grid[cur_row][col])
                ++full_flag;
        }

        return full_flag === COLS;
    }

    gameOverBoard(){
        this.p_ctx.fillStyle = 'white';
        this.p_ctx.globalAlpha = 0.75;
        this.p_ctx.fillRect(0, ROWS/2 - 2 , COLS, ROWS/4);

        this.p_ctx.globalAlpha = 1;
        this.p_ctx.fillStyle = 'red';
        this.p_ctx.textAlign = 'center'
        this.p_ctx.textBaseline = 'middle';
        this.p_ctx.font = '5px serif'
        this.p_ctx.fillText("game over", COLS/2, ROWS/2 + 0.5, 9.5);
        this.p_ctx.font = 'bold 5px';

    }

    drawBoard(){
    for(let row = 0; row < ROWS; ++row){
            for(let col = 0; col < COLS; ++col){
                if(this.grid[row][col]){
                    this.p_ctx.fillStyle = COLORS_NUM[this.grid[row][col]];
                    this.p_ctx.fillRect(col, row, 1, 1);
                }
            }
        }
    }





}