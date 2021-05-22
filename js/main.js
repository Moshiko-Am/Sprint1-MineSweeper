'use strict';

function checkGameOver() {
  gGame.shownCount = 0;
  var isWin = false;
  var needToShow = gLevels[currLevel].needToShow; // Setting the variable of the 'need to show' counter
  gGame.shownCount = checkShownCount(); // counting the shown cells
  var minesCount = 0; // reseting the mines count of the current level
  gGame.markedCount = 0; // reseting the marked count of the current level
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      // looping through the board to check how many mines and marked cells there are
      if (gBoard[i][j].isMine) {
        minesCount++;
      }
      if (gBoard[i][j].isMarked) {
        gGame.markedCount++;
      }
    }
  }
  if (
    (gGame.shownCount === needToShow && minesCount === gGame.markedCount) || // checking the victory condition
    gGame.shownCount + minesCount === gBoard.length ** 2
  ) {
    isWin = true;
    gGame.isOn = false;
    gGame.isOn = false;
  }
  return isWin;
}

function cellMarked(elCell) {
  var cellId = getIdtoPos(elCell.id);
  var location = gBoard[cellId.i][cellId.j];
  var elSpan = document.querySelector(`#cell-${cellId.i}-${cellId.j} span`);

  if (!gGame.isOn) {
    return;
  }

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
  var isWin = checkGameOver();
  if (isWin) {
    var elSmiley = document.querySelector('.smiley');
    gWinSound.play();

    console.log('win');
    clearInterval(gTimeInterval);
    gTimeInterval = null;
    elSmiley.innerText = '😎';
  }
}

function cellClicked(elCell, i, j) {
  var cellId = getIdtoPos(elCell.id);
  var location = gBoard[cellId.i][cellId.j];
  var elTd = document.querySelector(`#cell-${+cellId.i}-${+cellId.j}`);
  var elSpan = document.querySelector(`#cell-${cellId.i}-${cellId.j} span`);
  var elSmiley = document.querySelector('.smiley');
  var minesCount = gLevels[currLevel].mines;

  if (!gGame.isOn) {
    return;
  }

  if (location.isMarked) {
    return;
  }

  if (gIsFirstClick) {
    gIsFirstClick = false;
    gGame.isOn = true;
    location.isShown = true;

    getTime();

    for (var i = 0; i < gBoard.length; i++) {
      for (var j = 0; j < gBoard[i].length; j++) {
        if (i === +cellId.i && j === +cellId.j) {
          // looping the board after first click to get the empty positions for the mines
          continue;
        } else {
          gEmptyPositions.push({ i: i, j: j });
        }
      }
    }
    shuffle(gEmptyPositions);
    addMines(minesCount, gEmptyPositions);
    setMinesNegs(gBoard);
    elCell.classList.add('revealed');
    renderBoard(gBoard);
  } else {
    location.isShown = true;
  }

  if (gIsHintTurn) {
    // checking to see if it's a hint turn - and allow to show hints(negs)
    gHints--;
    if (gHints === 0) {
      var elModal = document.querySelector('.hints-modal');
      elModal.style.opacity = 1;
      elModal.innerText = 'No more hints...';
      setTimeout(function () {
        elModal.style.opacity = 0;
      }, 1000);
    }
    hintNegs(i, j, false);
    setTimeout(function () {
      hintNegs(i, j, true);
    }, 1000);
    gIsHintTurn = false;
    return;
  }

  if (location.minesAroundCount === ' ') {
    // expanding the negs with recursion
    expandNegs(+cellId.i, +cellId.j, gBoard);
  }

  if (!location.isMine) {
    elSpan.classList.remove('hidden');
    elTd.classList.add('revealed');
    location.isShown = true;
  }
  if (location.isMine) {
    gLives--;
    updateLives();
    if (gLives > 0) {
      elSpan.classList.remove('hidden');
      elTd.classList.add('revealed');
      gMineSound.play();
      elSmiley.innerText = '😨';

      setTimeout(function () {
        elSpan.classList.add('hidden');
        elTd.classList.remove('revealed');
        location.isShown = false;
        elSmiley.innerText = '🤩';
        return;
      }, 700);
    } else {
      gGame.isOn = false;
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
    // if all conditions have passed - win the game
    gWinSound.play();
    console.log('win');

    clearInterval(gTimeInterval);
    gTimeInterval = null;
    elSmiley.innerText = '😎';
    return;
  }
}

function addMines(count, position) {
  count = gLevels[currLevel].mines;
  for (var i = 0; i < count; i++) {
    // putting mines on the field in relation to the level mines count
    var rndIdx = getRandomInt(0, position.length - 1);
    gBoard[position[rndIdx].i][position[rndIdx].j].isMine = true;
  }
}

function revealMines() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      var elTd = document.querySelector(`#cell-${i}-${j}`);
      var elSpan = document.querySelector(`#cell-${i}-${j} span`); // if game is over - reveal all the mines on the field
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
      // looping through the board to see how many cells are shown
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
      // checking for mines negs for the count
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
      if (j < 0 || j >= board[i].length) continue; // looping through the negs to get the negs count
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
      var elTd = document.querySelector(`#cell-${i}-${j}`);
      var elSpan = document.querySelector(`#cell-${i}-${j} span`);
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
        if (board[i][j].isMarked) {
          board[i][j].isMarked = false;
          gGame.markedCount--;
          elSpan.innerText = board[i][j].isMine
            ? MINE
            : board[i][j].minesAroundCount;
        }
        elTd.classList.add('revealed');
        elSpan.classList.remove('hidden');
      }
      if (board[i][j].minesAroundCount === ' ') {
        // opening the negs cells with recursion if the cells are empty (up until there is mine neg)
        expandNegs(i, j, board);
      }
    }
  }
}

