'use strict';

// Utils functions: //

window.addEventListener('contextmenu', (e) => e.preventDefault());

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
      if (board[i][j].isMine) {
        mine = MINE;
      } else {
        mine = board[i][j].minesAroundCount;
      }

      strHTML += `<td id="cell-${i}-${j}" class="${cellClass}" onclick="cellClicked(this)" oncontextmenu="cellMarked(this)"><span class="${unvisible}">${mine}</span></td>`;
    }
    strHTML += `</tr>`;
  }
  var elBoard = document.querySelector('.board');
  elBoard.innerHTML = strHTML;
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

// function revealSafe(elCell){
//   if(gIsFirstClick) {
//     return;
//   }

// }

// function safeToClick(board) {
//   var safeClicks = [];
//   for (var i = 0; i < board.length; i++) {
//     for (var j = 0; j < board[0].length; j++) {
//       if (gBoard[i][j].isMine) {
//         continue;
//       } else {
//         safeClicks.push({ i: i, j: j });
//       }
//     }
//   }
//   return safeClicks;
// }
