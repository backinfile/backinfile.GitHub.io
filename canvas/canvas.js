
var game = null;
var method = 1;
var fast = true;

$(function() {
	$canvas = $('canvas');
	var width = $canvas.width();
	var height = $canvas.height();
	var unitSize = 10;
	game = new function Game() {
		this.W = Math.floor(width/unitSize);
		this.H = Math.floor(height/unitSize);
		this.offsetX = (width-unitSize*this.W)/2;
		this.offsetY = (height-unitSize*this.H)/2;
		this.drawPain = function() {
			$canvas.clearCanvas();
			$canvas.drawRect({
				fillStyle: '#CCC',
				x:this.offsetX,
				y:this.offsetY,
				width:unitSize*this.W,
				height:unitSize*this.H,
				fromCenter:false,
				cornerRadius: 6
			});
			for(var i=0; i<this.W; i++) {
				for(var j=0; j<this.H; j++) {
					this.drawArc(i,j, this.map.get(i,j));
				}
			}
		}
		this.getoripos = function(x,y) {
			var tx = this.offsetX+x*unitSize;
			var ty = this.offsetY+y*unitSize;
			return [tx,ty];
		}
		this.getmidpos = function(x,y) {
			var tx = this.offsetX+x*unitSize+unitSize/2;
			var ty = this.offsetY+y*unitSize+unitSize/2;
			return [tx,ty];
		}
		this.drawArc = function(x,y,color=0) {
			var pos = this.getmidpos(x,y);
			var col = color?'#333':'#999';
			$canvas.drawArc({
				fillStyle:col,
				x: pos[0], y: pos[1],
				radius: unitSize/2
			});
		}
		this.first = null;
		this.onclick = function (e) {
			var x = Math.floor((e.offsetX-game.offsetX)/unitSize);
			var y = Math.floor((e.offsetY-game.offsetY)/unitSize);
			if (x>=0 && x<game.W && y>=0 && y<game.H) {
				console.log(x,y);
				if (!game.first) {
					game.first = [x,y];
				} else {
					game.drawLine(game.first, [x,y]);
					game.first = null;
				}
			}
		}
		this.onclick1 = function (e) {
			var x = Math.floor((e.offsetX-game.offsetX)/unitSize);
			var y = Math.floor((e.offsetY-game.offsetY)/unitSize);
			if (x>=0 && x<game.W && y>=0 && y<game.H) {
				console.log(x,y);
				game.map.set(x,y,1);
				game.drawArc(x,y,1);
			}
		}
		this.onclick2 = function (e) {
			var x = Math.floor((e.offsetX-game.offsetX)/unitSize);
			var y = Math.floor((e.offsetY-game.offsetY)/unitSize);
			if (x>=0 && x<game.W && y>=0 && y<game.H) {
				console.log(x,y);
				var sp = fast?7:500;
				if (method == 3) game.fill(x,y);
				else if (method == 2) game.fillTimeoutF1(x,y,sp);
				else if (method == 1) game.fillTimeoutF2(x,y,sp);
			}
		}
		this.map = new GameMap(this.W, this.H, 0);
		$canvas.on('click', this.onclick);
		this.drawLine = function(pos1, pos2) {
			var tx = pos2[0]-pos1[0];
			var ty = pos2[1]-pos1[1];
			if (tx == 0) {
				for (var i=0; i<Math.abs(ty); i++) {
					this.drawArc(pos1[0], pos1[1]+(ty>0?1:-1)*i, 1);
					this.map.set(pos1[0], pos1[1]+(ty>0?1:-1)*i, 1);
				}
			} else if (Math.abs(tx)>=Math.abs(ty)) {
				for (var i=0; i<Math.abs(tx); i++) {
					this.drawArc(pos1[0]+i*(tx>0?1:-1), Math.round(pos1[1]+i*ty/Math.abs(tx)), 1);
					this.map.set(pos1[0]+i*(tx>0?1:-1), Math.round(pos1[1]+i*ty/Math.abs(tx)), 1);
				}
				this.drawArc(pos2[0],pos2[1], 1);
			} else {
				for (var i=0; i<Math.abs(ty); i++) {
					this.drawArc(Math.round(pos1[0]+i*tx/Math.abs(ty)), pos1[1]+i*(ty>0?1:-1), 1);
					this.map.set(Math.round(pos1[0]+i*tx/Math.abs(ty)), pos1[1]+i*(ty>0?1:-1), 1);
				}
				this.drawArc(pos2[0],pos2[1], 1);
				this.map.set(pos2[0],pos2[1], 1);
			}
			//this.drawPain();
		}
		this.fill = function(x,y) {
			function dsp(x,y) {
				var dx = [1, 0, -1, 0];
				var dy = [0, 1,  0,-1];
				for (var i=0; i<4; i++) {
					var tx = x+dx[i];
					var ty = y+dy[i];
					if (game.map.get(tx,ty) == 0) {
						game.drawArc(tx,ty,1);
						game.map.set(tx,ty,1);
						dsp(tx,ty);
					}
				}
			}
			dsp(x,y);
		}
		this.fill2 = function(x,y,to=10) {
			var queue = [];
			queue.push([x,y]);
			var dx = [1, 0, -1, 0];
			var dy = [0, 1,  0,-1];
			while(queue.length) {
				var pos = queue.pop();
				var x = pos[0];
				var y = pos[1];
				game.drawArc(x,y,1);
				game.map.set(x,y,1);
				for (var i=0; i<4; i++) {
					var tx = x+dx[i];
					var ty = y+dy[i];
					if (game.map.get(tx,ty) == 0) {
						queue.push([tx,ty]);
					}
				}
			}
		}
		this.fillTimeoutF1 = function(x,y,to=10) {
			var queue = [];
			queue.push();
			game.drawArc(x,y,1);
			game.map.set(x,y,1);
			var dx = [1, 0, -1, 0];
			var dy = [0, 1,  0,-1];
			function dsp(dir, pos) {
				//console.log(queue.length);
				if (dir<4) {
					var x = pos[0];
					var y = pos[1];
					var tx = x+dx[dir];
					var ty = y+dy[dir];
					if (game.map.get(tx,ty) == 0) {
						queue.push([tx,ty]);
						game.drawArc(tx,ty,1);
						game.map.set(tx,ty,1);
						if (queue.length) {
							setTimeout(function(){dsp(dir+1, pos);},to);
						}
					} else {
						if (queue.length) {
							setTimeout(function(){dsp(dir+1, pos);},0);
						}
					}
				} else {
					queue.shift();
					dir = -1;
					pos = queue[0];
					if (queue.length) {
						setTimeout(function(){dsp(dir+1, pos);},0);
					}
				}
				
			}
			dsp(0, [x,y]);
		}
		this.fillTimeoutF2 = function(x,y,to=10) {
			var queue = [];
			queue.push([x,y]);
			game.drawArc(x,y,1);
			game.map.set(x,y,1);
			var dx = [1, 0, -1, 0];
			var dy = [0, 1,  0,-1];
			function dsp(dir) {
				//console.log(queue.length);
				var pos = queue[queue.length-1]
				var x = pos[0];
				var y = pos[1];
				var tx = x+dx[dir];
				var ty = y+dy[dir];
				if (game.map.get(tx,ty) == 0) {
					queue.push([tx,ty]);
					game.drawArc(tx,ty,1);
					game.map.set(tx,ty,1);
					if (queue.length) {
						setTimeout(function(){dsp(dir);},to);
					}
				} else {
					if (dir == 3) {
						queue.pop();
						dir = 0;
					} else {
						dir++;
					}
					if (queue.length) {
						setTimeout(function(){dsp(dir);},0);
					}
				}
				
			}
			dsp(0);
		}
	};
	game.drawPain();
	game.drawLine([10,10], [10, 40]);
	game.drawLine([10,10], [40, 20]);
	game.drawLine([10,40], [40, 20]);
	
	$('#x10').on('click', function() {
		$canvas.off('click');
		$canvas.on('click', game.onclick1);
	});
	$('#x11').on('click', function() {
		$canvas.off('click');
		$canvas.on('click', game.onclick);
		game.first = null;
	});
	$('#x12').on('click', function() {
		$canvas.off('click');
		$canvas.on('click', game.onclick2);
	});
	$('#x21').on('click', function() {method = 1;});
	$('#x22').on('click', function() {method = 2;});
	$('#x23').on('click', function() {method = 3;});
	$('#x31').on('click', function() {fast = true;});
	$('#x32').on('click', function() {fast = false;});
});

function sleep(delay) {
	var start = new Date().getTime();
	while(start+delay > new Date().getTime());
}

function clear() {
	game.map.init(0);
	game.drawPain();
}

function GameMap(W, H, initval=0) {
	this.W = W;
	this.H = H;
	this.maparray = new Array(W);
	for (var i=0; i<W; i++) {
		this.maparray[i] = new Array(H);
		for (var j=0; j<H; j++) 
			this.maparray[i][j] = initval;
	}
	this.init = function (initval) {
		for (var i=0; i<W; i++) {
			for (var j=0; j<H; j++) 
				this.maparray[i][j] = initval;
		}
	}
	this.set = function(x,y,val=0) {
		if (x<0 || x>=this.W || y<0 || y>=this.H) 
			return null;
		this.maparray[x][y] = val;
		return true;
	}
	this.get = function(x,y) {
		if (x<0 || x>=this.W || y<0 || y>=this.H) 
			return -2;
		return this.maparray[x][y];
	}
	this.tranfrom = function(gmap,wallvalue=-1) {
		for (var i=0; i<this.W; i++) {
			for (var j=0; j<this.H; j++) {
				this.maparray[i][j] = gmap.maparray[i][j]>0?wallvalue:0;
			}
		}
	}
}
