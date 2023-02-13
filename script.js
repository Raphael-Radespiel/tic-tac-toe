const main = document.querySelector("main");
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

let gameState = resetGameState();

function resetGameState() {
  return {
    gameMode: 0,
    startingPLayer: 'x',
    currentPlayerTurn: 'x',
    nextPlayerTurn: 'o',
    turnCount: 0,
    matchState: 'ongoing',
    gameBoard: [['','',''],['','',''],['','','']],
    playerScores: [0,0]
  }
}

////////////////////////////////////////////////
// Functions that set up and return html divs //
////////////////////////////////////////////////

function setUpSelection() {
  gameState = resetGameState();

  main.innerHTML = `
  <section class="flex-box-one">
    <div data-mode="0">
      Human<br>vs<br>Human
    </div>
    <div data-mode="1">
      Human<br>vs<br>Computer
    </div>
    </section>
  `;

  main.querySelector("div[data-mode='0']").addEventListener('click', () => {gameState.gameMode = 0; setUpGame();}, {once: true});
  main.querySelector("div[data-mode='1']").addEventListener('click', () => {gameState.gameMode = 1; setUpGame();}, {once: true});
}

//TODO: CHANGE RUNGAMELOOP TO JUST CHECK THE GAME MODE AND CHOOSE A SPECIFIC FUNCTION
function setUpGame() { 
  main.innerHTML = `
  <section class="flex-box-two">
    <div>
    ${(gameState.gameMode == 0) ? 'Human vs Human' : 'Human vs Computer'}
    </div>
  </section>
  `;

  setCanvasGameBoard();

  main.querySelector("section").append(canvas);

  (gameState.gameMode == 0) ? runHumanVsHumanGameLoop() : runHumanVsComputerGameLoop();
}

function setUpScore(scoreCondition){ 
  main.innerHTML = `
  <section class="flex-box-two">
    <div class="win-display" id="${scoreCondition + "-win"}">
      ${(scoreCondition == 'tie') ? "it's a tie!" : scoreCondition + " won!"}
    </div>
    <div id="player-score">
      <strong style="color:blue;">${gameState.playerScores[0]}</strong>
      <p> - </p>
      <strong style="color:red;">${gameState.playerScores[1]}</strong>
    </div>
    <div id="lower-page-buttons">
      <div id="new-turn">New Turn</div>
      <div id="reset">Reset</div>
    </div>
  </section>`;

  main.querySelector("#new-turn").addEventListener('click', () => {setUpGame(gameState.gameMode)}, {once: true});
  main.querySelector("#reset").addEventListener('click', setUpSelection, {once: true});
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
 
////////////////////////////////////////////////////////////////////
// Functions related to game mechanics and artificial inteligence //
////////////////////////////////////////////////////////////////////
function runHumanVsHumanGameLoop(){
  canvas.onclick = e => {
    
    handleClickInput(e);

    gameState.matchState = checkGameState();

    if(gameState.turnCount >= 5 && 
      gameState.matchState != 'ongoing') { 
      handleMatchEnd(gameState.matchState);
    }
  }
}

function runHumanVsComputerGameLoop(){

  let boardResult = checkGameState();
  if(gameState.turnCount >= 5 && 
    boardResult != 'ongoing') { 
    handleMatchEnd(boardResult);
  }

  // I THINK IM GOING ABOUT THIS THE WRONG WAY. 
  // MAYBE ITS ADDING THIS EVERY SINGLE FRAME AND THATS A PROBLEM
  // OR THE PLAYER TURN FILTER ISNT GOOD BECAUSE THE ONCLICK HANDLER
  // GETS ADDED AND IS STILL USED EVEN AFTER A CLICK
  if(gameState.currentPlayerTurn == 'x' && !isGameOver){
    canvas.onclick = e => {  
      handleClickInput(e);
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
    window.requestAnimationFrame(runHumanVsComputerGameLoop);
  }
}

/////////////////////////////////////////
// HELPER FUNCTIONS FOR THE GAME LOGIC //
/////////////////////////////////////////
function swapPlayerTurn(){
  let current = gameState.currentPlayerTurn;
  gameState.currentPlayerTurn = gameState.nextPlayerTurn;
  gameState.nextPlayerTurn = current;
}

function handleClickInput(e){
  let rect = e.target.getBoundingClientRect();
  let clickSquare = checkEmptySquare(e.clientX - rect.left, e.clientY - rect.top, canvas.clientWidth);
  
  if(clickSquare.truth) {
    renderSymbol(gameState.currentPlayerTurn, clickSquare.index[1], clickSquare.index[0]);
    gameState.gameBoard[clickSquare.index[0]][clickSquare.index[1]] = gameState.currentPlayerTurn;
    // write a switch player turn
    swapPlayerTurn();
    gameState.turnCount++;
  }
}

function handleMatchEnd(boardResult){
  // Reset Board and turn Count
  gameState.gameBoard = [['','',''],['','',''],['','','']]; 
  gameState.turnCount = 0;  

  // Swap starting Player
  gameState.startingPLayer == 'x' ? 
    gameState.startingPLayer = 'o' : 
    gameState.startingPLayer = 'x';
  
  // Count Score
  if(boardResult == 'x') gameState.playerScores[0]++;
  if(boardResult == 'o') gameState.playerScores[1]++;

  setUpScore(boardResult);
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

function checkGameState(){
  const board = gameState.gameBoard;
  const turn = gameState.turnCount;
  const playerValue = gameState.nextPlayerTurn;

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


setUpSelection();
