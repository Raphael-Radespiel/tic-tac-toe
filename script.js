const gameDisplay = document.querySelector('#display');
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

let gameState = resetGameState();

function resetGameState() {
  return {
    gameMode: 0,
    // I'll change isPlayerOneTurn into something like: startingPlayer: 'x'
    isPlayerOneTurn: true,
    //startingPLayer: 'x',
    nextPlayerTurn: 'o',
    turnCount: 0,
    gameBoard: [['','',''],['','',''],['','','']],
    playerScores: [0,0]
  }
}

////////////////////////////////////////////////
// Functions that set up and return html divs //
////////////////////////////////////////////////

// THIS FUNCTION IS OK
function setUpSelection() {
  resetDisplay();

  gameDisplay.classList.add('flex-box-one'); 
  gameDisplay.classList.remove('flex-box-two');

  gameState = resetGameState();
  
  let [humanSelectDiv, computerSelectDiv] = getSelectionDivs();
  gameDisplay.append(humanSelectDiv, computerSelectDiv);
}

// THIS IS OK, I'll HAVE TO SEE WHAT setcanvas runGameLoop and other internal functions do
function setUpGame() { 
  resetDisplay();

  gameDisplay.classList.add('flex-box-two');
  gameDisplay.classList.remove('flex-box-one');

  setCanvasGameBoard();

  gameDisplay.append(getGameModeText(), canvas);

  // GAME PLAY LOOP
  runGameLoop();
}

// THIS FUNCTION's NAME IS SET UP SCORE, BUT IT DOES A WHOLE LOT MORE?
function setUpScore(scoreCondition){ 
  resetDisplay();

  // Reset Board and turn Count
  gameState.gameBoard = [['','',''],['','',''],['','','']]; 
  gameState.turnCount = 0;  

  // Switch starting player 
  if(gameState.startingPLayer == 'x'){
    gameState.startingPLayer = 'o';
    gameState.gameState.nextPlayerTurn = 'x';
  }
  else if(gameState.startingPLayer == 'o'){
    gameState.startingPLayer = 'x';
    gameState.gameState.nextPlayerTurn = 'o';
  }

  // Count the score
  if(scoreCondition == 'x') {
    gameState.playerScores[0]++;
  }
  else if(scoreCondition == 'o') {
    gameState.playerScores[1]++;
  }

  let [winCondition, playerScore] = getGameScoreDivs(scoreCondition);
  gameDisplay.append(winCondition, playerScore);

  gameDisplay.append(getGameOptionButtons());
}

// THIS IS OK
function getSelectionDivs() { 
  let divLeft = document.createElement('div');
  let divRight = document.createElement('div');
  
  divLeft.innerHTML = 'Human<br>vs<br>Human';
  divLeft.mode = 0;
  divRight.innerHTML = 'Human<br>vs<br>Computer';
  divRight.mode = 1;

  function clickSelector(e) {
    gameState.gameMode = e.currentTarget.mode;
    setUpGame();
  }

  divLeft.addEventListener('click', clickSelector, {once: true});
  divRight.addEventListener('click', clickSelector, {once: true});

  return [divLeft, divRight];
}

function getGameModeText() {
  let gameModeText = document.createElement('div');
  if(gameState.gameMode == 0) gameModeText.textContent = 'Human vs Human';
  if(gameState.gameMode == 1) gameModeText.textContent = 'Human vs Computer';

  return gameModeText;
}

function setCanvasGameBoard() { 
  canvas.width = window.innerWidth;
  canvas.height = window.innerWidth;

  context.font = `${canvas.width / 3}px sans-serif`;
  context.textAlign = 'center';

  context.fillRect(canvas.width / 3, 0, 10, canvas.height);
  context.fillRect(canvas.width / 3 * 2, 0, 10, canvas.height);
  context.fillRect(0, canvas.height / 3 , canvas.width, 10);
  context.fillRect(0, canvas.height / 3 * 2 , canvas.width, 10);
}

function getGameScoreDivs(gameOutcome) {
  let winCondition = document.createElement('div'); 
  let playerScoreDiv = document.createElement('div'); 

  winCondition.classList.add('win-display');
  if(gameOutcome == 'tie'){
    winCondition.textContent = 'its a tie!';
    winCondition.id = 'tie';
  }
  else{
    winCondition.textContent = `${gameOutcome} won!`;
    winCondition.id = `${gameOutcome}-win`;
  }

  playerScoreDiv.innerHTML = `<strong style="color:blue;">${gameState.playerScores[0]}</strong>
    <p> - </p><strong style="color:red;">${gameState.playerScores[1]}</strong>`;
  playerScoreDiv.id = 'player-score';

  return [winCondition, playerScoreDiv];
}

function getGameOptionButtons() {
  let resetButton = document.createElement('div');
  let newTurnButton = document.createElement('div');
  let lowerPageButtons = document.createElement('div');
  
  newTurnButton.textContent = 'New Turn';
  resetButton.textContent = 'Reset';
  lowerPageButtons.id = 'lower-page-buttons';

  newTurnButton.addEventListener('click', () => {setUpGame(gameState.gameMode)}, {once: true});
  resetButton.addEventListener('click', setUpSelection, {once: true});

  lowerPageButtons.append(newTurnButton, resetButton);

  return lowerPageButtons;
}

