const gameDisplay = document.querySelector('#display');

let isPlayingCPU = false;

function setUpSelection(){
  gameDisplay.classList.add('flex-box-one'); 
  gameDisplay.classList.remove('flex-box-two');

  let divLeft = document.createElement('div');
  let divRight = document.createElement('div');
  
  divLeft.textContent = 'Human vs Human';
  divRight.textContent = 'Human vs Computer';

  gameDisplay.append(divLeft, divRight);

  divLeft.addEventListener('click', () => setUpGame(false));
  divRight.addEventListener('click', () => setUpGame(true));
}

function setUpGame(gameMode){ 
  // Adjust class of display
  gameDisplay.classList.add('flex-box-two');
  gameDisplay.classList.remove('flex-box-one');

  // Removes previous state's elements
  clearDisplay();

  // Sets game mode and corresponding text
  (gameMode) ? isPlayingCPU = true : isPlayingCPU = false;

  let divMode = document.createElement('div');
  (isPlayingCPU) ? divMode.textContent = 'Human vs Computer' : 
      divMode.textContent = 'Human vs Human';

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
    }
    gameBoard.append(boardRow);
  }

  gameDisplay.append(gameBoard);
}

function clearDisplay(){
  gameDisplay.innerHTML = '';
}

setUpSelection();
