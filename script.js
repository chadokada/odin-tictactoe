const gameBoard = (() => {
  let gameArray = new Array(9);
  let horizontalWins = [0, 3, 6].map( i => { return[i, i+1, i+2] } )
  let verticalWins = [0, 1, 2].map(i => { return [ i, i+3, i+6 ] } )
  let diagonalWins = [ [0, 4, 8], [2, 4, 6] ]; 

  const viewBoard = () => {
    let gameArrayClone = [...gameArray];
    return gameArrayClone
  }

  const clearBoard = () => {
    gameArray = new Array(9);
  }

  const isSquareBlank = (gameSquare) => {
    return gameArray[gameSquare] == undefined;
  }

  const placeMarker = (gameSquare, marker) =>{
    if (isSquareBlank(gameSquare)){
      gameArray[gameSquare] = marker;
    }
  }

  const boardFull = () => {
    let filledSquares = 0;
    gameArray.forEach(square => square != undefined ? filledSquares += 1 : null);
    return filledSquares == 9;
  }

  const getMarkedSquares = (marker) => {
    let markedSquares = [];
    for (i = 0; i < gameArray.length; i++ ){
      gameArray[i] == marker ? markedSquares.push(i) : null
    }
    return markedSquares;
  }

  const winConditionMet = (conditions, markedSquares) => {
    let conditionsMet = 0
    for (i = 0; i < conditions.length; i++){
      let condition = conditions[i];
      let squaresMarked = 0
      for (j = 0; j < condition.length; j++){
        markedSquares.includes(condition[j]) ? squaresMarked += 1 : null
      }
      squaresMarked == 3 ? conditionsMet += 1 : null;
    }
    return conditionsMet > 0
  }

  const checkPlayerWin = (player) => {
    let markedSquares = getMarkedSquares(player.getMarker);
    let horizontalWin = winConditionMet(horizontalWins, markedSquares);
    let verticalWin = winConditionMet(verticalWins, markedSquares);
    let diagonalWin = winConditionMet(diagonalWins, markedSquares);
    return horizontalWin || verticalWin || diagonalWin;
  }

  return {
    viewBoard,
    clearBoard,
    isSquareBlank,
    placeMarker,
    checkPlayerWin,
    boardFull
  }
})();

const displayController = (() => {
  let gameInfo = document.querySelector(".game-info");
  let gameBoxes = document.querySelectorAll(".board-box");

  const placeMarker = (gameSquareID, marker) => {
    gameSquareDiv = document.getElementById(`${gameSquareID}`);
    gameSquareDiv.innerHTML = marker;
  }

  const clearBoard = () => {
    gameBoxes.forEach(gameBox => {
      if (gameBox.innerHTML != ""){
        gameBox.innerHTML = "";
      }
    })
  }

  const getInactivePlayerNum = (currentPlayerNum) => {
    return (currentPlayerNum == 1 ? 2 : 1)
  }

  const getPlayerInfoDivs = (playerNum) => {
    let containerDiv = document.getElementById(`p${playerNum}`);
    let nameInput = document.getElementById(`p${playerNum}-input`);
    return [containerDiv, nameInput]  
  }

  const toggleActiveStyle = (divArray) =>{
    let containerDiv, nameInput;
    [containerDiv, nameInput] = divArray;
    containerDiv.classList.toggle('active-player');
    nameInput.classList.toggle('active-player-input')
  }

  const highlightCurrentPlayer = (currentPlayerNum) => {
    let playerDivs = getPlayerInfoDivs(currentPlayerNum);
    toggleActiveStyle(playerDivs)
  }

  const switchPlayerHighlight = (currentPlayerNum) => {
    let inactivePlayerNum = getInactivePlayerNum(currentPlayerNum);
    let currentPlayerDivs = getPlayerInfoDivs(currentPlayerNum);
    let inactivePlayerDivs = getPlayerInfoDivs(inactivePlayerNum);
    toggleActiveStyle(currentPlayerDivs);
    toggleActiveStyle(inactivePlayerDivs);
  }

  const announceWinner = (winnerName) => {
    gameInfo.innerHTML = `${winnerName} wins!`;
  }

  const clearGameInfo = () => {
    gameInfo.innerHTML = "";
  }

  const displayScore = (player) => {
    let scoreDiv = document.querySelector(`.player${player.getPlayerNum}-score`)
    scoreDiv.innerHTML = player.getScore();
  }

  const displayTies = (ties) => {
    let tieDiv = document.querySelector('.tie-score');
    tieDiv.innerHTML = ties;
    gameInfo.innerHTML = "Tie round!"
  }

  function resizeInput() {
    this.style.width = (this.value.length + 1) + "ch";
  }
  var inputs = document.querySelectorAll('input');
  inputs.forEach(input => input.addEventListener('input', resizeInput))
  inputs.forEach(input => resizeInput.call(input));

  return {
    placeMarker,
    clearBoard,
    highlightCurrentPlayer,
    switchPlayerHighlight,
    clearGameInfo,
    displayScore,
    displayTies,
    announceWinner
  }
})();

