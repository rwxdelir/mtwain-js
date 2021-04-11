const tetromino = [ 
	[[1,0],
  [1,1], 
  [1,0]],
 [[1,1], 
  [1,1]],
 [[1],  
  [1],  
  [1], 
  [1]],  
 [[1,0], 
  [1,0], 
  [1,1]],
]

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
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],    
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],    
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],    
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]    
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
  'ArrowDown': new V2(1.0, 0),
  'ArrowRight': new V2(0, 1.0),
  'ArrowLeft': new V2(0, -1.0)
}

class Board {
	constructor(context) {
		this.context = context;
	}

	fillBoard() {
		this.context.fillStyle = 'black';
		for (let i = 0; i < boardMap.length; i++) {
			for (let j = 0; j < boardMap[i].length; j++) {
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
	}
	
	fillPiece() {
		this.context.fillStyle = "red";
		for (let i = 0; i < tetromino[this.pieceIndex].length; i++) {
			for (let j = 0; j < tetromino[i].length; j++) {
				if (tetromino[this.pieceIndex][i][j] == 1) {
					this.context.fillRect(20 * j, 20 * i, 19, 19);
				}
			}
		}
	}

	getWidth() {

	}
	
	getHeight() {

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

		console.log(this.piece.potentialPos)
		this.piece.potentialPos = this.piece.potentialPos.add(vel);
		
		this.board.fillBoard();
		this.piece.fillPiece();
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
	let i = 0;

	function step(timestamp) {
		if (start === undefined)  {
			start = timestamp;
		}
		let dt = Math.floor(start / 1000);
		start = timestamp;

		if (dt > 2) {
			dt = 0;
			game.update();
		}
		console.log(dt)
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
