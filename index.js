class Tetris {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.frameCounter = 0;
    this.boardWidth = BOARD_WIDTH;
    this.boardHeight = BOARD_HEIGHT;
    this.boardX = 0;
    this.boardY = 0;
    this.squareSide = 30; // square size
    this.canvas.width = (this.boardWidth * this.squareSide);
    this.canvas.height = (this.boardHeight * this.squareSide);
    this.score = 0;
    this.level = 1;
    
    this.clearingDelay = 40;
    this.pauseState = false;
    this.endState = false;
    this.clearLineState = false;
  
    this.scorePlaceholder = document.getElementById('game-score');
    this.nextPiecePlaceholder = document.getElementById('game-next-piece');
    this.nextPieceContainer = document.getElementById('game-next-piece-container');
    this.pausePopup = document.getElementById('game-pause-popup');
    this.endPopup = document.getElementById('game-end-popup');
    this.endText = document.getElementById('game-end-text');
    this.endPopupContainer = document.getElementById('game-end');
    this.pauseText = document.getElementById('game-pause-text');
    this.pausePopupContainer = document.getElementById('game-pause');

    this.nextPieceCtx = this.nextPiecePlaceholder.getContext('2d');
    this.nextPiecePlaceholder.width = 120;
    this.nextPiecePlaceholder.height = 80;

    this.pieces = [
      {
        id: 0,
        name: 'z',
        color: '#0074D9',
        rotation: Z_ROT,
        initialP: Z_INI_POS,
        initialN: Z_NEXT_POS 
      },
      {
        id: 1,
        name: 's',
        color: '#7FDBFF',
        rotation: S_ROT,
        initialP: S_INI_POS,
        initialN: S_NEXT_POS 
      },
      {
        id: 2,
        name: 'o',
        color: '#FFDC00',
        rotation: O_ROT,
        initialP: O_INI_POS,
        initialN: O_NEXT_POS 
      },
      {
        id: 3,
        name: 'l',
        color: '#FF4136',
        rotation: L_ROT,
        initialP: L_INI_POS,
        initialN: L_NEXT_POS  

      },
      {
        id: 4,
        name: 'j',
        color: '#85144b',
        rotation: J_ROT,
        initialP: J_INI_POS,
        initialN: J_NEXT_POS 
      },
      {
        id: 5,
        name: 't',
        color: '#3D9970',
        rotation: T_ROT,
        initialP: T_INI_POS,
        initialN: T_NEXT_POS 
      },
      {
        id: 6,
        name: 'i',
        color: '#AAAAAA',
        rotation: I_ROT,
        initialP: I_INI_POS,
        initialN: I_NEXT_POS 
      }
    ];

    this.currentPieceID = 0; 
    this.next = this._generateRandomNumber();
    this.piece = this.pieces[0];  // current piece
    this.pieceRotation = 0;               // current piece's position
    this.piecePosition = [this.piece.initialP[0] * this.squareSide, 
                          this.piece.initialP[1] * this.squareSide];
    this.shadowPiece = this.piece;
    this.shadowRotation = this.pieceRotation;
    this.shadowPosition = this.piecePosition; 

     
        
  
    this.board = [];
    for (let i = 0; i < this.boardHeight + 2; i++) {
      const row = [];
      for (let j = 0; j < this.boardWidth; j++) {
        row.push(7);
      }
      this.board.push(row);
    }
  }
  
  reset() {
    this.frameCounter = 0;
    this.score = 0;

    this.pauseState = false;
    this.endState = false;
    this.clearLineState = false;
    this.board = [];
    for (let i = 0; i < this.boardHeight + 2; i++) {
      const row = [];
      for (let j = 0; j < this.boardWidth; j++) {
        row.push(7);
      }
      this.board.push(row);
    }

    this.next = this._generateRandomNumber();    
    this.piece = this.pieces[0];  // current piece
    this.pieceRotation = 0;               // current piece's position
    this.piecePosition = [this.piece.initialP[0] * this.squareSide, 
                          this.piece.initialP[1] * this.squareSide];
    this.shadowPiece = this.piece;
    this.shadowRotation = this.pieceRotation;
    this.shadowPosition = this.piecePosition; 
  }

  async play() {
    this.gameLoop = true;
    do {
      this._process();
      await this._sleep();
    } while(this.gameLoop);
  }

  _process() {
    window.onresize = this._alignBoard();
    this._render();
    this._pause();
    this._end();
    this._clearLine();
    if (this.clearLineState) { --this.clearingDelay; }

    if (this.pauseState || this.endState) {
    } else {
      ++this.frameCounter;


      if (this.frameCounter > 10) { 
        if (this.score <= 200) {
          this.level = 1;
        }  
        if (this.score >= 500) {
          this.level = 2;
        } 
        if (this.score >= 1000) {
          this.level = 3;
        } 
        if (this.score >= 1500) {
          this.level = 4;
        } 
        if (this.score >= 2500) {
          this.level = 5;
        } 
        if (this.score >= 3000) {
          this.level = 6;
        } 
        if (this.score >= 4000) {
          this.level = 7;
        }

        this.level = 3;

        if (this.frameCounter + (this.level * 2) > 50) {
          this.frameCounter = 0;
          if (this._checkCurrentCollision(0,1)) {
            this.piecePosition[1] += this.squareSide;
          } else {
            this._freeze();
            this.currentPieceID = this.next;
            this._nextPiece();
          }
        }
      }
    }
  }

  _render() {
    this._updatePiece();
    this._drawBoard();
    this._drawShadowPiece();
    this._drawPiece();
    this._drawScore();
    this._drawNextPiece();
  }

  _pause() {
    if (this.pauseState && !this.endState) {
      this.context.fillStyle = '#3987c9';
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.globalAlpha = 0.5;
      this.pauseText.style.left = `${((window.innerWidth - this.canvas.width) / 2)+45}px`;
      this.pausePopupContainer.style.display = 'block';
    } else {
      this.pauseState = false;
      this.context.globalAlpha = 1;
      this.pausePopupContainer.style.display = 'none';
    }
  }

  _end() {
    if (this.endState) {
      this.context.globalAlpha = 0.5;
      this.context.fillStyle = '#3987c9';
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.endPopupContainer.style.display = "block";
      this.scorePlaceholder.style.display = "none";
      this.nextPieceContainer.style.display = "none"

      this.endPopup.innerHTML = ("SCORE " + this.score);
      this.endText.style.left = `${((window.innerWidth - this.canvas.width) / 2)+ 25}px`;
    }

  }
  _checkCurrentCollision(potX, potY) {
    let p = this.piece.rotation[this.pieceRotation];
    let x = this.piecePosition[0] / this.squareSide;
    let y = this.piecePosition[1] / this.squareSide;

    return this._checkCollision(p, x, y, potX, potY);
  }

  _checkShadowCollision(potX, potY) {
      let p = this.shadowPiece.rotation[this.shadowRotation];
    let x = this.shadowPosition[0] / this.squareSide;
    let y = this.shadowPosition[1] / this.squareSide;

    return this._checkCollision(p, x, y, potX, potY);
  }

  _checkCollision (p, x, y, potX, potY) {
    for (let i =0; i < p.length; i++) {
      for (let j =0; j < p[i].length; j++) {
        if (p[i][j] != 0) {
          if (potX+x+j > this.boardWidth - 1 
            || x + potX + j < 0
            || potY + y + i > this.boardHeight - 1 
            || (typeof this.board[potY+y+i] != 'undefined'
               && typeof this.board[potY+y+i][potX+x+j] != 'undefined' 
               && this.board[potY+y+i][potX+x+j] < 7)
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }
  
  _nextRotation() {
    let rotations = this.piece.rotation;
    let rotLen = this.piece.rotation.length;
    let rotIndex = (this.pieceRotation + 1) % rotLen; 
    let potPiece = rotations[rotIndex];
    let x = this.piecePosition[0] / this.squareSide;
    let y = this.piecePosition[1] / this.squareSide;
    
    if (this._checkCollision(potPiece, x, y, 0, 0)) {
      this.pieceRotation = rotIndex;
      this.shadowRotation = this.pieceRotation;
    }
  }
  
  _nextPiece() {
    let depth = this._depth();
    let nextPiece = this.pieces[this.next];
    if (depth === 0) {
      this.endState = true;
      this.pieceCurrentID = this.piece.id;
    }
    if (depth > 0 && !this.endState) { 
      this.piece = nextPiece;
      this.pieceRotation = 0;
      this.piecePosition = [this.piece.initialP[0] * this.squareSide, 
                            this.piece.initialP[1] * this.squareSide];
      this.shadowPiece = nextPiece;
      this.shadowRotation = this.pieceRotation;
      this.shadowPosition = this.piecePosition;
      this.currentPieceID = this.next;
      this.next = this._generateRandomNumber();
    }
  }

  _freeze() {
    let piece = this.piece.rotation[this.pieceRotation];
    let x = this.piecePosition[0] / this.squareSide;
    let y = this.piecePosition[1] / this.squareSide;
    for (let i = 0; i < piece.length; i++) {
      for (let j = 0; j < piece[i].length; j++) {
        if (piece[i][j] != 0) {
          if (typeof this.board[i + y] != 'undefined'
              && typeof this.board[i + y][j + x] != 'undefined') {
            this.board[i + y][j + x] = this.piece.id;
          } else {
            this.endState = true;
          }
        }
      }
    }
  }

  _drawBoard() {
    this.context.fillStyle = '#111111';
    this.context.fillRect(this.boardX, this.boardY, 
                          this.boardWidth * this.squareSide, 
                          this.boardHeight * this.squareSide
    );


    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] < 7) {
          this._drawSquare(
            this.boardX + this.squareSide * j,
            this.boardY + this.squareSide * i,
            this.pieces[this.board[i][j]].color,
            this.context
          )
          this.context.strokeStyle = 'red';
          this.context.strokeRect( 
            this.boardX + this.squareSide * j, 
            this.boardY + this.squareSide * i,
            this.squareSide, this.squareSide);
        }
      }
    }
  }


  _clearLine() {
    let removeTurn = [];
    for (let i = 0; i < this.boardHeight; i++) {
      for (let j = 0; j < this.boardWidth; j++) {
        if (this.board[i][j] == 7) { break;} 
        else if (j == this.boardWidth - 1) {removeTurn.push(i);}
      }
    }
    if (removeTurn.length > 0)  { this.clearLineState = true;}
    if (this.clearLineState) { --this.clearingDelay; }

    if (this.clearingDelay >= 1) {
      for (let i = 0; i < removeTurn.length; i++) {
        for (let j = 0; j < this.boardWidth; j++) {
          if (this.board[i][j] != 8) {
            this.board[removeTurn[i]][j] = Math.floor(Math.random() * 6);
          }
        }
      }
    } else {
      
      for (let q = 0; q < removeTurn.length; q++) {
        for (let i = removeTurn[q]; i > 0; i--) {
          for (let j = 0; j < this.boardWidth; j++) {
            this.board[i][j] = this.board[i-1][j];
          }
        }
      }
      this.clearLineState = false;
      this.clearingDelay = 40;
      switch (removeTurn.length) {
         case 0: 
           break;
         case 1:
           this.score += 40;
           break;
         case 2: 
           this.score += 100;
           break;
         case 3: 
           this.score += 300;
           break;
         case 4: 
           this.score += 1200;
           break;
         default: 
           break;
      }
    } 
  }

  _drawPiece() {
    let piece = this.piece.rotation[this.pieceRotation];

    for (let i = 0; i < piece.length; i++) {
      for (let j = 0; j < piece[i].length; j++) {
        if (piece[i][j] != 0) {
          this._drawSquare(
            (this.piecePosition[0] + j * this.squareSide) + this.boardX,
            (this.piecePosition[1] + i * this.squareSide) + this.boardY, 
            this.piece.color, this.context);
        }
      }
    }
  }

  _drawShadowPiece() {
    let piece = this.shadowPiece.rotation[this.shadowRotation];
    let dropY = 0;
    while (this._checkShadowCollision(0, dropY / this.squareSide)) {
      dropY += this.squareSide;
    }

    for (let i = 0; i < piece.length; i++) { 
      for (let j = 0; j < piece[i].length; j++) {
        if (piece[i][j] != 0) {
           this._drawSquare(
           (this.shadowPosition[0] + j * this.squareSide + this.boardX),
           (dropY - 30 + this.piecePosition[1] + i * this.squareSide) + this.boardY,
           '#181818', this.context);
        }
      }                                              
    }
  }

  _drawNextPiece() {
    this.nextPieceCtx.clearRect(0, 0, 
      this.nextPiecePlaceholder.width, 
      this.nextPiecePlaceholder.height);
    this.nextPieceContainer.style.position = 'absolute';
    this.nextPieceContainer.style.left = `${(window.innerWidth - this.canvas.width) / 2 - 150}px`;
    this.nextPieceContainer.style.top = `${40}px`;

    let piece = this.pieces[this.next].rotation[0];
    let initialN = this.pieces[this.next].initialN;
    for (let i = 0; i < piece.length; i++) { 
      for (let j = 0; j < piece[i].length; j++) {
        if (piece[i][j] != 0) {
           this._drawSquare(
           (j + initialN[0] ) * this.squareSide,
           (i + initialN[1]) * this.squareSide + 100,
           'white', 
           this.nextPieceCtx);
        }
      }                                              
    } 

  }
  
  _drawSquare(x, y, color, context) {
    context.fillStyle = color;
    context.shadowColor = 'red';
    context.shadowOffsetX = 5;
    context.shadowOffsetY = 5;
    context.fillRect(x, y, this.squareSide, this.squareSide);
  }

  _updatePiece() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  _generateRandomNumber() {
    let rand = Math.floor(Math.random() * 7);
    if (rand === this.currentPieceID) { 
      return this._generateRandomNumber(); } 
    return rand;
  }
  
  _drawScore() {
    let randColor = this.pieces[Math.floor(Math.random() * 6)].color;
    this.scorePlaceholder.innerText = "SCORE " + this.score;
    this.scorePlaceholder.style.right = `${(window.innerWidth - this.canvas.width) / 2 - 180}px`;
    if (this.clearLineState) {
      this.scorePlaceholder.style.color = randColor;
      this.scorePlaceholder.style.background = 'pink';
    } else {
      this.scorePlaceholder.style.background = '#2F4F4F';
      this.scorePlaceholder.style.color = '#7FDBFF';
    }
  }

  _depth() {
    let depth = this.boardHeight;
    let flag = true;
    for (let i = 0; i < this.boardHeight; i++) {
      for (let j = 0; j < this.boardWidth; j++) {
        if (this.board[i][j] < 7 && flag) {
          depth = i;
          flag = false;
        }
      }
    }
    return depth;
  }

  _sleep() {return new Promise(requestAnimationFrame); }

  _alignBoard() {
    this.canvas.style.left = `${(window.innerWidth - this.canvas.width) / 2}px`;
    this.canvas.style.position = "absolute";
  }
}

