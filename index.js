class Tetris {
	constructor(context) {
		this.context = context;
		this.frameCounter = 0;
		this.gameLoop = false;
		this.piecePosition = [0, 0];

		this.boardWidth = BOARD_WIDTH;
		this.boardWeight = BOARD_HEIGHT;

		this.squareSide = 30; // square size

		this.pieces = [
			{
				id: 0,
				name: 'z',
				color: 'red',
				rotation: Z_ROT
			},
			{
				id: 1,
				name: 's',
				color: 'green',
				rotation: S_ROT
			},
			{
				id: 2,
				name: 'o',
				color: 'blue',
				rotation: O_ROT
			},
			{
				id: 3,
				name: 'l',
				color: 'orange',
				rotation: L_ROT
			},
			{
				id: 4,
				name: 'j',
				color: 'purple',
				rotation: J_ROT
			},
			{
				id: 5,
				name: 't',
				color: 'yellow',
				rotation: T_ROT
			},
			{
				id: 6,
				name: 'i',
				color: 'brown',
				rotation: I_ROT
			}
		];

		this.piece = this.pieces[0]; 	// current piece
		this.pieceRotation = 0; 			// current piece's position
		this.next = this.pieces[0];   // next piece


	}
	

	async play() {
		this.gameLoop = true;
		do {
			this._drawPiece();
			this._process();
			await this._sleep();
		} while(this.gameLoop);
	}
	
	_process() {
		++this.frameCounter;
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

	_sleep() {return new Promise(requestAnimationFrame); }
	
}

(() => {
	const canvas = document.getElementById('game-canvas');
	const context = canvas.getContext('2d');
	const game = new Tetris(context);

	game.play();
}) ()

