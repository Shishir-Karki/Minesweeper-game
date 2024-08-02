let NUM_ROWS =9
let NUM_COLS = 9
let NUM_MINES = 10
let board  = []
let revealedTiles = 0;
let gameWon = false;

function setDifficulty() {
    const difficulty = document.getElementById('difficulty').value;
    if (difficulty === 'easy') {
        NUM_MINES = 10;
        NUM_ROWS = 20;
        NUM_COLS = 20;
    } else if (difficulty === 'medium') {
        NUM_MINES = 15;
        NUM_ROWS = 15;
        NUM_COLS = 15;
    } else if (difficulty === 'hard') {
        NUM_MINES = 20;
        NUM_ROWS = 9;
        NUM_COLS = 9;
    }
}


//initializing the board
function initializeBoard() {
    setDifficulty() 
    revealedTiles=0;
    board=[];
    gameWon = false;
    for (let row = 0; row < NUM_ROWS; row++) {
        board[row] = [];
        for (let col = 0; col < NUM_COLS;col++) {
            board[row][col] = {
                isMine: false,
                isRevealed: false,
                count: 0
            };
        }
    }
   
    //placing of mines
    let mines = 0;
    while (mines < NUM_MINES) {
        const randomRow = Math.floor(Math.random() * NUM_ROWS);
        const randomCol = Math.floor(Math.random() * NUM_COLS);
        if (board[randomRow][randomCol].isMine) continue
         
            board[randomRow][randomCol].isMine = true;
            mines++;
        
    }

    for (let row = 0; row < NUM_ROWS; row++) {
        for (let col = 0; col < NUM_COLS;col++) {
            if (board[row][col].isMine) continue;
            let count = 0;
            // Loop through adjacent cells
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (i === 0 && j === 0) continue; // Skip the current cell
                    const newRow = row + i;
                    const newCol = col + j;
                    // Check bounds and if adjacent cell is a mine
                    if (newRow >= 0 && newRow < NUM_ROWS && newCol >= 0 && newCol < NUM_COLS && board[newRow][newCol].isMine) {
                        count++;
                    }
                }
            }
            board[row][col].count = count;
        }
    }
}

document.getElementById('difficulty').addEventListener('change', () => {
    initializeBoard();
    render();
});
const gameboard = document.getElementById("game-board");
function render() {
    gameboard.innerHTML = "";
    for (let row = 0; row < NUM_ROWS; row++) {
        for (let col = 0; col < NUM_COLS; col++) {
            const tile = document.createElement("div");
            tile.className = "tile";
            if (board[row][col].isRevealed) {
                tile.classList.add("revealed");
                if (board[row][col].isMine) {
                    tile.innerText = "💣";
                } else if (board[row][col].count > 0) {
                    tile.innerText = board[row][col].count;
                }
            }
            tile.addEventListener('click', () => revealTile(row, col));
            gameboard.appendChild(tile);
        }
        gameboard.appendChild(document.createElement('br'));
    }
}


function gameOver(){
    revealAllMines();
    render();

    const gameOverScreen = document.createElement('div');
    gameOverScreen.id = "game-over-screen";

    gameOverScreen.innerHTML =`
          <div class = "game-over-content">
            <h2>Game Over!</h2>
            <button id="restart">Restart Game</button>
          </div>`

    document.body.appendChild(gameOverScreen);

    document.getElementById("restart").addEventListener('click', () => {
        document.body.removeChild(gameOverScreen)
        restartGame();
    })


}
function restartGame(){
    board = [];
    initializeBoard();
    render();           
}

function revealTile(row, col) {
    if (row >= 0 && row < NUM_ROWS && col >= 0 && col < NUM_COLS && !board[row][col].isRevealed) {
        board[row][col].isRevealed = true;
        revealedTiles++;

        if (board[row][col].isMine) {
            gameOver();
            // Handle game over scenario
            // Reveal all mines
           
        } else {
            // Only reveal adjacent tiles if the current tile is not a mine
            if (board[row][col].count === 0) {
                // If the current tile has no adjacent mines, reveal all adjacent tiles recursively
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        revealTile(row + dx, col + dy);
                    }
                }
            }
            render();
            checkWin();
        }
    }
}

function checkWin(){
    const totalTiles = NUM_ROWS*NUM_COLS;
    const nonMineTiles = totalTiles - NUM_MINES;

    if(revealedTiles===nonMineTiles  && !gameWon){
        gameWon = true;
        displayWinScreen();
    }

}

function displayWinScreen(){
    const winScreen = document.createElement('div');
    winScreen.id = "win-screen";
    winScreen.innerHTML = `
    <div class = "win-screen-display">
    <h2>YOU FINNALY WIN IT! HERE IS YOUR GIFT </h2>
    <p>BONK!</p>
    <button id="restart" >Restart</button>
    </div>`;

    document.body.appendChild(winScreen);
    document.getElementById("restart").addEventListener('click', () => {
        document.body.removeChild(winScreen)
        restartGame();
    })

}

function revealAllMines() {
    for (let row = 0; row < NUM_ROWS; row++) {
        for (let col = 0; col < NUM_COLS; col++) {
            if (board[row][col].isMine) {
                board[row][col].isRevealed = true;
            }
        }
    }
}


    

initializeBoard();
render();
console.log(board);