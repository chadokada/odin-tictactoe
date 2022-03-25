
const gameBoard = (() => {
  let gameArray = new Array(9);
  let horizontalWins = [0, 3, 6].map( i => { return[i, i+1, i+2] } )
  let verticalWins = [0, 1, 2].map(i => { return [ i, i+3, i+6 ] } )
  let diagonalWins = [ [0, 4, 8], [2, 4, 6] ]; 

  const viewBoard = () => {
    let gameArrayClone = [...gameArray];
    return gameArrayClone
  }

  const isSquareBlank = (gameSquare) => {
    return gameArray[gameSquare] == undefined;
  }

  const placeMarker = (gameSquare, marker) =>{
    if (isSquareBlank(gameSquare)){
      gameArray[gameSquare] = marker;
    }
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
    isSquareBlank,
    placeMarker,
    checkPlayerWin
  }
})();

const displayController = (() => {
  let gameInfo = document.querySelector(".game-info");

  const placeMarker = (gameSquareID, marker) => {
    gameSquareDiv = document.getElementById(`${gameSquareID}`);
    gameSquareDiv.innerHTML = marker;
  }

  const displayCurrentPlayer = (currentPlayerName) => {
    gameInfo.innerHTML = `Now Playing: ${currentPlayerName}`;
  }
  return {
    placeMarker,
    displayCurrentPlayer
  }
})();

const Player = (marker) => {
  const getName = `Player ${marker}`;
  const getMarker = marker;
  return {
    getName, 
    getMarker
  }
}

const gameFlow = (() => {
  let gameOver = false;
  let gameWinner = "";
  const playerX = Player("X");
  const playerO = Player("O");
  const players = [playerX, playerO];
  let currentPlayerNum = 0;
  let currentPlayer = players[currentPlayerNum];
  let gameBoxes = document.querySelectorAll(".board-box");
  
  const changePlayer = (currentPlayerNum) => {
    return (currentPlayerNum == 1 ? 0 : 1);
  }

  const clickHandler = (event) =>{
    let currentSquare = event.path[0];
    let gameSquareID = currentSquare.id;
    let marker = currentPlayer.getMarker;

    if (gameBoard.isSquareBlank(gameSquareID)){
      gameBoard.placeMarker(gameSquareID,currentPlayer.getMarker);
      displayController.placeMarker(gameSquareID, marker);

      console.log(gameBoard.checkPlayerWin(currentPlayer))

      currentPlayerNum = changePlayer(currentPlayerNum);
      currentPlayer = players[currentPlayerNum];
      displayController.displayCurrentPlayer(currentPlayer.getName);
  
    } else {
      alert("Box is already taken. Please select another one")
    }
  }

  const initializeGame = () =>{
    gameBoxes.forEach(gameBox => gameBox.addEventListener("click", clickHandler));
    displayController.displayCurrentPlayer(currentPlayer.getName)
    console.log("lets rumble bitch")

  }

  return {initializeGame, gameBoxes, clickHandler}
})();


gameFlow.initializeGame();




