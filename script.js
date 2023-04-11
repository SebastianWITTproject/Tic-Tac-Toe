let row1 = new Array(3);
let row2 = new Array(3);
let row3 = new Array(3);



function gamestatus(player1Pick, player2Pick, playerTurn, gamedStarted)
{
    this.pick = player1Pick;
    this.otherpick = player2Pick;
    this.turn = playerTurn;
    this.start = gamedStarted;
}

const board = document.getElementsByClassName("board"); 
const x = document.getElementById("x");
const o = document.getElementById("o");
const turnDisplay = document.getElementById("turn");
const cell = document.querySelectorAll(".board > div");
const replay = document.getElementById("replay");
const level = document.getElementById("level");
const final = document.getElementById("finalscore");
const intro = document.getElementById("intro");
const outcome = document.getElementById("outcome");
const container = document.getElementById("container");

let boardState = [row1, row2, row3];
let gameStatus;
let mode = level.value;
let start = false;


function Minimax(board, depth, isAi, marker)
{
    let result = checkWinCondition (marker);
    
    if (result == 10)
    {
        if (!isAi)
        {
            result = result - depth;
            return result;
        }
        if (isAi)
        {
            result = (result + depth) * -1
            return result;
        }
    }
    if (result == 0)
    {
        return result;
    }
    
    if (isAi)
    {
        let best = -1000;

        for (let i = 0; i < board.length; i++) {
        
            for (let j = 0; j < board[i].length; j++) {

                if (board[i][j] != 'x' && board[i][j] != 'o')
                {
                    board[i][j] = gameStatus.otherpick
                    best = Math.max(best, Minimax(board,depth + 1, !isAi, gameStatus.otherpick));
                    board[i][j] = '_';
                }
        }
        
    }
        return best;
    }
    if (!isAi)
    {
        let best = 1000;

        for (let i = 0; i < board.length; i++) {
        
            for (let j = 0; j < board[i].length; j++) {

                if (board[i][j] != 'x' && board[i][j] != 'o')
                {
                    board[i][j] = gameStatus.pick
                    best = Math.min(best, Minimax(board,depth + 1, !isAi, gameStatus.pick));
                    //console.log(best)
                    board[i][j] = '_';
                }
        }
        
    }
        return best;
    }
    
}

function optimalAi(array)
{
    let bestMove = 
    {
        value : - 1000,
        x : -1,
        y : -1,
    }

    for (let i = 0; i < array.length; i++) {
        
        for (let j = 0; j < array[i].length; j++) {
            if (array[i][j] != 'x' && array[i][j] != 'o')
            {
                array[i][j] = gameStatus.otherpick;
                let current = Minimax(array, 0, false, gameStatus.otherpick);
                array[i][j] = '_';
                
                if (current > bestMove.value)
                {
                    bestMove.x = i;
                    bestMove.y = j;
                    bestMove.value = current;
                }
            }
        }
    }
        array[bestMove.x][bestMove.y]= gameStatus.otherpick;
        console.log(array)
        document.getElementById(bestMove.x.toString() + bestMove.y.toString()).innerHTML = gameStatus.otherpick;
        gameStatus.turn = true;

        let finalScore = checkWinCondition (gameStatus.otherpick);
        if (finalScore == 10)
        {
            
            displayScore(gameStatus.otherpick, 'win');
            gameStatus.start = false;
            setTimeout(() => {resetBoard();}, 1500);
            return;
        }
        if (finalScore == 0)
        {
            displayScore(gameStatus.otherpick, 'draw');
            gameStatus.start = false;
            setTimeout(() => {resetBoard();}, 1500);
            resetBoard ();
            return;
        }
        gameStatus.turn == true && gameStatus.pick =='x' ? turnDisplay.innerHTML = "It's x turn" : 
        turnDisplay.innerHTML = "It's o turn";
        gameStatus.turn == true && gameStatus.pick =='o' ? turnDisplay.innerHTML = "It's o turn" : 
        turnDisplay.innerHTML = "It's x turn"
}
function randomAi(array)
{
    let free = checkFreespace(boardState);
    console.log(free);
    let rand = Math.floor(Math.random() * free);
    console.log(free);
        for (let i = 0; i < array.length; i++) {
        
            for (let j = 0; j < array[i].length; j++) {
        
                if (array[i][j] != 'x' && array[i][j] != 'o')
                {
                    if (rand == 0)
                    {
                        array[i][j] = gameStatus.otherpick;
                        document.getElementById(i.toString() + j.toString()).innerHTML = gameStatus.otherpick;
                        gameStatus.turn = true;
                        let result = checkWinCondition (gameStatus.otherpick);
                        if (result == 10)
                        {
                            displayScore(gameStatus.otherpick, 'win');
                             gameStatus.start = false;
                            setTimeout(() => {resetBoard();}, 1500);
                            return;
                        }
                        if (result == 0)
                        {
                            displayScore(gameStatus.otherpick, 'draw');
                            gameStatus.start = false;
                            setTimeout(() => {resetBoard();}, 1500);
                            return;
                        }
                    }
                    rand --;
                }
            }
            
        }
        gameStatus.turn == true && gameStatus.pick =='x' ? turnDisplay.innerHTML = "It's x turn" : 
        turnDisplay.innerHTML = "It's o turn";
        gameStatus.turn == true && gameStatus.pick =='o' ? turnDisplay.innerHTML = "It's o turn" : 
        turnDisplay.innerHTML = "It's x turn";
}

