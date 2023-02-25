let difficultyButton = document.querySelector("#difficultyBox");
let restartButton = document.querySelector("#restartBox");

difficultyButton.addEventListener('click', () => {
    if(gameDifficulty == 40){
        difficultyButton.innerText = "Hard";
        gameDifficulty = 60;
    }
    else if(gameDifficulty == 60){
        difficultyButton.innerText = "Harder";
        gameDifficulty = 80;
    }
    else if(gameDifficulty == 80){
        difficultyButton.innerText = "Normal";
        gameDifficulty = 40;
    }
    bombCounter = gameDifficulty;
    realBombCounter = gameDifficulty;
});

restartButton.addEventListener('click', () => {
    bombCounter = gameDifficulty;
    realBombCounter = gameDifficulty;
    document.querySelector("#counterBomb").innerText = bombCounter;
    firstStroke = true;
    clearInterval(timeCounter);
    clearPlayArea();
    addDivToArea();
    addBombs();
    assingBombNumber();
    let b =0;
    for(let i=0; i<256;){
        i++;
        if(TILE_STATUS.get(i) == 10){
            b += 1;
        }
    }
    console.log(b);
    youLoseSing.style.display = "none";
});


