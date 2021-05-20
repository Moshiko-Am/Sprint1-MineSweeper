'use strict';

function checkGameOver() {
  var isWin = false;
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
  if (
    (shownCount === needToShow && minesCount === markedCount) ||
    shownCount === gBoard.length ** 2
  ) {
    isWin = true;
    gGame.isOn = false;
    gGameIsOn = false;
  }
  return isWin;
}

function cellMarked(elCell) {
  var cellId = getIdtoPos(elCell.id);
  var location = gBoard[cellId.i][cellId.j];
  var elSpan = document.querySelector(`.cell-${cellId.i}-${cellId.j} span`);

  if (gIsFirstClick) {
    return;
  }
  gIsFirstClick = false;

  if (location.isShown) {
    return;
  }

  if (!location.isMarked) {
    location.isMarked = true;
    elSpan.classList.remove('hidden');
    elCell.classList.add('revealed');
    elSpan.innerText = FLAG;
  } else {
    location.isMarked = false;
    elSpan.classList.add('hidden');
    elCell.classList.remove('revealed');
    elSpan.innerText = location.isMine ? MINE : location.minesAroundCount;
  }

  if (checkGameOver()) {
    var elSmiley = document.querySelector('.smiley');
    gWinSound.play();

    console.log('win');
    clearInterval(gTimeInterval);
    gTimeInterval = null;
    elSmiley.innerText = '😎';
  }
}

function cellClicked(elCell) {
  var cellId = getIdtoPos(elCell.id);
  var location = gBoard[cellId.i][cellId.j];
  var elTd = document.querySelector(`.cell-${+cellId.i}-${+cellId.j}`);
  var elSpan = document.querySelector(`.cell-${cellId.i}-${cellId.j} span`);
  var elSmiley = document.querySelector('.smiley');
  var minesCount = gLevels[currLevel].mines;

  if (!gGameIsOn) {
    return;
  }

  if (gIsFirstClick) {
    elTd.classList.add('revealed');
    elSpan.classList.remove('hidden');
    gIsFirstClick = false;
    gGame.isOn = true;
    location.isShown = true;

    getTime();

    for (var i = 0; i < gBoard.length; i++) {
      for (var j = 0; j < gBoard[i].length; j++) {
        if (i === +cellId.i && j === +cellId.j) {
          continue;
        } else {
          gEmptyPositions.push({ i: i, j: j });
        }
      }
    }
    shuffle(gEmptyPositions);
    addMines(minesCount, gEmptyPositions);
    setMinesNegs(gBoard);
    renderBoard(gBoard);
  } else {
    location.isShown = true;
    elTd.classList.add('revealed');
    elSpan.classList.remove('hidden');
  }

  if (!gGame.isOn) {
    return;
  }

  if (location.minesAroundCount === ' ') {
    expandNegs(+cellId.i, +cellId.j, gBoard);
  }

  if (location.isMarked) {
    return;
  }

  if (!location.isMine) {
    elSpan.classList.remove('hidden');
    elTd.classList.add('revealed');
    location.isShown = true;
  }
  if (location.isMine) {
    if (gLives > 1) {
      elSpan.classList.remove('hidden');
      elTd.classList.add('revealed');
      gMineSound.play();
      elSmiley.innerText = '😨';
      gLives--;
      setTimeout(function () {
        elSpan.classList.add('hidden');
        elTd.classList.remove('revealed');
        location.isShown = false;
        elSmiley.innerText = '🤩';
        return;
      }, 700);
    } else {
      gGameIsOn = false;
      elSpan.classList.remove('hidden');
      elTd.classList.add('revealed');
      location.isShown = true;
      location.isMine = true;
      if (!checkGameOver()) {
        clearInterval(gTimeInterval);
        revealMines();
        gLose.play();
        gGame.isOn = false;
        console.log('Game Over');
        elSmiley.innerText = '😭';
        return;
      }
    }
  }

  checkShownCount();
  if (checkGameOver()) {
    gWinSound.play();
    console.log('win');

    clearInterval(gTimeInterval);
    gTimeInterval = null;
    elSmiley.innerText = '😎';
    return;
  }
  updateLives();
}

function addMines(count, position) {
  count = gLevels[currLevel].mines;
  for (var i = 0; i < count; i++) {
    var rndIdx = getRandomInt(0, position.length - 1);
    gBoard[position[rndIdx].i][position[rndIdx].j].isMine = true;
  }
}

function revealMines() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      var elTd = document.querySelector(`.cell-${i}-${j}`);
      var elSpan = document.querySelector(`.cell-${i}-${j} span`);
      if (gBoard[i][j].isMine) {
        gBoard[i][j].isShown = true;
        elTd.classList.add('revealed');
        elSpan.classList.remove('hidden');
      }
    }
  }
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

function setMinesNegs(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      if (!board[i][j].isMine) {
        board[i][j].minesAroundCount = getMinesNegsCount(i, j, board);
      }
    }
  }
}

function getMinesNegsCount(cellI, cellJ, board) {
  var negsCount = 0;
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
  if (negsCount === 0) {
    negsCount = ' ';
  }
  return negsCount;
}

function expandNegs(cellI, cellJ, board) {
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      var elTd = document.querySelector(`.cell-${i}-${j}`);
      var elSpan = document.querySelector(`.cell-${i}-${j} span`);
      if (i === cellI && j === cellJ) continue;
      if (j < 0 || j >= board[i].length) continue;

      if (board[i][j].isMine) {
        continue;
      }
      if (board[i][j].isShown) {
        continue;
      } else {
        gGame.shownCount++;
        board[i][j].isShown = true;
        elTd.classList.add('revealed');
        elSpan.classList.remove('hidden');
      }
      if (board[i][j].minesAroundCount === ' ') {
        expandNegs(i, j, board);
      }
    }
  }
}

function updateLives() {
  if (gLives === 3) {
    gLifeRight.style.opacity = 1;
    gLifeLeft.style.opacity = 1;
    gLifeCenter.style.opacity = 1;
  } else if (gLives === 2) {
    gLifeRight.style.opacity = 0;
  } else if (gLives === 1) {
    gLifeCenter.style.opacity = 0;
    gLifeRight.style.opacity = 0;
    gLifeLeft.innerHTML = '❤️';
  } else if (gLives === 0) {
    gLifeCenter.style.opacity = 0;
    gLifeRight.style.opacity = 0;
    gLifeLeft.style.display = 0;
  }
}
