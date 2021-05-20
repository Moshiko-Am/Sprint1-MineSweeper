'use strict';

// Global variables: //
const MINE = '💣';
const FLAG = '🚩';
var gBoard;
var gEmptyPositions = [];
var currLevel;
var gTimeInterval;
var gIsFirstClick = true;
var gGameIsOn = true;
var gLives;

var gMineSound = new Audio('sounds/explosion-sound.mp3');
var gWinSound = new Audio('sounds/funny-blowing-trumpet-sound-effect.mp3');
var gLose = new Audio('sounds/lose.mp3');
var gLifeLeft = document.querySelector('.life-left');
var gLifeRight = document.querySelector('.life-right');
var gLifeCenter = document.querySelector('.life-center');
gLifeLeft.innerText = '❤️';
gLifeCenter.innerText = '❤️';
gLifeRight.innerText = '❤️';

var gLevels = [
  {
    size: 4,
    mines: 2,
    needToShow: 4 ** 2 - 2, // 14
  },
  {
    size: 8,
    mines: 12,
    needToShow: 8 ** 2 - 12, //52
  },
  {
    size: 12,
    mines: 30,
    needToShow: 12 ** 2 - 30, //114
  },
];

var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
};

function init(level) {
  gLifeLeft.innerText = '❤️';
  gLifeCenter.innerText = '❤️';
  gLifeRight.innerText = '❤️';
  gLives = 3;
  gGameIsOn = true;
  currLevel = level;
  var elTime = document.querySelector('.time h3');
  var elSmiley = document.querySelector('.smiley');
  elSmiley.innerText = '🤩';
  clearInterval(gTimeInterval);
  gIsFirstClick = true;
  gGame.isOn = true;
  gTimeInterval = null;
  elTime.innerText = '0.000';

  gBoard = buildBoard(gLevels[currLevel].size);
  renderBoard(gBoard);
}
