const COLS = 10;
const  ROWS = 20;
const NEXT_COLS = 5;
const NEXT_ROWS = 6;
const BLOCK_SIZE = 30;

let rAF = null;
let count = 0;

let GAME_OVER_FLAG = false;
let GAME_SPEED = 35;

const KEY = {
    LEFT: 37,
    RIGHT: 39,
    DOWN: 40
}
Object.freeze(KEY);

const tetrominos = {
    'I': [
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0]
    ],
    'J': [
        [6,0,0],
        [6,6,6],
        [0,0,0],
    ],
    'L': [
        [0,0,7],
        [7,7,7],
        [0,0,0],
    ],
    'O': [
        [2,2],
        [2,2],
    ],
    'S': [
        [0,4,4],
        [4,4,0],
        [0,0,0],
    ],
    'Z': [
        [5,5,0],
        [0,5,5],
        [0,0,0],
    ],
    'T': [
        [0,3,0],
        [3,3,3],
        [0,0,0],
    ]
};

const COLORS = {
    'I': 'cyan',
    'O': 'yellow',
    'T': 'purple',
    'S': 'green',
    'Z': 'red',
    'J': 'blue',
    'L': 'orange'
};

const COLORS_NUM = {
    1: 'cyan',
    2: 'yellow',
    3: 'purple',
    4: 'green',
    5: 'red',
    6: 'blue',
    7: 'orange'
}

const SCORE_BY_LEVEL = {
    1: 50,
    2: 100,
    3: 150,
    4: 200,
    5: 300
}

const NEXT_LEVEL_SCORE = {
    "SECOND": 5000,
    "THIRD": 15000,
    "FOURTH": 25000,
    "FIFTH": 40000
}