function checkFreespace(array)
{
    let count = 0;

    for (let i = 0; i < array.length; i++) {
        
        for (let j = 0; j < array[i].length; j++) {

            if (array[i][j] != 'x' && array[i][j] != 'o')
            {
                count ++;
            }
        }
        
    }
    return count;
}

function checkWinCondition(marker)
{
    let h1 = boardState[0][0] == marker && boardState[0][1] == marker && boardState[0][2] == marker
    let h2 = boardState[1][0] == marker && boardState[1][1] == marker && boardState[1][2] == marker
    let h3 = boardState[2][0] == marker && boardState[2][1] == marker && boardState[2][2] == marker

    let v1 = boardState[0][0] == marker && boardState[1][0] == marker && boardState[2][0] == marker
    let v2 = boardState[0][1] == marker && boardState[1][1] == marker && boardState[2][1] == marker
    let v3 = boardState[0][2] == marker && boardState[1][2] == marker && boardState[2][2] == marker
    
    let d1 = boardState[0][0] == marker && boardState[1][1] == marker && boardState[2][2] == marker
    let d2 = boardState[0][2] == marker && boardState[1][1] == marker && boardState[2][0] == marker

    if (h1 || h2 || h3 || v1 || v2 || v3 || d1 || d2)
    {
        return 10;
    }
    else if (checkFreespace(boardState) == 0)
    {
        return 0;
    }
    
}
function play (event)
{
    let row = event.target.id[0];
    let column = event.target.id[1];
    //console.log(gameStatus.turn)
    if (boardState[row][column] != 'o' && boardState[row][column] != 'x' 
    && gameStatus.turn == true && gameStatus.start == true)
    {
        boardState[row][column] = gameStatus.pick;
        event.target.innerHTML = gameStatus.pick;
        gameStatus.turn = false;
        let result = checkWinCondition (gameStatus.pick);
        console.log(result);
        if (result == 10)
        {
            displayScore(gameStatus.pick, 'win');
            gameStatus.start = false;
            setTimeout(() => {resetBoard();}, 1500);
            return;
        }

        if (result == 0)
        {
            displayScore(gameStatus.pick, 'draw');
            gameStatus.start = false;
            setTimeout(() => {resetBoard();}, 1500);
            return;
        }
        if (gameStatus.start === true)
        {
            manageMode();
            console.log('hi')
        }
    }
    // PVP mode
    else if (boardState[row][column] != 'o' && boardState[row][column] != 'x' 
    && gameStatus.turn == false && gameStatus.start == true && mode == 'PVP')
    {
        boardState[row][column] = gameStatus.otherpick;
        event.target.innerHTML = gameStatus.otherpick;
        gameStatus.turn = true;
        let result = checkWinCondition (gameStatus.pick);
        if (result == 10)
        {
            displayScore(gameStatus.otherpick, 'win');
            gameStatus.start = false;
            setTimeout(() => {resetBoard();}, 1500);
            return;
        }

        if (result == 0)
        {
            displayScore(gameStatus.otherpick, 'draw');
            gameStatus.start = false;
            setTimeout(() => {resetBoard();}, 1500);
            return;
        }
        if (gameStatus.turn === true)
        {
            if (gameStatus.pick == 'x')
            {
                turnDisplay.innerHTML = "It's x turn";
            }
            else if (gameStatus.pick == 'o')
            {
                turnDisplay.innerHTML = "It's o turn";
            }
        }
        if (gameStatus.turn === false)
        {
            if (gameStatus.pick == 'x')
            {
                turnDisplay.innerHTML = "It's o turn";
            }
            else if (gameStatus.pick == 'o')
            {
                turnDisplay.innerHTML = "It's x turn";
            }
        }
    }
    
}

