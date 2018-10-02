
var game = null;
function randInt(min, max) {return Math.floor(Math.random()*(max-min+1))+min};



(function canvaskit($){
	function Mouse(jqnode) {
		this.state = false;
		this.draglist = [];		//x1, y1, x2, y2, true/false:true means not stop
		this.clicklist = [];	//x, y
		this.addClick = function(e){this.clicklist.push(e);};
		this.addDrag = function(e){this.draglist.push(e);};
		this.off = function(){this.draglist=[];this.clicklist=[];}
		var ms = this;
		jqnode.on('mousedown', function(e) {
			ms.state = true;
			ms.t = new Date().getTime();
			ms.lastt = new Date().getTime();
			ms.pos = [e.offsetX, e.offsetY];
		});
		jqnode.on('mouseup mouseout', function(e) {
			if (ms.state) {
				if (new Date().getTime() - ms.t < 150) {
					for(var i=0; i<ms.clicklist.length; i++) {
						ms.clicklist[i](e.offsetX, e.offsetY);
					}
					console.log('click');
				} else {
					for(var i=0; i<ms.draglist.length; i++) {
						ms.draglist[i](ms.pos[0],ms.pos[1],
									e.offsetX, e.offsetY, false);
					}
					console.log('dragdown');
				}
				ms.state = false;
			}
		});
		jqnode.on('mousemove', function(e) {
			if (ms.state) {
				var t = new Date().getTime();
				if (t - ms.lastt > 20 ) {
					ms.lastt = t;
					for(var i=0; i<ms.draglist.length; i++) {
						ms.draglist[i](ms.pos[0],ms.pos[1],
									e.offsetX, e.offsetY, true);
					}
					console.log('drag');
				}
			}
		});
	}
	$.fn.extend({
		fillRect: function(x,y,width,height,color){
			if (!this[0].getContext) return;
			var ctx = this[0].getContext('2d');
			ctx.fillStyle = color || 'black';
			ctx.beginPath();
			ctx.moveTo(x,y);
			ctx.lineTo(x+width,y);
			ctx.lineTo(x+width,y+height);
			ctx.lineTo(x,y+height);
			ctx.closePath();
			ctx.fill();
		},
		clear: function() {
			if (!this[0].getContext) return;
			var ctx = this[0].getContext('2d');
			ctx.clearRect(0,0,this.width(),this.height());
		},
		getMouseState: function() {
			return new Mouse(this);
		}
	});
})(jQuery);


