
const gameBoard = (() => {
  let gameArray = ["X", "O", "X", "O", "X", "O", "X", "O", "X"]
  return {
    gameArray
  }
})();


const displayController = (() => {
  const displayGameArray = (gameArray) => {
    for (box = 0; box < gameArray.length; box++){
      gameBox = document.getElementById(`${box}`);
      gameBox.innerHTML = gameArray[box];
    }
  }
  return {
    displayGameArray
  }

})();

displayController.displayGameArray(gameBoard.gameArray)
/*
let gameBoxes = document.querySelectorAll(".board-box");
gameBoxes.forEach(gameBox => 
  gameBox.addEventListener("click", () =>{
      gameBox.innerHTML = "X";
    }
  )
);
*/
