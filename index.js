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
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],    
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],     
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],    
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],    
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],    
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],    
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],    
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],    
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1]    
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
	// TODO (#2): Limit doesn't work in Y: 14, X: 8) for some cases
	for (let i = 0; i < (this.getWidth() / 20); i++) {
		if (tetromino[this.pieceIndex][this.pieceShape][(this.getHeight() / 20) - 1][i] > 0) {
			if (boardMap[((this.potentialPos.y + this.getHeight()) / 20) - 1][(this.potentialPos.x / 20) + i] > 0) {
				return false;
			}
		}
	}
	return true;
}

	update() {
		this.canSetPos()
		if (this.potentialPos.x < 220 - this.getWidth() &&
				this.potentialPos.x >= 0 && this.potentialPos.y < 420 - this.getHeight()) {
			if (this.canSetPos()) {
				this.pos = this.potentialPos;
			}
		}
		this.potentialPos = this.pos;	

		this.fillPiece();
		console.log("Y: " + this.potentialPos.y / 20 + " " + "X: " + this.potentialPos.x / 20)

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
		this.board.fillBoard();
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
