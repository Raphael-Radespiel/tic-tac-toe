function checkGameState(board, turn, playerValue) {
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

  if((board[0][0] == board[1][1] && board[1][1] == board[2][2]) || 
    (board[2][0] == board[1][1] && board[1][1] == board[0][2])){ 
    if(board[1][1] == playerValue){
      return playerValue;
    }
  }

  let finalValue = (turn == 9) ? 'tie' : 'ongoing';
  return finalValue;
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

// OK, NOW MAKE IT PASS BACK AN OBJECT WITH THE SCORE AND THE 
// SELECTED PATH
function miniMax(node, depth, isMaximizer){
  let winValues = {
    x: -1,
    o: 1,
    tie: 0
  };

  let gameBoard = JSON.parse(JSON.stringify(node));
  
  let playerSymbol = isMaximizer ? 'o' : 'x';

  let possibleMoves = getPossibleMoves(gameBoard, playerSymbol);

  playerSymbol = isMaximizer ? 'x' : 'o';

  let gameStateValue = checkGameState(gameBoard, depth, playerSymbol);
  
  if(depth == 9 || gameStateValue != 'ongoing') {
    let score = winValues[gameStateValue]; 
    return score; // divide by depth later 
  }


  if(isMaximizer) {
    let value = -Infinity;  

    for(let move of possibleMoves) {
      let boardValue = miniMax(move, depth + 1, false);
      value = Math.max(value, boardValue);
    }
    return value;
  }
  else{
    let value = Infinity;
    
    for(let move of possibleMoves) {
      let boardValue = miniMax(move, depth + 1, true);
      value = Math.min(value, boardValue);
    } 

    return value;
  }
}

describe('Implementation of a minimax algorithm for tic-tac-toe', () => {

  it('Test', () => {
    expect(miniMax([['x','o','o'],['o','x','o'],['o','','']], 7, true)).toStrictEqual(1);
  });
});