(() => {
  const canvas = document.getElementById('game-canvas');
  const game = new Tetris(canvas);

  document.addEventListener('keydown', event => {
    if (event.defaultPrevented) {
      return;
    }
    switch(event.code) {
      case "ArrowRight":
        if (game._checkCurrentCollision(1, 0) && !game.pauseState) {
          game.piecePosition[0] += game.squareSide;
        }
        break;
      case "ArrowLeft": 
        if (game._checkCurrentCollision(-1, 0) && !game.pauseState) {
          game.piecePosition[0] -= game.squareSide;
        }
        break;
      case "ArrowDown": 
        if (!game.pauseState) {
          if (game._checkCurrentCollision(0, 1)){ 
            game.piecePosition[1] += game.squareSide;
          } else {
            game._freeze();
            game._nextPiece();
          }
          break;
        }
      case "ArrowUp": 
        if (!game.pauseState) {
          game._nextRotation();
        }
        break;
      case "ShiftLeft":
        if (game.pauseState) {
          game.pauseState = false;
        } else {
          game.pauseState = true;
        }
        break;
      
      // Hard drop
      case "Space":
        if (!game.pauseState) {
          while (game._checkCurrentCollision(0, 1)) {
            game.piecePosition[1] += game.squareSide;
          }
          if (!game._checkCurrentCollision(0, 1)) {
            game._freeze();
            game._nextPiece();
          }
        }
        break;
      case "Enter": 
        if (!game.pauseState) {
          game.endPopupContainer.style.display = "none";
          game.scorePlaceholder.style.display = "block";
          game.nextPieceContainer.style.display = "block";
          game.reset();
        }
    }

    event.preventDefault();
  })
  game.play();
}) ()

