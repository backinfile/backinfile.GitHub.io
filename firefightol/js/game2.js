
(function _addSeededRandom2Math() {
	Math._seed = 5;
	Math.setSeed = function(s) {
		Math._seed = s;
	};
	Math.seededRandom = function(min, max) {
		max = (max || 1) + 1;
		min = min || 0;
		Math._seed = (Math._seed * 9301 + 49297) % 233280;
		var rnd = Math._seed / 233280.0;
		return Math.floor(min + rnd * (max - min));
	};
	Math.Random = function(min, max) {
		max++;
		return Math.floor(min + Math.random() * (max - min));
	};
	Math.shuffle = function(arr) {
		var len = arr.length, tmp;
		if (len <= 1) return;
		for (var i=0; i<len; i++) {
			let aim = Math.seededRandom(0,len-1);
			tmp = arr[i];
			arr[i] = arr[aim];
			arr[aim] = tmp;
		}
		return arr;
	};
	Array.prototype.back = function() {
		if (!this.length) return null;
		return this[this.length-1];
	}
})();

(function _addRemove2Array() {
	Array.prototype.indexOf = function(val) {
		for (var i = 0; i < this.length; i++) {
			if (this[i] == val) return i;
		}
		return -1;
	};
	Array.prototype.remove = function(val) {
		var index = this.indexOf(val);
		if (index > -1) {
			this.splice(index, 1);
		}
	};
})();

function delHtmlTag(str){
	return str.replace(/<[^>]+>/g,"");
}

class DigitShow {
	constructor(type='英雄') {
		this.type = type;
		if (type == '英雄') {
			this.url = 'img/healthDigit.png';
			this.backgroundurl = 'img/healthbg.png';
			var div = $('<div>');
			div.css('position', 'absolute');
			var warp = $('<div>');
			warp.css('position', 'absolute');
			var img = $('<img src="'+this.backgroundurl+'"/>');
			img.css('position', 'absolute');
			img.css('top', -20.5);
			img.css('left', -20.5);
		} else {
			this.url = 'img/cost.png';
			this.backgroundurl = 'img/'+type+'.png';
			var div = $('<div>');
			div.css('position', 'absolute');
			var warp = $('<div>');
			warp.css('position', 'absolute');
			var img = $('<img src="'+this.backgroundurl+'"/>');
			img.css('position', 'absolute');
			img.css('top', -16.5);
			img.css('left', -14.5);
		}
		
		
		
		div.append(img);
		div.append(warp);
		//$('#gamebody').append(div);
		this.div = div;
		this.warp = warp;
		this.digitDivs = [];
		this.set();
		this.setPos(16,16);
	}
	newdigitDiv() {
		var digitDiv = $('<div>');
		digitDiv.css('width', 19);
		digitDiv.css('height', 22);
		digitDiv.css('overflow', 'hidden');
		digitDiv.css('position', 'absolute');
		digitDiv.css('background-image', 'url('+this.url+')');
		this.warp.append(digitDiv);
		return digitDiv;
	}
	setDivNumber(i, n) {
		if (!this.digitDivs[i]) this.digitDivs[i] = this.newdigitDiv();
		this.digitDivs[i].css('left', 15*i);
		this.digitDivs[i].css('top', -11);
		this.digitDivs[i].css('background-position', -19*n+'px 0px');
		this.digitDivs[i].css('background-image', 'url('+this.url+')');
	}
	divideNumber(n=0) {
		if (n<0) n=0;
		let numbers = [];
		while(n>0) {
			numbers.push(n%10);
			n = Math.floor(n/10);
		}
		if (!numbers.length) numbers.push(0);
		return numbers;
	}
	setPos(x,y) {
		this.div.css('left', x);
		this.div.css('top', y);
	}
	set(n=0, isOri=false) {
		if (isOri) {
			this.url = 'img/healthDigit.png';
		} else {
			this.url = 'img/cost.png';
		}
		let numbers = this.divideNumber(n);
		var len = numbers.length;
		this.warp.css('left', -(2+15*len/2));
		for (let i=0; (i<len) || (i<this.digitDivs.length); i++) {
			if (numbers.length) {
				let num = numbers.pop();
				this.setDivNumber(i, num);
			} else {
				if (this.digitDivs[i]) {
					this.digitDivs[i].remove();
					this.digitDivs[i] = null;
				}
			}
		}
	}
}

class MultiCallback {
	constructor() {
		this.cnt = 0;
		this.cbf = null;
	}
	pipe(callback) {
		this.cnt--;
		var my = this;
		return function() {
			setTimeout(callback, 0);
			my.cnt++;
			if (my.cnt >= 1) {
				setTimeout(my.cbf, 0);
			}
		}
	}
	all(callback) {
		this.cbf = callback;
		this.cnt++;
		if (this.cnt >= 1) {
			setTimeout(this.cbf, 0);
		}
	}
}


