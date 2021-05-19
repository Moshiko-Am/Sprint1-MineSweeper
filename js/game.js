'use strict';

// Global variables: //
const MINE = '💣';
const FLAG = '🚩';
var gBoard;
var gTimeInterval = null;
var gIsFirstClick = true;

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
  var currLevel = level;
  var elTime = document.querySelector('.time h3');
  gGame.isOn = true;
  elTime.innerText = '0.000';
  gBoard = buildBoard(gLevels[currLevel].size);
  renderBoard(gBoard);
}
