
var $;
$ = $ || {};

(function Mat2dkit($) {
	//2D变换组件
	// rotate 逆时针
	function Mat() {
		this.type = 'Mat';
		this.get = function (x, y) {
			if (x>2 || x<0 || y>2 || y<0) throw new Error('矩阵访问失败');
			return this.array[x*3+y];
		}
		this.set = function (x, y, value) {
			if (x>2 || x<0 || y>2 || y<0) throw new Error('矩阵访问失败');
			this.array[x*3+y] = value;
		}
		this.mul = function (mat) {
			var res = new Mat();
			for (let i=0; i<3; i++) {
				for (let j=0; j<3; j++) {
					res.set(i,j,this.get(i,0)*mat.get(0,j)+this.get(i,1)*mat.get(1,j)+this.get(i,2)*mat.get(2,j));
				}
			}
			return res;
		}
		this.tran = function(a,b) {return new Mat('tran',a,b).mul(this);}
		this.rotate = function(radian) {return new Mat('rotate',radian).mul(this);}
		this.symX = function() {return (new Mat('symX')).mul(this);}
		this.symY = function() {return (new Mat('symY')).mul(this);}
		this.log = function () {
			console.log(this.array.slice(0,3).join(' ')+'\n'+
				this.array.slice(3,6).join(' ')+'\n'+
				this.array.slice(6,9).join(' ')+'\n');
		}
		this.array = new Array(9);
		for (let i=0; i<9; i++) this.array[i] = 0;
		this.set(0,0,1);
		this.set(1,1,1);
		this.set(2,2,1);
		if (arguments.length > 0) {
			if (arguments[0] == 'tran') {
				this.set(0,2,arguments[1] || 0);
				this.set(1,2,arguments[2] || 0);
			} else if (arguments[0] == 'rotate') {
				var radian = arguments[1] || 0;//Math.PI*(arguments[1] || 0)/180;
				var sin = Math.sin(radian);
				var cos = Math.cos(radian);
				this.set(0,0,cos);
				this.set(0,1,-sin);
				this.set(1,0,sin);
				this.set(1,1,cos);
			} else if (arguments[0] == 'symX') {
				this.set(0,0,1);
				this.set(1,1,-1);
				
			} else if (arguments[0] == 'symY') {
				this.set(0,0,-1);
				this.set(1,1,1);
			}
		}
	}
	//$.Mat = Mat;
	$.tran = function(dx,dy){return new Mat('tran', dx,dy);};
	$.rotate = function(radian){return new Mat('rotate', radian);};
	$.symX = function(){return new Mat('symX');};
	$.symY = function(){return new Mat('symY');};
	function leftmul(point, mat) {
		if (!(point instanceof Array) || point.length>2) throw new Error('point应是长度为2的Array');
		var x = mat.get(0,0)*point[0]+mat.get(0,1)*point[1]+mat.get(0,2)*1;
		var y = mat.get(1,0)*point[0]+mat.get(1,1)*point[1]+mat.get(1,2)*1;
		return [x,y];
	}
	Array.prototype.tran = function(dx,dy){return leftmul(this,new Mat('tran',dx,dy));};
	Array.prototype.rotate = function(radian){return leftmul(this,new Mat('rotate',radian));};
	Array.prototype.symX = function(){return leftmul(this,new Mat('symX'));};
	Array.prototype.symY = function(){return leftmul(this,new Mat('symY'));};
	Array.prototype.shape = function(mat){return leftmul(this, mat);};
	Array.prototype.log = function(){console.log(this);};
})($);

(function Dragkit($){
	//canvas拖拽组件s
	function Mouse(node) {
		this.state = false;
		this.draglist = [];		//x1, y1, x2, y2, true/false:true means not stop
		this.clicklist = [];	//x, y
		this.addClick = function(e){this.clicklist.push(e);};
		this.addDrag = function(obj, e, delay=20){this.draglist.push([obj, e,delay]);};
		this.off = function(){this.draglist=[];this.clicklist=[];}
		var ms = this;
		node.onmousedown = function (e) {
			ms.state = true;
			ms.t = new Date().getTime();
			ms.lastt = new Date().getTime();
			ms.pos = [e.offsetX, e.offsetY];
		};
		node.onmouseup = function(e) {
			if (ms.state) {
				if (new Date().getTime() - ms.t < 150) {
					for(var i=0; i<ms.clicklist.length; i++) {
						ms.clicklist[i](e.offsetX, e.offsetY);
					}
					console.log('click');
				} else {
					for(var i=0; i<ms.draglist.length; i++) {
						ms.draglist[i][1].call(ms.draglist[i][0], 
									ms.pos[0],ms.pos[1],
									e.offsetX, e.offsetY, false);
					}
					console.log('dragdown');
				}
				ms.state = false;
			}
		};
		node.onmousemove = function(e) {
			if (ms.state) {
				var t = new Date().getTime();
				for(var i=0; i<ms.draglist.length; i++) {
					if (t - ms.lastt > ms.draglist[i][2] ) {
						ms.draglist[i][1].call(ms.draglist[i][0], 
									ms.pos[0],ms.pos[1],
									e.offsetX, e.offsetY, true);
					}
				}
				ms.lastt = t;
				console.log('drag');
			}
		};
	}
	$.getMouseState = function(node) {
		return new Mouse(node);
	}
})($);


