
var $;
$ = $ || {};


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
	
	/* //b3.render();
	setInterval(function gameloop() {
		ctx.clearRect(0,0,width,height);
		b3.render();
	}, 1000/60); */
	$.animationFrame(function draw() {
		ctx.clearRect(0,0,width,height);
		b3.render();
	});
}











