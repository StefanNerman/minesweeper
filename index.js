const gameScreen = document.querySelector("#gameGameScreen");
const youLoseSing = document.querySelector("#loseSing");
let PLAY_AREA = new Map();
let TILE_STATUS = new Map();
let timeBoard = document.querySelector("#timeBox");
let gameDifficulty = 60;
let timerMin;
let timerSec;
let timerMill;
let timeCounter;
let firstStroke = false;
let bombGeneratorArray;
let bombCounter = 60;
let realBombCounter = 60;
let highScoreMin;
let highScoreSec;
let highScoreMil;


addDivToArea();
function addDivToArea(){
	for(let i = 0; i < 16;){
		i++
		for(let j=0; j<16;){
			j++
			let temp = {
				tileDiv: document.createElement("div"),
				isFlagged: false,	
				tileID: XYC(i, j),
				painted: false		
			};
			temp.tileDiv.classList.add('gameTiles');
			temp.tileDiv.addEventListener('mouseup', (e) => {clickOnTile(temp, e)});
			temp.tileDiv.addEventListener('contextmenu', (e) => {e.preventDefault()});
			document.querySelector("#long"+i).append(temp.tileDiv);
			PLAY_AREA.set(XYC(i, j), temp);						
		}
	}
}
function clickOnTile(temp, e){
	if(e.button == 0) leftClickOnTile(temp)					
	if(e.button == 2 & !temp.painted){
		if(!temp.isFlagged){
			bombCounter -= 1;
			document.querySelector("#counterBomb").innerText = bombCounter;
			let flag = document.createElement('div');
			flag.classList.add("shit");
			temp.tileDiv.append(flag);
			temp.isFlagged = true;
			if(TILE_STATUS.get(temp.tileID) != 10 & temp.tileDiv.innerText>0){
				flag.style.transform = "translateY(-500%)";
			}
			if(TILE_STATUS.get(temp.tileID) == 10){
				realBombCounter--;
			}
			if(TILE_STATUS.get(temp.tileID) == 10 & realBombCounter == 0){
				youLoseSing.style.display = "block";
				youLoseSing.style.color = "green";
				youLoseSing.innerText = "YOU WIN";
				document.cookie = "minehigh="+timerMin+":"+timerSec+":"+timerMill+"; expires=Fri, 18 September 2099 11:00:00 UTC; path=/";
			}
		}
		else{
			bombCounter += 1;
			document.querySelector("#counterBomb").innerText = bombCounter;
			temp.tileDiv.removeChild(temp.tileDiv.lastChild);
			temp.isFlagged = false;
			if(TILE_STATUS.get(temp.tileID) == 10){
				realBombCounter++;
			}
		}
	}	
}
function leftClickOnTile(temp){
	if(firstStroke) firstClick(temp)	
	if(TILE_STATUS.get(temp.tileID) == 10){
		temp.tileDiv.style.backgroundColor = "rgb(250, 0, 0)";
		youLoseSing.style.display = "block";
		youLoseSing.innerText = "YOU LOSE";
	}
	else{assingTile(temp.tileID);}
}
function firstClick(temp){
	startGameTimer()
	firstStroke = false;
	if(TILE_STATUS.get(temp.tileID) == 10){
		TILE_STATUS.set(temp.tileID, 0);
		bombGeneratorArray.forEach(element => {
			if(element == temp.tileID) bombGeneratorArray.splice(bombGeneratorArray.indexOf(element), 1);			
		});
		firstClickOnBomb();
	}
}
function startGameTimer(){
	clearInterval(timeCounter);
	timerMin=0;
	timerSec=0;
	timerMill=0;
	timeCounter = setInterval(timerFunction, 100);
}
getCookie();
function getCookie(){
	let cDecoded = decodeURIComponent(document.cookie);
	let cArray = cDecoded.slice(9, cDecoded.length+1).split(":");
	highScoreMin = cArray[0];
	highScoreSec = cArray[1];
	highScoreMil = cArray[2];
	if(cArray[0] == undefined){
		highScoreMin = 0;
		highScoreSec = 0;
		highScoreMil = 0;
	}
	document.querySelector("#highScoreBox").innerText = "best time: "+highScoreMin+":"+highScoreSec+":"+highScoreMil;
}


function addBombs(){
	for(let i = 1; i<256;){
		i++;
		TILE_STATUS.set(i, 0);
	}

	bombGeneratorArray = [];
	for(let i=0; i<gameDifficulty;){
		i++;
		let temp = XYC(Math.floor(Math.random()*16+1), Math.floor(Math.random()*16+1));
		for(let x = 0; x<gameDifficulty;){
			if(bombGeneratorArray[x] == temp){
				x=-1;
				temp = XYC(Math.floor(Math.random()*16+1), Math.floor(Math.random()*16+1));
			}
			x++;
		}
		bombGeneratorArray.push(temp);
	}
	bombGeneratorArray.forEach(element => {
		TILE_STATUS.set(element, 10);
		//PLAY_AREA.get(element).tileDiv.style.backgroundColor = "rgb(0,0,0)";
	});
}

