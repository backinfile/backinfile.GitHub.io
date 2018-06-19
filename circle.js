
function randInt(min, max) {return Math.floor(Math.random()*(max-min+1)+min);}
function randTri(v=45) {
	this.des = randInt(20,120);
	this.sig = 1;
	this.cur = 0;
	this.value = v;
	this.update = function () {
		this.cur += this.des/11;
		if (this.cur>=this.des) {
			this.value = this.value+this.cur*this.sig;
			if (Math.random()>=0.3) {
				this.des = randInt(0,2);
			} else {
				this.des = randInt(20,100);
			}
			if (Math.random()>=0.3)this.sig *= -1;
			this.cur = 0;
		}
	}
	this.rand = function() {
		return this.value+this.cur*this.sig;
	}
}

$(function(){
	$canvas = $('canvas');
	var arcrotate = 0;
	var trirotate = new randTri(45);
	var trirotate2 = new randTri(90);
	var trirotate3 = new randTri(160);
	setInterval(function() {
		$canvas.clearCanvas();
		$canvas.drawRect({
			fillStyle: '#be6397',
			x:0,y:0,
			width:800,
			height:600,
			fromCenter:false,
		}).drawArc({
			strokeStyle: '#d9baee',
			strokeWidth: 20,
			x: 400, y: 300,
			radius: 110,
			start: 110, end: 359,
			rotate:arcrotate,
			shadowColor: '#FFF',
			shadowBlur: 5
		}).drawArc({
			strokeStyle: '#ffc5ff',
			strokeWidth: 20,
			x: 400, y: 300,
			radius: 110,
			start: 0, end: 109,
			rotate:arcrotate,
			shadowColor: '#FFF',
			shadowBlur: 5
		});
		$canvas.drawArc({
			strokeStyle: '#eac2fd',
			strokeWidth: 6,
			x: 400, y: 300,
			radius: 85,
			start: 45, end: 160,
			rotate:-arcrotate,
			shadowColor: '#FFF',
			shadowBlur: 5
		}).drawArc({
			strokeStyle: '#eac2fd',
			strokeWidth: 6,
			x: 400, y: 300,
			radius: 85,
			start: 185, end: 270,
			rotate:-arcrotate,
			shadowColor: '#FFF',
			shadowBlur: 5
		}).drawArc({
			strokeStyle: '#eac2fd',
			strokeWidth: 6,
			x: 400, y: 300,
			radius: 85,
			start: 315, end: 360,
			rotate:-arcrotate,
			shadowColor: '#FFF',
			shadowBlur: 5
		});
		$canvas.drawArc({
			strokeStyle: '#edffff',
			strokeWidth: 7,
			x: 400, y: 300,
			radius: 85,
			start: 31, end: 40,
			rotate:-arcrotate,
			shadowColor: '#FFF',
			shadowBlur: 9
		}).drawArc({
			strokeStyle: '#edffff',
			strokeWidth: 7,
			x: 400, y: 300,
			radius: 85,
			start: 170, end: 175,
			rotate:-arcrotate,
			shadowColor: '#FFF',
			shadowBlur: 9
		}).drawArc({
			strokeStyle: '#edffff',
			strokeWidth: 7,
			x: 400, y: 300,
			radius: 85,
			start: 270, end: 290,
			rotate:-arcrotate,
			shadowColor: '#FFF',
			shadowBlur: 9
		});
		$('canvas').drawPolygon({
			fillStyle: '#daffff',
			x: 400, y: 300,
			radius: 7,
			sides: 3,
			rotate: trirotate.rand(),
			translateX:0,
			translateY:135,
			shadowColor: '#FFF',
			shadowBlur: 9
		}).drawPolygon({
			fillStyle: '#daffff',
			x: 400, y: 300,
			radius: 7,
			sides: 3,
			rotate: trirotate.rand()+180,
			translateX:0,
			translateY:135,
			shadowColor: '#FFF',
			shadowBlur: 9
		});
		$('canvas').drawPolygon({
			fillStyle: '#ff76ff',
			x: 400, y: 300,
			radius: 7,
			sides: 3,
			rotate: trirotate2.rand(),
			translateX:0,
			translateY:135,
			shadowColor: '#FFF',
			shadowBlur: 9
		});
		$('canvas').drawPolygon({
			fillStyle: '#ff80ff',
			x: 400, y: 300,
			radius: 7,
			sides: 3,
			rotate: trirotate3.rand(),
			translateX:0,
			translateY:135,
			shadowColor: '#FFF',
			shadowBlur: 5
		});
		arcrotate += 1.5;
		trirotate.update();
		trirotate2.update();
		trirotate3.update();
		
	}, 1000/30);
	
	
	
});