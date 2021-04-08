const blockMap = [
  [ 0x4640, 0x0E40, 0x4C40, 0x4E00 ], // 'T'
  [ 0x8C40, 0x6C00, 0x8C40, 0x6C00 ], // 'S'
  [ 0x4C80, 0xC600, 0x4C80, 0xC600 ], // 'Z'
  [ 0x4444, 0x0F00, 0x4444, 0x0F00 ], // 'I'
  [ 0x44C0, 0x8E00, 0xC880, 0xE200 ], // 'J'
  [ 0x88C0, 0xE800, 0xC440, 0x2E00 ], // 'L'
  [ 0xCC00, 0xCC00, 0xCC00, 0xCC00 ]  // 'O'
];

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
		return new V2(this.x * s, this.y * s)
	}
}

const directionMap = {
	'ArrowDown': new V2(0, 1.0),
	'ArrowRight': new V2(1.0, 0),
	'ArrowLeft': new V2(-1.0, 0)
} 

function createBoard(ctx, boardMap) {
	ctx.fillStyle = 'red';
	for (let i = 0; i < boardMap.length; i++) {
		for (let j = 0; j < boardMap[i].length; j++) {
			ctx.fillRect(20 * j, 20 * i, 19, 19);
		}
	}
}

function createBlock(ctx, s, r, color = 'black') {
	ctx.fillStyle = color;
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			if (blockMap[s][r] & (0x8000 >> (i * 4 + j))) {
				ctx.fillRect(20 * j, 20 * i, 19, 19);
			}
		}
	}
}

class Camera {
	pos = new V2(0, 0);
	vel = new V2(0, 0);

	constructor(context)  {
		this.context = context;
	}

	update(dt) {
		this.pos = this.pos.add(this.vel.scale(dt));
	}

	width() { 
	}

	height() { 
	}

	fillRect(x, y, color) {
		this.context.fillStyle = color;
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				if (blockMap[0][0] & (0x8000 >> (i * 4 + j))) {
					this.context.fillRect((20 * j) + y, (20 * i) + x, 19, 19);
				}
			}
		}
	}
}

class Player {
	constructor(pos) {
		this.pos = pos;
	}
	
	update(dt, vel) {
		this.pos = this.pos.add(vel.scale(dt));
	}

	render(camera) {
		camera.fillRect(this.pos.x, this.pos.y, 'black');
	}
}

class Game {
	pressedKeys = new Set();
	player = new Player(new V2(0, 0));
	
	constructor(context) {
		this.camera = new Camera(context);
	}

	keyDown(event) {
		this.pressedKeys.add(event.code);
		console.log(this.pressedKeys)
	}
	
	update(dt) {
		let vel = new V2(0, 0);

		for (let key of this.pressedKeys) {
			if (key in directionMap) {
				vel = vel.add(directionMap[key])
			}
		}

		this.player.update(dt, vel);
	}

}

let game = null;

(() => {
	const canvas = document.getElementById('game');
	const ctx = canvas.getContext('2d');
	let windowWasResized = true;
	
	let game = new Game(ctx);
	
	let start;
	function step(timestamp) {
		if (start === undefined) {
			start = timestamp;
		}
		const dt = (timestamp - start) * 0.001;
		start = timestamp;

		if (windowWasResized) {
			canvas.width = 500;
			canvas.height = 1000;
			console.log(canvas.width)
			console.log(canvas.height)

			windowWasResized = false;
		}

		createBoard(ctx, boardMap);
		game.camera.fillRect(60 * 2, 40, 'black');		

		game.update(dt);

		window.requestAnimationFrame(step);
	}
	
	window.requestAnimationFrame(step);

	window.addEventListener('resize', event => {
		windowWasResized = true;
	})
	
	document.addEventListener('keydown', event => {
		game.keyDown(event);
	})		

})();