function resetDisplay() {
  gameDisplay.innerHTML = '';
}
 
////////////////////////////////////////////////////////////////////
// Functions related to game mechanics and artificial inteligence //
////////////////////////////////////////////////////////////////////
function updateGame() {
  gameState.turnCount++;

  let playerSymbol = gameState.isPlayerOneTurn ? 'x' : 'o';

  switch(gameState.gameMode){
    case 0:
      // Display the player symbol and update the Tic-Tac-Toe game array
      if(gameState.isPlayerOneTurn == true){
        gameState.isPlayerOneTurn = false;
        this.textContent = playerSymbol;
        this.style.color = 'blue';
        gameState.gameBoard[this.parentNode.id][this.id] = playerSymbol;
      }
      else{
        gameState.isPlayerOneTurn = true;
        this.textContent = playerSymbol;
        this.style.color = 'red';
        gameState.gameBoard[this.parentNode.id][this.id] = playerSymbol;
      }
      break;
    case 1:
      if(gameState.isPlayerOneTurn == true && gameState.turnCount != 9){
        gameState.isPlayerOneTurn = false;
        this.textContent = playerSymbol;
        this.style.color = 'blue';
        gameState.gameBoard[this.parentNode.id][this.id] = playerSymbol;

        let bestMove = miniMax(gameState.gameBoard, gameState.turnCount, true);
        let moveIndex = getIndexOfArrayDiference(gameState.gameBoard, bestMove.pathChosen); 
        console.log(bestMove.pathChosen);
        console.log(moveIndex[0] + ' ' + moveIndex[1]);
        updateGameSquare(moveIndex[0], moveIndex[1]);
        gameState.isPlayerOneTurn = true; 
      }
      else{
        gameState.isPlayerOneTurn = false;
        this.textContent = playerSymbol;
        this.style.color = 'blue';
        gameState.gameBoard[this.parentNode.id][this.id] = playerSymbol;
      }
      break;
  }

  if(gameState.turnCount >= 5 && 
    checkGameState(gameState.gameBoard, gameState.turnCount, playerSymbol) != 'ongoing') { 
    setTimeout(() => setUpScore(checkGameState(gameState.gameBoard, gameState.turnCount, playerSymbol)), 500);
  }
}

function runGameLoop() {
  // Make a function that varies if game mode is 0, 1, 2
  let gameFunction;
  
  switch(gameState.gameMode) {
    case 0:
    case 2:
      gameFunction = function() {
      
        let isGameOver = false; 
        let lastPlayerSymbol = gameState.isPlayerOneTurn ? 'o' : 'x';

        canvas.onclick = e => {
          let playerSymbol = gameState.isPlayerOneTurn ? 'x' : 'o';
          let rect = e.target.getBoundingClientRect();
          let x = e.clientX - rect.left; 
          let y = e.clientY - rect.top;
          let clickSquare = checkEmptySquare(x, y, canvas.clientWidth);

          if(clickSquare.truth) {
            renderSymbol(playerSymbol, clickSquare.index[1], clickSquare.index[0]);
            gameState.gameBoard[clickSquare.index[0]][clickSquare.index[1]] = playerSymbol;
            gameState.isPlayerOneTurn = !gameState.isPlayerOneTurn;
            gameState.turnCount += 1;
          }
        }

        if(gameState.turnCount >= 5 && 
          checkGameState(gameState.gameBoard, gameState.turnCount, lastPlayerSymbol) != 'ongoing') { 
          setTimeout(() => setUpScore(checkGameState(gameState.gameBoard, gameState.turnCount, lastPlayerSymbol)), 300);
          isGameOver = true;
          gameState.isPlayerOneTurn = !gameState.isPlayerOneTurn;
        }

        if(isGameOver == false) {
          window.requestAnimationFrame(gameFunction);
        }
      };
      break;
    case 1:
      gameFunction = function() {
        let isGameOver = false;
        let lastPlayerSymbol = gameState.isPlayerOneTurn ? 'o' : 'x';

        if(gameState.turnCount >= 5 && 
          checkGameState(gameState.gameBoard, gameState.turnCount, lastPlayerSymbol) != 'ongoing') { 
          setTimeout(() => setUpScore(checkGameState(gameState.gameBoard, gameState.turnCount, lastPlayerSymbol)), 300);
          isGameOver = true;
          gameState.isPlayerOneTurn = !gameState.isPlayerOneTurn;
          gameState.gameBoard = [['','',''], ['','',''], ['','','']];
        }

        if(gameState.isPlayerOneTurn && !isGameOver){
          canvas.onclick = e => {  
            let rect = e.target.getBoundingClientRect();
            let x = e.clientX - rect.left; 
            let y = e.clientY - rect.top;
            let clickSquare = checkEmptySquare(x, y, canvas.clientWidth);

            if(clickSquare.truth) {
              renderSymbol('x', clickSquare.index[1], clickSquare.index[0]);
              gameState.gameBoard[clickSquare.index[0]][clickSquare.index[1]] = 'x';
              gameState.isPlayerOneTurn = false;
              gameState.turnCount += 1;
            }
          }
        }
        else if(!gameState.isPlayerOneTurn && !isGameOver){ 
          let bestMove = miniMax(gameState.gameBoard, gameState.turnCount, true);
          let moveIndex = getIndexOfArrayDiference(gameState.gameBoard, bestMove.pathChosen); 
          renderSymbol('o', moveIndex[1], moveIndex[0]);
          gameState.gameBoard[moveIndex[0]][moveIndex[1]] = 'o';
          console.log(gameState.gameBoard);
          console.log('Game score = ' + bestMove.score);
          gameState.isPlayerOneTurn = true; 
          gameState.turnCount += 1;
        }

        if(isGameOver == false){
          window.requestAnimationFrame(gameFunction);
        }
      }
      break;
  }

  window.requestAnimationFrame(gameFunction);
}

