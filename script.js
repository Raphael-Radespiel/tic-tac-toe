const gameDisplay = document.querySelector('#display');

let gameMode = 0;
let isFirstPlayerTurn = true;
let turnCount = 0;
let gameArray = [['','',''],['','',''],['','','']];
let playerScores = [0,0];

function setUpSelection(){
  clearDisplayDiv();

  // Reset the Game's variables
  isFirstPlayerTurn = true;
  playerScores = [0,0];
  gameArray = [['','',''],['','',''],['','','']]; 
  turnCount = 0;

  // Set the correct display class
  gameDisplay.classList.add('flex-box-one'); 
  gameDisplay.classList.remove('flex-box-two');

  // Create, set content and listen to these game-mode selector divs
  let divLeft = document.createElement('div');
  let divMiddle = document.createElement('div');
  let divRight = document.createElement('div');
  
  divLeft.innerHTML = 'Human<br>vs<br>Human';
  divMiddle.innerHTML = 'Human<br>vs<br>Smart<br>Computer';
  divRight.innerHTML = 'Human<br>vs<br>not-so-smart<br>Computer';

  divLeft.addEventListener('click', () => setUpGame(0), {once: true});
  divMiddle.addEventListener('click', () => setUpGame(1), {once: true});
  divRight.addEventListener('click', () => setUpGame(2), {once: true});
  
  gameDisplay.append(divLeft, divMiddle, divRight);
}

function setUpGame(mode){ 
  clearDisplayDiv();

  // Sets game mode and corresponding text
  gameMode = mode;
  
  // Set the correct display class
  gameDisplay.classList.add('flex-box-two');
  gameDisplay.classList.remove('flex-box-one');

  // Create the game-mode display text
  let divMode = document.createElement('div');
  if(gameMode == 0) divMode.textContent = 'Human vs Human';
  else if(gameMode == 1) divMode.textContent = 'Human vs Smart Computer';
  else divMode.textContent = 'Human vs not-so-smart Computer';

  // Creates the Tic-Tac-Toe game-board
  let gameBoard = document.createElement('div');
  gameBoard.classList.add('board-game');

  for(let i = 0; i < 3; i++){  
    // create row div
    let boardRow = document.createElement('div');
    boardRow.classList.add('row');
    boardRow.id = `${i}`;

    for(let j = 0; j < 3; j++){
      // create column div
      let boardColumn = document.createElement('div');
      boardColumn.classList.add('col');
      boardColumn.id = `${j}`;
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

  gameDisplay.append(divMode, gameBoard);
}

function updateGame(){
  // Update the turn count
  turnCount++;

  // Display the player symbol and update the Tic-Tac-Toe game array
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
    gameArray[this.parentNode.id][this.id] = 'o';
  }

  // After the 5th turn, check if the game is in a tie or a win
  if(turnCount >= 5 && checkGameState() != 'ongoing'){
    setUpScore(checkGameState());
  }
}

function clearDisplayDiv(){
  gameDisplay.innerHTML = '';
}

function checkGameState(){

  let playerValue = isFirstPlayerTurn ? 'o' : 'x';
  
  // Check horizontal/vertical win
  for(let i = 0; i < 3; i++){
    if(gameArray[i][0] == playerValue && 
      gameArray[i][1] == playerValue && 
      gameArray[i][2] == playerValue){
      return playerValue;
    }
    if(gameArray[0][i] == playerValue && 
      gameArray[1][i] == playerValue && 
      gameArray[2][i] == playerValue){
      return playerValue;
    }
  }

  // Check diagonal win
  if(gameArray[0][0] == playerValue &&
    gameArray[1][1] == playerValue &&
    gameArray[2][2] == playerValue){
    return playerValue;
  }
  if(gameArray[2][0] == playerValue &&
    gameArray[1][1] == playerValue &&
    gameArray[0][2] == playerValue){
    return playerValue;
  }

  // If it isn't a win, it's ongoing. If the board is filled up, it's a tie
  return turnCount == 9 ? 'tie' : 'ongoing';
}

function setUpScore(scoreCondition){
  clearDisplayDiv();

  // Reset the board variables 
  gameArray = [['','',''],
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

setUpSelection();
