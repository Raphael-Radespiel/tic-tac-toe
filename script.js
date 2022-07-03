const gameDisplay = document.querySelector('#display');

let gameMode = 0;
let isPlayerOneTurn = true;
let turnCount = 0;
let gameBoard = [['','',''],['','',''],['','','']];
let playerScores = [0,0];

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

function setUpGame(){ 
  resetDisplay();

  gameDisplay.classList.add('flex-box-two');
  gameDisplay.classList.remove('flex-box-one');


  gameDisplay.append(getGameModeText(), getGameBoard());
}

function getSelectionMode() { 
  let divLeft = document.createElement('div');
  let divMiddle = document.createElement('div');
  let divRight = document.createElement('div');
  
  divLeft.innerHTML = 'Human<br>vs<br>Human';
  divMiddle.innerHTML = 'Human<br>vs<br>Smart<br>Computer';
  divRight.innerHTML = 'Human<br>vs<br>not-so-smart<br>Computer';

  divLeft.addEventListener('click', () => setUpGame(0), {once: true});
  divMiddle.addEventListener('click', () => setUpGame(1), {once: true});
  divRight.addEventListener('click', () => setUpGame(2), {once: true});

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

function updateGame(){
  // Update the turn count
  turnCount++;

  // Display the player symbol and update the Tic-Tac-Toe game array
  if(gameMode == 0){
    if(isPlayerOneTurn == true){
      isPlayerOneTurn = false;
      this.textContent = 'x';
      this.style.color = 'blue';
      gameBoard[this.parentNode.id][this.id] = 'x';
    }
    else{
      isPlayerOneTurn = true;
      this.textContent = 'o';
      this.style.color = 'red';
      gameBoard[this.parentNode.id][this.id] = 'o';
    }
  }
  else if(gameMode == 1){ 
    if(isPlayerOneTurn == true){
      isPlayerOneTurn = false;
      this.textContent = 'x';
      this.style.color = 'blue';
      gameBoard[this.parentNode.id][this.id] = 'x';

      gameBoard = bestMove();
      console.log(gameBoard);
      isPlayerOneTurn = true; 
    }
  }

  // After the 5th turn, check if the game is in a tie or a win
  if(turnCount >= 5 && checkGameState(gameBoard, turnCount) != 'ongoing'){ 
    setUpScore(checkGameState(gameBoard, turnCount));
  }
}

function resetDisplay(){
  gameDisplay.innerHTML = '';
}

function checkGameState(board, turn){
 let newBoard = JSON.parse(JSON.stringify(board));
  // Check horizontal/vertical win
  for(let i = 0; i < 3; i++){
    if(newBoard[i][0] == newBoard[i][1] && newBoard[i][1] == newBoard[i][2]){
      if(newBoard[i][0] != ''){
        console.log(toString(newBoard[i][0]));
        return toString(newBoard[i][0]);
      }
    }
    if(newBoard[0][i] == newBoard[1][i] && newBoard[1][i] ==  newBoard[2][i]){
      if(newBoard[0][i] != ''){
        console.log(toString(newBoard[0][i]));
        return toString(newBoard[0][i]);
      }
    }
  }

  // Check diagonal win
  if((newBoard[0][0] == newBoard[1][1] && newBoard[1][1] == newBoard[2][2]) || 
    (newBoard[2][0] == newBoard[1][1] && newBoard[1][1] == newBoard[0][2])){ 
    if(newBoard[1][1] != ''){
      console.log(toString(newBoard[1][1]));
      return toString(newBoard[1][1]);
    }
  }

  // If it isn't a win, it's ongoing. If the newBoard is filled up, it's a tie
  let finalValue = (turn == 9) ? 'tie' : 'ongoing';
  console.log(finalValue);
  return finalValue;
}

function setUpScore(scoreCondition){
  resetDisplay();

  // Reset the board variables 
  gameBoard = [['','',''],
               ['','',''],
               ['','','']]; 
  turnCount = 0;
  
  // score display elements
  let winCondition = document.createElement('div'); 
  let playerScoreDiv = document.createElement('div'); 
  
  // Button elements
  let resetButton = document.createElement('div');
  let newTurnButton = document.createElement('div');
  let lowerPageButtons = document.createElement('div');

  // Set the score condition and add to the winning player's score
  winCondition.classList.add('win-display');
  if(scoreCondition == 'tie'){
    winCondition.textContent = 'its a tie!';
    winCondition.id = 'tie';
  }
  else{
    winCondition.textContent = `${scoreCondition} won!`;
    winCondition.id = `${scoreCondition}-win`;
    scoreCondition == 'x' ? playerScores[0]++ : playerScores[1]++;
  }
  
  playerScoreDiv.innerHTML = `<strong style="color:blue;">${playerScores[0]}</strong>
    <p> - </p><strong style="color:red;">${playerScores[1]}</strong>`;
  playerScoreDiv.id = 'player-score';
  
  newTurnButton.textContent = 'New Turn';
  resetButton.textContent = 'Reset';
  lowerPageButtons.id = 'lower-page-buttons';

  newTurnButton.addEventListener('click', () => {setUpGame(gameMode)}, {once: true});
  resetButton.addEventListener('click', setUpSelection, {once: true});

  lowerPageButtons.append(newTurnButton, resetButton);
  
  gameDisplay.append(winCondition, playerScoreDiv, lowerPageButtons);
}

function minmax(board, depth, isMaximizer){
  let winValues = {
    x: -1,
    o: 1,
    tie: 0
  };

  let newBoard = JSON.parse(JSON.stringify(board));
  console.log('board value: ');
  console.log(newBoard);
  
  let gameStateValue = checkGameState(newBoard, depth);
  console.log(gameStateValue);

  if(depth == 9 || gameStateValue != 'ongoing'){
    let score = winValues[checkGameState(newBoard, depth)]; 
    console.log('board value: ');
    console.log(newBoard);
    console.log('returning: ' + score + ' at depth: ' + depth);
    return score / depth; // divide by depth so it has incentive to win faster
  }


  if(isMaximizer){
    let value = -Infinity;
    
    for(let i = 0; i < 3; i++){
      for(let j = 0; j < 3; j++){
        if(newBoard[i][j] != ''){
          newBoard[i][j] = 'o';
          let boardValue = minmax(newBoard, depth + 1, false);
          newBoard[i][j] = '';
          value = Math.max(value, boardValue);
        }
      }
    }
    return value;
  }
  else{
    let value = Infinity;
    
    for(let i = 0; i < 3; i++){
      for(let j = 0; j < 3; j++){
        if(newBoard[i][j] != ''){
          newBoard[i][j] = 'x';
          let boardValue = minmax(newBoard, depth + 1, true);
          newBoard[i][j] = '';
          value = Math.min(value, boardValue);
        }
      }
    }
    return value;
  }
}

function bestMove(){
  let bestScore = -Infinity;
  let move;

  let newBoard = JSON.parse(JSON.stringify(gameBoard));

  console.log('array:');
  console.log(newBoard);

  for(let i = 0; i < 3; i++){
    for(let j = 0; j < 3; j++){
      if(newBoard[i][j] == ''){
        newBoard[i][j] = 'o';
        console.log('new board position: ' + i + ' ' + j);
        console.log(newBoard);
        let nodeValue = minmax(newBoard, turnCount + 1, false);
        if(nodeValue > bestScore){
          bestScore = nodeValue;
          move = newBoard;
        }
        newBoard[i][j] = '';
      }
    }
  }
  console.log('best score is: ' + bestScore);
  console.log('best Score array is: ');
  console.log(move);
  return move;
}

function getPossibleMoves(board, str){
  let movesArray;
  
  for(let i = 0; i < 3; i++){
    for(let j = 0; j < 3; j++){
      if(board[i][j] == ''){
        let tempBoard = {...board};
        tempBoard[i][j] = str;
        movesArray.push(tempBoard);
      }
    }
  }

  return movesArray;
}

setUpSelection();