function renderSymbol(playerSymbol, x, y) {
  context.fillStyle = playerSymbol == 'x' ? 'blue' : 'red';
  context.fillText(playerSymbol, (x * (canvas.width / 3) + (canvas.width / 6)), (y * (canvas.width / 3) + (canvas.width / 3.75 )));
}

function checkEmptySquare(xPos, yPos, width) {
  let snapValue = width / 3;
  let col = Math.floor(xPos/snapValue);
  let row = Math.floor(yPos/snapValue);

  if(gameState.gameBoard[row][col] == '') {
    let obj = {
      truth: true,
      index: [row, col]
    }

    return obj;
  }

  let obj = {
    truth: false
  }
  return obj; 
}

function checkGameState(board, turn, playerValue){
  // Check horizontal/vertical win
  for(let i = 0; i < 3; i++){
    if(board[i][0] == board[i][1] && board[i][1] == board[i][2] && 
      board[i][0] == playerValue){
      return playerValue;
    }
    if(board[0][i] == board[1][i] && board[1][i] ==  board[2][i] && 
      board[0][i] == playerValue){
      return playerValue;
    }
  }

  // Check diagonal win
  if((board[0][0] == board[1][1] && board[1][1] == board[2][2]) || 
    (board[2][0] == board[1][1] && board[1][1] == board[0][2])){ 
    if(board[1][1] == playerValue){
      return playerValue;
    }
  }

  // If it isn't a win, it's ongoing. If the board is filled up, it's a tie
  let finalValue = (turn == 9) ? 'tie' : 'ongoing';
  return finalValue;
}

function miniMax(node, depth, isMaximizer){
  let winValues = {
    x: -1,
    o: 1,
    tie: 0
  };
  
  let pathWithScore = {
    pathChosen: [],
    score: 0
  };

  let gameBoard = JSON.parse(JSON.stringify(node));
  
  let playerSymbol = isMaximizer ? 'o' : 'x';

  let possibleMoves = getPossibleMoves(gameBoard, playerSymbol);

  let previousPlayerSymbol = isMaximizer ? 'x' : 'o';

  let gameStateValue = checkGameState(gameBoard, depth, previousPlayerSymbol);
  
  if(depth == 9 || gameStateValue != 'ongoing') {
    pathWithScore.score = winValues[gameStateValue] / depth; 
    pathWithScore.pathChosen = node;
    return pathWithScore;  
  }

  if(isMaximizer) {
    let value = -Infinity;  
    let selectedObject = pathWithScore;

    for(let move of possibleMoves) {
      let boardValue = miniMax(move, depth + 1, false);
      if(value < boardValue.score) {
        value = boardValue.score;
        selectedObject.score = value;
        selectedObject.pathChosen = move;
      }
    }
    return selectedObject;
  }
  else{
    let value = Infinity;
    let selectedObject = pathWithScore; 

    for(let move of possibleMoves) {
      let boardValue = miniMax(move, depth + 1, true);
      if(value > boardValue.score) {
        value = boardValue.score;
        selectedObject.score = value;
        selectedObject.pathChosen = move;
      }
    } 

    return selectedObject;
  }
}

function getPossibleMoves(array, playerSymbol) {
  let movesArray = new Array();

  for(let i = 0; i < 3; i++){
    for(let j = 0; j < 3; j++){
      let board = JSON.parse(JSON.stringify(array));
      if(board[i][j] == ''){
        board[i][j] = playerSymbol;
        movesArray.push(board);
      }
    }
  }

  return movesArray;
}

function getIndexOfArrayDiference(arrayOne, arrayTwo) {
  for(let i = 0; i < 3; i++) {
    for(let j = 0; j < 3; j++) {
      if(arrayOne[i][j] != arrayTwo[i][j]){
        return [i, j];
      }
    }
  }
}

function updateGameSquare(row, col) {
  let squareTarget = gameDisplay.querySelector(`.row#${CSS.escape(String(row))}`).querySelector(`#${CSS.escape(String(col))}`); 
  squareTarget.textContent = 'o';
  squareTarget.style.color = 'red';
  squareTarget.removeEventListener('click', updateGame, {once: true});

  gameState.gameBoard[row][col] = 'o';
}


setUpSelection();