class Card{
	constructor(no, ith) {
		this.no = no;
		this.ith = ith;
		
		this.buildBaseDiv();
		this.buildDecorateDiv();
		
		this.setPos(100,50);
		this.setCost(Resources.CardData[this.no].cost);
	}
	buildBaseDiv() {
		var no = this.no;
		var ith = this.ith;
		var frontImg = 'img/'+(no<10?'000':(no<100?'00':(no<1000?'0':'')))+no+'.jpg'; 
		var backImg = 'img/0001.jpg';
		var height = gc.cardHeight;
		var width = gc.cardWidth;
		this.frontImg = frontImg;
		this.backImg = backImg;
		this.width = width;
		this.height = height;
		this.ani = []; // animation list
		
		
		let warp = $('<div>');
		warp.css('perspective', '1000px');
		warp.css('position', 'absolute');
		warp.css('border-radius', '5px');
		
		let div = $('<div>');
		// div.css('backface-visibility', 'hidden');
		div.css('width', 243);
		div.css('height', 314);
		div.css('position', 'relative');
		div.css('transform-style', 'preserve-3d');
		div.appendTo(warp);
		
		let back = $('<image src='+backImg+'>');
		back.css('position', 'absolute');
		back.css('width', 243);
		back.css('height', 314);
		back.css('border-radius', '5px');
		back.css('transform', 'translateZ(1px) rotateY(180deg)');
		back.appendTo(div);
		
		let front = $('<image src='+frontImg+'>');
		front.css('width', 243);
		front.css('height', 314);
		front.css('position', 'absolute');
		front.css('border-radius', '5px');
		front.css('transform', 'translateZ(1px)');
		front.appendTo(div);
		
		this.front = front;
		this.back = back;
		this.div = div;
		this.warp = warp;
		$('#gamebody').append(warp);
	}
	setPos(x,y) {
		this.warp.css('left', x);
		this.warp.css('top', y);
		this.x = x;
		this.y = y;
	}
	buildDecorateDiv() {
		var url = 'img/'+Resources.CardData[this.no].type+'.png';
		let digitBack = $('<image src="'+url+'">');
		digitBack.css('position', 'absolute');
		digitBack.css('transform', 'translateZ(2px)');
		digitBack.css('width', 56);
		digitBack.css('height', 88);
		digitBack.appendTo(this.div);
		
		
		var digitDiv = $('<div>');
		digitDiv.css('width', 44);
		digitDiv.css('height', 51);
		digitDiv.css('top', 6);
		digitDiv.css('left', 6);
		digitDiv.css('overflow', 'hidden');
		digitDiv.css('position', 'absolute');
		digitDiv.css('transform', 'translateZ(2px)');
		// digitDiv.css('background-image', 'url('+this.url+')');
		digitDiv.css('background-size', '440px 51px');
		digitDiv.appendTo(this.div);
		this.digitDiv = digitDiv;
	}
	setRotate(d) {
		this.div.css('transform', 'rotateY('+d+'deg)');
	}
	setBorder(type) {
		if (type == 1) {
			this.front.css('box-shadow','0px 0px 10px 4px black');
		} else if (type == 2) {
			this.front.css('box-shadow','0px 0px 10px 4px blue');
		} else if (type == 3) {
			this.front.css('box-shadow','0px 0px 10px 4px red');
		} else if (type == 0) {
			this.front.css('box-shadow','');
		}
	}
	hide() {
		$(this.warp).hide();
	}
	show() {
		$(this.warp).show();
	}
	destroy() {
		$(this.div).off('mouseout mouseover');
		$(this.warp).off('click mousemove mouseup mousedown');
		//$(this.warp).remove();
		//$(this.show).remove();
	}
	onclick(f) {
		$(this.warp).off('click');
		$(this.warp).on('click', f);
	}
	offclick() {
		$(this.warp).off('click');
	}
	
	
	setCost(n) {
		if (n<0) n = 0;
		if (n == Resources.CardData[this.no].cost) {
			this.url = 'img/healthDigit.png';
		} else {
			this.url = 'img/cost.png';
		}
		this.digitDiv.css('background-image', 'url('+this.url+')');
		this.digitDiv.css('background-position', (-44*n)+'px 0px');
	}
}

var gc = (function() {
	var ratio = {
		width:1707,
		height:838,
		cardWidth:780*0.14,
		cardHeight:1075*0.14,
		handLeft:242,
		handRight:1466,
		handTop:637,
		heroLeft:41,
		heroTop1:564,
		heroTop2:265,
		cardTop:45,
		cardLeft1:74,
		cardLeft2:319,
		cardLeft3:529,
		cardLeft4:715,
		cardLeft5:903,
		cardLeft6:1091,
		cardLeft7:1278,
		cardLeft8:1529,
		chooseTop:290,
		showTop:247,
		showLeft1:804,
		showLeft2:873,
		messageTop:240,
		messageBottom:521+240,
		messageLeft:1480,
		messageRight:205+1480,
		buttonTop:588,
		buttonLeft:1318,
		castTop:300,
		castBottom:610,
		castLeft:242,
		castRight:1466,
		playTop:320,
		playLeft:300,
		playRight:450,
		revealLeft:798,
		revealTop:422
	};
	return ratio;
	var rate = window.innerWidth/ratio.width;
	var globalcoordinate = {};
	for (x in ratio) {
		globalcoordinate[x] = ratio[x]*rate;
		// console.log(globalcoordinate[x])
	}
	return globalcoordinate;
})();

var card = null;
$(function() {
	card = new Card(15, true);
	card.setCost(2);
});


