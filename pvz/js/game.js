
function Tank(pos) {
	this.pos = pos || [100, 100];
	this.rotate = 0;
}
Tank.prototype = {
	
};


window.onload = function () {
	var canvas = document.createElement('canvas');
	var width = window.innerWidth;
	var height = window.innerHeight;
	canvas.width = width;
	canvas.height = height;
	document.body.appendChild(canvas);
	var ctx = canvas.getContext('2d');
	var mouse = $.getMouseState(canvas);
	
	
	setInterval(function gameloop() {
		ctx.clearRect(0,0,width,height);
	}, 1000/60);
}