function updateLives() {
  if (gLives === 3) {
    gLifeBottom.style.visibility = 'visible';
    gLifeTop.style.visibility = 'visible';
    gLifeCenter.style.visibility = 'visible'; // hard coding the lives and making them dissapear when needed
  }
  if (gLives < 3) {
    gLifeBottom.style.visibility = 'hidden';
  }
  if (gLives < 2) {
    gLifeCenter.style.visibility = 'hidden';
  }
  if (gLives < 1) {
    gLifeTop.style.visibility = 'hidden';
  }
}

function safeClicks(elBtn) {
  gSafeClicks--;
  if (!gGame.isOn) {
    return;
  }

  if (gSafeClicks <= 0) {
    var elSafeModal = document.querySelector('.safe-modal');
    elSafeModal.style.opacity = 1;
    setTimeout(function () {
      elSafeModal.style.opacity = 0;
    }, 2000);
  }
  for (var k = 0; k < 3; k++) {
    // looping 3 times as the lives count
    for (var i = 0; i < gBoard.length; i++) {
      // then looping through the board to check which is a safe cell
      for (var j = 0; j < gBoard[i].length; j++) {
        if (
          gBoard[i][j].isMine ||
          gBoard[i][j].isMarked ||
          gBoard[i][j].isShown
        ) {
          continue;
        } else {
          var elTd = document.querySelector(`#cell-${i}-${j}`);
        }
      }
    }
  }
  elTd.classList.add('safe-to-click');
  setTimeout(function () {
    elTd.classList.remove('safe-to-click');
  }, 1500);

  elBtn.style.visibility = 'hidden'; // hiding the button after it's clicked
}

function useHints(elBtn) {
  if (gIsFirstClick) {
    var elModal = document.querySelector('.hints-modal');
    elModal.style.opacity = 1;
    setTimeout(function () {
      elModal.style.opacity = 0;
    }, 2000);
    return;
  }

  if (!gIsHintTurn) {
    gIsHintTurn = true;
    elBtn.style.visibility = 'hidden'; // when allowd, open the option to allow seeing the negs of the cell
  } else {
    return;
  }
}

function hintNegs(cellI, cellJ, toHide) {
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      var elSpan = document.querySelector(`#cell-${i}-${j} span`); // looping through the field negs to allow cells to be shown/not shown
      var elTd = document.querySelector(`#cell-${i}-${j}`);
      if (j < 0 || j >= gBoard[i].length) continue;

      if (!elTd.classList.contains('revealed') && !gBoard[i][j].isMarked) {
        gBoard[i][j].isShown = !toHide ? true : false; // checking the condition to know which cell we need to stop showing

        if (toHide) {
          elSpan.classList.add('hidden');
        } else {
          elSpan.classList.remove('hidden');
        }
      }
    }
  }
}