const Player = (marker, playerNum) => {
  let nameDiv = document.querySelector(`.player${playerNum}-name`)
  let score = 0;
  const getMarker = marker;
  const getPlayerNum = playerNum
  
  const getName = () => {
    return nameDiv.value
  }

  const playerWins = () => {
    score += 1;
  }

  const getScore = () => {
    return score;
  }

  const clearScore = () => {
    score = 0;
  }

  return {
    getName, 
    getMarker,
    getPlayerNum,
    playerWins,
    getScore,
    clearScore
  }
}


const gameFlow = (() => {
  const playerX = Player("X", 1);
  const playerO = Player("O", 2);
  const players = [null, playerX, playerO];
  let currentPlayerNum = 1;
  let currentPlayer = players[currentPlayerNum];
  let ties = 0;
  let gameBoxes = document.querySelectorAll(".board-box");
  const changePlayer = (currentPlayerNum) => {
    return (currentPlayerNum == 1 ? 2 : 1);
  }

  const roundOver = (winner) =>{
    let roundWinner = winner.getName();
    displayController.announceWinner(roundWinner);
    winner.playerWins();
    displayController.displayScore(winner);

    gameBoxes.forEach(gameBox => gameBox.removeEventListener("click", clickHandler));
    gameBoxes.forEach(gameBox => gameBox.addEventListener("click", newRound));
  }

  const roundTie = () => {
    ties += 1;
    displayController.displayTies(ties);
    gameBoxes.forEach(gameBox => gameBox.removeEventListener("click", clickHandler));
    gameBoxes.forEach(gameBox => gameBox.addEventListener("click", newRound));
  }

  const clickHandler = (event) =>{
    let currentSquare = event.path[0];
    let gameSquareID = currentSquare.id;
    let marker = currentPlayer.getMarker

    if (gameBoard.isSquareBlank(gameSquareID)){
      gameBoard.placeMarker(gameSquareID,currentPlayer.getMarker);
      displayController.placeMarker(gameSquareID, marker);

      if (gameBoard.boardFull()){
        if (gameBoard.checkPlayerWin(currentPlayer)){
          roundOver(currentPlayer)
        } else {
          roundTie();
        }

      } else {
        if (gameBoard.checkPlayerWin(currentPlayer)) {
          roundOver(currentPlayer)
        } else {
          currentPlayerNum = changePlayer(currentPlayerNum);
          currentPlayer = players[currentPlayerNum];
  
          displayController.switchPlayerHighlight(currentPlayer.getPlayerNum);
        }
      }

    } else {
      alert("Box is already taken. Please select another one")
    }
  }

  const restartGame = () => {
    currentPlayerNum = 1;
    ties = 0
    gameBoard.clearBoard();
    displayController.clearBoard();
    playerX.clearScore();
    playerO.clearScore();
    displayController.displayScore(playerX);
    displayController.displayScore(playerO);
    displayController.displayTies(ties);
    displayController.clearGameInfo();
  }

  let restartBtn = document.querySelector(".restart")
  restartBtn.addEventListener('click', restartGame)

  const newRound = () =>{
    gameBoxes.forEach(gameBox => gameBox.removeEventListener("click", newRound));
    gameBoxes.forEach(gameBox => gameBox.addEventListener("click", clickHandler));
    displayController.clearBoard();
    displayController.clearGameInfo();
    gameBoard.clearBoard();
  }

  const startGame = () =>{
    gameBoxes.forEach(gameBox => gameBox.addEventListener("click", clickHandler));
    displayController.highlightCurrentPlayer(currentPlayer.getPlayerNum);
  }

  return {
    startGame,
    newRound
  }
})();

gameFlow.startGame();
