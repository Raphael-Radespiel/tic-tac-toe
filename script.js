const main = document.querySelector("main");
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

let gameState = resetGameState();

function resetGameState() {
  return {
    gameMode: 0,
    startingPlayer: 'x',
    currentPlayerTurn: 'x',
    nextPlayerTurn: 'o',
    turnCount: 0,
    matchState: 'ongoing',
    gameBoard: [['','',''],['','',''],['','','']],
    playerScores: [0,0],
    clickFlag: true 
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
    if(gameState.clickFlag == false) return;

    gameState.clickFlag = false;
    
    const isClickSuccessful = handleClickInput(e);

    if(isClickSuccessful){
      gameState.matchState = checkGameState();

      if(gameState.turnCount >= 5 && 
        gameState.matchState != 'ongoing') { 
        handleMatchEnd(gameState.matchState);
      }
    }

    gameState.clickFlag = true;
  }
}

function runHumanVsComputerGameLoop(){
  if(gameState.startingPlayer == 'o'){
    renderSymbol('o', 0, 0);
    gameState.gameBoard[0][0] = 'o';

    swapPlayerTurn();
    gameState.turnCount++;
  }

  canvas.onclick = e => {
    if(gameState.clickFlag == false) return;

    gameState.clickFlag = false;

    const isClickSuccessful = handleClickInput(e);

    if(isClickSuccessful){
      gameState.matchState = checkGameState();

      if(gameState.turnCount >= 5 && 
        gameState.matchState != 'ongoing') { 
        handleMatchEnd(gameState.matchState);
        gameState.clickFlag = true;
        return;
      }

      makeComputerMove();

      gameState.matchState = checkGameState();

      if(gameState.turnCount >= 5 && 
        gameState.matchState != 'ongoing') { 
        handleMatchEnd(gameState.matchState);
        gameState.clickFlag = true;
        return;
      }
    }
    
    gameState.clickFlag = true;
  }
}

function makeComputerMove(){
  // Calculate best move
  let copyOfGameBoard = JSON.parse(JSON.stringify(gameState.gameBoard));
  let bestMove = getBestMove(copyOfGameBoard, gameState.turnCount++); 

  // Apply move to the board 
  renderSymbol('o', bestMove[1], bestMove[0]);
  gameState.gameBoard[bestMove[0]][bestMove[1]] = 'o';

  swapPlayerTurn();
  gameState.turnCount++;
}

function getBestMove(node, depth){

    let bestValue = -Infinity;  
    let bestMove = [];

    for(let i = 0; i < 3; i++) {
      for(let j = 0; j < 3; j++){

        if(node[i][j] == ""){

          let copyOfNode = JSON.parse(JSON.stringify(node));
          copyOfNode[i][j] = "o";

          let score = miniMax(copyOfNode, depth + 1, false);

          if(bestValue < score){
            bestValue = score;
            bestMove = [i, j];
          }
        }
      }
    }

  return bestMove;
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

    swapPlayerTurn();
    gameState.turnCount++;
  }

  return clickSquare.truth;
}

function handleMatchEnd(boardResult){
  // Reset Board and turn Count
  gameState.gameBoard = [['','',''],['','',''],['','','']]; 
  gameState.turnCount = 0;  

  gameState.matchState = 'ongoing';

  // Swap starting Player
  gameState.startingPlayer == 'x' ? 
    gameState.startingPlayer = 'o' : 
    gameState.startingPlayer = 'x';

  gameState.currentPlayerTurn = gameState.startingPlayer;

  gameState.startingPlayer == 'o' ?
    gameState.nextPlayerTurn = 'x' : 
    gameState.nextPlayerTurn = 'o';
  
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
    return {
      truth: true,
      index: [row, col]
    }
  }

  return {
    truth: false
  }
}

function checkGameState(board = gameState.gameBoard, turn = gameState.turnCount, playerValue = gameState.nextPlayerTurn){
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

  if(depth >= 5){
    let previousPlayerSymbol = isMaximizer ? 'x' : 'o';

    let gameStateValue = checkGameState(node, depth, previousPlayerSymbol);
    
    if(gameStateValue != 'ongoing') {
      let multiplier;
      gameStateValue == 'x' ? multiplier = -1 : gameStateValue == 'o' ? multiplier = 1 : multiplier = 0;

      let score = multiplier / depth;
      return score;  
    }
  }

  if(isMaximizer) {
    let bestValue = -Infinity;  

    for(let i = 0; i < 3; i++) {
      for(let j = 0; j < 3; j++){

        if(node[i][j] == ""){
          let copyOfNode = JSON.parse(JSON.stringify(node));
          copyOfNode[i][j] = "o";

          let score = miniMax(copyOfNode, depth + 1, false);

          if(bestValue < score){
            bestValue = score;
          }
        }
      }
    }

    return bestValue; 
  }
  else{
    let bestValue = Infinity;  

    for(let i = 0; i < 3; i++) {
      for(let j = 0; j < 3; j++){

        if(node[i][j] == ""){
          let copyOfNode = JSON.parse(JSON.stringify(node));
          copyOfNode[i][j] = "x";

          let score = miniMax(copyOfNode, depth + 1, true);

          if(bestValue > score){
            bestValue = score;
          }
        }
      }
    }

    return bestValue; 
  }
}

function cloneAndModifyBoard(board, coord, player){
  let copyOfGameBoard = JSON.parse(JSON.stringify(board));
  copyOfGameBoard[coord[0]][coord[1]] = player;

  return copyOfGameBoard;
}

function cloneAndModifyPossibleMoves(possibleMoves, move){
  let copyOfPossibleMoves = JSON.parse(JSON.stringify(possibleMoves));
  let index = possibleMoves.find((element, index) => {
    if(element == move){
      return index;
    }
  });
  copyOfPossibleMoves.splice(index, 1);

  return copyOfPossibleMoves;
}

function getPossibleMoves(gameBoard){
  let movesArray = new Array();

  for(let i = 0; i < 3; i++){
    for(let j = 0; j < 3; j++){
      if(gameBoard[i][j] == ''){
        let coordinates = [i, j];
        movesArray.push(coordinates);
      }
    }
  }

  return movesArray;
}

setUpSelection();