$(function() {
	$canvaswarp = $('.canvaswarp');
	var width = $canvaswarp.width();
	var height = $canvaswarp.height();
	var unitSize = 16;
	$canvaswarp.html('<canvas width='+width+' height='+height+'>您的浏览器不支持canvas</canvas>');
	var $canvas = $('canvas');
	width = $canvas.width();
	height = $canvas.height();
	
	// $canvaswarp.css('background-image', 'url(img/timg.jpg)');
	
	
	game = new function Game() {
		this.W = Math.floor(width/unitSize);
		this.H = Math.floor(height/unitSize);
		this.offsetX = (width-unitSize*this.W)/2;
		this.offsetY = (height-unitSize*this.H)/2;
		
		this.map = new GameMap(this.W, this.H, 0);
		this.colormap = ['white', '#AAA', '#333', 'black', 'red', 'blue', 'green', 'rgba(0,0,0,0)'];
		this.colorid = 0;
		this.ismapchanged = true;
		this.shapeSave = {
			state: false, list: [],
			begin: function() {this.state = true;this.list = [];},
			push: function(x,y,color) {if (this.state)this.list.push([x,y,color]);},
			recover: function() {
				for (var i=0; i<this.list.length; i++) {
					var t = this.list[i];
					game.point({x:t[0],y:t[1],color:t[2]});
				}
			},
			end: function() {this.state = false;}
		}
		this.point = function(options) {
			options = $.extend({x:0,y:0,color:this.colorid}, options);
			var t = this.map.get(options.x, options.y);
			if (t != options.color) {
				this.ismapchanged = true;
				this.map.set(options.x, options.y, options.color);
				this.shapeSave.push(options.x, options.y, t);
			}
		}
		this.line = function(x1,y1,x2,y2,color) {
			var pos1 = [x1,y1];
			var pos2 = [x2,y2];
			var color = color || this.colorid;
			var tx = pos2[0]-pos1[0];
			var ty = pos2[1]-pos1[1];
			if (tx == 0) {
				for (var i=0; i<Math.abs(ty); i++) {
					this.point({x:pos1[0], y:pos1[1]+(ty>0?1:-1)*i, color:color});
				}
			} else if (Math.abs(tx)>=Math.abs(ty)) {
				for (var i=0; i<Math.abs(tx); i++) {
					this.point({
						x:pos1[0]+i*(tx>0?1:-1), 
						y:Math.round(pos1[1]+i*ty/Math.abs(tx)), 
						color:color});
				}
				this.point({x:pos2[0],y:pos2[1], color:color});
			} else {
				for (var i=0; i<Math.abs(ty); i++) {
					this.point({x:Math.round(pos1[0]+i*tx/Math.abs(ty)), y:pos1[1]+i*(ty>0?1:-1), color:color});
				}
				this.point({x:pos2[0],y:pos2[1], color:color});
			}
		}
		this.shape = function(options) {
			this.shapeSave.begin();
			this.shapeSave.end();
		}
		this.getColor = function (options) {
			options = $.extend({x:0,y:0}, options);
			return game.map.get(options.x, options.y);
		}
		this.fill = function (x,y,color) {
			color = color || this.colorid;
			var oricolor = game.map.get(x,y);
			if (color == oricolor) return;
			var queue = [];
			queue.push([x,y]);
			var dx = [1, 0, -1, 0];
			var dy = [0, 1,  0,-1];
			while(queue.length) {
				//if (queue.length%10 == 0)console.log(queue.length);
				var pos = queue.pop();
				var x = pos[0];
				var y = pos[1];
				game.point({x:x,y:y,color:color});
				for (var i=0; i<4; i++) {
					var tx = x+dx[i];
					var ty = y+dy[i];
					if (game.map.get(tx,ty) == oricolor) {
						queue.push([tx,ty]);
					}
				}
			}
		}
		this.isgrid = false;
		this.draw = function (force) { // clear and draw (the only one draws)
			if (force || this.ismapchanged) {
				$canvas.clear();
				var size = unitSize;
				if (!this.isgrid) size += 1;
				for (var i=0; i<this.W; i++) {
					for (var j=0; j<this.H; j++) {
						var color = this.map.get(i,j);
						$canvas.fillRect(this.offsetX+i*unitSize, 
							this.offsetY+j*unitSize,
							size, size,
							this.colormap[color]);
					}
				}
				this.ismapchanged = false;
			}
		}
		
		this.getmappos = function(x,y) {	// canvas pos to map pos
			return [Math.floor((x-this.offsetX)/unitSize), Math.floor((y-this.offsetY)/unitSize)];
		}
		
		/// select things
		this.colorid = 1;
		this.shapeselect = 1;
		this.isgrid = false;
		this.mouse = $canvas.getMouseState();
		$canvas.css('cursor','crosshair');
		$('#clear').on('click', function(){
			game.map.clear(0);
			game.draw(true);
		});
		$('#cancel').on('click', function(){
			game.shapeSave.recover();
			game.draw();
		});
		$('#save').on('click', function(){
			url = $canvas[0].toDataURL("image/png");
			var t = $("#download").attr("href", url).attr("download", "canvas.png");
			t[0].click();
		});
		$('[name="grid"]').on('change', function() {
			game.isgrid = !game.isgrid;
			game.draw(true);
		});
		$('[name="color"]').on('change', function() {
			game.colorid = parseInt($(this).val());
		});
		$('[name="shape"]').on('change', function() {
			game.shapeselect = parseInt($(this).val());
			console.log(game.shapeselect);
		});
		this.mouse.addDrag(dragline);
		$('[name="radio1"]').on('change', function() {
			var val = parseInt($(this).val());
			game.mouse.off();
			if (val == 0) {
				$canvas.css('cursor','url(img/pen.ico) 0 32, auto');
			} else if (val == 1) {
				$canvas.css('cursor','crosshair');
			} else if (val == 2) {
				$canvas.css('cursor','crosshair');
			} else if (val == 3) {
				$canvas.css('cursor','url(img/fill.ico) 0 16, auto');
			}
			if (val == 1) {game.mouse.addDrag(dragline);}
			else if (val == 0) {
				game.mouse.addClick(clickpoint);
				game.mouse.addDrag(dragpoint);
			} else if (val == 3) {
				game.mouse.addClick(clickfill);
			} else if (val == 2) {
				game.mouse.addDrag(dragshape);
			}
			
		});
	};
	game.draw();
});


function GameMap(W, H, initval=0) {
	if (W['W']) {
		this.W = W.W;
		this.H = W.H;
		this.maparray = new Array(this.W);
		for (var i=0; i<this.W; i++) {
			this.maparray[i] = new Array(this.H);
			for (var j=0; j<this.H; j++) 
				this.maparray[i][j] = W.get(i,j);
		}
	} else {
		this.W = W;
		this.H = H;
		this.maparray = new Array(W);
		for (var i=0; i<W; i++) {
			this.maparray[i] = new Array(H);
			for (var j=0; j<H; j++) 
				this.maparray[i][j] = initval;
		}
	}
	this.clear = function (initval=0) {
		for (var i=0; i<W; i++) {
			for (var j=0; j<H; j++) 
				this.maparray[i][j] = initval;
		}
	}
	this.set = function(x,y,val=0) {
		if (x<0 || x>=this.W || y<0 || y>=this.H) 
			return null;
		if (this.maparray[x][y] == val) return false;
		this.maparray[x][y] = val;
		return true;
	}
	this.get = function(x,y) {
		if (x<0 || x>=this.W || y<0 || y>=this.H) 
			return -2;
		return this.maparray[x][y];
	}
}


