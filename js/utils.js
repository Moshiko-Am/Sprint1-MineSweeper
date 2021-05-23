'use strict';

// Utils functions: //

window.addEventListener('contextmenu', (e) => e.preventDefault());

function buildBoard(size) {
  var board = [];
  for (var i = 0; i < size; i++) {
    board[i] = [];
    for (var j = 0; j < size; j++) {
      // creating a board according to the size of the gLevel
      board[i][j] = {
        minesAroundCount: null,
        isShown: false,
        isMine: false,
        isMarked: false,
      };
    }
  }

  return board;
}

function renderBoard(board) {
  var strHTML = '';
  for (var i = 0; i < board.length; i++) {
    strHTML += `<tr>`;
    for (var j = 0; j < board[i].length; j++) {
      var cellClass = board[i][j].isShown ? 'revealed' : ''; // giving the cells a different bgc according to the isShown parameter
      var unvisible = board[i][j].isShown ? '' : 'hidden'; // giving the spans a different style according to the isShown parameter
      var mine;
      if (board[i][j].isMine) {
        mine = MINE;
      } else {
        mine = board[i][j].minesAroundCount;
      }

      strHTML += `<td id="cell-${i}-${j}" class="${cellClass}" onclick="cellClicked(this, ${i},${j})" oncontextmenu="cellMarked(this)"><span class="${unvisible}">${mine}</span></td>`;
    }
    strHTML += `</tr>`;
  }
  var elBoard = document.querySelector('.board');
  elBoard.innerHTML = strHTML;
}

function resetAids() {
  // reseting the game when init from one function (controlling all the needed properties for a new game)
  var elSafes = document.querySelectorAll('.safe');
  var elHints = document.querySelectorAll('.hint');
  var elTime = document.querySelector('.time h3');
  var elSmiley = document.querySelector('.smiley');
  var elHintsModal = document.querySelector('.hints-modal');
  elHintsModal.innerText = 'Hints are not allowed at first click...';
  gEmptyPositions = [];
  for (var i = 0; i < elSafes.length; i++) {
    elSafes[i].style.visibility = 'visible';
    elHints[i].style.visibility = 'visible';
  }
  gLifeTop.style.visibility = 'visible';
  gLifeCenter.style.visibility = 'visible';
  gLifeBottom.style.visibility = 'visible';
  gSafeClicks = 3;
  gLives = 3;
  elSmiley.innerText = '🤩';
  elTime.innerText = '0.000';
  clearInterval(gTimeInterval);
  gTimeInterval = null;
  gIsFirstClick = true;
  gIsHintTurn = false;
}

function instructionsModal() {
  var elModal = document.querySelector('.instructions');
  var elBtnOpen = document.querySelector('.btn-open');
  elBtnOpen.style.display = 'block';
  elModal.style.display = 'none';
}

function openInstructions() {
  var elModal = document.querySelector('.instructions');
  var elBtnOpen = document.querySelector('.btn-open');
  elModal.style.display = 'block';
  elBtnOpen.style.display = 'none';
}

function getIdtoPos(id) {
  var id = id.split('-');
  var pos = {
    i: id[1],
    j: id[2],
  };
  return pos;
}

function getClassName(location) {
  var cellClass = 'cell-' + location.i + '-' + location.j;
  return cellClass;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getTime() {
  var elTime = document.querySelector('.time h3');
  var startTime = Date.now();
  gTimeInterval = setInterval(function () {
    var time = (Date.now() - startTime) / 1000;
    time = parseFloat(time).toFixed(3);
    elTime.innerText = time;
  }, 100);
}

function shuffle(items) {
  var randIdx, keep, i;
  for (i = items.length - 1; i > 0; i--) {
    randIdx = getRandomInt(0, items.length - 1);

    keep = items[i];
    items[i] = items[randIdx];
    items[randIdx] = keep;
  }
  return items;
}
