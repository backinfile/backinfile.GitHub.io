
var Board = {
	getMinionCardPos: function(width, height, i, j) {
		var offsetX = width/2+10;
		var offsetY = height/2+10;
		var gapX = 10;
		var gapY = 10;
		width += gapX;
		height += gapY;
		return [offsetX+i*width, offsetY+i*height];
	},
	getBoardMinionPos: function(width, height) {
		return [$.width/2-width/2, $.height/2+height/2];
	}
};


var MinionCard = (function() {
	function MinionCard(url='img/brick.jpg') {
		this.imgUrl = url;
		this.state = 'stand'; // moving dragging
		
		this.ready = false;
		
		this.selected = false;
		this.scale = 0.6;
		this.cur_rx = 0;
		this.cur_ry = 0;
		this.aim_rx = 0;
		this.aim_ry = 0;
		var my = this;
		(function loadImage() {
			my.imgData = new Image();
			my.imgData.onload = function() {
				my.ready = true;
				my.height = my.imgData.height;
				my.width = my.imgData.width;
				my.display();
			};
			my.imgData.src = my.imgUrl;
		})();
	}
	MinionCard.prototype = {
		update: function(delta) {
			if (!this.ready) return;
			var scale = this.selected?1:this.scale;
			var shadow = this.selected?10:5;
			var rotateSpeed = 1*delta;
			var dx = this.aim_rx - this.cur_rx;
			var dy = this.aim_ry - this.cur_ry;
			var maxRotateX = Math.min(rotateSpeed, Math.abs(dx));
			var maxRotateY = Math.min(rotateSpeed, Math.abs(dy));
			dx = (dx>0?1:-1)*maxRotateX;
			dy = (dy>0?1:-1)*maxRotateY;
			this.cur_rx += dx;
			this.cur_ry += dy;
			this.imgDOM.style.transform = 
				//'rotateX('+this.cur_ry+'deg) rotateY('+this.cur_rx+'deg) '+
				'translateX('+this.cur_rx+'px) translateY('+this.cur_ry+'px) '+
				'translateZ(40px) '+
				'scale('+scale+','+scale+')';
			this.imgDOM.style.boxShadow='5px 5px '+shadow+'px black';
		},
		display: function() {
			var imgDOM = document.createElement('img');
			this.imgDOM = imgDOM;
			imgDOM.src = this.imgUrl;
			var warp = document.createElement('div');
			warp.style.width = this.width+'px';
			warp.style.height = this.height+'px';
			warp.style.float = 'left';
			warp.appendChild(imgDOM);
			document.body.appendChild(warp);
			//imgDOM.style.border = '4px solid rgb(233,140,45)';
			imgDOM.style.boxShadow = '5px 5px 5px black';
			//imgDOM.style.position = '';
			var my = this;
			imgDOM.onmousemove = function(e) {
				var maxdeg = 10;
				maxdeg = Math.min(maxdeg, my.width*(1-my.scale), my.height*(1-my.scale));
				var dx = e.offsetX-my.width/2;
				var dy = e.offsetY-my.height/2;
				if (Math.abs(dx)>=my.width-20 || Math.abs(dy)>=my.height-20) return;
				my.aim_rx = -dx*2/my.width*maxdeg;
				my.aim_ry = -dy*2/my.height*maxdeg;
				//document.getElementById('show').innerHTML = dx+' '+dy+'<br>'+my.aim_rx+' '+my.aim_ry+'<br>'
				//	+my.cur_rx+' '+my.cur_ry;
			}
			imgDOM.onmouseout = function(e) {
				my.aim_rx = 0;
				my.aim_ry = 0;
				my.selected = false;
			}
			imgDOM.onmouseover = function(e) {
				my.selected = true;
			}
		},
		render: function() {
			if (!this.ready) return;
			$.ctx.drawImage(this.imgData,this.pos[0]-this.width/2, this.pos[1]-this.height/2);
		}
	};
	return MinionCard;
})();

(function() {
	$.width = window.innerWidth;
	$.height = window.innerHeight;
	$.canvas = document.createElement('canvas');
	$.canvas.width = $.width;
	$.canvas.height = $.height;
	document.body.appendChild($.canvas);
	$.ctx = $.canvas.getContext('2d');
	var mc = new MinionCard();
	
	$.animationFrame(function(delta) {
		$.ctx.clearRect(0,0,$.width,$.height);
		mc.render();
	});
	
});//();

var minionCards = (function() {
	var urls = ['img/bottle.jpg', 'img/brick.jpg', 'img/burn.jpg',
		'img/face.jpg', 'img/head.jpg', 'img/provoke.jpg', 
		'img/step.jpg', 'img/super.jpg'];
	var mcs = [];
	for (var i=0; i<urls.length; i++) {
		mcs.push(new MinionCard(urls[i]));
	}
	return mcs;
})();
$.animationFrame(function (delta) {
	delta /= 1000/60;
	for (var i=0; i<minionCards.length; i++) {
		minionCards[i].update(delta);
	}
});





