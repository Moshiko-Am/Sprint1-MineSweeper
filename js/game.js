'use strict';

// Global variables: //
const MINE = '💣';
const FLAG = '🚩';
var gBoard;
var gEmptyPositions = [];
var currLevel;
var gTimeInterval;
var gIsFirstClick;
var gGameIsOn;
var gLives;
var gSafeClicks;
var gIsHintTurn;
var gHints;

var gMineSound = new Audio('sounds/explosion-sound.mp3');
var gWinSound = new Audio('sounds/funny-blowing-trumpet-sound-effect.mp3');
var gLose = new Audio('sounds/lose.mp3');
var gLifeTop = document.querySelector('.life-top');
var gLifeBottom = document.querySelector('.life-bottom');
var gLifeCenter = document.querySelector('.life-center');

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
};

function init(level) {
  resetAids(); // Resets all the starting aids of the game
  gHints = 3;
  currLevel = level;

  gGame.shownCount = 0;
  gGame.markedCount = 0;
  gGame.isOn = true;

  gBoard = buildBoard(gLevels[currLevel].size);
  renderBoard(gBoard);
}
