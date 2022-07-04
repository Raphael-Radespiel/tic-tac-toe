const gameDisplay = document.querySelector('#display');

let gameMode = 0;
let isPlayerOneTurn = true;
let turnCount = 0;
let gameBoard = [['','',''],['','',''],['','','']];
let playerScores = [0,0];

////////////////////////////////////////////////
// Functions that set up and return html divs //
////////////////////////////////////////////////
function setUpSelection() {
  resetDisplay();

  gameDisplay.classList.add('flex-box-one'); 
  gameDisplay.classList.remove('flex-box-two');

  // Reset the Game's variables
  isPlayerOneTurn = true;
  playerScores = [0,0];
  gameBoard = [['','',''],['','',''],['','','']]; 
  turnCount = 0;
  
  for(let i = 0; i < 3; i++) {
    gameDisplay.append(getSelectionMode()[i]);
  }
}

function setUpGame() { 
  resetDisplay();

  gameDisplay.classList.add('flex-box-two');
  gameDisplay.classList.remove('flex-box-one');


  gameDisplay.append(getGameModeText(), getGameBoard());
}

function setUpScore(scoreCondition){ 
  resetDisplay();

  gameBoard = [['','',''],['','',''],['','','']]; 
  turnCount = 0;  

  if(scoreCondition == 'x') {
    playerScores[0]++;
  }
  else if(scoreCondition == 'o') {
    playerScores[1]++;
  }

  for(let i = 0; i < 2; i++) {
    gameDisplay.append(getGameScore(scoreCondition)[i]);
  }

  gameDisplay.append(getGameOptionButtons());
}

function clickSelector(e) {
  gameMode = e.currentTarget.mode;
  setUpGame();
}

function getSelectionMode() { 
  let divLeft = document.createElement('div');
  let divMiddle = document.createElement('div');
  let divRight = document.createElement('div');
  
  divLeft.innerHTML = 'Human<br>vs<br>Human';
  divLeft.mode = 0;
  divMiddle.innerHTML = 'Human<br>vs<br>Smart<br>Computer';
  divMiddle.mode = 1;
  divRight.innerHTML = 'Human<br>vs<br>not-so-smart<br>Computer';
  divRight.mode = 2;

  divLeft.addEventListener('click', clickSelector, {once: true});
  divMiddle.addEventListener('click', clickSelector, {once: true});
  divRight.addEventListener('click', clickSelector, {once: true});

  return [divLeft, divMiddle, divRight];
}

function getGameModeText() {
  let gameModeText = document.createElement('div');
  if(gameMode == 0) gameModeText.textContent = 'Human vs Human';
  else if(gameMode == 1) gameModeText.textContent = 'Human vs Smart Computer';
  else gameModeText.textContent = 'Human vs not-so-smart Computer';

  return gameModeText;
}

function getGameBoard() {
  let gameBoard = document.createElement('div');
  gameBoard.classList.add('board-game');

  for(let i = 0; i < 3; i++){  
    let boardRow = document.createElement('div');
    boardRow.classList.add('row');
    boardRow.id = `${i}`;

    for(let j = 0; j < 3; j++){
      let boardColumn = document.createElement('div');
      boardColumn.classList.add('col');
      boardColumn.id = `${j}`;
      boardRow.append(boardColumn);  
      
      boardColumn.style.borderBottom = '4px solid black'; 
      boardColumn.style.borderTop = '4px solid black'; 
      boardColumn.style.borderRight = '4px solid black';
      boardColumn.style.borderLeft = '4px solid black';
      
      if(i == 0) boardColumn.style.borderTop = '';
      else if(i == 2) boardColumn.style.borderBottom = '';

      if(j == 0) boardColumn.style.borderLeft = '';
      else if(j == 2) boardColumn.style.borderRight = '';

      boardColumn.addEventListener('click', updateGame, {once: true});
    }
    gameBoard.append(boardRow);
  }

  return gameBoard;
}

function getGameScore(gameOutcome) {
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

  playerScoreDiv.innerHTML = `<strong style="color:blue;">${playerScores[0]}</strong>
    <p> - </p><strong style="color:red;">${playerScores[1]}</strong>`;
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

  newTurnButton.addEventListener('click', () => {setUpGame(gameMode)}, {once: true});
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
  turnCount++;

  let playerSymbol = isPlayerOneTurn ? 'x' : 'o';

  switch(gameMode){
    case 0:
      // Display the player symbol and update the Tic-Tac-Toe game array
      if(isPlayerOneTurn == true){
        isPlayerOneTurn = false;
        this.textContent = playerSymbol;
        this.style.color = 'blue';
        gameBoard[this.parentNode.id][this.id] = playerSymbol;
      }
      else{
        isPlayerOneTurn = true;
        this.textContent = playerSymbol;
        this.style.color = 'red';
        gameBoard[this.parentNode.id][this.id] = playerSymbol;
      }
      break;
    case 1:
      if(isPlayerOneTurn == true && turnCount != 9){
        isPlayerOneTurn = false;
        this.textContent = playerSymbol;
        this.style.color = 'blue';
        gameBoard[this.parentNode.id][this.id] = playerSymbol;

        let bestMove = miniMax(gameBoard, turnCount, true);
        let moveIndex = getIndexOfArrayDiference(gameBoard, bestMove.pathChosen); 
        console.log(bestMove.pathChosen);
        console.log(moveIndex[0] + ' ' + moveIndex[1]);
        updateGameSquare(moveIndex[0], moveIndex[1]);
        isPlayerOneTurn = true; 
      }
      else{
        isPlayerOneTurn = false;
        this.textContent = playerSymbol;
        this.style.color = 'blue';
        gameBoard[this.parentNode.id][this.id] = playerSymbol;
      }
      break;
  }

  if(turnCount >= 5 && 
    checkGameState(gameBoard, turnCount, playerSymbol) != 'ongoing') { 
    setTimeout(() => setUpScore(checkGameState(gameBoard, turnCount, playerSymbol)), 500);
  }
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

  gameBoard[row][col] = 'o';
}

setUpSelection();