function dragline(x1,y1,x2,y2,st) {
	var pos1 = game.getmappos(x1,y1);
	var pos2 = game.getmappos(x2,y2);
	game.shapeSave.begin();
	game.line(pos1[0],pos1[1],pos2[0],pos2[1]);
	game.shapeSave.end();
	game.draw();
	if (st) game.shapeSave.recover();
}
function clickpoint(x,y) {
	var pos = game.getmappos(x,y);
	game.shapeSave.begin();
	game.point({x:pos[0],y:pos[1]});
	game.shapeSave.end();
	game.draw();
}
function dragpoint(x1,y1,x2,y2,st) {
	var pos = game.getmappos(x2,y2);
	game.shapeSave.begin();
	game.point({x:pos[0],y:pos[1]});
	game.shapeSave.end();
	game.draw();
}
function clickfill(x,y) {
	var pos = game.getmappos(x,y);
	game.shapeSave.begin();
	game.fill(pos[0],pos[1]);
	game.shapeSave.end();
	game.draw();
}
function dragshape(x1,y1,x2,y2,st) {
	var pos1 = game.getmappos(x1,y1);
	var pos2 = game.getmappos(x2,y2);
	game.shapeSave.begin();
	if (game.shapeselect == 1) {
		game.line(pos1[0],pos1[1],pos1[0],pos2[1]);
		game.line(pos1[0],pos2[1],pos2[0],pos2[1]);
		game.line(pos2[0],pos1[1],pos2[0],pos2[1]);
		game.line(pos1[0],pos1[1],pos2[0],pos1[1]);
	} else if (game.shapeselect == 2) {
		var r = Math.sqrt(Math.pow(pos1[0]-pos2[0],2) + Math.pow(pos1[1]-pos2[1],2));
		var total = Math.floor(r*10);
		for (var i=0; i<total; i++) {
			var x = pos1[0]+r*Math.cos(Math.PI*2*i/total);
			var y = pos1[1]+r*Math.sin(Math.PI*2*i/total);
			game.point({x:Math.round(x),y:Math.round(y)});
		}
	} else if (game.shapeselect == 3) {
		var r = Math.sqrt(Math.pow(pos1[0]-pos2[0],2) + Math.pow(pos1[1]-pos2[1],2));
		var nr = r*Math.cos(72/180*Math.PI)/Math.cos(36/180*Math.PI);
		function getCos(n) {return Math.floor(r*Math.cos(n/180*Math.PI));}
		function getSin(n) {return Math.floor(r*Math.sin(n/180*Math.PI));}
		function ngetCos(n) {return Math.floor(nr*Math.cos(n/180*Math.PI));}
		function ngetSin(n) {return Math.floor(nr*Math.sin(n/180*Math.PI));}
		var posu = [pos1[0], pos1[1]-Math.floor(r)];
		var posr = [pos1[0]+getCos(18), pos1[1]-getSin(18)];
		var posl = [pos1[0]-getCos(18), pos1[1]-getSin(18)];
		var posur = [pos1[0]+ngetCos(54), pos1[1]-ngetSin(54)];
		var posul = [pos1[0]-ngetCos(54), pos1[1]-ngetSin(54)];
		var posdur = [pos1[0]+ngetCos(360-18), pos1[1]-ngetSin(360-18)];
		var posdul = [pos1[0]-ngetCos(360-18), pos1[1]-ngetSin(360-18)];
		var posdr = [pos1[0]+getCos(360-54), pos1[1]-getSin(360-54)];
		var posdl = [pos1[0]-getCos(360-54), pos1[1]-getSin(360-54)];
		var posd = [pos1[0], pos1[1]+Math.floor(nr)];
		game.line(posu[0], posu[1], posur[0], posur[1]);
		game.line(posu[0], posu[1], posul[0], posul[1]);
		game.line(posr[0], posr[1], posur[0], posur[1]);
		game.line(posl[0], posl[1], posul[0], posul[1]);
		game.line(posr[0], posr[1], posdur[0], posdur[1]);
		game.line(posl[0], posl[1], posdul[0], posdul[1]);
		game.line(posdr[0], posdr[1], posdur[0], posdur[1]);
		game.line(posdl[0], posdl[1], posdul[0], posdul[1]);
		game.line(posdr[0], posdr[1], posd[0], posd[1]);
		game.line(posdl[0], posdl[1], posd[0], posd[1]);
	}
	game.shapeSave.end();
	game.draw();
	if (st) game.shapeSave.recover();
}











