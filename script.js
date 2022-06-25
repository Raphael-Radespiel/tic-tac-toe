const gameDisplay = document.querySelector('#display');

function setUpSelection(){
  gameDisplay.classList.add('flex-box-one'); 
  
  let divLeft = document.createElement('div');
  let divRight = document.createElement('div');
  
  gameDisplay.append(divLeft, divRight);

  divLeft.textContent = 'Human vs Human';
  divRight.textContent = 'Human vs Computer';
}

setUpSelection();
