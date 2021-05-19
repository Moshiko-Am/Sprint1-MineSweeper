'use strict';

// Utils functions: //

window.addEventListener('contextmenu', (e) => e.preventDefault());

gBoard = buildBoard(4);
console.log(gBoard);

renderBoard(gBoard);

function buildBoard(size) {
  var board = [];
  for (var i = 0; i < size; i++) {
    board[i] = [];
    for (var j = 0; j < size; j++) {
      board[i][j] = {
        minesAroundCount: null,
        isShown: false,
        isMine: false,
        isMarked: false,
      };
    }
  }
  board[getRandomInt(0, size - 1)][getRandomInt(0, size - 1)].isMine = true;
  board[getRandomInt(0, size - 1)][getRandomInt(0, size - 1)].isMine = true;

  return board;
}

function renderBoard(board) {
  var strHTML = '';
  for (var i = 0; i < board.length; i++) {
    strHTML += `<tr>`;
    for (var j = 0; j < board[i].length; j++) {
      var cellClass = getClassName({ i: i, j: j });
      var unvisible = board[i][j].isShown ? '' : 'hidden';
      var mine;
      if (board[i][j].isMine === true) {
        mine = MINE;
      } else {
        board[i][j].minesAroundCount = getMinesNegsCount(i, j, board);
        mine = board[i][j].minesAroundCount;
      }

      strHTML += `<td id="cell-${i}-${j}" class="${cellClass}" onclick="cellClicked(this)" oncontextmenu="cellMarked(this)"><span class="${unvisible}">${mine}</span></td>`;
    }
    strHTML += `</tr>`;
  }
  var elBoard = document.querySelector('.board');
  elBoard.innerHTML = strHTML;
}
function checkGameOver() {
  var needToShow = gLevels[0].needToShow; // 14
  var shownCount = checkShownCount(); // counting the shown cells
  var minesCount = 0;
  var markedCount = 0;
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      if (gBoard[i][j].isMine) {
        minesCount++;
      }
      if (gBoard[i][j].isMine && gBoard[i][j].isMarked) {
        markedCount++;
      }
    }
  }
  if (shownCount === needToShow && minesCount === markedCount) {
    console.log('win');
    gGame.isOn = false;
  }
}

function cellMarked(elCell) {
  var cellId = getIdtoPos(elCell.id);
  var location = gBoard[cellId.i][cellId.j];
  var elSpan = document.querySelector(`.cell-${cellId.i}-${cellId.j} span`);

  if (location.isShown) {
    return;
  }

  if (!location.isMarked) {
    location.isMarked = true;
    elSpan.classList.remove('hidden');
    elSpan.innerText = FLAG;
  } else {
    location.isMarked = false;
    elSpan.classList.add('hidden');
    elSpan.innerText = location.isMine ? MINE : location.minesAroundCount;
  }
  console.log(gBoard);
  checkGameOver();
}

function cellClicked(elCell) {
  var cellId = getIdtoPos(elCell.id);
  var location = gBoard[cellId.i][cellId.j];
  var elTd = document.querySelector(`.cell-${cellId.i}-${cellId.j}`);

  var elSpan = document.querySelector(`.cell-${cellId.i}-${cellId.j} span`);

  if (location.isMarked) {
    return;
  }

  if (!location.isMine) {
    elSpan.classList.remove('hidden');
    elTd.classList.add('revealed');
    location.isShown = true;
  } else if (location.isMine) {
    elSpan.classList.remove('hidden');
    elTd.classList.add('revealed');
    location.isShown = true;
    location.isMine = true;
    console.log('Mine!!!');
  }
  checkShownCount();
  checkGameOver();
}

function checkShownCount() {
  var count = 0;
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      if (!gBoard[i][j].isShown) {
        continue;
      }
      count++;
    }
  }
  return count;
}

function getIdtoPos(id) {
  var id = id.split('-');
  var pos = {
    i: id[1],
    j: id[2],
  };
  return pos;
}

function getMinesNegsCount(cellI, cellJ, board) {
  var negsCount = '';
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i === cellI && j === cellJ) continue;
      if (j < 0 || j >= board[i].length) continue;
      if (board[i][j].isMine) {
        negsCount++;
      }
    }
  }
  return negsCount;
}

function renderCell(location, value) {
  var cellSelector = '.' + getClassName(location);
  var elCell = document.querySelector(cellSelector);
  elCell.innerHTML = value;
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
