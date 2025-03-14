
var width = 1000;
var height = 600;
var unitSize = 40;
var game = null;

function randInt(min, max) {return Math.floor(Math.random()*(max-min+1)+min);}


$(function() {
	$canvas = $('canvas');
	game = new function Game() {	//only one
		this.W = Math.floor(width/(unitSize))-1;
		this.H = Math.floor(height/(unitSize))-1;;
		this.offsetX = (width-unitSize*this.W)/2;
		this.offsetY = (height-unitSize*this.H)/2;
		this.getoripos = function (x,y) {
			var dx = this.offsetX+this.W*unitSize;
			var dy = this.offsetY+this.H*unitSize;
			return [dx,dy];
		}
		this.getmidpos = function (x,y) {
			var dx = this.offsetX+x*unitSize+unitSize/2;
			var dy = this.offsetY+y*unitSize+unitSize/2;
			return [dx,dy];
		}
		this.drawRect = function(x,y, inc=true) {
			var pos = this.getmidpos(x,y);
			if (inc) {
				$canvas.drawRect({
					fillStyle: '#CCC',
					x:pos[0],
					y:pos[1],
					width:unitSize-4,
					height:unitSize-4,
					fromCenter:true,
					cornerRadius: 3
				});
			} else {
				$canvas.drawRect({
					strokeStyle: 'green',
					strokeWidth: 4,
					x:pos[0],
					y:pos[1],
					width:unitSize-2,
					height:unitSize-2,
					fromCenter:true,
					cornerRadius: 3
				});
			}
		}
		this.drawIcon = function(x, y, style) {
			if (style <= 0) return null;
			var pos = this.getmidpos(x,y);
			var w = style%6;
			var h = Math.floor(style/6)
			$('canvas').drawImage({
				source: 'img/timg.jpg',
				x: pos[0], y: pos[1],
				sWidth: 200,
				sHeight: 200,
				sx: w*200, sy: h*200,
				scale:unitSize/255,
				fromCenter:true,
				shadowColor: '#000',
				shadowBlur: 5,
			});	
		}
		this.drawGrid = function() {
			for (var i=1; i<this.W-1; i++) {
				for (var j=1; j<this.H-1; j++) {
					if (this.map.get(i,j)>0)
						this.drawRect(i,j);
				}
			}
		}
		this.map = new GameMap(this.W, this.H);
		this.fillmap = function() {
			for (var i=1; i<this.W-1; i++) {
				for (var j=1; j<this.H-1; j++) {
					this.map.set(i,j,randInt(1,10));
				}
			}
		}
		this.fillmap();
		this.drawIcons = function() {
			for (var i=0; i<this.W; i++) {
				for (var j=0; j<this.H; j++) {
					var style = this.map.get(i,j);
					this.drawIcon(i,j,style);
				}
			}
		}
		this.flush = function () {
			$canvas.clearCanvas();
			//this.drawGrid();
			this.drawIcons();
		}
		this.drawPath = function(path) {
			var obj = {
			  strokeStyle: 'rgba(20%,20%,100%, 90%)',
			  strokeWidth: 6,
			  rounded: true,
			  shadowColor: '#000',
			  shadowBlur: 5,
			};
			for (var p=0; p<path.length; p++) {
				var pos = this.getmidpos(path[p][0],path[p][1]);
				obj['x'+(p+1)] = pos[0];
				obj['y'+(p+1)] = pos[1];
			}
			$canvas.drawLine(obj);
		}
		this.tmpmap = new GameMap(this.W,this.H,-1);
		this.pathmap = new GameMap(this.W,this.H,null);
		this.line = function(pos1, pos2) {
			this.tmpmap.tranfrom(this.map);
			this.pathmap.init(null);
			function dsp(pos, path, cur, max, dir) {
				//console.log(pos,path,cur,dir);
				if (cur >= max) return null;
				path.push(pos);
				var dx = [1, 0, 0,-1];
				var dy = [0, -1, 1,0];
				for (var i=0; i<4; i++) {
					if (dir>=0 &&(dir+i==3)) continue;
					var cnt = 1;
					var tpath = path.slice();
					while(1) {
						var tx = pos[0]+dx[i]*cnt;
						var ty = pos[1]+dy[i]*cnt;
						var t = game.tmpmap.get(tx,ty);
						if (tx==pos2[0] && ty==pos2[1]) {
							tpath.push([tx,ty]);
							return tpath;
						}
						if ((t<=cur && t>0) || t<0) break;
						game.tmpmap.set(tx,ty,cur);
						game.pathmap.set(tx,ty,[pos[0]+dx[i]*(cnt-1),pos[1]+dy[i]*(cnt-1)]);
						var tmppath = tpath.slice();
						var p = dsp([tx,ty],tmppath,cur+1, max, i);
						if (p) return p;
						tpath.push([tx,ty]);
						cnt++;
					}
				}
				return null;
			}
			return dsp(pos1, [], 1, 4, -1);
		}
		
		this.first = null;
		this.onclick = function (e) {
			var x = Math.floor((e.offsetX-game.offsetX)/unitSize);
			var y = Math.floor((e.offsetY-game.offsetY)/unitSize);
			console.log(x,y);
			if (game.map.get(x,y)<=0) return null;
			if (!game.first) {
				//game.flush();
				game.drawRect(x,y,false);
				game.first = [x,y];
				
			} else {
				if (game.first[0]==x && game.first[1]==y) {
					game.flush();
					game.first = null;
				} else if (game.map.get(game.first[0],game.first[1]) == game.map.get(x,y)){
					var res = game.line([x,y], game.first);
					if (res) {
						game.drawRect(x,y,false);
						game.drawPath(res);
						$canvas.off('click');
						setTimeout(function(){
							game.map.set(game.first[0],game.first[1], 0);
							game.map.set(x,y, 0);
							game.first = null;
							game.flush();
							$canvas.on('click',game.onclick);
							console.log('ok');
						}, 200);
					} else {
						game.flush();
						game.first = [x,y];
						game.drawRect(x,y,false);
					}
				} else {
					game.flush();
					game.drawRect(x,y,false);
					game.first = [x,y];
				}
			}
			
		}
		$canvas.on('click',this.onclick);
	};
	game.flush();
});


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



