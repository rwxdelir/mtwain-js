const tetromino = [[	
	[[1,0],
	 [1,1],
	 [1,0]],
	[[1,1,1],
	 [0,1,0]],
	[[0,1],
	 [1,1],
	 [0,1]],
	[[0,1,0],
	 [1,1,1]]
],[
	[[1,1],
	 [1,1]],
	[[1,1],
	 [1,1]],
	[[1,1],
	 [1,1]],
	[[1,1],
	 [1,1]]
],[
	[[1],
	 [1],
	 [1],
	 [1]],
	[[1,1,1,1]],
	 [[1],
	 	[1],
	 	[1],
	 	[1]],
	[[1,1,1,1]]
],[
	[[1,0], 
   [1,0], 
   [1,1]],
	[[1,1,1],
	 [1,0,0]],
	[[1,1],
	 [0,1],
	 [0,1]],
	[[0,0,1],
	 [1,1,1]]
]]

const boardMap = [    
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],    
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],    
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],     
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],    
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],    
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],    
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],    
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],    
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],    
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],    
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],    
  [0, 0, 0, 0, 1, 0, 1, 0, 0, 0],    
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],     
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],    
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],    
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],    
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],    
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],    
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],    
  [0, 0, 0, 0, 0, 0, 1, 0, 1, 1]    
]

class V2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	add(v) {
		return new V2(this.x + v.x, this.y + v.y);
	}
	
	scale(s) {
		return new V2(this.x * s, this.y * s);
	}
}

const directionMap = {
  'ArrowDown': new V2(0, 1.0),
  'ArrowRight': new V2(1.0, 0),
  'ArrowLeft': new V2(-1.0, 0)
}

class Board {
	constructor(context) {
		this.context = context;
	}

	fillBoard() {
		for (let i = 0; i < boardMap.length; i++) {
			for (let j = 0; j < boardMap[i].length; j++) {
				if (boardMap[i][j] == 1) {
					this.context.fillStyle = 'red';
				} else { 
					this.context.fillStyle = 'black';
				}
				this.context.fillRect(20 * j, 20 * i, 19, 19);
			}
		}
	}

	update() {
		this.fillBoard()
	}
}

class Piece {
	constructor(pos, context) {
		this.context = context;
		this.tetromino = tetromino;
		this.pos = pos;
		this.potentialPos = new V2(0, 0);
		this.pieceIndex = Math.floor(Math.random() * (4 - 0) + 0);
		this.pieceShape = Math.floor(Math.random() * (4 - 0) + 0);
	}
	
	fillPiece() {
		this.context.fillStyle = "red";
		for (let i = 0; i < tetromino[this.pieceIndex][this.pieceShape].length; i++) {
			for (let j = 0; j < tetromino[this.pieceIndex][this.pieceShape][i].length; j++) {
				if (tetromino[this.pieceIndex][this.pieceShape][i][j] == 1) {
					this.context.fillRect(20 * j + this.pos.x, 20 * i + this.pos.y, 19, 19);
				}
			}
		}
	}

	getWidth() {
		return 20 * Math.max(...tetromino[this.pieceIndex][this.pieceShape].map(x => x.length));
	}
	
	getHeight() {
		return 20 * tetromino[this.pieceIndex][this.pieceShape].length;
	}

	canSetPos() {
		let row = ((this.potentialPos.y) / 20);
		let col = ((this.potentialPos.x) / 20);
		let tetRow = (this.getHeight() / 20);
		let tetCol = (this.getWidth() / 20);

		for (let i = 0; i < tetRow; i++) {
			for (let j = 0; j < tetCol; j++) {
				if (boardMap[row + i][col + j] > 0 &&
						tetromino[this.pieceIndex][this.pieceShape][i][j] > 0) {
					return false;
				}
			}
		}
		return true
	}

	freeze() {
		let row = (this.pos.y / 20);
		let col = (this.pos.x / 20);
		let tetRow = (this.getHeight() / 20);
		let tetCol = (this.getWidth() / 20);

		for (let i = 0; i < tetRow; i++) {
			for (let j = 0; j < tetCol; j++) {
				if (tetromino[this.pieceIndex][this.pieceShape][i][j] > 0) {
					boardMap[row + i][col + j] = tetromino[this.pieceIndex][this.pieceShape][i][j];
				}
			}
		}
	}

	update() {
		this.potentialPos = this.pos;	

		this.fillPiece();

	}
}

class JTetris {
	pressedKeys = new Set();

	constructor(context) {
		this.context = context;
		this.board = new Board(this.context);
		this.piece = new Piece(new V2(0, 0), this.context);
	}

	update() {
		let vel = new V2(0, 0);
		for (let key of this.pressedKeys) {
			if (key in directionMap) {
				vel = vel.add(directionMap[key])
			}
		}

		this.piece.potentialPos = this.piece.potentialPos.add(vel.scale(20));

		if (this.piece.potentialPos.x < 220 - this.piece.getWidth() &&
				this.piece.potentialPos.x >= 0 && this.piece.potentialPos.y < 420 - this.piece.getHeight()) {
			if (this.piece.canSetPos()) {
				this.piece.pos = this.piece.potentialPos;
			} else {
				this.piece.freeze();
				this.board.update();
			}
		}

		this.board.update();
		this.piece.update();
	}

	keyDown(event) {
		this.pressedKeys.add(event.code);
	}

	keyUp(event) {
		this.pressedKeys.delete(event.code);
	}
}

let game = null;

(() => {
	const canvas = document.getElementById('game-canvas');
	const context = canvas.getContext('2d');
	canvas.width = 1000;
	canvas.height = 400;

	let game = new JTetris(context);
	let start = 0;

	function step(timestamp) {
		if (start === undefined)  {
			start = timestamp;
		}

		if (!start || timestamp - start >= 100) {
			start = timestamp;
			game.update();
		}
		window.requestAnimationFrame(step);
	}

	window.requestAnimationFrame(step);

	document.addEventListener('keydown', event => {
		game.keyDown(event);
	})

	document.addEventListener('keyup', event => {
		game.keyUp(event);
	})
})()
