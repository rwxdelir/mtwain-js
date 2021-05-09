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
    this.canvas.width = this.boardWidth * this.squareSide;
    this.canvas.height = this.boardHeight * this.squareSide;
    //this.removeTurn = new Set(); 
    this.score = 0;
    this.level = 1;

    this.clearingDelay = 20;
    this.pauseState = false;
    this.endState = false;
    this.clearLineState = false;

    this.pieces = [
      {
        id: 0,
        name: 'z',
        color: '#0074D9',
        rotation: Z_ROT,
        initialP: Z_INI_POS
      },
      {
        id: 1,
        name: 's',
        color: '#7FDBFF',
        rotation: S_ROT,
        initialP: S_INI_POS
      },
      {
        id: 2,
        name: 'o',
        color: '#FFDC00',
        rotation: O_ROT,
        initialP: O_INI_POS
      },
      {
        id: 3,
        name: 'l',
        color: '#FF4136',
        rotation: L_ROT,
        initialP: L_INI_POS
      },
      {
        id: 4,
        name: 'j',
        color: '#85144b',
        rotation: J_ROT,
        initialP: J_INI_POS
      },
      {
        id: 5,
        name: 't',
        color: '#3D9970',
        rotation: T_ROT,
        initialP: T_INI_POS
      },
      {
        id: 6,
        name: 'i',
        color: '#AAAAAA',
        rotation: I_ROT,
        initialP: I_INI_POS
      }
    ];

    this.next = 0;
    this.piece = this.pieces[this.next];  // current piece
    this.pieceRotation = 1;               // current piece's position
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
    //this.removeTurn = []; 
    this.score = 0;

    this.pauseState = false;
    this.endState = false;
    this.board = [];
    for (let i = 0; i < this.boardHeight + 2; i++) {
      const row = [];
      for (let j = 0; j < this.boardWidth; j++) {
        row.push(7);
      }
      this.board.push(row);
    }

    this.next = 0;
    this.piece = this.pieces[this.next];  // current piece
    this.pieceRotation = 1;               // current piece's position
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
    if (this.endState) {
      this.reset();
    }
    if (this.pauseState) {
    } else {
      ++this.frameCounter;
        
      this._clearLine();

      if (this.clearLineState) { --this.clearingDelay;
      }

      this._render();
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
    this._drawText();
  }

  _pause() {
    if (this.pauseState) {
      this.pauseState = false;
    } else {
      this.pauseState = true;
    }
  }

  _checkCurrentCollision(potX, potY) {
    let p = this.piece.rotation[this.pieceRotation];
    let pHeight = this._pieceHeight(p);
    let pWidth = this._pieceWidth(p);
    let x = this.piecePosition[0] / this.squareSide;
    let y = this.piecePosition[1] / this.squareSide;

    return this._checkCollision(p, x, y, potX, potY, pHeight, pWidth);
  }

  _checkShadowCollision(potX, potY) {
    let p = this.shadowPiece.rotation[this.shadowRotation];
    let pHeight = this._pieceHeight(p);
    let pWidth = this._pieceWidth(p);
    let x = this.shadowPosition[0] / this.squareSide;
    let y = this.shadowPosition[1] / this.squareSide;

    return this._checkCollision(p, x, y, potX, potY, pHeight, pWidth);
  }

  _checkCollision (p, x, y, potX, potY, pHeight, pWidth) {
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
    let potPieceWidth = this._pieceWidth(potPiece);
    let potPieceHeight = this._pieceHeight(potPiece);
    let x = this.piecePosition[0] / this.squareSide;
    let y = this.piecePosition[1] / this.squareSide;
    
    if (this._checkCollision(potPiece, x, y, 0, 0, potPieceHeight, potPieceWidth)) {
      this.pieceRotation = rotIndex;
      this.shadowRotation = this.pieceRotation;
    }
  }
  
  _nextPiece() {
    this.next = (this.next + 1) % 7;
    let depth = this._depth();
    let nextPiece = this.pieces[this.next];
    if (depth === 0) {
      this.endState = true;
    }
    if (depth > 0 && !this.endState) { 
      this.piece = nextPiece;
      this.pieceRotation = 0;
      this.piecePosition = [this.piece.initialP[0] * this.squareSide, 
                            this.piece.initialP[1] * this.squareSide];
      this.shadowPiece = nextPiece;
      this.shadowRotation = this.pieceRotation;
      this.shadowPosition = this.piecePosition;
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
            this.pieces[this.board[i][j]].color
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
    if (this.clearLineState) { --this.clearingDelay;}

    if (this.clearingDelay >= 1) {
      for (let i = 0; i < removeTurn.length; i++) {
        for (let j = 0; j < this.boardWidth; j++) { 
          this.board[removeTurn[i]][j] = Math.floor(Math.random() * 6);
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
      this.clearingDelay = 20;

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
            this.piecePosition[0] + j * this.squareSide,
            this.piecePosition[1] + i * this.squareSide, 
            this.piece.color);
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
           this.shadowPosition[0] + j * this.squareSide,
           dropY - 30 + this.piecePosition[1] + i * this.squareSide,
           '#181818');
        }
      }                                              
    }
  }

  _drawSquare(x, y, color) {
    this.context.fillStyle = color;
    this.context.shadowColor = 'red';
    this.context.shadowOffsetX = 5;
    this.context.shadowOffsetY = 5;
    this.context.fillRect(x, y, this.squareSide, this.squareSide);
  }

  _updatePiece() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  _drawText() {
    this.context.shadowOffsetX = 2;
    this.context.shadowOffsetY = 2;
    this.context.shadowBlur = 2;
    this.context.shadowColor = 'rgba(0, 0, 0, 0.5)';

    this.context.font = '30px Allan, Helvetica, Arial, sans-serif';
    this.context.fillText("Score: " + this.score, 5, 30); 
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

  _pieceWidth(piece) {
    let p = piece;
    let entry = [];
    let acc = 0;
    for (let i = 0; i < p.length; i++) {
      for (let j = 0; j < p[i].length; j++) {
        if (p[i][j] != 0) {
          entry.push(j);  
        }
      }
    }
    
    let min = Math.min(...entry)
    let max = Math.max(...entry)

    while(min <= max) {
      ++acc;
      ++min;
    }
    return acc;
  }
  
  _pieceHeight(piece) {
    let p = piece;
    let acc = 0;
    let f = true
    for (let i = 0; i < p.length; i++) {
      for (let j = 0; j < p[i].length; j++) {
        if (p[i][j] > 0 && f) { 
          ++acc;
          f = false;
        }
      }
      f = true;
    }
    return acc;
  }

  _sleep() {return new Promise(requestAnimationFrame); }
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
        game._pause();
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
    }

    event.preventDefault();
  })
  game.play();
}) ()

