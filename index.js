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

    this.piece = this.pieces[4];  // current piece
    this.pieceRotation = 3;       // current piece's position
    this.next = this.pieces[0];   // next piece
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
    
    this.board[11][0] = 3;
    this.board[11][3] = 3;
    this.board[11][4] = 3;
    this.board[11][6] = 3;
  }
  

  async play() {
    this.gameLoop = true;
    do {
      this._process();
      await this._sleep();
    } while(this.gameLoop);
  }
  
  _process() {
    ++this.frameCounter;
    this._render();
//    if (this.frameCounter > 40) {
//      this._canMove();
//      this.frameCounter = 0;
//      if (this.moveDown && this._checkCollision(0,1)) {
//        this.piecePosition[1] += this.squareSide;
//        this.moveDown = false;
//      }
//    }
  }

  _render() {
    this._updatePiece();
    this._drawBoard();
    this._drawPiece();
  }
  
  _canMove() {
    let p = this.piece.rotation[this.pieceRotation];
    let bWidth = this.boardWidth;
    let bHeight = this.boardHeight;
    let pWidth = this._pieceWidth();
    let pHeight = this._pieceHeight();
    let pPosX = (this.piecePosition[0] / this.squareSide);
    let pPosY = (this.piecePosition[1] / this.squareSide);
    let sizeLeft = p[0].length;

    for (let row = 0; row < p.length; row++) {
      for (let col = 0; col < p[row].length; col++) {
        if (p[row][col] != 0) {
          if (pPosX + col + pWidth < bWidth) {
            this.moveRight = true;
          } 
          if (pPosY + row + pHeight < bHeight) { 
            this.moveDown = true;
          }

          if (col < sizeLeft) {
            sizeLeft = col; 
          }
        }
      }
    }
    if (pPosX + this._pieceWidth() + sizeLeft > pWidth) {
      this.moveLeft = true;
    }
  }

  _checkCollision (potX, potY) {
    let pHeight = this._pieceHeight();
    let pWidth = this._pieceWidth();
    let p = this.piece.rotation[this.pieceRotation];
    let x = this.piecePosition[0] / this.squareSide;
    let y = this.piecePosition[1] / this.squareSide;
  
    for (let i =0; i < p.length; i++) {
      for (let j =0; j < p[i].length; j++) {
        console.log("Board[y][x] " + this.board[potY + y + i][potX + x + j])
        console.log("Potential Position (X, Y) " + (potX + x + j) + " " + (potY + y + i))
        if (p[i][j] != 0) {
          if (this.board[potY+y+i][potX + x + j] < 7) {
            console.log(this.board[potY+y+i])
            return false; 
          }
        }
      }
    }
    return true;
  }

  _checkLeftCollided (potX, potY) {
    let pHeight = this._pieceHeight();
    let pWidth = this._pieceWidth();
    let p = this.piece.rotation[this.pieceRotation];
    let x = this.piecePosition[0] / this.squareSide;
    let y = this.piecePosition[1] / this.squareSide;
  
    for (let i =0; i < p.length; i++) {
      for (let j =0; j < p[i].length; j++) {
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

  _pieceWidth() {
    let p = this.piece.rotation[this.pieceRotation];
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

  _pieceHeight() {
    let p = this.piece.rotation[this.pieceRotation];
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
    game._canMove(); // check available movements otherwise false
    switch(event.code) {
      case "ArrowRight":
        if (game.moveRight && game._checkCollision(1, 0)) {
          game.piecePosition[0] += game.squareSide;
          game.moveRight = false;
        }
        break;
      case "ArrowLeft": 
        if (game.moveLeft && game._checkCollision(-1, 0)) {
          game.piecePosition[0] -= game.squareSide;
          game.moveLeft = false;
        }
        break;
      case "ArrowDown": 
        if (game.moveDown
          && game._checkCollision(0, 1)){
          game.piecePosition[1] += game.squareSide;
          game.moveDown = false;
        }
        break;
    }

    event.preventDefault();
  })
  game.play();
}) ()