function assingBombNumber(){
	for(let id=0;id<256;){
		id++;
		let tempTile = TILE_STATUS.get(id);
		let bombsNear = 0;
		let checkUL = true;let checkU = true;let checkUR = true;let checkR = true;
		let checkDR = true;let checkD = true;let checkDL = true;let checkL = true;
		if(tempTile != 10){
			if(NTX(id) == 1){
				checkUL = false;
				checkDL = false;
				checkL = false;
			}
			if(NTX(id) == 16){
				checkUR = false;
				checkR = false;
				checkDR = false;
			}
			if(NTY(id) == 1){
				checkUL = false;
				checkU = false;
				checkUR = false;
			}
			if(NTY(id) == 16){
				checkDL = false;
				checkD = false;
				checkDR = false;
			}	

			if(checkUL){
				if(TILE_STATUS.get(XYC(NTX(id)-1, NTY(id))-1) == 10){
					bombsNear += 1;
				}
			}
			if(checkU){
				if(TILE_STATUS.get(XYC(NTX(id), NTY(id)-1)) == 10){
					bombsNear += 1;
				}
			}
			if(checkUR){
				if(TILE_STATUS.get(XYC(NTX(id)+1, NTY(id)-1)) == 10){
					bombsNear += 1;
				}
			}
			if(checkR){
				if(TILE_STATUS.get(XYC(NTX(id)+1, NTY(id))) == 10){
					bombsNear += 1;
				}
			}
			if(checkDR){
				if(TILE_STATUS.get(XYC(NTX(id)+1, NTY(id)+1)) == 10){
					bombsNear += 1;
				}
			}
			if(checkD){
				if(TILE_STATUS.get(XYC(NTX(id), NTY(id)+1)) == 10){
					bombsNear += 1;
				}
			}
			if(checkDL){
				if(TILE_STATUS.get(XYC(NTX(id)-1, NTY(id)+1)) == 10){
					bombsNear += 1;
				}
			}
			if(checkL){
				if(TILE_STATUS.get(XYC(NTX(id)-1, NTY(id))) == 10){
					bombsNear += 1;
				}
			}
			
			TILE_STATUS.set(id, bombsNear);
		}
	}
}

function assingTile(id){
	let tempTile = TILE_STATUS.get(id);		
	if(tempTile == 0){
		let nearbyZeros = [id];
		for(let i=0; i<nearbyZeros.length;){
			let zeroID = nearbyZeros[i];
			let x = NTX(zeroID);
			let y = NTY(zeroID);
			let check1 = true;let check2 = true;let check3 = true;let check4 = true;
			let check5 = true;let check6 = true;let check7 = true;let check8 = true;		
			i++;
			
			if(x == 1){
				check1 = false;
				check7 = false;
				check8 = false;
			}
			if(x == 16){
				check3 = false;
				check4 = false;
				check5 = false;
			}
			if(y == 1){
				check1 = false;
				check2 = false;
				check3 = false;
			}
			if(y == 16){
				check5 = false;
				check6 = false;
				check7 = false;
			}
			if(check1 & TILE_STATUS.get(XYC(x-1, y-1)) == 0){
				if(!nearbyZeros.includes(XYC(x-1, y-1))){
					nearbyZeros.push(XYC(x-1, y-1));	
				}
			}
			if(check2 & TILE_STATUS.get(XYC(x, y-1)) == 0){
				if(!nearbyZeros.includes(XYC(x, y-1))){
					nearbyZeros.push(XYC(x, y-1));	
				}
			}
			if(check3 & TILE_STATUS.get(XYC(x+1, y-1)) == 0){
				if(!nearbyZeros.includes(XYC(x+1, y-1))){
					nearbyZeros.push(XYC(x+1, y-1));	
				}
			}
			if(check4 & TILE_STATUS.get(XYC(x+1, y)) == 0){
				if(!nearbyZeros.includes(XYC(x+1, y))){
					nearbyZeros.push(XYC(x+1, y));	
				}
			}
			if(check5 & TILE_STATUS.get(XYC(x+1, y+1)) == 0){
				if(!nearbyZeros.includes(XYC(x+1, y+1))){
					nearbyZeros.push(XYC(x+1, y+1));	
				}
			}
			if(check6 & TILE_STATUS.get(XYC(x, y+1)) == 0){
				if(!nearbyZeros.includes(XYC(x, y+1))){
					nearbyZeros.push(XYC(x, y+1));	
				}
			}
			if(check7 & TILE_STATUS.get(XYC(x-1, y+1)) == 0){
				if(!nearbyZeros.includes(XYC(x-1, y+1))){
					nearbyZeros.push(XYC(x-1, y+1));	
				}
			}
			if(check8 & TILE_STATUS.get(XYC(x-1, y)) == 0){
				if(!nearbyZeros.includes(XYC(x-1, y))){
					nearbyZeros.push(XYC(x-1, y));	
				}
			}
		}
		nearbyZeros.forEach(e => {
			paintNumberTile(0, e);
			let x = NTX(e);
			let y = NTY(e);
			if(x>1 & y>1){
				paintNumberTile(TILE_STATUS.get(XYC(x-1, y-1)), XYC(x-1, y-1))
			}
			if(y>1){
				paintNumberTile(TILE_STATUS.get(XYC(x, y-1)), XYC(x, y-1))
			}
			if(x<16 & y>1){
				paintNumberTile(TILE_STATUS.get(XYC(x+1, y-1)), XYC(x+1, y-1))
			}
			if(x<16){
				paintNumberTile(TILE_STATUS.get(XYC(x+1, y)), XYC(x+1, y))
			}
			if(x<16 & y<16){
				paintNumberTile(TILE_STATUS.get(XYC(x+1, y+1)), XYC(x+1, y+1))
			}
			if(y<16){
				paintNumberTile(TILE_STATUS.get(XYC(x, y+1)), XYC(x, y+1))
			}
			if(x>1 & y<16){
				paintNumberTile(TILE_STATUS.get(XYC(x-1, y+1)), XYC(x-1, y+1))
			}
			if(x>1){
				paintNumberTile(TILE_STATUS.get(XYC(x-1, y)), XYC(x-1, y))
			}
		});	
	}
	paintNumberTile(tempTile, id);
}