function Bezier(ctx, isMain, width, height) {
	this.ctx = ctx;
	this.width = width || window.innerWidth;
	this.height = height || window.innerHeight;
	this.isMain = isMain;
	this.points = [];
	this.sympoints = [[this.width/2,this.height/2-50],[this.width/2,this.height/2+50]];
	this.sym = null;
	if (isMain) {
		this.sym = new Bezier(ctx, false, width, height);
	}
	this.render = function() {
		var ctx = this.ctx;
		if (this.points.length < 2) return;
		if (this.points.length == 2) {
			ctx.beginPath();
			ctx.moveTo(this.points[0][0],this.points[0][1]);
			ctx.lineTo(this.points[1][0],this.points[1][1]);
			ctx.strokeStyle = this.isMain?'black':'lightblue';
			ctx.stroke();
		} else {
			if (this.isMain) {
				ctx.strokeStyle = 'gray';
				for (let i=0; i<this.points.length; i++) {
					ctx.beginPath();
					ctx.arc(this.points[i][0],this.points[i][1],5,0,2*Math.PI);
					ctx.stroke();
				}
				if (this.sympoints.length == 2) {
					for (let i=0; i<this.sympoints.length; i++) {
						ctx.beginPath();
						ctx.arc(this.sympoints[i][0],this.sympoints[i][1],5,0,2*Math.PI);
						ctx.stroke();
					}
					var dx = this.sympoints[1][0] - this.sympoints[0][0];
					var dy = this.sympoints[1][1] - this.sympoints[0][1];
					var sqrt = Math.sqrt(dx*dx+dy*dy);
					var max = Math.max(this.width, this.height);
					ctx.save();
					ctx.beginPath();
					ctx.setLineDash([4]);
					ctx.moveTo(this.sympoints[0][0]+dx/sqrt*max, this.sympoints[0][1]+dy/sqrt*max);
					ctx.lineTo(this.sympoints[0][0]-dx/sqrt*max, this.sympoints[0][1]-dy/sqrt*max);
					ctx.stroke();
					ctx.restore();
					ctx.beginPath();
					ctx.moveTo(this.sympoints[0][0],this.sympoints[0][1]);
					ctx.lineTo(this.sympoints[1][0],this.sympoints[1][1]);
					ctx.stroke();
				}
			}
			
			ctx.beginPath();
			ctx.moveTo(this.points[0][0],this.points[0][1]);
			var points = [];
			for (let i=1; i<this.points.length; i++) {
				points.push(this.points[i][0],this.points[i][1]);
			}
			if (this.points.length == 3) ctx.quadraticCurveTo.apply(ctx, points);
			ctx.bezierCurveTo.apply(ctx, points);
			$.points = points;
			ctx.strokeStyle = this.isMain?'black':'blue';
			ctx.stroke();
			
		}
		if (this.sym) {
			var tx = this.sympoints[0][0];
			var ty = this.sympoints[0][1];
			var dx = this.sympoints[1][0]-this.sympoints[0][0];
			var dy = this.sympoints[1][1]-this.sympoints[0][1];
			var radian = Math.acos(dy/Math.sqrt(dx*dx+dy*dy)*(dx>0?1:-1));
			tmat = $.tran(-tx,-ty).rotate(radian).symY().rotate(-radian).tran(tx,ty);
			$.tmat = tmat;
			$.radian = radian;
			$.tx = tx;
			$.ty = ty;
			for (var i=0; i<this.points.length; i++) {
				this.sym.points[i] = this.points[i].shape(tmat);
			}
			this.sym.render();
		}
	}
	
	this.dragsave = [0,0];
	this.isOndrag = false;
	this.ondrag = function (x1,y1,x2,y2,isdrag) {
		var ctx = this.ctx;
		if (this.isOndrag) {
			if (this.dragsave[0] == 0) {
				var i = this.dragsave[1];
				this.points[i][0] = x2;
				this.points[i][1] = y2;
			} else {
				var i = this.dragsave[1];
				this.sympoints[i][0] = x2;
				this.sympoints[i][1] = y2;
			}
			this.isOndrag = isdrag;
			return;
		}
		for (var i=0; i<this.points.length; i++) {
			ctx.beginPath();
			ctx.arc(this.points[i][0], this.points[i][1],12,0,2*Math.PI);
			if (ctx.isPointInPath(x1,y1)) {
				this.isOndrag = true;
				this.dragsave = [0, i];
				this.points[i][0] = x2;
				this.points[i][1] = y2;
				return;
			}
		}
		for (var i=0; i<this.sympoints.length; i++) {
			ctx.beginPath();
			ctx.arc(this.sympoints[i][0], this.sympoints[i][1],12,0,2*Math.PI);
			if (ctx.isPointInPath(x1,y1)) {
				this.isOndrag = true;
				this.dragsave = [1, i];
				this.sympoints[i][0] = x2;
				this.sympoints[i][1] = y2;
				return;
			}
		}
	}
}


window.onload = function () {
	var canvas = document.createElement('canvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	document.body.appendChild(canvas);
	//canvas.style.backgroundColor = 'lightblue';
	var width = window.innerWidth;
	var height = window.innerHeight;
	var ctx = canvas.getContext('2d');
	ctx.lineWidth = 3;
	var b3 = new Bezier(ctx,true, width, height);
	b3.points = [[100,100],[100,200],[300,300],[300,400]];
	
	
	var mouse = $.getMouseState(canvas);
	mouse.addDrag(b3, b3.ondrag, 10);
	
	//b3.render();
	setInterval(function gameloop() {
		ctx.clearRect(0,0,width,height);
		b3.render();
	}, 1000/60);
}











