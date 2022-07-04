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

describe('Takes a game board and returns array of possible moves', () =>{
  it('check symbol consistency', () => {
    let result1 = [[['x','x','x'],['o', 'o', 'o'], ['x', 'o', '']],[['x','x','x'],['o', 'o', 'o'], ['x', '', 'o']]];
    let result2 = [[['x','o', 'x'], ['x','','o'], ['', '', 'o']], [['x','o', 'x'], ['','x','o'], ['', '', 'o']], 
      [['x','o', 'x'], ['','','o'], ['x', '', 'o']], [['x','o', 'x'], ['','','o'], ['', 'x', 'o']]];
    
    expect(getPossibleMoves([['x','x','x'],['o', 'o', 'o'], ['x', '', '']], 'o')).toStrictEqual(result1);
    expect(getPossibleMoves([['x','o', 'x'], ['','','o'], ['', '', 'o']], 'x')).toStrictEqual(result2);
  });
});
/* function getPossibleMoves(board, str){
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
*/