function paintNumberTile(tileStatus, id){
	let tempTileDiv = PLAY_AREA.get(id).tileDiv;
	if(tileStatus == 1){
		tempTileDiv.style.color = "blue";
	}
	if(tileStatus == 2){
		tempTileDiv.style.color = "green";
	}
	if(tileStatus == 3){
		tempTileDiv.style.color = "red";
	}
	if(tileStatus == 4){
		tempTileDiv.style.color = "darkblue";
	}
	if(tileStatus == 5){
		tempTileDiv.style.color = "darkred";
	}
	if(tileStatus == 6){
		tempTileDiv.style.color = "violet";
	}	
	if(tileStatus == 7){
		tempTileDiv.style.color = "cyan";
	}

	if(tileStatus != 0){
		tempTileDiv.innerText = tileStatus;
		tempTileDiv.style.backgroundColor = "rgb(160,160,160)";
	}
	else{
		tempTileDiv.style.backgroundColor = "rgb(160,160,160)";
	}
	PLAY_AREA.get(id).painted = true;
}

function clearPlayArea(){
	for(let i=0;i<16;){
		i++;
		while (document.querySelector("#long"+i).hasChildNodes()) {
			document.querySelector("#long"+i).removeChild(document.querySelector("#long"+i).firstChild);
   		}
	}
}

function timerFunction(){
	timerMill += 1;
	if(timerMill == 10){
		timerMill = 0;
		timerSec += 1;
	}
	if(timerSec == 60){
		timerSec = 0;
		timerMin += 1;
	}
	timeBoard.innerText = "Time: "+timerMin+"-"+timerSec+"."+timerMill;
}

function firstClickOnBomb(){
	let temp = XYC(Math.floor(Math.random()*16+1), Math.floor(Math.random()*16+1));
	for(let x = 0; x<gameDifficulty;){
		if(bombGeneratorArray[x] == temp){
			x=-1;
			temp = XYC(Math.floor(Math.random()*16+1), Math.floor(Math.random()*16+1));
		}
		x++;
	}
	bombGeneratorArray.push(temp);
	TILE_STATUS.set(temp, 10);
	PLAY_AREA.get(temp).tileDiv.style.backgroundColor = "rgb(0,0,0)";
	for(let i=0;i<256;){
		i++
		let tempTile = PLAY_AREA.get(i).tileDiv;
		tempTile.innerText = "";
		tempTile.style.backgroundColor = "gray";
	}
	bombGeneratorArray.forEach(element => {
		TILE_STATUS.set(element, 10);
	});
	assingBombNumber();
}


function XYC(x, y){
    return 16*(x-1) + y;
}
function NTX(num) {
	let x = 1;	
	while(num > 16) {	
		num -= 16;	
		x += 1;	
	}
	return x;
}
function NTY(num) {
	num = num % 16;
	if(num == 0){
		num = 16;
	}
	return num;
}

