const gameDisplay = document.querySelector('#display');

let gameMode = 0;
let isFirstPlayerTurn = true;

function setUpSelection(){
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

      switch(i){
        case 0:
          boardColumn.style.borderBottom = '4px solid black';
          break;
        case 1:
          boardColumn.style.borderBottom = '4px solid black';
          boardColumn.style.borderTop = '4px solid black';
          break;
        case 2:
          boardColumn.style.borderTop = '4px solid black';
          break;
      }

      switch(j){        
        case 0:
          boardColumn.style.borderRight = '4px solid black';
          break;
        case 1:
          boardColumn.style.borderRight = '4px solid black';
          boardColumn.style.borderLeft = '4px solid black';
          break;
        case 2:
          boardColumn.style.borderLeft = '4px solid black';
          break;
      }

      // Add eventListener
      boardColumn.addEventListener('click',updateGame, {once: true});
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
  }
  else{
    isFirstPlayerTurn = true;
    this.textContent = 'o';
    this.style.color = 'red';
  }
}

function clearDisplay(){
  gameDisplay.innerHTML = '';
}

setUpSelection();