function manageMode()
{
    if (gameStatus.turn === true)
    {
        if (gameStatus.pick == 'x')
        {
            turnDisplay.innerHTML = "It's x turn";
        }
        else if (gameStatus.pick == 'o')
        {
            turnDisplay.innerHTML = "It's o turn";
        }
    }
    if (gameStatus.turn === false)
    {
        if (gameStatus.pick == 'x')
        {
            turnDisplay.innerHTML = "It's o turn";
        }
        else if (gameStatus.pick == 'o')
        {
            turnDisplay.innerHTML = "It's x turn";
        }
    }
    switch (mode)
    {
        case 'unbeatable':
            setTimeout(() => {optimalAi(boardState);}, 1000);
            break;

        case 'easy':
            setTimeout(() => {randomAi(boardState);}, 1000);
            break;
    }
}

function startGame(pick)
{
    start = true;
    let other;
    let turn; 
    container.classList.remove = "anime";
    pick == 'x' ? turn = true : turn = false;
    pick == 'x' ? other = 'o' : other = 'x';
    gameStatus = new gamestatus (pick, other, turn, start);
    if (gameStatus.turn === true)
    {
        if (gameStatus.pick == 'x')
        {
            turnDisplay.innerHTML = "It's x turn";
        }
        else if (gameStatus.pick == 'o')
        {
            turnDisplay.innerHTML = "It's o turn";
        }
    }
    if (gameStatus.turn === false)
    {
        if (gameStatus.pick == 'x')
        {
            turnDisplay.innerHTML = "It's o turn";
        }
        else if (gameStatus.pick == 'o')
        {
            turnDisplay.innerHTML = "It's x turn";
        }
    }
    if (pick == 'o')
    {
        manageMode();
    }
    
}

function resetBoard()
{
    let i = 0
    start = false;

    while (i < cell.length)
    {
        cell[i].innerHTML = "&nbsp";
        i ++;
    }   
    row1 = new Array(3);
    row2 = new Array(3);
    row3 = new Array(3);
    boardState = [row1, row2, row3];

    final.setAttribute("style", "display: none");
    container.setAttribute("style", "display: flex");
    x.setAttribute("style", "border: solid");
    o.setAttribute("style", "border: solid");
    turnDisplay.innerHTML = '';
    container.classList.add = "anime";
}

function displayScore (marker, result)
{
    container.setAttribute("style", "display: none");
    switch (result)
    {
        case 'win':

            intro.innerHTML = "The winner is";
            outcome.innerHTML = marker;

            final.setAttribute("style", "display: inline");
            break;

        case 'draw':

            intro.innerHTML = "It's a";
            outcome.innerHTML = "DRAW";
            final.setAttribute("style", "display: inline");
            break;
    }
}

let i = 0
while (i < board.length)
{
    board[i].addEventListener("click", (event) => play(event));
    i ++;
}

function managePick(marker)
{
    if (marker =='x' && start ==false)
    {
        x.setAttribute("style", "border: solid #31c3c3");
        console.log(x.style)
        startGame(marker);
    }
    if (marker =='o' && start ==false)
    {
        o.setAttribute("style", "border: solid #31c3c3");
        startGame(marker);
    }
}

x.addEventListener("click", () => managePick('x'));
o.addEventListener("click", () => managePick('o'));

replay.addEventListener("click", () => resetBoard());
level.addEventListener("change", function(){resetBoard(); mode = level.value});

