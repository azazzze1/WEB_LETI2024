class Game_logic{
    constructor(ctx, next_ctx) {
        this.tetrominoSequence = [];
        this.board = new Board(ctx);
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.next_ctx = next_ctx;

        this.board.reset();
        this.generateSequence();
        this.board.piece = new Piece(ctx, this.getNextTetromino());
        next_ctx.clearRect(0,0,NEXT_ROWS, NEXT_COLS);

        this.recordList = JSON.parse(localStorage.getItem('recordList'));
    }

    getRandomInt(min, max){
        min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    generateSequence(){
        const sequance = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
        while (sequance.length){
            const rand = this.getRandomInt(0, sequance.length-1);
            const name = sequance.splice(rand, 1)[0];

            this.tetrominoSequence.push(name);
        }
    }

    lookNextTetromino(){
        if(this.tetrominoSequence.length == 0){
            this.generateSequence();
        }
        const name = this.tetrominoSequence[this.tetrominoSequence.length-1];
        const matrix = tetrominos[name];
        let row = 2;

        let col;
        switch(name){
            case 'I':
                row = 1.5;
                col = 0.5;
                break;
            case 'O':
                col = 1.5;
                break;
            default:
                col = 1;
        }

        const color = COLORS[name];
        let next_tetramino = {
            color: color,
            matrix: matrix,
            row: row,
            col: col
        };
        let next_piece = new Piece(this.next_ctx, next_tetramino);

        next_ctx.clearRect(0,0,NEXT_ROWS, NEXT_COLS);
        next_piece.draw();
    }

    getNextTetromino(){
        const name = this.tetrominoSequence.pop();
        this.lookNextTetromino();
        const matrix = tetrominos[name];
        const col = COLS/2 - Math.ceil(matrix[0].length / 2);
        const row = name === 'I' ? -1 : -2;
        const color = COLORS[name];
        return{
            color: color,
            matrix: matrix,
            row: row, 
            col: col
        };
    }

    isValidMove(posX = this.board.piece.x, posY = this.board.piece.y, pieceShape = this.board.piece.shape){
        for(let row = 0; row < pieceShape.length; ++row){
            for(let col = 0; col < pieceShape[row].length; ++col){
                if(pieceShape[row][col] && (
                    posX + col < 0 || posX + col >= COLS || posY + row >= ROWS ||
                    this.board.grid[posY + row][posX + col]
                )){
                    return false;
                }
            }
        }
        return true;
    }

    showGameOver(){
        cancelAnimationFrame(rAF);
        GAME_OVER_FLAG = true;
        this.board.gameOverBoard();

        let recordPlayer = {
            name: localStorage.getItem("username"),
            score: this.score
        };

        const existingRecordIndex = this.recordList.findIndex(record => record.name === recordPlayer.name);
        if(existingRecordIndex !== -1){
            if(recordPlayer.score > this.recordList[existingRecordIndex]){
                this.recordList[existingRecordIndex] = recordPlayer;
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

    placeTetromino(){
        this.score += SCORE_BY_LEVEL[this.level];
        this.checkNewLevel();

        let cur_piece = this.board.piece;
        for(let row = 0; row < cur_piece.shape.length; ++row){
            for(let col = 0; col < cur_piece.shape[0].length; ++col){
                if(cur_piece.shape[row][col]){
                    if(cur_piece.y + row < 0){
                        this.showGameOver();
                        return;
                    }
                    this.board.grid[cur_piece.y + row][cur_piece.x + col] = cur_piece.shape[row][col];
                }
            }
        }

        for(let row = ROWS - 1; row >= 0;){
            if(this.board.checkFilledRow(row)){
                ++this.lines; this.score += SCORE_BY_LEVEL[this.level] * 5;
                this.checkNewLevel();
                this.board.grid.splice(row, 1);
                this.board.grid.unshift(Array(COLS).fill(0));
            } else{
                --row;
            }
        }

        this.board.piece = new Piece(this.board.p_ctx, this.getNextTetromino());
    }

    checkNewLevel(){
        if(this.score > NEXT_LEVEL_SCORE["FIFTH"]){
            this.level = 5;
            GAME_SPEED = 5;
        }else if(this.score > NEXT_LEVEL_SCORE["FOURTH"]){
            this.level = 4;
            GAME_SPEED = 15;
        }else if(this.score > NEXT_LEVEL_SCORE["THIRD"]){
            this.level = 3;
            GAME_SPEED = 20;
        }else if(this.score > NEXT_LEVEL_SCORE["SECOND"]){
            this.level = 2;
            GAME_SPEED = 25;
        }

        document.getElementById('lines').innerText = this.lines;
        document.getElementById('score').innerText = this.score;
        document.getElementById('level').innerText = this.level;
    }

    showRow(){return this.board.piece.y;}
    showCol(){return this.board.piece.x;}

}