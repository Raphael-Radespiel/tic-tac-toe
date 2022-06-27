const gameDisplay = document.querySelector('#display');

let gameMode = 0;
let isFirstPlayerTurn = true;
let turnNum = 0;
let gameArray = 
[['','',''],
['','',''],
['','','']];
let playerScores = [0,0];

function setUpSelection(){
  clearDisplay();

  gameDisplay.classList.add('flex-box-one'); 
  gameDisplay.classList.remove('flex-box-two');

  let divLeft = document.createElement('div');
  let divMiddle = document.createElement('div');
  let divRight = document.createElement('div');
  
  divLeft.innerHTML = 'Human<br>vs<br>Human';
  divMiddle.innerHTML = 'Human<br>vs<br>Smart<br>Computer';
  divRight.innerHTML = 'Human<br>vs<br>not-so-smart<br>Computer';

  gameDisplay.append(divLeft, divMiddle, divRight);

  divLeft.addEventListener('click', () => setUpGame(0), {once: true});
  divMiddle.addEventListener('click', () => setUpGame(1), {once: true});
  divRight.addEventListener('click', () => setUpGame(2), {once: true});
}

function setUpGame(mode){ 
  // Adjust class of display
  gameDisplay.classList.add('flex-box-two');
  gameDisplay.classList.remove('flex-box-one');

  // Removes previous state's elements
  clearDisplay();

  // Sets game mode and corresponding text
  gameMode = mode;

  let divMode = document.createElement('div');
  switch(gameMode){
    case 0:
      divMode.textContent = 'Human vs Human';
      break;
    case 1:
      divMode.textContent = 'Human vs Smart Computer';
      break;
    case 2:
      divMode.textContent = 'Human vs not-so-smart Computer';
      break;
  } 

  gameDisplay.append(divMode);

  // Creates the tic-tac-toe board
  let gameBoard = document.createElement('div');
  gameBoard.classList.add('board-game');

  for(let i = 0; i < 3; i++){  
    let boardRow = document.createElement('div');
    boardRow.classList.add('row');
    boardRow.id = `row-${i}`;
    for(let j = 0; j < 3; j++){
      let boardColumn = document.createElement('div');
      boardColumn.classList.add('col');
      boardColumn.id = `col-${j}`;
      boardRow.append(boardColumn);  
      
      // Set border style for tic tac toe grid
      boardColumn.style.borderBottom = '4px solid black'; 
      boardColumn.style.borderTop = '4px solid black'; 
      boardColumn.style.borderRight = '4px solid black';
      boardColumn.style.borderLeft = '4px solid black';
      
      if(i == 0) boardColumn.style.borderTop = '';
      else if(i == 2) boardColumn.style.borderBottom = '';

      if(j == 0) boardColumn.style.borderLeft = '';
      else if(j == 2) boardColumn.style.borderRight = '';

      // Add eventListener 
      boardColumn.addEventListener('click', updateGame, {once: true});
    }
    gameBoard.append(boardRow);
  }

  gameDisplay.append(gameBoard);
}

function updateGame(){
  if(isFirstPlayerTurn == true){
    isFirstPlayerTurn = false;
    this.textContent = 'x';
    this.style.color = 'blue';
    gameArray[this.parentNode.id.replace('row-', '')][this.id.replace('col-', '')] = 'x';
  }
  else{
    isFirstPlayerTurn = true;
    this.textContent = 'o';
    this.style.color = 'red';
    gameArray[this.parentNode.id.replace('row-', '')][this.id.replace('col-', '')] = 'o';
  }

  turnNum++;

  if(turnNum >= 5){
    if(checkGameState() != 'ongoing'){
      clearDisplay();
      gameArray = [['','',''],
                   ['','',''],
                   ['','','']];
      turnNum = 0;
      playerScores = [0,0];

      setUpScore(checkGameState());
    }
  }
}

function clearDisplay(){
  gameDisplay.innerHTML = '';
}

function checkGameState(){
  let strBeingChecked = '';
  (isFirstPlayerTurn) ? strBeingChecked = 'o' : strBeingChecked = 'x';
  // Check horizontal/vertical win
  for(let i = 0; i < 3; i++){
    if(gameArray[i][0] == strBeingChecked && 
      gameArray[i][1] == strBeingChecked && 
      gameArray[i][2] == strBeingChecked){
      return strBeingChecked;
    }
    if(gameArray[0][i] == strBeingChecked && 
      gameArray[1][i] == strBeingChecked && 
      gameArray[2][i] == strBeingChecked){
      return strBeingChecked;
    }
  }

  // check diagonal win
  if(gameArray[0][0] == strBeingChecked &&
    gameArray[1][1] == strBeingChecked &&
    gameArray[2][2] == strBeingChecked){
    return strBeingChecked;
  }
  if(gameArray[2][0] == strBeingChecked &&
    gameArray[1][1] == strBeingChecked &&
    gameArray[0][2] == strBeingChecked){
    return strBeingChecked;
  }

  if(turnNum == 9) return 'tie';
  else return 'ongoing'; 
}

function setUpScore(scoreCondition){
  let winCondition = document.createElement('div'); 
  let playerScoreDiv = document.createElement('div'); 
  let resetButton = document.createElement('div');
  let newTurnButton = document.createElement('div');
  let lowerPageButtons = document.createElement('div');

  switch(scoreCondition){
    case 'x':
      winCondition.textContent = 'x won!';
      winCondition.id = 'x-win';
      playerScores[0]++;
      break;
    case 'o':
      winCondition.textContent = 'o won!';
      winCondition.id = 'o-win';
      playerScores[1]++;
      break;
    case 'tie':
      winCondition.textContent = 'its a tie!';
      winCondition.id = 'tie';
      break;
  }
  
  winCondition.classList.add('win-display');
  playerScoreDiv.innerHTML = `<strong style="color:blue;">${playerScores[0]}</strong><p> - </p><strong style="color:red;">${playerScores[1]}</strong>`; 
  playerScoreDiv.id = 'player-score';
  
  let eventSetUpGame = function(){setUpGame(gameMode);};

  newTurnButton.textContent = 'New Turn';
  newTurnButton.addEventListener('click', eventSetUpGame, {once: true});
  resetButton.textContent = 'Reset';
  resetButton.addEventListener('click', setUpSelection, {once: true});
  lowerPageButtons.id = 'lower-page-buttons';
  lowerPageButtons.append(newTurnButton, resetButton);
  
  gameDisplay.append(winCondition, playerScoreDiv, lowerPageButtons);
}

setUpSelection();
