const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;
ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

const next = document.getElementById('next');
const next_ctx = next.getContext('2d');
next_ctx.canvas.width = NEXT_COLS * BLOCK_SIZE;
next_ctx.canvas.height = NEXT_ROWS * BLOCK_SIZE;
next_ctx.scale(BLOCK_SIZE,BLOCK_SIZE);

document.getElementById("user").textContent += localStorage.getItem("username");
console.log(localStorage);

let gameLogic = new Game_logic(ctx, next_ctx);

document.addEventListener('keydown', (event) => {
    const KeyName = event.key;

    if(GAME_OVER_FLAG) return;

    if(KeyName == 'ArrowLeft' || KeyName == 'ArrowRight'){
        const colMove = KeyName == 'ArrowLeft' ? gameLogic.showCol() - 1 : gameLogic.showCol() + 1;
        if(gameLogic.isValidMove(colMove)){
            gameLogic.board.piece.x = colMove;
        }
    }

    if(KeyName == "ArrowUp"){
        const matrix = gameLogic.board.piece.rotate();
        if(gameLogic.isValidMove(gameLogic.showCol(), gameLogic.showCol(), matrix)){
            gameLogic.board.piece.shape = matrix;
        }
    }

    if(KeyName == "ArrowDown"){
        const row = gameLogic.showRow() + 1;
        if(!gameLogic.isValidMove(gameLogic.showCol(), row)){
            gameLogic.board.piece.y = row - 1;
            gameLogic.placeTetromino();
            return;
        }
        gameLogic.board.piece.y = row;
    }

    if(KeyName == "Control"){
        let row = gameLogic.showRow(), col = gameLogic.showCol();
        while(gameLogic.isValidMove(col,row)){
            ++row;
        }
        gameLogic.board.piece.y = --row;
    }
});

function loop(){
    rAF = requestAnimationFrame(loop);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    gameLogic.board.drawBoard();
    if(gameLogic.board.piece){
        if(++count > GAME_SPEED){
            gameLogic.board.piece.y++;
            count = 0;
        }

        if(!gameLogic.isValidMove()){
            --gameLogic.board.piece.y;
            gameLogic.placeTetromino();
        }
    }

    gameLogic.board.p_ctx.fillStyle = gameLogic.board.piece.p_color;
    gameLogic.board.piece.draw();
}

function play(){
    cancelAnimationFrame(rAF);
    rAF = requestAnimationFrame(loop);
    gameLogic.lookNextTetromino();
}

