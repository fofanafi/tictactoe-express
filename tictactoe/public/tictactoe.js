var tictactoe = (function() {

var Player = function(title, playerNumber) {
    this.wins = 0;
    this.title = title;
    this.number = playerNumber;
}

var player1 = new Player('Player 1', 1);
var player2 = new Player('Player 2', 2);

var games = [];
var draws = 0;

function Game(firstPlayer) {
    return {
        firstPlayer : firstPlayer, // the first player to move
        moves : [], // a list of the order cells were selected
        player : function(moveNumber) { // the player to move on moveNumber
            return (moveNumber % 2 === 0) ? 
                this.firstPlayer : 
                otherPlayer(this.firstPlayer);
        },
        currentPlayer : function() {
            return this.player(this.moves.length);
        },
        currentSymbol : function() {
            return symbolForPlayer(this.currentPlayer());
        },
        selectCell : function(number) {
            this.moves.push(number);
        },
        currentBoard : function() { // build a board based on the moves
            var board = [];
            board[8] = undefined; // initialize an empty board of 9 cells
            for (var i = 0; i < this.moves.length; i++) {
                var cell = this.moves[i];
                board[cell] = this.player(i);
            }
            return board;
        }
    };
}

function symbolForPlayer(player) {
    return (player === player1) ? 'X' : 'O';
}

var cells = []; // the html cells
var board = document.getElementById('board');
for (var i = 0; i < 9; i++) {
    var cell = document.createElement('div');
    cell.className = "cell";
    cell.number = i;
    board.appendChild(cell);
    cells.push(cell);
}

// Reset the cell to the play-game state.
function resetCell(cell) {
    cell.className = "cell";
    cell.textContent = "";
    cell.onmouseover = function() {
        var player = currentGame().currentPlayer();
        this.className += " mouseover" + player.number;
        this.textContent = player.title;
    }
    cell.onmouseout = function() {
        this.className = "cell";
        this.textContent = "";
    }
    cell.onclick = function() {
        selectCell(this);
    }
}

// A player has selected a cell.
function selectCell(cell) {
    var game = currentGame();
    
    /* update the display -- must be performed before updating the model
       as it depends on the model */
    stopCellEvents(cell);
    cell.textContent = game.currentSymbol();

    // update the model
    game.selectCell(cell.number);

    // check for game end
    var board = game.currentBoard();
    var playerWon = checkPlayerWon(board);
    if (playerWon !== null) {
        playerWon.wins += 1;
        document.getElementById("player" + playerWon.number).textContent
            = playerWon.wins;
        endGame();
    } else if (checkBoardFilled(board)) {
        draws += 1;
        document.getElementById("draws").textContent = draws;
        endGame();
    }
}

function stopCellEvents(cell) {
    cell.className = "cell";
    cell.onmouseover = function() {}
    cell.onmouseout = function() {}
    cell.onclick = function() {}
}

/* Returns the player number of the winning player or null. */
function checkPlayerWon(board) {
    var nextRow = function(i) { return i+3; }
    var nextCol = function(i) { return i+1; }
    var nextLeftDiag = function(i) { return i+4; }
    var nextRightDiag = function(i) { return i+2; }
    var checkThreeInARow = function(startPos, next) {
        var player = board[startPos];
        if (player === undefined) {
            return null;
        }
        var nextPos = next(startPos);
        if (board[nextPos] === player && board[next(nextPos)] === player) {
            return player;
        } else {
            return null;
        }
    }
    var player;
    for (var i = 0; i < 3; i++) {
        player = checkThreeInARow(i, nextRow);
        if (player != null) {
            return player;
        }
    }
    for (var i = 0; i < 9; i += 3) {
        player = checkThreeInARow(i, nextCol);
        if (player != null) {
            return player;
        }
    }
    player = checkThreeInARow(0, nextLeftDiag);
    if (player != null) {
        return player;
    }
    return checkThreeInARow(2, nextRightDiag);
}

function checkBoardFilled(board) {
    return board.foldl(function(cell, base) {
        return (cell !== undefined) && base;
    }, true);
}

function endGame() {
    cells.forEach(stopCellEvents);
    newgame.className = "";
    gamehistory.className = "";
}

function currentGame() {
    return games.last();
}

function getPlayer(number) {
    return (number === 2) ? player2 : player1;
}

function otherPlayer(player) {
    return (player === player1) ? player2 : player1;
}

// Populate the cells of the board given the game number for any game
// in the game history.
function populateCells(gameNumber) {
    var game = games[gameNumber];
    var moves = game.moves;
    for (var i=0; i < moves.length; i++) {
        cells[moves[i]].textContent = symbolForPlayer(game.player(i));
    }
}

var newgame = document.getElementById('newgame');
var gamehistory = document.getElementById('gamehistory');
var gameViewing; // the number of the game we are currently viewing
return {
    newGame : function(firstPlayerNumber) {
        var game = new Game(getPlayer(firstPlayerNumber));
        games.push(game);
        gameViewing = games.length - 1;
        newgame.className = "invisible";
        gamehistory.className = "invisible";
        cells.forEach(resetCell);
    },
    prevGame : function() {
        if (games.length > 0 && gameViewing !== 0) {
            gameViewing--;
            populateCells(gameViewing);
        }
    },
    nextGame : function() {
        if (games.length > 0 && gameViewing !== games.length-1) {
            gameViewing++;
            populateCells(gameViewing);
        }
    }
};
})();
