


var width = 1366;
var height = 700;
var speed = 1.5;


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
	
	$('div').mouseenter(function(){speed=0;});
	$('div').mouseout(function(){speed=1.5;});
	$canvas = $('canvas');
	var arcrotate = 0;
	var arcrotate2 = 0;
	var trirotate = new randTri(45);
	var trirotate2 = new randTri(90);
	var trirotate3 = new randTri(160);
	$canvas.clearCanvas({
		fillStyle: '#222',
		x:0,y:0,
		width:width,
		height:height,
		fromCenter:false,
	});
	setInterval(function() {
		$canvas.clearCanvas({
			fillStyle: 'rgb(50%,25%,50%)',
			x:533,y:200,
			width:300,
			height:300,
			fromCenter:false,
		});
		$canvas.drawArc({
			strokeStyle: 'rgba(100%,100%,100%,0.1)',
			strokeWidth: 20,
			x: width/2, y: height/2,
			radius: 110,
			start: 110, end: 359,
			rotate:arcrotate2,
			shadowColor: '#FFF',
			shadowBlur: 5
		}).drawArc({
			strokeStyle: 'rgba(100%,100%,100%,0.4)',
			strokeWidth: 20,
			x: width/2, y: height/2,
			radius: 110,
			start: 0, end: 109,
			rotate:arcrotate2,
			shadowColor: '#FFF',
			shadowBlur: 5
		});
		$canvas.drawArc({
			strokeStyle: 'rgba(100%,100%,100%,0.6)',
			strokeWidth: 6,
			x: width/2, y: height/2,
			radius: 85,
			start: 45, end: 160,
			rotate:-arcrotate,
			shadowColor: '#FFF',
			shadowBlur: 5
		}).drawArc({
			strokeStyle: 'rgba(100%,100%,100%,0.6)',
			strokeWidth: 6,
			x: width/2, y: height/2,
			radius: 85,
			start: 185, end: 270,
			rotate:-arcrotate,
			shadowColor: '#FFF',
			shadowBlur: 5
		}).drawArc({
			strokeStyle: 'rgba(100%,100%,100%,0.6)',
			strokeWidth: 6,
			x: width/2, y: height/2,
			radius: 85,
			start: 315, end: 360,
			rotate:-arcrotate,
			shadowColor: '#FFF',
			shadowBlur: 5
		});
		$canvas.drawArc({
			strokeStyle: 'rgba(100%,100%,100%,1)',
			strokeWidth: 7,
			x: width/2, y: height/2,
			radius: 85,
			start: 31, end: 40,
			rotate:-arcrotate,
			shadowColor: '#FFF',
			shadowBlur: 9
		}).drawArc({
			strokeStyle: 'rgba(100%,100%,100%,1)',
			strokeWidth: 7,
			x: width/2, y: height/2,
			radius: 85,
			start: 170, end: 175,
			rotate:-arcrotate,
			shadowColor: '#FFF',
			shadowBlur: 9
		}).drawArc({
			strokeStyle: 'rgba(100%,100%,100%,1)',
			strokeWidth: 7,
			x: width/2, y: height/2,
			radius: 85,
			start: 270, end: 290,
			rotate:-arcrotate,
			shadowColor: '#FFF',
			shadowBlur: 9
		});
		$('canvas').drawPolygon({
			fillStyle: 'rgba(100%,100%,100%,1)',
			x: width/2, y: height/2,
			radius: 7,
			sides: 3,
			rotate: trirotate.rand(),
			translateX:0,
			translateY:135,
			shadowColor: '#FFF',
			shadowBlur: 9
		}).drawPolygon({
			fillStyle: 'rgba(100%,100%,100%,1)',
			x: width/2, y: height/2,
			radius: 7,
			sides: 3,
			rotate: trirotate.rand()+180,
			translateX:0,
			translateY:135,
			shadowColor: '#FFF',
			shadowBlur: 9
		});
		$('canvas').drawPolygon({
			fillStyle: 'rgba(100%,100%,100%,0.4)',
			x: width/2, y: height/2,
			radius: 7,
			sides: 3,
			rotate: trirotate2.rand(),
			translateX:0,
			translateY:135,
			shadowColor: '#FFF',
			shadowBlur: 9
		});
		$('canvas').drawPolygon({
			fillStyle: 'rgba(100%,100%,100%,0.2)',
			x: width/2, y: height/2,
			radius: 7,
			sides: 3,
			rotate: trirotate3.rand(),
			translateX:0,
			translateY:135,
			shadowColor: '#FFF',
			shadowBlur: 5
		});
		arcrotate += speed;
		arcrotate2 += 1.5;
		if (speed >= 1) {
			trirotate.update();
			trirotate2.update();
			trirotate3.update();
		}
		
	}, 1000/30);
	
	
	
});