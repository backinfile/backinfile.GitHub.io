
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
	constructor(no, isShow=false) {
		var frontImg = 'img/'+(no<10?'000':(no<100?'00':(no<1000?'0':'')))+no+'.jpg'; 
		var backImg = 'img/0001.jpg';
		var height = 1075*0.14;
		var width = 780*0.14;
		this.width = width;
		this.height = height;
		this.ani = []; // animation list
		
		
		let warp = document.createElement('div');
		this.warp = warp;
		warp.style.perspective = '1000px';
		warp.style.left = '100px';
		warp.style.top = '50px';
		warp.style.position = 'fixed';
		warp.style.borderRadius = '5px';
		warp.style.zIndex = '0';
		
		let div = document.createElement('div');
		this.div = div;
		div.style.width = width+'px';
		div.style.height = height+'px';
		div.style.backfaceVisibility = 'hidden';
		div.style.position = 'relative';
        div.style.transformStyle = 'preserve-3d';
        div.style.backgroundColor = 'rgba(0,0,0,0)';
		
		
		let back = document.createElement('div');
		back.style.backgroundImage = 'url('+backImg+')';
		back.style.backgroundSize = '100% 100%';
		back.style.width = width+'px';
		back.style.height = height+'px';
		back.style.position = 'absolute';
		back.style.borderRadius = '5px';
		back.style.transform = ' translateZ(1px)';
		back.style.transform = 'rotateY(180deg)';
		
		let front = document.createElement('div');
		front.style.backgroundImage = 'url('+frontImg+')';
		front.style.backgroundSize = '100% 100%';
		front.style.width = width+'px';
		front.style.height = height+'px';
		front.style.position = 'absolute';
		front.style.borderRadius = '5px';
		front.style.transform = ' translateZ(1px)';
		
		let bigsize = 2.2;
		this.bigsize = bigsize;
		let show = document.createElement('div');
		show.style.backgroundImage = 'url('+frontImg+')';
		show.style.backgroundSize = '100% 100%';
		show.style.width = width*bigsize+'px';
		show.style.height = height*bigsize+'px';
		show.style.position = 'absolute';
		show.style.borderRadius = '5px';
		show.style.zIndex = '2000';
		//show.style.transform = 'translateX('+width+'px) translateY(-'+height*bigsize+'px)';
		this.show = show;
		
		
		
		div.appendChild(front);
		div.appendChild(back);
		warp.appendChild(div);
		$('#gamebody').append(warp);
		$('#gamebody').append(show);
		
		this.rotateSave = 0;
		this.scaleSave = 1;;
		this.setZIndex(0, true);
		this.setPos(100,50);
		this.no = no;
		$(show).hide();
		if (!isShow) this.divHide();
		
	}
	_getImgUrl() {
		var no = this.no;
		return 'img/'+(no<10?'000':(no<100?'00':(no<1000?'0':'')))+no+'.jpg'; 
	}
	rotate() {
		this.ani.push('rotate');
		return this;
	}
	fadeOut(callback) {
		$(this.warp).fadeOut("fast", callback);
	}
	fadeIn(callback) {
		$(this.warp).fadeIn("fast", callback);
	}
	move(ax,ay,speed=30) {
		this.ani.push('move');
		this.ani.push(ax);
		this.ani.push(ay);
		this.ani.push(speed);
		return this;
	}
	wait(t) {
		this.ani.push('wait');
		this.ani.push(t);
		return this;
	}
	shrink() {
		this.ani.push('shrink');
		return this;
	}
	expand() {
		this.ani.push('expand');
		return this;
	}
	action(callback) {
		//console.log(this.ani);
		var i=-1;
		var finish = 0;
		var my = this;
		my.ani2 = my.ani;
		my.ani = [];
		var len = my.ani2.length;
		function checkFinish(n) {
			finish += n;
			if (finish >= len) {
				setTimeout(callback, 0);
			}
		}
		function ac() {
			i++;
			if (i >= len) return;
			if (my.ani2[i] == 'rotate') {
				setTimeout(ac, 0);
				my.acRotate(function() {
					checkFinish(1);
				});
			} else if (my.ani2[i] == 'move') {
				my.acMove(my.ani2[i+1],my.ani2[i+2],my.ani2[i+3],function() {
					i+=3;
					checkFinish(4);
					setTimeout(ac, 0);
				});
			} else if (my.ani2[i] == 'shrink') {
				setTimeout(ac, 0);
				my.acShrink(function() {
					checkFinish(1);
				});
			} else if (my.ani2[i] == 'expand') {
				setTimeout(ac, 0);
				my.acExpand(function() {
					checkFinish(1);
				});
			} else if (my.ani2[i] == 'wait') {
				setTimeout(function() {
					i++;
					checkFinish(2);
					setTimeout(ac, 0);
				}, my.ani2[i+1]);
			}
		}
		ac();
	}
	acRotate(callback) {
		function stepGet(val, step, end) {
			if (val > end) return 0;
			if (val+step >= end) return end-val;
			return step;
		}
		var my = this;
		var n = 0;
		var inter = setInterval( function() {
			n +=  stepGet(n, 12, 180);
			my.div.style.transform = 'rotateY('+(n+my.rotateSave)+'deg)';
			if (!stepGet(n, 12, 180)) {
				clearInterval(inter);
				my.rotateSave += 180;
				setTimeout(callback, 0);
			}
		}, 1000/60);
	}
	acShrink(callback) {
		var my = this;
		var sc = my.scaleSave;
		var scMin = 0.1;
		function loop() {
			sc *= 0.8;
			if (sc < scMin) sc = scMin;
			my.warp.style.transform = 'scale('+sc+')';
			if (sc > scMin) setTimeout(loop, 1000/60);
			else {
				my.scaleSave = 0.1;
				setTimeout(callback, 0);
			}
		}
		loop();
	}
	acExpand(callback) {
		var my = this;
		var sc = my.scaleSave;
		function loop() {
			sc *= 1.2;
			if (sc > 1) sc = 1;
			my.warp.style.transform = 'scale('+sc+')';
			if (sc < 1) setTimeout(loop, 1000/60);
			else {
				my.scaleSave = 1;
				setTimeout(callback, 0);
			}
		}
		loop();
	}
	acMove(ax, ay, speed, callback) {
		var my = this;
		my.setZIndex(999+my.zIndex);
		$(this.warp).animate({'left':ax,'top':ay},"fast", 'swing', function() {
			my.setZIndex(my.zIndex);
			my.setPos(ax,ay);
			setTimeout(callback, 0);
		});
		/* var my = this;
		this.setZIndex(999);
		var inter = setInterval(function() {
			if (speed>5)speed *= 0.967;
			var r = Math.sqrt(Math.pow(ax-my.x,2)+Math.pow(ay-my.y,2));
			if (r < speed) {
				my.setPos(ax, ay);
				my.setZIndex();
				clearInterval(inter);
				setTimeout(callback, 0);
				//console.log('stop'); 
			} else {
				var dx = ax - my.x;
				var dy = ay - my.y;
				var fx = dx>0?1:-1, ux = dx*fx;
				var fy = dy>0?1:-1, uy = dy*fy;
				var tx = Math.min(ux/r*speed, ux)*fx;
				var ty = Math.min(uy/r*speed, uy)*fy;
				my.setPos(my.x+tx, my.y+ty);
			}
		}, 500/60); */
	}
	setPos(x,y) {
		this.warp.style.left = x+'px';
		this.warp.style.top = y+'px';
		this.show.style.left = x+'px';
		this.show.style.top = y+'px';
		this.x = x;
		this.y = y;
		if (y < 340)
			this.show.style.transform = 'translateY('+this.height+'px)';
		else 
			this.show.style.transform = 'translateY(-'+this.height*this.bigsize+'px)';
	}
	setZIndex(index=-1, force=false) {
		if (index<0) this.warp.style.zIndex = this.zIndex+'';
		else {
			if (force) this.zIndex=index;
			this.warp.style.zIndex = index+'';
		}
	}
	activeDarg(isTrue=true, callback) {
		// usege:
		// card.activeDarg(true, function(my,ox,oy,nx,ny) {
			// card.setPos(nx,ny);
		// });
		if (isTrue) {
			this.activeDarg(false);
			this.isDragable = true;
			var my = this;
			my.warp.style.cursor = "grab";
			$(my.warp).mousedown(function(event) {
				my.setZIndex(999);
				my.activeShowBig(false);
				let ori_x = my.x;
				let ori_y = my.y;
				let m_x = event.clientX;
				let m_y = event.clientY;
				my.warp.style.cursor = "grabbing";
				$(document).mousemove(function(event) {
					let n_x = event.clientX;
					let n_y = event.clientY;
					my.setPos(n_x-m_x+ori_x, n_y-m_y+ori_y);
				});
				$(my.warp).mouseup(function() {
					my.setZIndex();
					$(document).off('mousemove');
					$(my.warp).off('mousemove mouseup');
					//$(my.warp).click();
					my.warp.style.cursor = "grab";
					if (callback) callback(my, ori_x,ori_y,my.x,my.y);
				});
			});
		} else {
			this.isDragable = false;
			$(this.warp).off('mousemove mouseup mousedown');
			this.warp.style.cursor = "default";
		}
	}
	setBack() {
		this.rotateSave = 180;
		this.div.style.transform = 'rotateY(180deg)';
	}
	setShrink() {
		this.warp.style.transform = 'scale(0.1)';
		this.scaleSave = 0.1;
	}
	setExpand() {
		this.warp.style.transform = 'scale(1)';
		this.scaleSave = 1;
	}
	activeShowBig(isTrue=true) {
		if (isTrue) {
			this.isShowBig = true;
			var my = this;
			$(my.div).mouseover(function() {
				$(my.show).show();
			});
			$(my.div).mouseout(function() {
				$(my.show).hide();
			});
		} else {
			this.isShowBig = false;
			$(this.show).hide();
			$(this.div).off('mouseout mouseover');
		}
	}
	setBorder(type) {
		if (type == 1) {
			this.warp.style.boxShadow = '0px 0px 10px 4px blue';
		} else if (type == 2) {
			this.warp.style.boxShadow = '0px 0px 10px 4px black';
		} else if (type == 3) {
			this.warp.style.boxShadow = '0px 0px 10px 4px red';
		} else if (type == 0) {
			this.warp.style.boxShadow = '';
		}
	}
	divHide() {
		$(this.warp).hide();
	}
	divShow() {
		$(this.warp).show();
	}
	destroy() {
		$(this.div).off('mouseout mouseover');
		$(this.warp).off('click mousemove mouseup mousedown');
		$(this.warp).remove();
		$(this.show).remove();
	}
	onclick(f) {
		$(this.warp).off('click');
		$(this.warp).on('click', f);
	}
	offclick() {
		$(this.warp).off('click');
	}
}

