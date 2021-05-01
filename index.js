class Tetris {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.frameCounter = 0;
    this.gameLoop = false;
    this.boardWidth = BOARD_WIDTH;
    this.boardHeight = BOARD_HEIGHT;
    this.boardX = 0;
    this.boardY = 0;
    this.squareSide = 30; // square size
    this.canvas.width = this.boardWidth * this.squareSide;
    this.canvas.height = this.boardHeight * this.squareSide;
  
    this.removeTurn = []; 
    this.score = 0;
    this.pauseState = false;
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

  
    this.board = [];
    for (let i = 0; i < this.boardHeight; i++) {
      const row = [];
      for (let j = 0; j < this.boardWidth; j++) {
        row.push(7);
      }
      this.board.push(row);
    }

    // flags for move
    this.moveLeft = false;
    this.moveRight = false;
    this.moveDown = false;
  }
  

  async play() {
    this.gameLoop = true;
    do {
      this._process();
      await this._sleep();
    } while(this.gameLoop);
  }

  _process() {
    if (this.pauseState) {
     
    } else {
      ++this.frameCounter;
      this._render();
      if (this.frameCounter == 20) {
        let flag = true;
        for (let i = 0; i < this.boardHeight; i++) {
          for (let j = 0; j < this.boardWidth; j++) {
            if (this.board[i][j] < 7 && flag) {
            } else { flag = false } 
          }
          if (flag) { 
            this.removeTurn.push(i);
          }
          flag = true;
        }

      }

      if (this.frameCounter > 80) {
        switch (this.removeTurn.length) {
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
        }

        for (let i = 0; i < this.removeTurn.length; i++) {
          this._clearLine(this.removeTurn[i]);
        }

        this.removeTurn = [];
        
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

  _render() {
    this._updatePiece();
    this._drawBoard();
    this._drawPiece();
    this._drawText("SCORE: " + this.score);
        
    // Clearing line animation
    for (let i = 0; i < this.removeTurn.length; i++) {
      this.context.fillStyle = "purple";
      this.context.fillRect(this.boardX, 
        this.boardY + (this.removeTurn[i] * this.squareSide),
        this.boardWidth * this.squareSide, 
        this.squareSide);
    }
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

  _checkCollision (p, x, y, potX, potY, pHeight, pWidth) {
    for (let i =0; i < p.length; i++) {
      for (let j =0; j < p[i].length; j++) {
        if (p[i][j] != 0) {
          if (typeof this.board[potY+y+i] === 'undefined' ||
              typeof this.board[potY+y+i][potX + x + j] === 'undefined') {
            return false;
          }
          if (this.board[potY+y+i][potX + x + j] < 7) {
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
    }
  }
  
  _nextPiece() {
    this.next = (this.next + 1) % 7;
    this.piece = this.pieces[this.next];
    this.pieceRotation = 0;
    this.piecePosition = [this.piece.initialP[0] * this.squareSide, 
                          this.piece.initialP[1] * this.squareSide];
  }

  _freeze() {
    let piece = this.piece.rotation[this.pieceRotation];
    let x = this.piecePosition[0] / this.squareSide;
    let y = this.piecePosition[1] / this.squareSide;

    for (let i = 0; i < piece.length; i++) {
      for (let j = 0; j < piece[i].length; j++) {
        if (piece[i][j] != 0) {
          this.board[i + y][j + x] = this.piece.id;
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
        }
      }
    }
  }

  _clearLine(lineIndex) {
    for (let i = 0; i < this.boardHeight - 1; i++) {
      for (let j = 0; j < this.boardWidth; j++) {
        if (i === lineIndex) {
          this.board[i][j] = 7;
        }
      }
    }

    for (let i = lineIndex; i > 0; i--) {
      for (let j = 0; j < this.boardWidth; j++) {
        this.board[i][j] = this.board[i-1][j];
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

  _drawSquare(x, y, color) {
    this.context.fillStyle = color;
    this.context.fillRect(x, y, this.squareSide, this.squareSide);
  }

  _updatePiece() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  _drawText(text) {
    this.context.shadowOffsetX = 2;
    this.context.shadowOffsetY = 2;
    this.context.shadowBlur = 2;
    this.context.shadowColor = 'rgba(0, 0, 0, 0.5)';

    this.context.font = '30px Allan, Helvetica, Arial, sans-serif';
    this.context.fillText("Score: " + this.score, 5, 30); 
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
      case "Space":
        game._pause();
        break;
    }

    event.preventDefault();
  })
  game.play();
}) ()

