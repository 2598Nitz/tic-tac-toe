const players = (nameVar) =>{

    let name = nameVar;
    const displayTurn = () =>{
        let turnDiv = document.querySelector("#display-turn");
        turnDiv.innerHTML = `${name}'s turn`;
        console.log(turnDiv);
    }

    return {name,displayTurn};
};

let playerOne = players("player1");
let playerTwo = players("player2");

const gameBoard = (()=>{

    let states = [' ',' ',' ',' ',' ',' ',' ',' ',' '];
    let playerOneTurn = false;

    let winningCombo = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ]

    
    const checkGameStatus = () => {
        

        let result = ['draw',-1];

       

        for(let i = 0; i < winningCombo.length; i++)
        {
            if(states[winningCombo[i][0]] === states[winningCombo[i][1]] &&
                 states[winningCombo[i][1]] === states[winningCombo[i][2]])
            {
                if(states[winningCombo[i][0]] === 'X' || states[winningCombo[i][0]] === 'O')
                {
                    result[0] = 'win';
                    result[1] = i;
                    return result;
                }
            }
        }

        //check for draw.Logic: Each grid item is filled.

        for(let i = 0; i < states.length; i++)
        {
            if(states[i] === ' ')
            {
                result[0] = 'inProgress';
                return result;
            }
        }
        
        return result;
    }

    function resetEverything(e)
    {
        states = [' ',' ',' ',' ',' ',' ',' ',' ',' '];
        for(let i = 0; i < states.length; i++)
        {
            let grid = document.querySelector("div[data-index='"+i+"']");
            grid.innerHTML = "";
            grid.style.backgroundColor = "white";
        }
        playerOneTurn = false;
        let displayDiv = document.querySelector('#display-turn');
        displayDiv.innerHTML = "";

        let endModal = document.querySelector("#endModal");
        endModal.style.display = "none";

        let gameModeModal = document.querySelector("#gameModeModal");
        gameModeModal.style.display = "block";
    }

    const renderWin = (index,winner) =>{
        for(let i = 0; i < states.length; i++)
        {
            let grid = document.querySelector("div[data-index='"+i+"']");
            grid.innerHTML = states[i];
        }

        for(let i = 0; i < 3; i++)
        {
            let grid = document.querySelector("div[data-index='"+winningCombo[index][i]+"']");
            if(grid.innerHTML === 'X')
            {
                grid.style.backgroundColor = "rgba(214, 116, 116,0.4)";
            }
            else
            {
                grid.style.backgroundColor = "rgba(116, 116, 214,0.4)";
            }
        }


        let endModal = document.querySelector("#endModal");
        endModal.style.display = "block";

        let endDisplay = document.querySelector("#end-display");
        endDisplay.innerHTML = `Congrats ${winner} !!!`;

        let endRestartBtn = document.querySelector('.end-restart');
        endRestartBtn.addEventListener('click',resetEverything);

    }

    const renderDraw = () =>{
        for(let i = 0; i < states.length; i++)
        {
            let grid = document.querySelector("div[data-index='"+i+"']");
            grid.innerHTML = states[i];
        }

        let endModal = document.querySelector("#endModal");
        endModal.style.display = "block";

        let endDisplay = document.querySelector("#end-display");
        endDisplay.innerHTML = `Match resulted in a draw`;

        let endRestartBtn = document.querySelector('.end-restart');
        endRestartBtn.addEventListener('click',resetEverything);
    }
    const markOnBoard = (e) => {
        let grid = e.target;
        if(grid.innerHTML === 'X' || grid.innerHTML === 'O')
        {
            return;
        }

        if(playerOneTurn)
        {
            grid.innerHTML = 'X';
            grid.style.color = "red";
            states[parseInt(grid.dataset.index)] = 'X';
        }
        else
        {
            grid.innerHTML = 'O';
            grid.style.color = "blue";
            states[parseInt(grid.dataset.index)] = 'O';
        }

        let result = checkGameStatus();
        console.log(result);
        if(result[0] === 'inProgress')
        {
            //switch user turn and display it
            playerOneTurn = !playerOneTurn;
            renderUI(false,playerOneTurn);
        }
        else if(result[0] === 'win')
        {
            //display win for current player
            //go to game mode option
            let winner = playerOneTurn?playerOne.name:playerTwo.name;
            renderWin(result[1],winner);
            
        }
        
        else
        {
            //display draw
            //game mode option
            renderDraw();

        }

    }
    const renderUI = (listenToClick = false,pt) =>{

        playerOneTurn = pt;
        
        for(let i = 0; i < states.length; i++)
        {
            let grid = document.querySelector("div[data-index='"+i+"']");
            if(listenToClick)
            {
                grid.addEventListener('click',markOnBoard);
            }
            grid.innerHTML = states[i];
        }

        
        if(playerOneTurn)
        {
            playerOne.displayTurn();
        }
        else
        {
            playerTwo.displayTurn();
        }
        
    };

    return {renderUI,resetEverything};
})();

const gameControl = (() => {


    function gameMode()
    {   
        let restartBtn = document.querySelector('.restart');
        restartBtn.addEventListener('click',gameBoard.resetEverything);

        let multiPlayerBtn = document.querySelector("#users");
        multiPlayerBtn.addEventListener('click',(e) =>{

            console.log('clicked');
            let gameModeModal = document.querySelector("#gameModeModal");
            gameModeModal.style.display = "none";

            let multiPlayerModal = document.querySelector("#multiPlayerModal");
            multiPlayerModal.style.display = "block";
        })

        let startGameBtn = document.querySelector("#submit-names");

        startGameBtn.addEventListener('click',(e) =>{

            console.log('start game');

            //fetch player's names
            let p1Div = document.querySelector("#p1");
            let p2Div = document.querySelector("#p2");
            let p1Name = p1Div.value;
            let p2Name = p2Div.value;

            if(p1Div.value === "")
            {
                p1Name = "player1";
            }
            if(p2Div.value === "")
            {
                p2Name = "player2";
            }
            

            playerOne = players(p1Name);
            playerTwo = players(p2Name);

            
            playerTwo.displayTurn();
            let multiPlayerModal = document.querySelector("#multiPlayerModal");
            multiPlayerModal.style.display = "none";
            
            let listenToClick = true;
            
            gameBoard.renderUI(listenToClick,true);
        })
    }

    return {gameMode};
})();


gameControl.gameMode();