class Hero extends Card {
	constructor(no, isMain=false, isShow=true) {
		super(no, isShow);
		this.isMain = isMain;
		this.isPlaying = false;
		if (no == 2) {
			this.data = [35,0,0, [],[],[],[]];
			//this.data = [26,'∞',0, [],[],[],[]];
		} else if (no == 4) {
			this.data = [32,2,0, [],[],[],[]];
		} else {
			this.data = [35,0,0, [],[],[],[]];
		}
		this.equipments = [];
		this.activeDecorate();
		this.castArea = [[280,220], [950,400]];
		this.playPilePos = [[270,290], [450,290]];
		this.handHeight = 560;
	}
	activeDecorate() {
		var my = this;
		var width = this.height/7;
		var doms = new Array(7);
		this.doms = doms;
		var titles = ['生命','技能','营火','牌库','手牌','弃牌','放逐'];
		for (let i=0; i<7; i++) {
			var show = document.createElement('div');
			//show.style.backgroundImage = 'url('+frontImg+')';
			//show.style.backgroundSize = '100% 100%';
			show.style.width = '50px';
			show.style.height = width+'px';
			show.style.position = 'absolute';
			show.style.borderRadius = '5px';
			show.style.left = this.width+'px';
			show.style.top = width*i+'px';
			show.style.textAlign = 'left';
			show.style.lineHeight = width+'px';
			show.style.fontSize = '0.7em';
			show.style.cursor = 'default';
			//show.style.transform = 'translateX('+width+'px) translateY(-'+height*(bigsize+1)/2+'px)';
			show.title = titles[i];
			this.warp.appendChild(show);
			show.innerHTML = '0';
			doms[i] = show;
			if (i>2) {
				$(show).on('click', function() {
					my.gr.log('---'+[0,0,0,'牌库','手牌','弃牌堆','放逐牌堆'][i]+'---');
					var str = ' ';
					for(var j=0; j<my.data[i].length; j++) {
						str += Resources.CardData[my.data[i][j].no].name+'; ';
					}
					my.gr.log(str);
				});
			} else {
				$(show).on('click', function() {
					my.gr.log(['生命','技能次数','营火'][i]+':'+my.data[i]);
				});
			}
		}
	}
	setDecorate(n, val) {
		var titles = ['生命','技能','营火','牌库','手牌','弃牌','放逐'];
		this.doms[n].innerHTML = titles[n]+':'+val;
	}
	getDecoratePos(n, isShrink=false) {
		if (isShrink) {
			return [this.x+this.width+this.height/14-this.width/2, this.y+this.height/7*n+this.height/14-this.height/2];
		}
		return [this.x+this.width+this.height/14, this.y+this.height/7*n+this.height/14];
	}
	updateData() {
		var my = this;
		my.gr.setPower(my.power);
		if (this.data) {
			this.setDecorate(0,this.data[0]);
			this.setDecorate(1,this.data[1]);
			this.setDecorate(2,this.data[2]);
			this.setDecorate(3,this.data[3].length);
			this.setDecorate(4,this.data[4].length);
			this.setDecorate(5,this.data[5].length);
			this.setDecorate(6,this.data[6].length);
			for(var i=0; i<2; i++) {
				let card = this.weapons[i];
				if (card) {
					my.setWeaponDurable(i, card.durable);
				}
			}
		}
	}
	getWeaponPos(n, isShrink) {
		n = 1-n;
		if (isShrink) return [this.x, this.y+90+15*n-75];
		else return [this.x, this.y+90+30*n];
	}
	activeWeapon() {
		this.weapons = [null, null];
		this._weaponDivs = [$('<div>'), $('<div>')];
		this._shows = [null, null];
		for (let i=0; i<2; i++) {
			let pos = this.getWeaponPos(i);
			let div = this._weaponDivs[i];
			$('#gamebody').append(div);
			div.css('height', 28);
			div.css('width', 100);
			div.css('position', 'absolute');
			div.css('left', pos[0]+5);
			div.css('top', pos[1]);
			console.log();
			//div.css('background-color', 'rgba(255,255,255,0.9)');
			div.css('background-image', 'url(img/weapon.png)');
			div.css('background-size', '100% 100%');
			div.css('z-index', 999);
			div.css('box-shadow','0px 0px 10px 1px blue');
			div.hide();
			var span = $('<div>');
			span.css('height', 28);
			span.css('width', 22);
			span.css('float', 'left');
			span.css('line-height', '28px');
			span.css('text-align', 'center');
			var text = $('<div>');
			text.css('height', 28);
			text.css('width', 100-22);
			text.css('float', 'left');
			text.css('line-height', '28px');
			text.css('font-size', '0.6em');
			text.css('text-align', 'left');
			text.css('cursor', 'default');
			div.append(span);
			div.append(text);
			
			var show = document.createElement('div');
			show.style.backgroundImage = 'url(img/0001.jpg)';
			show.style.backgroundSize = '100% 100%';
			show.style.width = 110*2.2+'px';
			show.style.height = 150*2.2+'px';
			show.style.position = 'absolute';
			show.style.left = pos[0]+5+'px';
			show.style.top = pos[1]+'px';
			show.style.borderRadius = '5px';
			show.style.zIndex = '1002';
			show.style.transform = 'translateY(-'+150*2.2+'px)';
			$(show).hide();
			$('#gamebody').append(show);
			this._shows[i] = $(show);
		}
	}
	setWeaponBorder(n, type) {
		if (type==0) {
			this._weaponDivs[n].css('box-shadow','');
		} else {
			this._weaponDivs[n].css('box-shadow','0px 0px 10px 2px blue');
		}
	}
	setWeaponClick(n, f=null) {
		let div = this._weaponDivs[n];
		div.off('click');
		div.on('click', f);
	}
	resetWeapon(n) {
		let card = this.weapons[n];
		let div = this._weaponDivs[n];
		$(div.children()[1]).off('mouseover mouseout');
		if (!card)  return;
		if (card.no == 81) {
			if (!card.durable) card.durable = 0;
			card.charging = 0;
		} else card.durable = Resources.CardData[card.no].durable;
		card.skill = true;
		this.setWeaponDurable(n, card.durable);
		this.setWeaponName(n, this.getName(card));
		let show = this._shows[n];
		show.css('background-image','url('+card._getImgUrl()+')');
		$(div.children()[1]).mouseover(function() {
			show.show();
		});
		$(div.children()[1]).mouseout(function() {
			show.hide();
		});
	}
	setWeaponDurable(n, durable) {
		this._weaponDivs[n].children()[0].innerHTML = durable;
	}
	setWeaponName(n, name) {
		this._weaponDivs[n].children()[1].innerHTML = name;
	}
	
	
	init(callback) {
		var my = this;
		my.power = 0;
		this.activeWeapon();
		for (var j=0; j<8; j++) this.data[3].push(new Card(68));
		for (var j=0; j<2; j++) this.data[3].push(new Card(67));
		//this.data[3].push(new Card(28));
		//this.data[3].push(new Card(26));
		Math.shuffle(this.data[3]);
		//this.data[3].push(new Card(71));
		//this.data[3].push(new Card(71));
		//this.data[3].push(new Card(71));
		var pos = this.getDecoratePos(3, true);
		for (var i=0; i<this.data[3].length; i++) {
			let card = this.data[3][i];
			card.setPos(pos[0], pos[1]);
			card.setShrink();
		}
		this.drawCard(5, function() {
			setTimeout(callback, 0);
		});
	}
	_shuffle(isTrue=true) {
		if (!isTrue) {
			Math.shuffle(this.data[3]);
			this.gr.log('洗牌');
			return;
		}
		for (var i=0; i<this.data[5].length; i++) {
			this.data[3].push(this.data[5][i]);
		}
		this.data[5] = [];
		// 肝脏打击
		var cards = [];
		for (let i=0; i<this.data[3].length; i++) {
			if (this.data[3][i].no == 25) {
				cards.push(this.data[3][i]);
			}
		}
		for (let i=0; i<cards.length; i++) {
			this.data[3].remove(cards[i]);
		}
		Math.shuffle(this.data[3]);
		this.gr.log('洗牌');
		if (cards.length)this.gr.log('将肝脏打击移到牌堆顶');
		for (let i=0; i<cards.length; i++) {
			this.data[3].push(cards[i]);
		}
	}
	_getCard(isShuffle=true) {
		if (this.data[3].length) return this.data[3].pop();
		if (!isShuffle) return null;
		if (this.data[5].length) {
			this._shuffle();
			return this.data[3].pop();
		} else {
			this.gr.log('牌库没牌啦');
			return null;
		}
	}
	drawCard(number=1, callback) {
		if (this.isMain) {
			var handHeight = this.handHeight;
			var card =  this._getCard();// todo
			if (!card) {
				setTimeout(callback, 0);
				return;
			}
			var pos = this.getDecoratePos(3, true);
			var my = this;
			card.divShow();
			card.setBack();
			card.setShrink();
			card.setPos(pos[0], pos[1]);
			card.setBorder(0);
			card.expand();
			this.data[4].push(card);
			this.updateData();
			var len = this.data[4].length;
			var lefts = this.getLefts(len);
			let mc = new MultiCallback();
			for (let i=0; i<len; i++) {
				let card2 = my.data[4][i];
				card2.setZIndex(i+1, true);
				if (Math.round(card2.rotateSave/180)%2) card2.rotate();
				if (i+1 == len) card2.move(800,390).wait(300);
				card2.move(lefts[i], handHeight).action(mc.pipe(function() {
					if (i+1 == len) card2.activeShowBig();
				}));
			}
			mc.all(function() {
				number--;
				setTimeout(function() {
					if (number>0) {
						my.drawCard(number, callback);
					} else {
						setTimeout(callback,0);
					}
				}, 0);
			});
		} else {
			for(var i=0; i<number; i++) {
				var card = this._getCard(); // todo
				if (!card) break;
				this.data[4].push(card);
			}
			this.updateData();
			setTimeout(callback,0);
		}
	}
	getLefts(len, gap=5, handLeft=340, handRight=920) {
		var width = handRight-handLeft;
		var cardWidth = this.width;
		var usedWidth = (cardWidth+gap)*len-gap;
		var leftgap = 0;
		if (usedWidth>width) {
			gap = width/len-cardWidth;
		} else {
			leftgap = (width-usedWidth)/2;
		}
		var lefts = new Array(len);
		for (let i=0; i<len; i++) {
			lefts[i] = handLeft+(cardWidth+gap)*i+leftgap;
		}
		return lefts;
	}
	getVoidEffect() {
		return {'生命':0,'战力':0,'营火':0};
	}
	isEffectEmpty(effect) {
		if (effect['生命']) return false;
		if (effect['战力']) return false;
		if (effect['营火']) return false;
		return true;
	}
	turnStart() {
		var my = this;
		my.turnBuff = {};
		my.counter = [0,0,0,0,0,0,0,0,0,0,0];
		// 特殊 武技 法术 武器 基础 气功 连击 聚流 精神 街斗 充能
		my.power = 0; // 战力
		my.cardnum = 0; // 已经打出的卡牌数
		if (this.isMain) {
			my.gr.log('<span style="color:#BBB">营火火剩余'+my.gr.firePile.length+'张</span>');
			my.gr.log('<span style="color:#BBB">中央牌库剩余'+my.gr.commonPile.length+'张</span>');
			this.gr.log('回合开始');
		}
		var i=-1;
		function _loop() {
			i++;
			if (i>=2) {
				_end();
				return;
			}
			if (!my.weapons[i]) {
				_loop();
				return;
			}
			var effect = Resources.CardData[my.weapons[i].no].effect;
			if (!my.isEffectEmpty(effect)) {
				my.gr.log('装备'+my.getName(my.weapons[i])+'发动');
				my.applyEffect(effect, function() {
					_loop();
				});
			} else {
				_loop();
			}
		}
		
		function _end() {
			my.interactive();
			my.gr.turnOn();
			if (!my.isMain) {
				my.turnEnd(function() {
					my.attack(Math.seededRandom(1,5), function() {
						my.gr.heros[0].turnStart();
					});
					
				});
			}
		}
		_loop();
	}
	attackSelf(n, callback) {
		var my = this;
		var character = my.isMain?'你':'对方';
		function _loop() {
			my.select4(function(no) {
				if (n<=0) {
					my.updateData();
					setTimeout(callback, 0);
					return;
				}
				my.gr.log('<span style="color:#CCC">--对自己造成'+n+'点伤害</span>');
				if (no==0) {
					my.gr.log('<span style="color:#CCC">--'+character+'失去'+n+'点生命</span>');
					my.turnBuff['受到过伤害'] = true;
					my.data[0] -= n;
					if (my.data[0]<=0) {
						my.gr._winflag = true;
						my.gr.log('你输了！但游戏仍可以继续');
					}
				} else {
					no--;
					var durable = my.weapons[no].durable;
					if (durable > n) {
						my.weapons[no].durable -= n;
						my.gr.log('<span style="color:#CCC">--'+my.getName(my.weapons[no])+'承受'+n+'点伤害</span>');
					} else {
						n -= durable;
						my.gr.log('<span style="color:#CCC">--'+my.getName(my.weapons[no])+'承受'+durable+'点伤害</span>');
						my.dropWeapon(no, _loop);
						return;
					}
				}
				my.updateData();
				setTimeout(callback, 0);
			});
		}
		_loop();
	}
	attack(n, callback_t) {
		var flag = false;
		var my = this;
		var character = my.isMain?'对方':'你';
		var callback = function() {
			if (!flag) {
				my.opponent.data[0] -= n;
				my.gr.log('<span style="color:#CCC">--'+character+'失去'+n+'点生命</span>');
				if (my.opponent.data[0]<=0 && !my.gr._winflag) {
					my.gr._winflag = true;
					if (my.isMain) my.gr.log('你赢了！但游戏仍可以继续');
					if (!my.isMain) my.gr.log('你输了！但游戏仍可以继续');
				}
				my.updateData();
				my.opponent.updateData();
				setTimeout(callback_t, 0);
			}
		}
		if (!this.isMain) {
			for (var i=0; i<2; i++) {
				let card = this.opponent.weapons[i];
				if (!card) continue;
				if (card.no==19) {
					this.opponent.dropWeapon(i, callback_t);
					flag = true;
					break;
				}
			}
		}
		callback();
	}
	turnEnd(callback) {
		var my = this;
		my.interactive(false);
		if (my.turnBuff['震空波动拳']) {
			my.gr.log('震空波动拳发动');
			my.gr.log('将'+my.data[2]+'点营火转化为战力');
			my.power += my.data[2];
			my.data[2] = 0;
			my.updateData();
		}
		function _end() {
			my.data[2] = 0;
			my.turnBuff = {};
			for (var i=0; i<2; i++) my.resetWeapon(i);
			my.lastCard = null;
			var pos = my.getDecoratePos(5, true);
			let mc = new MultiCallback();
			for (let i=0; i<my.gr.playPile.length; i++) {
				let card = my.gr.playPile[i];
				card.shrink().move(pos[0], pos[1]).action(mc.pipe(function() {
					card.divHide();
				}));
				my.data[5].push(card);
			}
			for (let i=0; i<my.data[4].length; i++) {
				let card = my.data[4][i];
				card.shrink().move(pos[0], pos[1]).action(mc.pipe(function() {
					card.divHide();
				}));
				my.data[5].push(card);
			}
			my.gr.playPile = [];
			my.data[4] = [];
			mc.all(function() {
				my.drawCard(5, function() {
					if (my.isMain)my.gr.log('回合结束');
					if (!my.gr._winflag && my.data[4].length < 5) {
						my.gr._winflag = true;
						my.gr.log('--你'+(my.isMain?'输':'赢')+'了,但游戏仍可以继续');
					}
					setTimeout(callback, 0);
				});
			});
		}
		if(my.power) {
			my.attack(my.power, function() {
				my.power = 0;
				_end();
			});
		} else {
			_end();
		}
	}
	_getFire(card) {
		var fire = Resources.CardData[card.no].effect['营火'];
		if (fire) return fire;
		return 0;
	}
	_examHandCard(card, castFun=null) {
		if (!castFun)castFun=this.castCard;
		var my = this;
		card.setBorder(2); 
		var ability = Resources.CardData[card.no].ability;
		if (ability['充能']) {
			if (my.data[2] >= ability['充能']) {
				card.setBorder(1);
			}
		} else if (ability['聚气']) {
			if (my.data[2]+my._getFire(card) >= ability['聚气']) {
				card.setBorder(1);
			}
		} else if (ability['连击']) {
			let tmp = my.isType(card, '武技')?1:2;
			if (my.counter[tmp] >= ability['连击']) {
				card.setBorder(1);
			}
		} else if (ability['不同风格']) {
			if (my.getStyleNum() >= ability['不同风格']) {
				card.setBorder(1);
			}
		} else if (ability['背水']) {
			if (my.data[0] < my.opponent.data[0]) {
				card.setBorder(1);
			}
		}
		card.activeDarg(true, function(card,ox,oy,nx,ny) {
			if (my.isIn(nx,ny, my.castArea[0], my.castArea[1])) {
				card.setPos(nx,ny);
				card.activeShowBig();
				castFun.call(my, card);
			} else {
				card.setPos(ox,oy);
				card.activeShowBig();
			}
		});
	}
	_examWeapon(no, castFun=null) {
		if (!castFun)castFun=this.useWeapon;
		let card = this.weapons[no];
		if (!card) return;
		if (!card.skill) return;
		var my = this;
		if (Resources.CardData[card.no].ability['流放']) {
		} else if (card.no==40) {
		} else if (card.no==55) {
		} else if (card.no==81 && card.durable>=6) {
		} else if (card.no==79 && my.data[2]>=6) {
		} else {
			return;
		}
		my.setWeaponBorder(no, 1);
		my.setWeaponClick(no, function() {
			castFun.call(my, no);
		});
	}
	interactive(isOn=true) {
		// 开关交互
		if (!this.isMain) return;
		if (isOn) {
			this.updateData();
			this.interactive(false);
			this.gr.btnInteractive(true);
			var len = this.data[4].length;
			var my = this;
			// 手牌
			for (let i=0; i<len; i++) {
				let card = this.data[4][i];
				my._examHandCard(card);
			}
			// 武器
			for (let i=0; i<2; i++) {
				my._examWeapon(i);
			}
			// 买牌
			for (let i=0; i<5; i++) {
				let card = this.gr.buyPile[i];
				if (!card) continue;
				let cost = Resources.CardData[card.no].cost;
				if (my.turnBuff['粒子数反转']) cost--;
				if (my.data[2] >= cost) {
					card.setBorder(2);
				} else {
					card.setBorder(0);
				}
				if (card.no == 63) {
					if (my.turnBuff['受到过伤害']) cost -= 2;
					if (my.turnBuff['弃置过手牌']) cost -= 2;
					if (my.data[2] >= cost) {
						card.setBorder(2);
						if (cost == 4) card.setBorder(1);
						if (cost == 2) card.setBorder(3);
					}
				}
				if (card.no == 65) {
					if (my.data[2]+my.power >= cost) card.setBorder(2);
				}
				card.onclick(function() {
					if (card.no == 65) {
						if (my.data[2]) {
							my.gr.log('选择要为超重量武器支付的营火(不足8将用战力补齐)');
							my.nchoose(my.data[2]+1, [900151,900201,900202,900203,900204,900205,900206,900207,900208],
								function(n) {
								if (my.power+n >= 8) {
									my.power -= 8-n;
									my.data[2] -= n;
									if (8-n) {
										card._switch = true;
										my.gr.log('支付'+(8-n)+'点战力');
									} else card._switch = false;
									my.updateData();
									my.buyCard(card);
								} else {
									my.gr.log('战力不够');
									my.interactive(true);
								}
							});
						} else {
							if (my.power >= cost) {
								my.gr.log('支付8点战力');
								my.power -= 8;
								my.buyCard(card);
							}
						}
					} else {
						if (my.data[2] >= cost) {
							my.data[2] -= cost;
							//my.gr.buyPile[i] = null;
							my.buyCard(card);
						}
					}
				});
			}
			// 营火火牌 
			if (my.gr.firePile.length) {
				let card = my.gr.firePile[my.gr.firePile.length-1];
				let cost = 3;
				if (my.turnBuff['粒子数反转']) cost--;
				if (my.data[2] >= Resources.CardData[card.no].cost) {
					card.setBorder(2);
				} else {
					card.setBorder(0);
				}
				card.onclick(function() {
					if (my.data[2] >= Resources.CardData[card.no].cost) {
						my.data[2] -= Resources.CardData[card.no].cost;
						my.gr.firePile.pop();
						my.buyCard(card);
					}
				});
			}
			// 打出的牌
			for (var i=0; i<my.gr.playPile.length; i++) {
				let card = my.gr.playPile[i];
				card.setBorder(0);
				card.offclick();
			}
			
		} else { // off interactive
			var my = this;
			this.gr.btnInteractive(false);
			for (let i=0; i<this.data[4].length; i++) {
				let card = this.data[4][i];
				card.activeDarg(false);
				card.offclick();
				card.setBorder(0);
			}
			for (let i=0; i<this.gr.buyPile.length; i++) {
				let card = this.gr.buyPile[i];
				if (!card)continue;
				card.offclick();
				card.setBorder(0);
				card.activeDarg(false);
			}
			if (my.gr.firePile.length) {
				let card = my.gr.firePile[my.gr.firePile.length-1];
				card.setBorder(0);
				card.offclick();
				card.activeDarg(false);
			}
			for (let i=0; i<2;i++) {
				my.setWeaponBorder(i, 0);
				my.setWeaponClick(i);
			}
		}
	}
	handRevise(callback) {
		var my = this;
		var len = this.data[4].length;
		var lefts = this.getLefts(len);
		let mc = new MultiCallback();
		for (let i=0; i<len; i++) {
			let card2 = my.data[4][i];
			card2.setZIndex(i+1, true);
			card2.offclick();
			card2.divShow();
			card2.setBorder(0);
			card2.expand().move(lefts[i], my.handHeight).action(mc.pipe());
		}
		mc.all(function() {
			setTimeout(callback,0);
		});
	}
	castCard(card, callback) {
		var my = this;
		var mcb = new MultiCallback();
		my.interactive(false);
		my.data[4].remove(card);
		card.setBorder(0);
		my.handRevise(mcb.pipe());
		//card.fadeOut(mcb.pipe());
		// card.move(1100, 260).action(mcb.pipe(function() {
			// card.activeShowBig();
		// }));
		mcb.all(function() {
			var data = Resources.CardData[card.no];
			my.gr.log('打出'+data.name);
			var effect = $.extend({}, data.effect);
			
			if (my.isType(card, '装备')) {
				card.divShow();
				my.playingCard(card, effect,function() {
					my.countingCard(card, effect, callback);
				});
			} else {
				my.gr.playPile.push(card);
				my.playingCard(card, effect, function() {
					my.countingCard(card, effect, callback);
				});
			}
		});
	}
	isType(card, type) {
		// type == 武技 || 法术
		if (Resources.CardData[card.no].type==type) return true;
		if (card.no == 69 && (type=='武技'||type=='法术')) return true;
		return false;
	}
	isStyle(card, style) {
		if (Resources.CardData[card.no].style==style) return true;
		return false;
	}
	isSameStyle(card1, card2) {
		if (Resources.CardData[card1.no].style==Resources.CardData[card2.no].style) 
			return true;
		return false;
	}
	isSameType(card1, card2) {
		if (card1.no == 69) {
			if (this.isType(card2, '法术') || this.isType(card2, '武技')) return true;
			return false;
		} else {
			var type = Resources.CardData[card1.no].type;
			if (type == '无') return false;
			return this.isType(card2, type);
		}
	}
	isBase(card) {
		return (card.no==67||card.no==68||card.no==69);
	}
	charging(n=-1) {
		var my = this;
		for (let i=0; i<2; i++) {
			let card = my.weapons[i];
			if (card && card.no==81) {
				if (n==-1)card.durable++;
				else {
					if (!card.charging) card.charging = 0;
					card.charging += n;
					card.durable += Math.floor(card.charging/5);
					card.charging = card.charging%5;
				}
			}
		}
	}
	getTypeNum() {
		var cnt = 0;
		for (var i=0; i<=3; i++) {
			if (this.counter[i]) cnt++;
		}
		return cnt;
	}
	getStyleNum() {
		var cnt = 0;
		for (var i=4; i<=10; i++) {
			if (this.counter[i]) cnt++;
		}
		return cnt;
	}
	getCost(card, isTop=false) {
		//if (card._cost) return card._cost;
		var buff = this.turnBuff['噩梦化身'];
		if (isTop && buff) return buff[0];
		return Resources.CardData[card.no].cost;
	}
	getName(card) {
		return Resources.CardData[card.no].name;
	}
	isFillFire(card) {
		var my = this;
		if (!Resources.CardData[card.no].ability['聚气']) return false;
		if (my.data[2]+my._getFire(card)>=Resources.CardData[card.no].ability['聚气']) return true;
		return false;
	}
	playingCard(card, effect, callback_t) {
		var my = this;
		let callback = function() {
			my.cardnum++;
			if (my.isType(card, '特殊'))my.counter[0]++;
			if (my.isType(card, '武技'))my.counter[1]++;
			if (my.isType(card, '法术'))my.counter[2]++;
			if (my.isType(card, '武器'))my.counter[3]++;
			if (my.isStyle(card, '基础'))my.counter[4]++;
			if (my.isStyle(card, '气功'))my.counter[5]++;
			if (my.isStyle(card, '连击'))my.counter[6]++;
			if (my.isStyle(card, '聚流'))my.counter[7]++;
			if (my.isStyle(card, '精神'))my.counter[8]++;
			if (my.isStyle(card, '街斗'))my.counter[9]++;
			if (my.isStyle(card, '充能'))my.counter[10]++;
			my.lastCard = card;
			setTimeout(callback_t, 0);
		}
		if (!effect['战力']) effect['战力'] = 0;
		if (!effect['营火']) effect['营火'] = 0;
		if (!effect['生命']) effect['生命'] = 0;
		if (my.turnBuff['起势'] && my.isType(card, '武技')) {
			my.turnBuff['起势'] = false;
			if (my.isFillFire(card)) effect['战力'] += 1;
			my.gr.log('--起势发动');
		}
		
		if (my.cardnum==0) {
			card.doubleCast = true;
		}
		
		if (my.isType(card, '装备')) {
			my.equipWeapon(card, function() {
				setTimeout(callback, 0);
			});
			return;
		}
		
		if (card.no == 9) {
			my.turnBuff['起势'] = true;
		} else if (card.no == 10) {
			if (my.isFillFire(card)) {
				effect['战力'] += 1;
				my.drawCard(1, callback);
				return;
			}
		} else if (card.no == 12) {
			(function _no12() {
				var ori_card = card;
				if (my.isFillFire(ori_card)) {
					effect['战力'] += 1;
				}
				if (my.gr.playPile.length + my.data[5].length <= 1) {
					setTimeout(callback, 0);
					return;
				}
				my.gr.playPile.remove(ori_card);
				my.select2(my.gr.playPile, my.data[5], function(card) {
					my.gr.playPile.remove(card);
					my.gr.playPile.push(ori_card);
					let mcb = new MultiCallback();
					my.trashCard(card, mcb.pipe());
					my.setAllBack(mcb.pipe());
					mcb.all(callback);
				}, function(card) {
					my.data[5].remove(card);
					my.gr.playPile.push(ori_card);
					let mcb = new MultiCallback();
					my.trashCard(card, mcb.pipe());
					my.setAllBack(mcb.pipe());
					mcb.all(callback);
				});
			})();
			return;
		} else if (card.no == 13) {
			if (my.isFillFire(card)) {
				effect['战力'] += 1;
				// todo equipment
			}
		} else if (card.no == 14) {
			if (my.isFillFire(card)) {
				my.gr.log('--回合结束时,剩余的营火将转化成战力');
				my.turnBuff['震空波动拳'] = true;
				my.drawCard(1, callback);
				return;
			}
		} else if (card.no == 15) {
			if (my.isFillFire(card)) {
				my.nchoose(2, [900151, 900152], function(n) {
					if (n==0) {
						setTimeout(callback, 0);
					} else {
						if (my.data[4].length==0) {
							setTimeout(callback, 0);
							return;
						}
						my.select(my.data[4], function(card) {
							my.data[4].remove(card);
							let mcb = new MultiCallback();
							my.trashCard(card, mcb.pipe());
							my.handRevise(mcb.pipe());
							mcb.all(callback);
						});
					}
				});
				return;
			}
		} else if (card.no == 16) {
			(function() {
				let mc = new MultiCallback();
				var cards = [];
				for (let i=0; i<my.data[5].length; i++) {
					if (my.isType(my.data[5][i], '武技')) cards.push(my.data[5][i]);
				}
				if (!cards.length) {
					setTimeout(callback, 0);
					return;
				} 
				my.gr.log('--从弃牌区选择一张置入手牌');
				my.select(cards, function(card) {
					my.data[5].remove(card);
					let mcb = new MultiCallback();
					my.data[4].push(card);
					my.setAllBack(mcb.pipe());
					my.handRevise(mcb.pipe());
					mcb.all(callback);
				});
			})();
			return;
		} else if (card.no == 17) {
			if (my.isFillFire(card)) effect['营火'] += 1;
			my.drawCard(1, callback);
			return;
		}
		if (card.no == 21) {
			my.drawCard(1, function() {
				my.gr.log('--要流放吗?');
				my.nchoose(2, [900151,900152], function(n) {
					if (n==0) {
						setTimeout(callback, 0);
					} else {
						effect['生命'] += 1;
						my.gr.playPile.remove(card);
						card.divShow();
						my.trashCard(card, callback);
					}
				});
			});
			return;
		} else if (card.no == 22) {
			if (my.counter[1] >= 1) {
				my.drawCard(1, function() {
					if (my.data[4].length) {
						my.gr.log('--弃置一张手牌');
						my.select(my.data[4], function(card) {
							my.data[4].remove(card);
							var mc = new MultiCallback();
							my.discardCard(card, mc.pipe());
							my.handRevise(mc.pipe());
							mc.all(callback);
						});
					} else {
						setTimeout(callback, 0);
						return;
					}
				});
				return;
			}
		} else if (card.no == 23) {
			if (my.counter[1] >= 2) {
				my.nchoose(2, [900231,900232], function(n) {
					if (n==0) {
						effect['战力'] += 1;
						setTimeout(callback, 0);
					} else {
						my.drawCard(1, callback);
					}
				});
				return;
			}
		} else if (card.no == 24) {
			function _then() {
				if (my.counter[1]>=3) {
					my.drawCard(1, callback);
				} else {
					setTimeout(callback, 0);
				}
			}
			my.drawCard(1, function() {
				my.gr.log('--从手牌中放逐一张基本牌吗?');
				my.nchoose(2, [900151, 900152], function(n) {
					if (n == 0) {
						_then();
					} else {
						var mc = new MultiCallback();
						var cards = [];
						for (let i=0; i<my.data[4].length; i++) {
							let card = my.data[4][i];
							if (my.isBase(card)) cards.push(card);
						}
						if (!cards.length) {
							setTimeout(_then, 0);
							return;
						}
						my.gr.log('--选择一张<b>放逐</b>:');
						my.select(cards, function(card) {
							my.data[4].remove(card);
							let mcb = new MultiCallback();
							my.trashCard(card, mcb.pipe());
							my.handRevise(mcb.pipe());
							mcb.all(_then);
						});

					}
				});
			});
			return;
		} else if (card.no == 26) { 
			my.gr.log('--你可以按任意顺序打出展示的装备和武技牌');
			(function() {
				var ori_card = card;
				my.gr.playPile.remove(card);
				my._shuffle();
				var cards = [];
				var discardCards = [];
				for (let i=0; i<7; i++) {
					let card = my._getCard();
					if (!card) break;
					if (my.isType(card, '装备') || my.isType(card, '武技')) {
						cards.push(card);
					} else {
						discardCards.push(card);
					}
				}
				my.updateData();
				
				function _flush() {
					my.interactive(false);
					if (!cards.length) {
						var mc = new MultiCallback();
						for (var j=0; j<discardCards.length; j++) {
							my.discardCard(discardCards[j], mc.pipe());
						}
						mc.all(function(){
							my._shuffle(false);
							my.gr.playPile.push(card);
							setTimeout(callback, 0);
						});
						return;
					}
					for (let j=0; j<cards.length; j++) {
						let card = cards[j];
						card.divShow();
					}
					my.select3(cards, function(ncard) {
						cards.remove(ncard);
						ncard.activeDarg(false);
						for (let j=0; j<cards.length; j++) {
							cards[j].divHide();
							cards[j].activeDarg(false);
						}
						my.castCard(ncard, _flush);
					});
				}
				_flush();
			})();
			return;
		} else if (card.no == 27) {
			if (my.lastCard && Resources.CardData[my.lastCard.no].cost<=4) {
				let card = my.lastCard;
				my.gr.playPile.remove(card);
				my.data[3].remove(card);
				my.data[5].remove(card);
				my.data[6].remove(card);
				my.data[4].push(card);
				var index = my.weapons.indexOf(card);
				if (index>=0) {
					my.dropWeapon(index, function() {
						my.gr.log('将'+Resources.CardData[card.no].name+'返回手牌');
						my.handRevise(callback);
					});
				} else {
					my.gr.log('将'+Resources.CardData[card.no].name+'返回手牌');
					my.handRevise(callback);
				}
				return;
			}
		} else if (card.no == 28) {
			(function() {
				my.gr.playPile.remove(card);
				var cards = [];
				if (my.data[3].length>=2) {
					cards[1] = (my.data[3].pop());
					cards[0] = (my.data[3].pop());
					if (my.isSameType(cards[0], cards[1])) effect['战力'] += 2;
				} else if (my.data[3].length==1) {
					cards[0] = (my.data[3].pop());
				} else {
					my.gr.playPile.push(card);
					setTimeout(callback, 0);
					return;
				}
				function _loopfun() {
					my.interactive(false);
					if (cards.length) {
						let card = cards.pop();
						card.divShow();
						card.setBack();
						card.rotate().expand().move(600, 350).action(function() {
							my.castCard(card, _loopfun);
						});
					} else {
						my.gr.playPile.push(card);
						setTimeout(callback, 0);
					}
				}
				_loopfun();
			})();
			return;
		} else if (card.no == 29) {
			my.gr.log('--要将弃牌区的一张牌洗回牌库吗?');
			my.nchoose(2, [900151, 900152], function(n) {
				if (n==0) {
					setTimeout(callback, 0);
				} else {
					//console.log('###'+my.data[5].length);
					if (my.data[5].length==0) {
						setTimeout(callback, 0);
						return;
					}
					my.select(my.data[5], function(card0) {
						my.data[5].remove(card0);
						my.data[3].push(card0);
						my._shuffle(false);
						my.gr.log('--已将'+Resources.CardData[card0.no].name+'放回牌库');
						my.setAllBack(callback);
					});
				}
			});
			return;
		} else if (card.no == 30) {
			my.gr.log('--从打出区或弃牌区放逐一张牌');
			(function _no30() {
				var ori_card = card;
				function _end(card) {
					my.gr.playPile.push(ori_card);
					let mcb = new MultiCallback();
					my.trashCard(card, mcb.pipe());
					my.setAllBack(mcb.pipe());
					mcb.all(function() {
						if (my.counter[2]>=2) {
							my.drawCard(1, callback);
						} else {
							setTimeout(callback, 0);
						}
					});
				}
				if (my.gr.playPile.length + my.data[5].length <= 1) {
					setTimeout(callback, 0);
					return;
				}
				my.gr.playPile.remove(ori_card);
				my.select2(my.gr.playPile, my.data[5], function(card) {
					my.gr.playPile.remove(card);
					_end(card);
				}, function(card) {
					my.data[5].remove(card);
					_end(card);
				});
			})();
			return;
		}
		if (card.no == 33) {
			effect['战力'] += my.getStyleNum();
		} else if (card.no == 34) {
			my.drawCard(1, function() {
				if (my.getStyleNum()>=3) {
					my.gr.log('--从打出区或弃牌区放逐一张牌吗?');
					my.nchoose(2, [900151,900152], function(n) {
						if (n==0) {
							setTimeout(callback, 0);
						} else {
							if (my.gr.playPile.length + my.data[5].length <= 1) {
								setTimeout(callback, 0);
								return;
							}
							var ori_card = card;
							my.gr.playPile.remove(ori_card);
							function _end(card) {
								my.gr.playPile.push(ori_card);
								let mcb = new MultiCallback();
								my.trashCard(card, mcb.pipe());
								my.setAllBack(mcb.pipe());
								mcb.all(callback);
							}
							my.select2(my.gr.playPile, my.data[5], function(card) {
								my.gr.playPile.remove(card);
								_end(card);
							}, function(card) {
								my.data[5].remove(card);
								_end(card);
							});
						}
					});
				} else {
					setTimeout(callback, 0);
				}
			});
			return;
		} else if (card.no == 35) {
			if (my.getStyleNum() >= 3) {
				effect['战力'] += 1;
			}
		} else if (card.no == 36) {
			effect['营火'] += my.getStyleNum();
		} else if (card.no == 37) {
			my.turnBuff['断片感应'] = true;
		} else if (card.no == 38) {
			my.gr.log('--抓两张牌或者从弃牌区将2张不同风格的牌置入手牌');
			my.nchoose(2, [900381, 900382], function(n) {
				if (n==0) {
					my.drawCard(2, callback);
				} else {
					if (!my.data[5].length) {
						setTimeout(callback, 0);
						return;
					}
					my.select(my.data[5], function(card) {
						my.data[5].remove(card);
						my.data[4].push(card);
						my.handRevise(function() {
							var cards = [];
							for (let i=0; i<my.data[5].length; i++) {
								if (!my.isSameStyle(card, my.data[5][i]))
									cards.push(my.data[5][i]);
							}
							if (!cards.length) {
								my.setAllBack(callback)
								return;
							}
							for(let i=0; i<cards.length; i++) {
								my.data[5].remove(cards[i]);
							}
							my.setAllBack(function() {
								my.select(cards, function(card2) {
									cards.remove(card2);
									my.data[4].push(card2);
									for(let i=0; i<cards.length; i++) {
										my.data[5].push(cards[i]);
									}
									var mc = new MultiCallback();
									my.handRevise(mc.pipe());
									my.setAllBack(mc.pipe());
									mc.all(callback);
								});
							});
						});
					});
				}
			});
			return;
		} else if (card.no == 39) {
			my.gr.log('--你可以从打出区放逐一张牌');
			my.nchoose(2, [900151, 900152], function(n) {
				if (n==0) {
					setTimeout(callback, 0);
					return;
				} else {
					my.gr.playPile.remove(card);
					var ori_card = card;
					if (!my.gr.playPile.length) {
						my.gr.playPile.push(card);
						setTimeout(callback, 0);
						return;
					}
					my.select(my.gr.playPile, function(card) {
						my.gr.playPile.remove(card);
						let mcb = new MultiCallback();
						my.trashCard(card, mcb.pipe());
						my.setAllBack(mcb.pipe());
						mcb.all(function() {
							my.gr.playPile.push(ori_card);
							setTimeout(callback, 0);
						});
					});
				}
			});
			return;
		} else if (card.no == 41) {
			my.nchoose(2, [900411, 900412], function(n) {
				if (n==0) {
					effect['营火'] += 2;
				} else {
					effect['战力'] += 2;
				}
				setTimeout(callback, 0);
			});
			return;
		} else if (card.no == 42) {
			my.nchoose(2, [900421, 900422], function(n) {
				if (n==0) {
					effect['营火'] += 3;
				} else {
					effect['战力'] += 3;
				}
				setTimeout(callback, 0);
			});
			return;
		} else if (card.no == 43) {
			my.gr.log('--你可以保留其中不同风格的牌各1张');
			(function() {
				var cards = [];
				for (var i=0; i<3; i++) {
					let card = my._getCard();
					if (card) cards.push(card);
				}
				var styles = [];
				function _get() {
					let removeCards = []
					for (var i=0; i<cards.length; i++) {
						if (styles.indexOf(Resources.CardData[cards[i].no].style)>=0) {
							removeCards.push(cards[i]);
						}
					}
					let mc = new MultiCallback();
					for(let i=0; i<removeCards.length; i++) {
						let card = removeCards[i];
						cards.remove(card);
						my.discardCard(card, mc.pipe());
					}
					mc.all(function() {
						if (!cards.length) {
							setTimeout(callback, 0);
							return;
						}
						my.select(cards, function(card) {
							cards.remove(card);
							my.data[4].push(card);
							styles.push(Resources.CardData[card.no].style);
							my.handRevise(_get);
						});
					});
				}
				_get();
			})();
			return;
		} else if (card.no == 44) {
			effect['战力'] += my.getTypeNum();
			effect['战力'] += my.getStyleNum();
		}
		if (card.no == 45) {
			let card = my._getCard(false);
			if (card) {
				my.revealCard(card, function() {
					let cost = my.getCost(card, true);
					my.gr.log('--展示'+my.getName(card)+',费用为'+cost);
					if (cost>=2) {
						my.data[4].push(card);
						my.handRevise(callback);
					} else {
						effect['营火'] += 1;
						my.trashCard(card, callback);
					}
				});
				return;
			}
		} else if (card.no == 46) {
			let card = my._getCard(false);
			if (card) {
				my.revealCard(card, function() {
					let cost = my.getCost(card, true);
					my.gr.log('--展示'+my.getName(card)+',费用为'+cost);
					if (cost<2) {
						my.data[0]-=2;
					}
					my.data[3].push(card);
					my.setAllBack(function() {
						my.drawCard(2, callback);
					});
				});
				return;
			}
		} else if (card.no == 47) {
			let card = my._getCard(false);
			if (card) {
				my.revealCard(card, function() {
					let cost = my.getCost(card, true);
					my.gr.log('--展示'+my.getName(card)+',费用为'+cost);
					if (cost<2) {
						effect['战力'] += 2;
					} else {
						effect['战力'] += 3;
					}
					my.data[3].push(card);
					my.setAllBack(callback);
				});
				return;
			}
		} else if (card.no == 48) {
			let card = my._getCard();
			if (card) {
				my.revealCard(card, function() {
					my.gr.log('--展示'+my.getName(card));
					my.data[4].push(card);
					my.handRevise(function() {
						if (!my.isType(card, '武技')) {
							my.gr.log('--要放逐一张手牌吗？');
							my.nchoose(2, [900151,900152], function(n) {
								if (n==0) {
									setTimeout(callback, 0);
								} else {
									if (!my.data[4].length) {
										setTimeout(callback, 0);
										return;
									}
									my.select(my.data[4], function(card) {
										my.data[4].remove(card);
										var mc = new MultiCallback();
										my.handRevise(mc.pipe());
										my.trashCard(card, mc.pipe());
										mc.all(callback);
									});
								}
							});
						} else {
							setTimeout(callback, 0);
						}
					});
				});
				return;
			}
		} else if (card.no == 49) {
			my.seek(1, callback);
			return;
		} else if (card.no == 50) {
			my.drawCard(1, function() {
				my.seek(1, callback);
			});
			return;
		} else if (card.no == 52) {
			if (true) {
				var ori_card = card;
				my.gr.playPile.remove(card);
				var cards = [];
				for (var i=0; i<my.gr.buyPile.length; i++) {
					let card = my.gr.buyPile[i];
					if (card && my.getCost(card)<=5 && !my.isType(card, '装备')) cards.push(card);
				}
				if (!cards.length) {
					my.gr.playPile.push(card);
					setTimeout(callback, 0);
					return;
				}
				my.select(cards, function(card) {
					my.turnBuff['噩梦化身'] = [my.getCost(card)];
					var index = my.gr.buyPile.indexOf(card);
					my.gr.buyPile[index] = null;
					my.gr.setAllBack(function() {
						my.gr.fillCard(function() {
							my.castCard(card, function() {
								my.gr.playPile.remove(card);
								my.data[3].remove(card);
								my.data[4].remove(card);
								my.data[5].remove(card);
								my.data[6].remove(card);
								my.gr.trashPile.push(card);
								card.divShow();
								card.setExpand();
								my.gr.log('--放逐'+my.getName(card));
								my.gr.setAllBack(function() {
									my.gr.playPile.push(ori_card);
									setTimeout(callback, 0);
								});
							});
						});
					});
				}, 280, 0);
			}
			return;
		} else if (card.no == 53) {
			if (true) {
				function _end() {
					my.seek(3, callback);
				}
				my.gr.log('--要将弃牌区的几张牌洗回牌库？');
				my.nchoose(4, [900151,900531,900532,900533],function(n) {
					function _loop() {
						if (!my.data[5].length || !n) {
							my.setPileBack(_end);
							my._shuffle(false);
							return;
						}
						n--;
						my.select(my.data[5], function(card) {
							my.gr.log('--将'+my.getName(card)+'洗回牌库');
							my.data[5].remove(card);
							my.data[3].push(card);
							my.setDrawPileBack(_loop);
						});
					}
					_loop();
				});
			}
			return;
		} else if (card.no == 54) {
			let card = my._getCard(false);
			if (card) {
				my.revealCard(card, function() {
					let cost = my.getCost(card, true);
					my.gr.log('--展示'+my.getName(card)+',费用为'+cost);
					my.data[3].push(card);
					my.setPileBack(function() {
						if (cost<=3) {
							// todo 弃置手牌
							//my.opponent.discardCard(my.opponent.data[4][index])
							var aim = my.opponent.data[4].length -cost
							while(my.opponent.data[4].length>aim){
								my.opponent.data[5].push(my.opponent.data[4].pop());
							}
							my.attack(cost, callback);
						} else {
							my.seek(3, callback);
						}
					});
				});
				return;
			}
		} else if (card.no == 56) {
			if (true) {
				var indexCnt = 0;
				var cnt = 0;
				var cards = [];
				function _loop() {
					my.updateData();
					var card = my._getCard(false);
					if (!card) {
						my.gr.log('--牌库没牌啦');
						_end();
						return;
					}
					var cost = my.getCost(card, true);
					my.gr.log('--展示'+my.getName(card)+',费用为'+cost);
					my.revealCard(card, function() {
						cards.push(card);
						if (cost<=2) {
							_end();
							return;
						}
						cnt += cost;
						indexCnt++;
						_loop();
					},indexCnt);
				}
				function _end() {
					for (var i=0; i<cards.length; i++) {
						my.data[3].push(cards[i]);
					}
					my._shuffle(false);
					effect['战力'] += cnt;
					my.setPileBack(callback);
				}
				_loop();
			}
			return;
		} else if (card.no == 57) {
			if (true) {
				var mc = new MultiCallback();
				for (var i=0; i<my.data[4].length; i++) {
					let card = my.data[4][i];
					my.discardCard(card, mc.pipe());
				}
				mc.all(function() {
					effect['战力'] += my.data[4].length;
					my.data[4] = [];
					setTimeout(callback, 0);
				});
			}
			return;
		} else if (card.no == 58) {
			if (true) {
				if (!my.data[4].length) {
					setTimeout(callback, 0);
					return;
				}
				my.gr.log('--放逐一张手牌:');
				my.select(my.data[4], function(card) {
					my.data[4].remove(card);
					let mcb = new MultiCallback();
					my.trashCard(card, mcb.pipe());
					my.handRevise(mcb.pipe());
					mcb.all(function() {
						if (card.no==67) effect['战力']+=2;
						else effect['战力']+=1;
						setTimeout(callback, 0);
					});
				});
			}
			return;
		} else if (card.no == 59) {
			if (my.data[4].length == 1) {
				let card = my.data[4].pop();
				my.discardCard(card, function() {
					if (my.data[0]>=my.opponent.data[0]) {
						effect['战力'] += 2;
					} else {
						effect['战力'] += 3;
					}
					_end();
				});
			} else if (my.data[4].length > 1) {
				var index = Math.seededRandom(0, my.data[4].length-1);
				let card = my.data[4][index];
				my.data[4].remove(card);
				my.discardCard(card, function() {
					if (my.data[0]>=my.opponent.data[0]) {
						effect['战力'] += 2;
					} else {
						effect['战力'] += 3;
					}
					_end();
				});
			} else _end();
			function _end(){
				my.handRevise(function() {
					my.gr.log('--要流放吗?');
					my.nchoose(2, [900151,900152], function(n) {
						if (n==0) {
							setTimeout(callback, 0);
						} else {
							effect['生命'] += 1;
							my.gr.playPile.remove(card);
							card.divShow();
							my.trashCard(card, callback);
						}
					});
				});
			}
			return;
		} else if (card.no == 60) {
			my.drawCard(1, function() {
				function _end() {
					effect['战力']+=2;
					my.attackSelf(2, callback);
				}
				if (my.data[4].length) {
					my.gr.log('--弃置1张手牌');
					my.select(my.data[4], function(card) {
						my.data[4].remove(card);
						var mc = new MultiCallback();
						my.discardCard(card, mc.pipe());
						my.handRevise(mc.pipe());
						mc.all(_end);
					});
				} else {
					setTimeout(_end, 0);
					return;
				}
			});
			return;
		} else if (card.no == 61) {
			my.attackSelf(2, function() {
				effect['战力'] += 3;
				my.gr.log('--要流放吗?');
				my.nchoose(2, [900151,900152], function(n) {
					if (n==0) {
						setTimeout(callback, 0);
					} else {
						effect['生命'] += 1;
						my.gr.playPile.remove(card);
						card.divShow();
						my.trashCard(card, callback);
					}
				});
			});
			return;
		} else if (card.no == 62) {
			my.drawCard(2, function() {
				if (my.data[4].length) {
					my.gr.log('--弃置1张手牌');
					my.select(my.data[4], function(card) {
						my.data[4].remove(card);
						var mc = new MultiCallback();
						my.discardCard(card, mc.pipe());
						my.handRevise(mc.pipe());
						mc.all(callback);
					});
				} else {
					setTimeout(callback, 0);
					return;
				}
			});
			return;
		} else if (card.no == 63) {
			my.drawCard(2, callback);
			return;
		}
		if (card.no == 70) {
			my.opponent.turnBuff['致盲射线'] = true;
			// todo
		} else if (card.no == 71) {
			if (true) {
				var ori_card = card;
				my.gr.playPile.remove(ori_card);
				function _end(card) {
					let mcb = new MultiCallback();
					my.trashCard(card, mcb.pipe());
					my.setAllBack(mcb.pipe());
					mcb.all(_end2);
				}
				function _end2() {
					console.log('inn');
					my.gr.playPile.push(ori_card);
					if (my.data[0] < my.opponent.data[0]) {
						my.nchoose(2, [900231,900201], function(n) {
							if (n==0) {
								effect['战力'] += 1;
							} else {
								effect['营火'] += 1;
							}
							setTimeout(callback, 0);
						});
					} else {
						setTimeout(callback, 0);
					}
				}
				my.gr.log('--要从打出区或弃牌区放逐一张牌吗？');
				my.nchoose(2, [900151,900152], function(n) {
					if (n==0) {
						setTimeout(_end2, 0);
						return;
					} else {
						if (my.gr.playPile.length + my.data[5].length <= 0) {
							setTimeout(_end2, 0);
							return;
						} else {
							my.select2(my.gr.playPile, my.data[5], function(card) {
								my.gr.playPile.remove(card);
								_end(card);
							}, function(card) {
								my.data[5].remove(card);
								_end(card);
							});
						}
					}
				});
			}
			return;
		} else if (card.no == 72) {
			my.isCharge(3, function(n) {
				if (n) {
					my.data[2] -= 3;
					effect['战力'] += 2;
				}
				setTimeout(callback, 0);
			});
			return;
		} else if (card.no == 73) {
			if (true) {
				if (!my.data[4].length) {
					setTimeout(callback, 0);
					return;
				}
				my.gr.log('--放逐一张手牌:');
				my.select(my.data[4], function(card) {
					my.data[4].remove(card);
					let mcb = new MultiCallback();
					my.trashCard(card, mcb.pipe());
					my.handRevise(mcb.pipe());
					mcb.all(function() {
						if (card.no==68) effect['营火']+=2;
						else effect['营火']+=1;
						setTimeout(callback, 0);
					});
				});
			}
			return;
		} else if (card.no == 74) {
			if (my.data[2] >= 1) {
				my.gr.log('--是否要充能');
				my.nchoose(2, [900151, 900722], function(n) {
					if (n==1) {
						my.data[2] -= 1;
						my.charging();
						my.drawCard(1, callback);
					} else {
						setTimeout(callback, 0);
					}
				});
				return;
			}
		} else if (card.no == 75) {
			if (true) {
				my.turnBuff['粒子数反转'] = true;
				my.gr.log('--要流放吗?');
				my.nchoose(2, [900151,900152], function(n) {
					if (n==0) {
						setTimeout(callback, 0);
					} else {
						effect['营火'] += 1;
						my.gr.playPile.remove(card);
						card.divShow();
						my.trashCard(card, callback);
					}
				});
			}
			return;
		} else if (card.no == 76) {
			my.drawCard(1, function() {
				if (my.data[2] >= 3) {
					my.gr.log('--是否要充能');
					my.nchoose(2, [900151, 900722], function(n) {
						if (n==1) {
							my.data[2] -= 3;
							effect['战力'] += 2;
							my.charging();
						} else {
						}
						setTimeout(callback, 0);
					});
					return;
				} else {
					setTimeout(callback, 0);
				}
			});
			return;
		} else if (card.no == 77) {
			function _end() {
				my.handRevise(function() {
					my.gr.log('--声明一种资源');
					my.nchoose(2, [900771,900772], function(n) {
						if (n==0) {
							my.turnBuff['电眼逼人'] = '战力';
						} else {
							my.turnBuff['电眼逼人'] = '营火';
						}
						setTimeout(callback, 0);
					});
				});
			}
			my.drawCard(3, function() {
				var cnt = 3;
				function _loop() {
					if (cnt) {
						cnt--;
						if (my.data[4].length) {
							my.select(my.data[4], function(card) {
								my.data[4].remove(card);
								my.discardCard(card, function() {
									_loop();
								});
							});
						} else {
							setTimeout(_end, 0);
						}
					} else {
						setTimeout(_end, 0);
					}
				}
				_loop();
			});
			return;
		} else if (card.no == 80) {
			if (my.data[2] >= 1) {
				my.gr.log('--选择要充能的营火');
				my.nchoose(my.data[2]>=2?3:2, [900151, 900201, 900202], function(n) {
					if (n) {
						my.data[2] -= n;
						my.charging();
						effect['生命'] += n;
					}
					setTimeout(callback, 0);
				});
				return;
			} else {
				setTimeout(callback, 0);
			}
			return;
		}
		
		setTimeout(callback, 0);
	}
	nchoose(n, nos, callback) {
		// 抉择
		let cards = new Array(n);
		var my = this;
		my.updateData();
		let lefts = my.getLefts(n, 10, 200, 1100);
		for (let i=0; i<n; i++) {
			let card = new Card(nos[i], true);
			cards[i] = card;
			card.setZIndex(1100, true);
			card.setPos(lefts[i],290);
			card.setBorder(2);
			card.onclick(function() {
				for (let j=0; j<n; j++) if (j!=i)cards[j].destroy();
				card.setBorder(1);
				card.wait(500).action(function() {
					card.destroy();
					setTimeout(function() {
						if (callback) callback(i);
					}, 0);
				});
			});
		}
	}
	select(cards, click, height=280, zIndexAdd=100) {
		// 挑选
		var my = this;
		my.updateData();
		var mc = new MultiCallback();
		let lefts = my.getLefts(cards.length, 5, 200, 1140);
		for (let i=0; i<cards.length; i++) {
			let card = cards[i];
			card.setZIndex(i+801+zIndexAdd, true);
			card.divShow();
			card.setBorder(0);
			card.offclick();
			card.activeDarg(false);
			card.expand().move(lefts[i], height).action(mc.pipe(function() {
				card.activeShowBig();
			}));
		}
		mc.all(function() {
			for (let i=0; i<cards.length; i++) {
				let card = cards[i];
				card.setBorder(2);
				card.onclick(function() {
					click.call(my, card);
				});
			}
		});
	}
	select2(cards1,cards2, click1, click2) {
		this.select(cards1, click1, 180);
		this.select(cards2, click2, 380);
	}
	select3(cards, oncast, height=520) {
		var my = this;
		var mc = new MultiCallback();
		let lefts = my.getLefts(cards.length, 5, 200, 1140);
		for (let i=0; i<cards.length; i++) {
			let card = cards[i];
			card.setZIndex(i+800+2, true);
			card.divShow();
			card.setBorder(0);
			card.offclick();
			card.expand().move(lefts[i], height).action(mc.pipe(function() {
				card.activeShowBig();
			}));
		}
		mc.all(function() {
			for (let i=0; i<cards.length; i++) {
				let card = cards[i];
				card.setBorder(2);
				my._examHandCard(card, function() {
					oncast(card);
				});
			}
		});
	}
	select4(callback) {
		// select weapon: 1,2 for face; 1,2 for weapon
		var my = this;
		var cards = [];
		function _end(n) {
			cards[0].destroy();
			var mcb = new MultiCallback();
			for (let i=0; i<2; i++) {
				let card = my.weapons[i];
				if (card) {
					let pos = my.getWeaponPos(i, true);
					card.shrink().move(pos[0], pos[1]).action(mcb.pipe(function() {
						card.divHide();
						my._weaponDivs[i].show();
					}));
				}
			}
			mcb.all(function() {
				if (callback) callback(n);
			});
		}
		cards.push(new Card(my.no, true));
		cards[0].setPos(my.x, my.y);
		for (let i=0; i<2; i++) {
			let card = my.weapons[i];
			if (card) {
				if (card.no == 81) continue;
				if (Resources.CardData[card.no].ability['护卫']) {
					_end(i+1);
					return;
				}
				my._weaponDivs[i].hide();
				cards.push(card);
			}
		}
		if (cards.length==1) {
			_end(0);
			return;
		}
		my.gr.log('--选择一个目标');
		my.select(cards, function(card) {
			if (card == cards[0]) {
				_end(0);
				return;
			}
			var index = my.weapons.indexOf(card);
			_end(index+1);
			return;
		});
	}
	seek(n, callback) {
		// 探查
		var my = this;
		var before = my.data[4].length;
		my.drawCard(n, function() {
			var draws = my.data[4].length - before;
			if (draws) my.gr.log('--将'+draws+'张牌放回牌库顶(探查)');
			function _loop() {
				my.updateData();
				if (draws<=0) {
					my.handRevise(callback);
					return;
				}
				draws--;
				my.select(my.data[4], function(card) {
					my.data[4].remove(card);
					my.data[3].push(card);
					my.gr.log('--将'+my.getName(card)+'放回牌库顶');
					my.setPileBack(function() {
						//card.wait(500).action(_loop);
						setTimeout(_loop, 0);
					});
				});
			}
			_loop();
		});
	}
	isCharge(n, callback) {
		var my = this;
		if (my.data[2] >= n) {
			my.gr.log('--是否要充能?');
			my.nchoose(2, [900151, 900722], function(n) {
				if (n == 0) {
					callback(0);
				} else {
					my.charging();
					callback(n);
				}
			});
		} else {
			callback(0);
		}
	}
	trashCard(card, callback) {
		this.data[6].push(card);
		let pos = this.getDecoratePos(6, true);
		var my = this;
		this.gr.log('--放逐'+Resources.CardData[card.no].name);
		//if (my.no==2 && [67,68,69].indexOf(card.no)>=0) my.data[0]+=1;
		my.updateData();
		card.shrink().move(pos[0], pos[1]).action(function() {
			card.divHide();
			setTimeout(callback, 0);
		});
	}
	discardCard(card, callback) {
		this.data[5].push(card);
		let pos = this.getDecoratePos(5, true);
		var my = this;
		my.turnBuff['弃置过手牌'] = true;
		this.gr.log('--丢弃'+Resources.CardData[card.no].name);
		my.updateData();
		card.shrink().move(pos[0], pos[1]).action(function() {
			card.divHide();
			setTimeout(callback, 0);
		});
	}
	revealCard(card, callback, zIndexAdd=0) {
		card.setBorder(0);
		card.divShow();
		card.setZIndex(802+zIndexAdd, true);
		card.expand().move(600, 360).wait(500).action(function() {
			card.activeShowBig();
			setTimeout(callback, 0);
		});
	}
	setAllBack(callback) {
		var my = this;
		let lefts = my.getLefts(my.gr.playPile.length, -45, my.playPilePos[0][0], my.playPilePos[1][0]);
		let mc = new MultiCallback();
		for (let i=0; i<my.gr.playPile.length; i++) {
			let card = my.gr.playPile[i];
			card.offclick();
			card.setZIndex(i+1, true);
			card.setBorder(0);
			card.move(lefts[i], my.playPilePos[0][1]).action(mc.pipe());
		}
		let pos = my.getDecoratePos(5, true);
		for(let i=0; i<my.data[5].length; i++) {
			let card = my.data[5][i];
			card.offclick();
			card.shrink().move(pos[0], pos[1]).action(mc.pipe(function() {
				card.divHide();
			}));
		}
		let pos2 = my.getDecoratePos(3, true);
		for(let i=0; i<my.data[3].length; i++) {
			let card = my.data[3][i];
			//console.log(card);
			card.offclick();
			card.shrink().move(pos2[0], pos2[1]).action(mc.pipe(function() {
				card.divHide();
			}));
		}
		mc.all(callback);
	}
	setPileBack(callback) {
		var my = this;
		let mc = new MultiCallback();
		let pos = my.getDecoratePos(5, true);
		for(let i=0; i<my.data[5].length; i++) {
			let card = my.data[5][i];
			card.offclick();
			card.shrink().move(pos[0], pos[1]).action(mc.pipe(function() {
				card.divHide();
			}));
		}
		let pos2 = my.getDecoratePos(3, true);
		for(let i=0; i<my.data[3].length; i++) {
			let card = my.data[3][i];
			//console.log(card);
			card.offclick();
			card.shrink().move(pos2[0], pos2[1]).action(mc.pipe(function() {
				card.divHide();
			}));
		}
		mc.all(callback);
		
	}
	setDrawPileBack(callback) {
		var my = this;
		let mc = new MultiCallback();
		let pos = my.getDecoratePos(3, true);
		for(let i=0; i<my.data[3].length; i++) {
			let card = my.data[3][i];
			card.offclick();
			card.shrink().move(pos[0], pos[1]).action(mc.pipe(function() {
				card.divHide();
			}));
		}
		mc.all(callback);
		
	}
	applyEffect(effect,callback) {
		var my = this;
		if (my.turnBuff['电眼逼人']) {
			var buff = my.turnBuff['电眼逼人'];
			if (buff == '营火') {
				if (effect['营火']) my.gr.log('--电眼逼人生效');
				effect['营火'] *= 2;
			}
			if (buff == '战力') {
				if (effect['战力']) my.gr.log('--电眼逼人生效');
				effect['战力'] *= 2;
			}
		}
		if (effect['营火']) {
			my.charging(effect['营火']);
			my.data[2] += effect['营火'];
			my.gr.log('<span style="color:#BBB">--获得营火'+effect['营火']+'</span>');
		}
		if (effect['战力']) {
			my.gr.log('<span style="color:#BBB">--获得战力'+effect['战力']+'</span>');
			//my.attack(effect['战力']);
			my.power += effect['战力'];
		}
		if (effect['生命']) {
			my.data[0] += effect['生命'];
			my.gr.log('<span style="color:#BBB">--获得生命'+effect['生命']+'</span>');
		}
		my.updateData();
		my.opponent.updateData(); 
		setTimeout(callback, 0);
	}
	countingCard(card, effect, callback){ 
		// 结算
		var my = this;
		var len = my.gr.playPile.length;
		var lefts = my.getLefts(len, -55, my.playPilePos[0][0], my.playPilePos[1][0]);
		
		let mc = new MultiCallback();
		for (var i=0; i<2; i++) {
			if (my.weapons[i] && my.weapons[i].no==32 &&my.weapons[i]!=card) {
				let card = my.weapons[i];
				if (!card.counter)card.counter=0;
				card.counter++;
				if (card.counter>=3) {
					card.counter=0;
					my.gr.log('--冠军腰带发动');
					my.applyEffect({'生命':1}, mc.pipe());
				}
			}
		}
		for (let i=0; i<len; i++) {
			let card2 = my.gr.playPile[i];
			card2.setZIndex(i+1, true);
			// card2.setPos(lefts[i], my.playPilePos[0][1])
			// card2.fadeIn(mc.pipe(function() {
				// if (i+1 == len) card2.activeShowBig();
			// }));
			card2.move(lefts[i], my.playPilePos[0][1]).action(mc.pipe(function() {
				card2.activeShowBig();
				card2.divShow();
			}));
		}
		mc.all(function() {
			my.applyEffect(effect, function() {
				my.interactive();
				if (card.doubleCast && my.isType(card, '法术')) {
					card.doubleCast = false;
					var flag = false;
					for (let i=0; i<2; i++) {
						let card = my.weapons[i];
						if (card && card.no==78) flag = true;
					}
					if (flag) {
						my.data[3].remove(card);
						my.data[4].remove(card);
						my.data[5].remove(card);
						my.data[6].remove(card);
						my.gr.playPile.remove(card);
						my.castCard(card, callback);
					} else {
						setTimeout(callback, 0);
					}
				} else {
					//my.turnBuff['谐振腔'] = false;
					setTimeout(callback, 0);
				}
			});
			
		});
	}
	buyCard(card) {
		var my = this;
		//this.interactive(true);
		this.interactive(false);
		my.gr.buyPile[my.gr.buyPile.indexOf(card)] = null;
		my.gr.log('购买'+Resources.CardData[card.no].name);
		if (my.turnBuff['断片感应']) {
			my.turnBuff['断片感应'] = false;
			if (!my.isStyle(card, '聚流')) {
				my.data[2] += 1;
				my.gr.log('--断片感应发动');
			}
		}
		
		var callback = function() {
			my.gr.fillCard(function() {
				my.interactive();
			});
		}
		
		if (my.turnBuff['粒子数反转']) {
			my.turnBuff['粒子数反转'] = false;
			if (my.isType(card, '法术')) {
				my.gr.log('--粒子数反转触发');
				my.applyEffect({'战力':2});
			}
		}
		
		// 获得时
		if (card.no==25) {
			my.data[3].push(card);
			my.setPileBack(function() {
				my.updateData();
				card.divHide();
				my.gr.fillCard(function() {
					my.interactive();
				});
			});
			return;
		} else if (card.no == 20) {
			my.gr.log('--至多将两张置入手牌');
			(function() {
				var ori_card = card;
				my.data[2]+=Resources.CardData[20].cost;
				my.updateData();
				my.nchoose(my.data[2]>8?8:my.data[2], [900201, 900202, 900203,
					900204, 900205, 900206, 900207, 900208], function(n) {
					n++;
					my.data[2] -= n;
					let cards = [];
					let discardCards = [];
					function _end() {
						let mc = new MultiCallback();
						for (let i=0; i<cards.length; i++) {
							my.discardCard(cards[i], mc.pipe());
						}
						for (let i=0; i<discardCards.length; i++) {
							my.discardCard(discardCards[i], mc.pipe());
						}
						mc.all(function() {
							var mcb = new MultiCallback();
							my.trashCard(ori_card, mcb.pipe());
							my.gr.fillCard(mcb.pipe());
							mcb.all(function() {
								my.interactive();
							});
						});
					}
					for (let i=0; i<n; i++) {
						if (my.data[3].length-1-i<0) break;
						let card = my.data[3][my.data[3].length-1-i];
						if (('营火' in Resources.CardData[card.no].effect) 
							|| Resources.CardData[card.no].ability['聚气']) {
							cards.push(card);
						} else {
							discardCards.push(card);
						}
					}
					for (var i=0; i<cards.length; i++) my.data[3].remove(cards[i]);
					for (var i=0; i<discardCards.length; i++) my.data[3].remove(discardCards[i]);
					my.updateData();
					if (!cards.length) {
						_end()
					}
					my.select(cards, function(card) {
						my.data[4].push(card);
						my.handRevise(function() {
							cards.remove(card);
							my.updateData();
							if (!cards.length) {
								_end()
							}
							my.select(cards, function(card) {
								cards.remove(card);
								my.data[4].push(card);
								my.handRevise(_end);
							});
						});
					});
				});
			})();
			return;
		} else if (card.no == 19) {
			my.equipWeapon(card, callback);
			return;
		} else if (card.no == 32) {
			var cnt = 0;
			for (var i=0; i<my.gr.playPile.length; i++) {
				let card = my.gr.playPile[i];
				if (my.isType(card, '武技')) cnt++;
			}
			if (cnt>5) cnt=5;
			var effect = {'生命':cnt};
			my.applyEffect(effect, function() {
				my.discardCard(card, callback);
			});
			return;
		} else if (card.no == 40) {
			my.gr.log('--要从打出区放逐一张牌吗？');
			my.nchoose(2, [900151,900152], function(n) {
				if (n==0) {
					my.discardCard(card, callback);
				} else {
					var ori_card = card;
					my.select(my.gr.playPile, function(card) {
						var mc = new MultiCallback();
						my.gr.playPile.remove(card);
						my.trashCard(card, mc.pipe());
						my.setAllBack(mc.pipe());
						mc.all(function() {
							my.discardCard(ori_card, callback);
						});
					});
				}
			});
			return;
		} else if (card.no == 31) {
			my.gr.log('--要将弃牌区的一张费用不大于5的武技牌置入手牌吗？');
			my.nchoose(2, [900151,900152], function(n) {
				var ori_card = card;
				if (n==0) {
					setTimeout(callback, 0);
				} else {
					var cards = [];
					for (let i=0; i<my.data[5].length; i++) {
						let card = my.data[5][i];
						if (my.getCost(card)<=5 && my.isType(card, '武技')) cards.push(card);
					}
					if (!cards.length) {
						my.discardCard(ori_card, callback);
						return;
					}
					my.select(cards, function(card) {
						my.data[5].remove(card);
						my.data[4].push(card);
						var mc = new MultiCallback();
						my.setAllBack(mc.pipe());
						my.handRevise(mc.pipe());
						mc.all(function() {
							my.discardCard(ori_card, callback);
						});
					});
				}
			});
			return;
		} else if (card.no == 51) {
			my.data[3].push(card);
			my.setPileBack(function() {
				//my.updateData();
				//card.divHide();
				my.gr.fillCard(function() {
					my.interactive();
				});
			});
			return;
		} else if (card.no == 65) {
			if (card._switch) {
				card._switch = false;
				my.equipWeapon(card, callback);
				return;
			} else {
				my.discardCard(card, callback);
			}
		} else if (card.no == 66) {
			var cnt = 1;
			for (var i=0; i<my.data[6].length; i++) {
				if (my.data[6][i].no == 66) {
					cnt++;
				}
			}
			my.trashCard(card, function() {
				my.attack(cnt, callback);
			});
		} else if (card.no == 72 || card.no==76) {
			my.isCharge(3, function(n) {
				if (n) {
					my.data[2] -= 3;
					my.applyEffect({'战力':2});
				}
				my.discardCard(card, callback);
			});
		} else if (card.no == 79) {
			my.isCharge(6, function(n) {
				if (n) {
					my.data[2] -= 6;
					my.attack(4, function() {
						my.discardCard(card, callback);
					});
					return;
				}
				my.discardCard(card, callback);
			});
		} else if (card.no == 80) {
			if (my.data[2] >= 1) {
				my.gr.log('--选择要充能的营火');
				my.nchoose(my.data[2]>=2?3:2, [900151, 900201, 900202], function(n) {
					if (n) {
						my.data[2] -= n;
						my.charging();
						my.applyEffect({'生命':n});
					}
					my.discardCard(card, callback);
				});
				return;
			} else {
				my.discardCard(card, callback);
			}
		} else if (card.no == 74) {
			my.isCharge(1, function(n) {
				if (n) {
					my.data[2] -= 1;
					my.drawCard(1, function() {
						my.discardCard(card, callback);
					});
					return;
				}
				my.discardCard(card, callback);
			});
		} else if (card.no == 81) {
			my.applyEffect({'生命':3});
			my.equipWeapon(card, callback);
			return;
		} else {
			my.discardCard(card, callback);
		}
	}
	equipWeapon(card, callback) {
		var my = this;
		var no = null;
		//card.divHide();
		function _end() {
			card.divShow();
			my.weapons[no] = card;
			let pos = my.getWeaponPos(no, true);
			my.gr.log('--装备'+Resources.CardData[card.no].name);
			card.shrink().move(pos[0], pos[1]).action(function() {
				card.divHide();
				my._weaponDivs[no].show();
				my.resetWeapon(no);
				setTimeout(callback, 0);
			});
		}
		if (!my.weapons[0]) no = 0;
		else if (!my.weapons[1]) no = 1;
		else {
			this._weaponDivs[0].hide();
			this._weaponDivs[1].hide();
			my.gr.log('--选择一个装备弃置');
			my.select(my.weapons, function(card) {
				var mcb = new MultiCallback();
				no = my.weapons.indexOf(card);
				card = my.weapons[1-no];
				let pos = my.getWeaponPos(no, true);
				card.shrink().move(pos[0], pos[1]).action(mcb.pipe(function() {
					card.divHide();
					my._weaponDivs[1-no].show();
				}));
				my.dropWeapon(no, mcb.pipe());
				mcb.all(function() {
					card.wait(500).action(_end);
				});
			});
			return;
		}
		_end();
	}
	dropWeapon(no, callback) {
		let card = this.weapons[no];
		if(card) {
			this._weaponDivs[no].hide();
			this.weapons[no] = null;
			this.discardCard(card, callback);
			return;
		}
		setTimeout(callback, 0);
	}
	useWeapon(no, callback_t) {
		var my = this;
		my.interactive(false);
		var card = this.weapons[no];
		var effect = {'战力':0, '生命':0, '营火':0};
		var callback = function() {
			my.applyEffect(effect, function() {
				my.interactive(true);
				setTimeout(callback_t);
			});
		}
		if (!card || !card.skill) {
			setTimeout(callback, 0);
			return;
		}
		
		my.gr.log('发动装备'+my.getName(card));
		
		if (card.no == 18) {
			my.gr.log('--要流放吗?');
			my.nchoose(2, [900151,900152], function(n) {
				if (n==0) {
					setTimeout(callback, 0);
				} else {
					effect['战力'] += 1;
					var mc = new MultiCallback();
					my.dropWeapon(no, mc.pipe());
					my.trashCard(card, mc.pipe());
					mc.all(function() {
						my.data[5].remove(card);
						setTimeout(callback, 0);
					});
				}
			});
			return;
		}
		if (card.no == 64) {
			my.gr.log('--要流放吗?');
			my.nchoose(2, [900151,900152], function(n) {
				if (n==0) {
					setTimeout(callback, 0);
				} else {
					effect['生命'] += 1;
					var mc = new MultiCallback();
					my.dropWeapon(no, mc.pipe());
					my.trashCard(card, mc.pipe());
					mc.all(function() {
						my.data[5].remove(card);
						setTimeout(callback, 0);
					});
				}
			});
			return;
		}
		if (card.no == 40) {
			my.gr.log('--要放逐中央牌列的一张牌吗?');
			my.nchoose(2, [900151,900152], function(n) {
				if (n==0) {
					setTimeout(callback, 0);
				} else {
					card.skill = false;
					var cards = [];
					//if (my.gr.firePile.length) cards.push(my.gr.firePile[my.gr.firePile.length-1]);
					for (var i=0; i<my.gr.buyPile.length; i++) {
						let card = my.gr.buyPile[i];
						if (card) cards.push(card);
					}
					my.select(cards, function(card) {
						var index = my.gr.buyPile.indexOf(card);
						if (index>=0) my.gr.buyPile[index] = null;
						else my.gr.firePile.pop();
						my.gr.trashPile.push(card);
						my.gr.setAllBack(function() {
							my.gr.fillCard(callback);
						});
					});
				}
			});
			return;
		}
		if (card.no == 55) {
			card.skill = false;
			my.gr.log('--造成3点伤害');
			effect['战力']+=3;
			if (my.data[3].length) {
				let card = my.data[3][my.data[3].length-1];
				my.revealCard(card, function() {
					my.setAllBack(callback);
				});
				return;
			}
		}
		if (card.no == 79) {
			my.isCharge(6, function(n) {
				if (n) {
					my.data[2] -= 6;
					card.skill = false;
					my.attack(4, callback);
				} else {
					setTimeout(callback, 0);
				}
			});
			return;
		}
		if (card.no == 81) {
			card.skill = false;
			while(my.opponent.data[3].length>0){
				my.opponent.data[6].push(my.opponent.data[3].pop());
			}
			while(my.opponent.data[5].length>0){
				my.opponent.data[6].push(my.opponent.data[5].pop());
			}
			var mc = new MultiCallback();
			my.dropWeapon(no, mc.pipe());
			my.trashCard(card, mc.pipe());
			mc.all(function() {
				my.data[5].remove(card);
				setTimeout(callback, 0);
			});
			return;
		}
		setTimeout(callback, 0);
	}
	isIn(x,y, lt, rd) {
		if (x<=rd[0] && x>=lt[0] && y<=rd[1] && y>=lt[1]) return true;
		return false;
	}
	cover(isOn=true) {
		if (isOn) {
			this.cover(false);
			var $div = $('<div>');
			$div.css('width', 1400);
			$div.css('height', 720);
			$div.css('background-color', 'rgba(255,255,255,0.5)');
			$div.css('position', 'absolute');
			$div.css('z-index', '1001');
			$('#gamebody').append($div);
			this.coverDiv = $div;
		} else {
			if (this.coverDiv) this.coverDiv.remove();
		}
	}
}

 
class GameRule {
	constructor() {
		var width = 1334;
		var height = 198;
		var $div = $('<div>');
		$div.css('width', width+'px');
		$div.css('height', height+'px');
		$div.css('background-image', 'url(img/cardspos.png');
		$div.css('background-size', '100% 100%');
		$div.css('position', 'absolute');
		//$div.css('z-index', '-100');
		this.$div = $div;
		
		var btn = $('<button>');
		btn.data = {'on':'回合结束', 'off':'对手回合'};
		btn.html(btn.data.off);
		btn.attr("disabled",true);
		btn.css('position', 'absolute');
		btn.css('border-radius', '5px');
		btn.css('font-size', '1.5em');
		btn.css('width', 120);
		btn.css('height', 60);
		btn.css('left', 45);
		btn.css('top', 450);
		$('#gamebody').append(btn);
		this.btn = btn;
		btn.hide();
		
		var powerDiv = document.createElement('div');
		powerDiv.style.width = '50px';
		powerDiv.style.height = '23px';
		powerDiv.style.position = 'absolute';
		//powerDiv.style.borderRadius = '5px';
		powerDiv.style.left = '180px';
		powerDiv.style.top = '470px';
		powerDiv.style.textAlign = 'left';
		powerDiv.style.lineHeight = '23px';
		powerDiv.style.fontSize = '0.7em';
		powerDiv.style.cursor = 'default';
		$('#gamebody').append(powerDiv);
		this.powerDiv = $(powerDiv);
		
		$('#gamebody').append($div);
		this.setPos(40,20);
		this.poses = [[19,24],[239,24],[409,24],[552,24],[698,24],[843,24],[988,24],[1206,24]];
		this.heroPos = [[50,530],[50,280]];
		this.castArea = [[280,220], [950,500]];
		this.playPilePos = [[270,320], [450,320]];
		this.seed = 5;
	}
	log(text) {
		if (this.Log) {
			this.Log.html(this.Log.html()+'<br>  '+text);
			this.Log.scrollTop(this.Log.prop("scrollHeight"));
		} else {
			console.log(text);
		}
	}
	setPos(x,y) {
		this.x = x;
		this.y = y;
		this.$div.css('left', this.x);
		this.$div.css('top', this.y);
	}
	getPos(n) {
		return [this.x+this.poses[n][0], this.y+this.poses[n][1]];
	}
	getHeroPos(isMe=true) {
		if (isMe) return [50,530];
		else return [50,280];
	}
	turnOn() {
		this.btn.attr("disabled",false);
		this.btn.html(this.btn.data.on);
	}
	btnInteractive(isTrue=true) {
		if (isTrue) this.btn.attr("disabled",false);
		else this.btn.attr("disabled",true);
	}
	turnOff() {
		this.btn.attr("disabled",true);
		this.btn.html(this.btn.data.off);
	}
	activeLog() {
		var div = $('<div>');
		div.css('width', 245);
		div.css('height', 320);
		div.css('position', 'absolute');
		div.css('overflow-y', 'scroll');
		div.css('overflow-x', 'hidden');
		div.css('left', 1130);
		div.css('top', 340);
		
		// var warp = $('<div>');
		// warp.css('width', 220);
		// warp.css('height', 320);
		// warp.css('left', 1130);
		// warp.css('top', 340);
		// warp.css('position', 'absolute');
		// warp.css('border-bottom', '1px black solid');
		// div.css('overflow', 'hidden');
		// warp.append(div);
		
		$('#gamebody').append(div);
		this.Log = div;
		//this.Log.html('<br><br><br><br><br><br><br><br><br><br><br><br><br><br>')
	}
	fillCard(callback) {
		var my = this;
		var mc = new MultiCallback();
		for (let i=0; i<5; i++) {
			if (!this.buyPile[i] && this.commonPile.length) {
				this.buyPile[i] = this.commonPile.pop();
				var pos = my.getPos(i+2);
				this.buyPile[i].rotate().move(pos[0], pos[1]).action(mc.pipe());
			} 
		}
		mc.all(function() {
			setTimeout(callback, 0);
		});
	}
	setAllBack(callback) {
		var my = this;
		var mc = new MultiCallback();
		for (let i=0; i<5; i++) {
			var card = my.buyPile[i];
			var pos = my.getPos(i+2);
			if (card) card.move(pos[0], pos[1]).action(mc.pipe());
		}
		for (let i=0; i<my.trashPile.length; i++) {
			var card = my.trashPile[i]
			card.setZIndex(i+1, true);
			var pos = my.getPos(7);
			card.move(pos[0], pos[1]).action(mc.pipe());
		}
		if (my.firePile.length) {
			var card = my.firePile[my.firePile.length-1]
			var pos = my.getPos(1);
			card.move(pos[0], pos[1]).action(mc.pipe());
		}
		mc.all(function() {
			setTimeout(callback, 0);
		});
	}
	setPower(n) {
		this.powerDiv.html('战力:'+n);
	}
	init(seed, herono, isAfter=false, callback) {
		var my = this;
		Math.setSeed(seed);
		this.firePile = [];
		this.commonPile = [];
		this.playPile = [];
		this.trashPile = [];
		this.buyPile = new Array(5);
		this.activeLog();
		this.btn.show();
		my.log('初始化种子'+seed+'.....');
		
		
		var styles = ['气功', '街斗', '连击', '聚流', '精神', '充能'];
		for (var i=0; i<3; i++) {
			var index = Math.seededRandom(0,styles.length-1);
			my.log('选择风格'+styles[index]);
			my.loadStyle(styles[index]);
			styles.remove(styles[index]);
		}
		
		
		
		var pos0 = this.getPos(0);
		var pos1 = this.getPos(1);
		for (let i=0; i<10; i++) {
			let card = new Card(69, true);
			card.setPos(pos1[0], pos1[1]);
			card.activeShowBig();
			this.firePile.push(card);
		}
		Math.shuffle(this.commonPile);
		//this.commonPile.push(new Card(80, true)); ////////
		//this.commonPile.push(new Card(81, true)); ////////
		for (let i=0; i<this.commonPile.length; i++) {
			this.commonPile[i].setZIndex(i);
			this.commonPile[i].setBack();
			this.commonPile[i].activeShowBig();
			this.commonPile[i].setPos(pos0[0], pos0[1]);
		}
		
		let mc = new MultiCallback();
		my.fillCard(mc.pipe());
		
		var heros = [new Hero(herono[0], true), new Hero(herono[1])];
		this.heros = heros;
		for (let i=0; i<2; i++) {
			heros[i].setPos(my.heroPos[i][0],my.heroPos[i][1]);
			heros[i].gr = my;
			heros[i].activeShowBig();
			heros[i].opponent = heros[1-i];
			heros[i].init(mc.pipe());
		}
		
		mc.all(function() {
			setTimeout(callback, 0);
			my.log('对局开始');
			heros[isAfter?1:0].turnStart();
		});
		
		my.turnOff();
		my.btn.on('click', function() {
			my.turnOff();
			heros[0].turnEnd(function() {
				heros[1].turnStart();
			});
		});
	}
	loadStyle(style='气功') {
		for (let i=9; i<=81; i++) {
			for (var j=0; j<Resources.CardData[i].number; j++) {
				if (Resources.CardData[i].style == style) {
					this.commonPile.push(new Card(i, true));
				}
			}
		}
	}
}

var gr = null;
$(function() {
	document.onselectstart = function(){return false;};
	// document.body.style.cursor = 'wait';
	Resources.ready(function(){
		$('#loading').remove();
		gr = new GameRule();
		gr.init(Math.Random(5,100000), [2,2]);
		
	});
});





