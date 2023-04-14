//Objects, variables, and DOM selectors

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
let randomize = 1;

//Minimax function to search for the best move by calculating all future possible combinations
//with the idea that each player will always play the best move  

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
            result = (result * -1) + depth;
            return result;
        }
    }
    if (result == 0)
    {
        return result;
    }

    if (mode == "medium" && depth > 4)
    {
        return -1;
    }
    
    if (isAi)
    {
        let best = -1000;

        for (let i = 0; i < board.length; i++) {
        
            for (let j = 0; j < board[i].length; j++) {

                if (board[i][j] != 'x' && board[i][j] != 'o')
                {
                    board[i][j] = gameStatus.otherpick
                    best = Math.max(best , Minimax(board,depth + 1, !isAi, gameStatus.otherpick));
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
                    board[i][j] = '_';
                }
        }
        
    }
        return best;
    }
    
}
function medium(array)
{
    if (randomize > 0)
    {
        setTimeout(() => {randomAi(boardState);}, 1000);
        randomize --;
    }
    else
    {
        setTimeout(() => {optimalAi(boardState);}, 1000);
    }
}
//Manage the modes that use minimax to play the best moves evaluated by minimax depending on the 
//depth of calculation

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
                
                if (current >= bestMove.value)
                {
                    bestMove.x = i;
                    bestMove.y = j;
                    bestMove.value = current;
                }
            }
        }
    }
        array[bestMove.x][bestMove.y]= gameStatus.otherpick;
        let elem = document.getElementById(bestMove.x.toString() + bestMove.y.toString());
        if(gameStatus.otherpick == 'o') 
        {
            elem.setAttribute("style", "color:#FFFDE4");
        }
        if(gameStatus.otherpick == 'x')
        {
            elem.setAttribute("style", "color: black");
        }
        document.getElementById(bestMove.x.toString() + bestMove.y.toString()).innerHTML = gameStatus.otherpick;
        
        gameStatus.turn = true;

        let finalScore = checkWinCondition (gameStatus.otherpick);
        if (finalScore == 10)
        {
            setLine(gameStatus.otherpick);
            setTimeout(() => {displayScore(gameStatus.otherpick, 'win');}, 1000);
            gameStatus.start = false;
            setTimeout(() => {resetBoard();}, 2500);
            return;
        }
        if (finalScore == 0)
        {
            setTimeout(() => {displayScore(gameStatus.otherpick, 'draw');}, 1000);
            gameStatus.start = false;
            setTimeout(() => {resetBoard();}, 2500);
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
//This function take care of the Ai turn in easy mode by playing completely random moves based
//on a random number generated between 0 and number of free space left
function randomAi(array)
{
    let free = checkFreespace(boardState);
    let rand = Math.floor(Math.random() * free);
    
        for (let i = 0; i < array.length; i++) {
        
            for (let j = 0; j < array[i].length; j++) {
        
                if (array[i][j] != 'x' && array[i][j] != 'o')
                {
                    if (rand == 0)
                    {
                        array[i][j] = gameStatus.otherpick;
                        let elem = document.getElementById(i.toString() + j.toString());
                        
                        if(gameStatus.otherpick == 'o') 
                        {
                            elem.setAttribute("style", "color:#FFFDE4");
                        }
                        if(gameStatus.otherpick == 'x')
                        {
                            elem.setAttribute("style", "color: black");
                        }
                       
                        document.getElementById(i.toString() + j.toString()).innerHTML = gameStatus.otherpick;
                        gameStatus.turn = true;
                        let result = checkWinCondition (gameStatus.otherpick);
                        if (result == 10)
                        {
                            setLine(gameStatus.otherpick);
                            setTimeout(() => {displayScore(gameStatus.otherpick, 'win');}, 1000);
                            gameStatus.start = false;
                            setTimeout(() => {resetBoard();}, 2500);
                            return;
                        }
                        if (result == 0)
                        {
                            setTimeout(() => {displayScore(gameStatus.otherpick, 'draw');}, 1000);
                            gameStatus.start = false;
                            setTimeout(() => {resetBoard();}, 2500);
                            return;
                        }
                    }
                    rand --;
                }
            }
            
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
//Helper function that checks remaining space left not occupied by marker 'x' or 'o'

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

//Functions that return a number in case of a draw or a win with  possible winning
//combination and also checks what exact combination won to display the winning line 
//animation


function setLineColor(el, marker)
{
    marker == 'x' ? el.style.backgroundColor = "#454545" : el.style.backgroundColor = "#FFFDE4";
}

function setLine(marker)
{
    let h1 = boardState[0][0] == marker && boardState[0][1] == marker && boardState[0][2] == marker
    let h2 = boardState[1][0] == marker && boardState[1][1] == marker && boardState[1][2] == marker
    let h3 = boardState[2][0] == marker && boardState[2][1] == marker && boardState[2][2] == marker

    let v1 = boardState[0][0] == marker && boardState[1][0] == marker && boardState[2][0] == marker
    let v2 = boardState[0][1] == marker && boardState[1][1] == marker && boardState[2][1] == marker
    let v3 = boardState[0][2] == marker && boardState[1][2] == marker && boardState[2][2] == marker
    
    let d1 = boardState[0][0] == marker && boardState[1][1] == marker && boardState[2][2] == marker
    let d2 = boardState[0][2] == marker && boardState[1][1] == marker && boardState[2][0] == marker

    if (h1)
    {
        setLineColor(document.querySelector(".h1"), marker);
        document.querySelector(".h1").style.display = "inline";
        setTimeout(() => {document.querySelector(".h1").style.display = "none";}, 1000);
    }
    if (h2)
    {
        setLineColor(document.querySelector(".h2"), marker);
        document.querySelector(".h2").style.display = "inline";
        setTimeout(() => {document.querySelector(".h2").style.display = "none";}, 1000);
    }
    if (h3)
    {
        setLineColor(document.querySelector(".h3"), marker);
        document.querySelector(".h3").style.display = "inline";
        setTimeout(() => {document.querySelector(".h3").style.display = "none";}, 1000);
    }
    if (v1)
    {
        setLineColor(document.querySelector(".v1"), marker);
        document.querySelector(".v1").style.display = "inline";
        setTimeout(() => {document.querySelector(".v1").style.display = "none";}, 1000);
    }
    if (v2)
    {
        setLineColor(document.querySelector(".v2"), marker);
        document.querySelector(".v2").style.display = "inline";
        setTimeout(() => {document.querySelector(".v2").style.display = "none";}, 1000);
    }
    if (v3)
    {
        setLineColor(document.querySelector(".v3"), marker);
        document.querySelector(".v3").style.display = "inline";
        setTimeout(() => {document.querySelector(".v3").style.display = "none";}, 1000);
    }
    if (d1)
    {
        setLineColor(document.querySelector(".d1"), marker);
        document.querySelector(".d1").style.display = "inline";
        setTimeout(() => {document.querySelector(".d1").style.display = "none";}, 1000);
    }
    if (d2)
    {
        setLineColor(document.querySelector(".d2"), marker);
        document.querySelector(".d2").style.display = "inline";
        setTimeout(() => {document.querySelector(".d2").style.display = "none";}, 1000);
    }

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
//Main function that setups the action to do each time a cell on the board is clicked :
//Checks if it's a player turn or the AI and calls their respective function 

function play (event)
{
    let row = event.target.id[0];
    let column = event.target.id[1];

    if (boardState[row][column] != 'o' && boardState[row][column] != 'x' 
    && gameStatus.turn === true && gameStatus.start === true)
    {
        boardState[row][column] = gameStatus.pick;
        if(gameStatus.pick == 'o') 
        {
            event.target.setAttribute("style", "color:#FFFDE4");
        }
        if(gameStatus.pick == 'x')
        {
            event.target.setAttribute("style", "color: black");
        }
        event.target.innerHTML = gameStatus.pick;
        gameStatus.turn = false;
        let result = checkWinCondition (gameStatus.pick);
        
        if (result == 10)
        {
            setLine(gameStatus.pick);
            setTimeout(() => {displayScore(gameStatus.pick, 'win');}, 1000);
            gameStatus.start = false;
            setTimeout(() => {resetBoard();}, 2500);
            return;
        }

        if (result == 0)
        {
            setTimeout(() => {displayScore(gameStatus.otherpick, 'draw');}, 1000);
            gameStatus.start = false;
            setTimeout(() => {resetBoard();}, 2500);
            return;
        }
        if (gameStatus.start === true)
        {
            manageMode();
        }
    }
    // PVP mode
    else if (boardState[row][column] != 'o' && boardState[row][column] != 'x' 
    && gameStatus.turn === false && gameStatus.start === true && mode == 'PVP')
    {
        boardState[row][column] = gameStatus.otherpick;
        if(gameStatus.otherpick == 'o') 
        {
            event.target.setAttribute("style", "color:#FFFDE4");
        }
        if(gameStatus.otherpick == 'x')
        {
            event.target.setAttribute("style", "color: black");
        }
        event.target.innerHTML = gameStatus.otherpick;
        gameStatus.turn = true;
        let result = checkWinCondition (gameStatus.otherpick);
        if (result == 10)
        {
            setLine(gameStatus.otherpick);
            setTimeout(() => {displayScore(gameStatus.otherpick, 'win');}, 1000);
            gameStatus.start = false;
            setTimeout(() => {resetBoard();}, 2500);
            return;
        }

        if (result == 0)
        {
            setTimeout(() => {displayScore(gameStatus.otherpick, 'draw');}, 1000);
            gameStatus.start = false;
            setTimeout(() => {resetBoard();}, 2500);
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

//The play function calls this function when it's AI turn, choose the right AI to use depending 
//on mode selected

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

        case 'medium':
            medium(boardState);
            break;
    }
}

//Manage start of game by constructing objects and setting up variables

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
//reset the board display and set variables back to default

function resetBoard()
{
    let i = 0
    start = false;
    randomize = 1;

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

//Run the logic of the display of final score on the board

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
level.addEventListener("change", function(){resetBoard(); mode = level.value, console.log(mode)});

