
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
	Math.shuffle = function(arr) {
		var len = arr.length, tmp;
		for (var i=0; i<len; i++) {
			let aim = Math.seededRandom(0,len-1);
			tmp = arr[i];
			arr[i] = arr[aim];
			arr[aim] = tmp;
		}
		return arr;
	};
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
		show.style.zIndex = '1000';
		//show.style.transform = 'translateX('+width+'px) translateY(-'+height*bigsize+'px)';
		this.show = show;
		
		
		
		div.appendChild(front);
		div.appendChild(back);
		warp.appendChild(div);
		$('#gamebody').append(warp);
		$('#gamebody').append(show);
		
		this.rotateSave = 0;
		this.setZIndex(0, true);
		this.setPos(100,50);
		this.no = no;
		$(show).hide();
		if (!isShow) this.divHide();
		
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
			n +=  stepGet(n, 10, 180);
			my.div.style.transform = 'rotateY('+(n+my.rotateSave)+'deg)';
			if (!stepGet(n, 10, 180)) {
				clearInterval(inter);
				my.rotateSave += 180;
				setTimeout(callback, 0);
			}
		}, 1000/60);
	}
	acShrink(callback) {
		var my = this;
		var sc = 1;
		var scMin = 0.1;
		function loop() {
			sc *= 0.8;
			if (sc < scMin) sc = scMin;
			my.warp.style.transform = 'scale('+sc+')';
			if (sc > scMin) setTimeout(loop, 1000/60);
			else {
				setTimeout(callback, 0);
			}
		}
		loop();
	}
	acExpand(callback) {
		var my = this;
		var sc = 0.1;
		function loop() {
			sc *= 1.2;
			if (sc > 1) sc = 1;
			my.warp.style.transform = 'scale('+sc+')';
			if (sc < 1) setTimeout(loop, 1000/60);
			else {
				setTimeout(callback, 0);
			}
		}
		loop();
	}
	acMove(ax, ay, speed, callback) {
		var my = this;
		$(this.warp).animate({'left':ax,'top':ay},"normal", 'swing', function() {
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
			this.warp.style.boxShadow = '0px 0px 10px 1px blue';
		} else if (type == 2) {
			this.warp.style.boxShadow = '0px 0px 10px 1px black';
		} else if (type == 3) {
			this.warp.style.boxShadow = '0px 0px 10px 1px red';
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
			this.data = [26,99,0, [],[],[],[]];
		} else if (no == 4) {
			this.data = [32,2,0, [],[],[],[]];
		} else {
			this.data = [35,0,0, [],[],[],[]];
		}
		this.equipments = [];
		this.activeDecorate();
		this.castArea = [[280,220], [950,450]];
		this.playPilePos = [[270,320], [450,320]];
		this.handHeight = 560;
	}
	activeDecorate() {
		var my = this;
		var width = this.height/7;
		var doms = new Array(7);
		this.doms = doms;
		var titles = ['生命','技能次数','营火','牌库','手牌','弃牌','放逐'];
		for (let i=0; i<7; i++) {
			var show = document.createElement('div');
			//show.style.backgroundImage = 'url('+frontImg+')';
			//show.style.backgroundSize = '100% 100%';
			show.style.width = width+'px';
			show.style.height = width+'px';
			show.style.position = 'absolute';
			show.style.borderRadius = '5px';
			show.style.left = this.width+'px';
			show.style.top = width*i+'px';
			show.style.textAlign = 'center';
			show.style.lineHeight = width+'px';
			show.style.cursor = 'default';
			//show.style.transform = 'translateX('+width+'px) translateY(-'+height*(bigsize+1)/2+'px)';
			show.title = titles[i];
			this.warp.appendChild(show);
			show.innerHTML = '0';
			doms[i] = show;
			if (i>2) {
				$(show).on('click', function() {
					my.gr.log(my.data[i]);
				});
			}
		}
	}
	setDecorate(n, val) {
		this.doms[n].innerHTML = val;
	}
	getDecoratePos(n, isShrink=false) {
		if (isShrink) {
			return [this.x+this.width+this.height/14-this.width/2, this.y+this.height/7*n+this.height/14-this.height/2];
		}
		return [this.x+this.width+this.height/14, this.y+this.height/7*n+this.height/14];
	}
	
	updateData() {
		if (this.data) {
			this.setDecorate(0,this.data[0]);
			this.setDecorate(1,this.data[1]);
			this.setDecorate(2,this.data[2]);
			this.setDecorate(3,this.data[3].length);
			this.setDecorate(4,this.data[4].length);
			this.setDecorate(5,this.data[5].length);
			this.setDecorate(6,this.data[6].length);
		}
	}
	init(callback) {
		for (var j=0; j<8; j++) this.data[3].push(new Card(68));
		for (var j=0; j<2; j++) this.data[3].push(new Card(67));
		Math.shuffle(this.data[3]);
		this.data[3].push(new Card(26));
		this.data[3].push(new Card(69));
		this.data[3].push(new Card(24));
		this.data[3].push(new Card(15));
		this.data[3].push(new Card(69));
		this.data[3].push(new Card(69));
		this.drawCard(5, callback);
	}
	_shuffle() {
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
	_getCard() {
		if (this.data[3].length) return this.data[3].pop();
		else {
			if (this.data[5].length) {
				this._shuffle();
				return this.data[3].pop();
			} else {
				this.gr.log('无牌可抽');
				return null;
			}
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
	turnStart() {
		this.turnBuff = {};
		this.counter = [0,0,0];// card 武技 法术
		this.interactive();
		this.gr.turnOn();
		var my = this;
		if (!this.isMain) {
			this.turnEnd(function() {
				my.attack(3);
				my.gr.heros[0].turnStart();
			});
		}
	}
	attack(n) {
		this.opponent.data[0] -= n;
	}
	turnEnd(callback) {
		this.interactive(false);
		if (this.turnBuff['震空波动拳']) {
			this.attack(this.data[2]);
			this.opponent.updateData();
		}
		this.data[2] = 0;
		this.turnBuff = {};
		var my = this;
		var pos = my.getDecoratePos(5, true);
		let mc = new MultiCallback();
		for (let i=0; i<this.gr.playPile.length; i++) {
			let card = this.gr.playPile[i];
			card.shrink().move(pos[0], pos[1]).action(mc.pipe(function() {
				card.divHide();
			}));
			my.data[5].push(card);
		}
		for (let i=0; i<this.data[4].length; i++) {
			let card = this.data[4][i];
			card.shrink().move(pos[0], pos[1]).action(mc.pipe(function() {
				card.divHide();
			}));
			my.data[5].push(card);
		}
		this.gr.playPile = [];
		this.data[4] = [];
		mc.all(function() {
			my.drawCard(5, callback);
		});
	}
	_examHandCard(card, castFun=null) {
		if (!castFun)castFun=this.castCard;
		var my = this;
		card.setBorder(2); 
		if (Resources.CardData[card.no].ability['聚气']) {
			if (my.data[2] >= Resources.CardData[card.no].ability['聚气']) {
				card.setBorder(1);
			}
		} else if (Resources.CardData[card.no].ability['流放']) {
			card.config = false;
			card.setBorder(3);
			card.onclick(function() {
				card.config = !card.config;
				card.setBorder(card.config?1:3);
			});
		} else if (Resources.CardData[card.no].ability['连击']) {
			let tmp = my.isType(card, '武技')?1:2;
			if (my.counter[tmp] >= Resources.CardData[card.no].ability['连击']) {
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
	interactive(isOn=true) {
		// 开关交互
		if (!this.isMain) return;
		if (isOn) {
			this.updateData();
			this.interactive(false);
			var len = this.data[4].length;
			var my = this;
			// 手牌
			for (let i=0; i<len; i++) {
				let card = this.data[4][i];
				my._examHandCard(card);
			}
			// 买牌
			for (let i=0; i<5; i++) {
				let card = this.gr.buyPile[i];
				if (!card) continue;
				if (my.data[2] >= Resources.CardData[card.no].cost) {
					card.setBorder(2);
				} else {
					card.setBorder(0);
				}
				card.onclick(function() {
					if (my.data[2] >= Resources.CardData[card.no].cost) {
						my.data[2] -= Resources.CardData[card.no].cost;
						my.gr.buyPile[i] = null;
						my.buyCard(card);
					}
				});
			}
			// 营火火牌 
			if (my.gr.firePile.length) {
				let card = my.gr.firePile[my.gr.firePile.length-1];
				if (my.data[2] >= Resources.CardData[card.no].cost) {
					card.setBorder(1);
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
			for (let i=0; i<this.data[4].length; i++) {
				let card = this.data[4][i];
				card.activeDarg(false);
				card.offclick();
				card.setBorder(0);
			}
			for (let i=0; i<this.gr.buyPile.length; i++) {
				if (this.gr.buyPile[i])this.gr.buyPile[i].offclick();
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
			card2.move(lefts[i], my.handHeight).action(mc.pipe());
		}
		mc.all(function() {
			setTimeout(callback,0);
		});
	}
	castCard(card, callback) {
		// todo
		var my = this;
		var mcb = new MultiCallback();
		my.interactive(false);
		my.data[4].remove(card);
		card.setBorder(0);
		my.handRevise(mcb.pipe());
		card.fadeOut(mcb.pipe());
		mcb.all(function() {
			my.gr.playPile.push(card);
			var data = Resources.CardData[card.no];
			my.gr.log('打出'+data.name);
			var effect = $.extend({}, data.effect);
			my.playingCard(card, effect, function() {
				my.countingCard(card, effect, callback);
			});
		});
	}
	isType(card, type) {
		// type == 武技 || 法术
		if (Resources.CardData[card.no].type==type) return true;
		if (card.no == 69 && (type=='武技'||type=='法术')) return true;
		return false;
	}
	isBase(card) {
		return (card.no==67||card.no==68||card.no==69);
	}
	playingCard(card, effect, callback_t) {
		let callback = function() {
			if (my.turnBuff['起势'] && my.isType(card, '武技')) {
				my.turnBuff['起势'] = false;
				effect['战力'] += 1;
			}
			my.counter[0]++;
			if (my.isType(card, '武技'))my.counter[1]++;
			if (my.isType(card, '法术'))my.counter[2]++;
			setTimeout(callback_t, 0);
		}
		var my = this;
		if (card.no == 9) {
			my.turnBuff['起势'] = true;
		} else if (card.no == 10) {
			if (my.data[2]>=5) {
				effect['战力'] += 1;
				my.drawCard(1, callback);
				return;
			}
		} else if (card.no == 12) {
			(function _no12() {
				if (my.data[2]>=5) {
					effect['战力'] = 1;
				}
				if (my.gr.playPile.length+my.data[5].length == 0) {
					setTimeout(callback, 0);
					return;
				}
				var mc = new MultiCallback();
				let lefts = my.getLefts(my.gr.playPile.length, 5, 200, 1140);
				for (let i=0; i<my.gr.playPile.length; i++) {
					let card = my.gr.playPile[i];
					card.setZIndex(800+i);
					card.move(lefts[i], 220).action(mc.pipe(function() {
						card.activeShowBig();
					}));
				}
				let lefts2 = my.getLefts(my.data[5].length, 5, 200, 1140);
				for (let i=0; i<my.data[5].length; i++) {
					let card = my.data[5][i];
					card.setBorder(0);
					card.divShow();
					card.setBack();
					card.setShrink();
					card.setZIndex(800+i);
					card.expand().rotate().move(lefts2[i], 380).action(mc.pipe(function() {
						card.activeShowBig();
					}));
				}
				mc.all(function() {
					for (let i=0; i<my.gr.playPile.length; i++) {
						let card = my.gr.playPile[i];
						card.setBorder(2);
						card.onclick(function() {
							my.gr.playPile.remove(card);
							let mcb = new MultiCallback();
							my.trashCard(card, mcb.pipe());
							my.setAllBack(mcb.pipe());
							mcb.all(callback);
						});
					}
					for (let i=0; i<my.data[5].length; i++) {
						let card = my.data[5][i];
						card.setBorder(2);
						card.onclick(function() {
							my.data[5].remove(card);
							let mcb = new MultiCallback();
							my.trashCard(card, mcb.pipe());
							my.setAllBack(mcb.pipe());
							mcb.all(callback);
						});
					}
				});
			})();
			return;
		} else if (card.no == 13) {
			if (my.data[2]>=5) {
				effect['战力'] += 1;
				// todo equipment
			}
		} else if (card.no == 14) {
			if (my.data[2]>=8) {
				my.turnBuff['震空波动拳'] = true;
				my.drawCard(1, callback);
				return;
			}
		} else if (card.no == 15) {
			if (my.data[2]>=4) {
				my.choose(900151, 900152, function() {
					setTimeout(callback, 0);
				}, function() {
					if (my.data[4].length==0) {
						setTimeout(callback, 0);
						return;
					}
					var mc = new MultiCallback();
					let lefts = my.getLefts(my.data[4].length, 5, 200, 1140);
					for (let i=0; i<my.data[4].length; i++) {
						let card = my.data[4][i];
						card.setZIndex(800+i);
						card.move(lefts[i], 280).action(mc.pipe(function() {
							card.activeShowBig();
						}));
					}
					mc.all(function() {
						for (let i=0; i<my.data[4].length; i++) {
							let card = my.data[4][i];
							card.setBorder(2);
							card.onclick(function() {
								my.data[4].remove(card);
								let mcb = new MultiCallback();
								my.trashCard(card, mcb.pipe());
								my.handRevise(mcb.pipe());
								mcb.all(callback);
							});
						}
					});
				});
				return;
			}
		} else if (card.no == 16) {
			(function() {
				let mc = new MultiCallback();
				let cnt = 0;
				for (let i=0; i<my.data[5].length; i++) {
					if (my.isType(my.data[5][i], '武技')) cnt++;
				}
				if (!cnt) {
					setTimeout(callback, 0);
					return;
				}
				let lefts2 = my.getLefts(cnt, 5, 200, 1140);
				let cnt2 = 0;
				for (let i=0; i<my.data[5].length; i++) {
					let card = my.data[5][i];
					if (!my.isType(card, '武技')) continue;
					card.setBorder(0);
					card.divShow();
					card.setBack();
					card.setShrink();
					card.setZIndex(800+i);
					card.expand().rotate().move(lefts2[cnt2++], 280).action(mc.pipe(function() {
						card.activeShowBig();
					}));
				}
				mc.all(function() {
					for (let i=0; i<my.data[5].length; i++) {
						let card = my.data[5][i];
						card.setBorder(2);
						card.onclick(function() {
							my.data[5].remove(card);
							let mcb = new MultiCallback();
							my.data[4].push(card);
							my.setAllBack(mcb.pipe());
							my.handRevise(mcb.pipe());
							mcb.all(callback);
						});
					}
				});
			})();
			return;
		} else if (card.no == 17) {
			if (my.data[2]>=4) {
				effect['营火'] = 1;
			}
			my.drawCard(1, callback);
			return;
		} else if (card.no == 18) {
			// todo
		} else if (card.no == 19) {
			// todo
		} else if (card.no == 20) {
			// todo
		} else if (card.no == 21) {
			if (card.config) {
				effect['生命'] = 1;
				my.gr.playPile.remove(card);
				card.divShow();
				my.trashCard(card, function() {
					console.log('done');
					my.drawCard(1, callback);
				});
			} else {
				my.drawCard(1, callback);
			}
			return;
		} else if (card.no == 22) {
			if (my.counter[1] >= 1) {
				my.drawCard(1, function() {
					var mc = new MultiCallback();
					let lefts = my.getLefts(my.data[4].length, 5, 200, 1140);
					for (let i=0; i<my.data[4].length; i++) {
						let card = my.data[4][i];
						card.setZIndex(i+800);
						card.move(lefts[i], 280).action(mc.pipe(function() {
							card.activeShowBig();
						}));
					}
					mc.all(function() {
						for (let i=0; i<my.data[4].length; i++) {
							let card = my.data[4][i];
							card.setBorder(2);
							card.onclick(function() {
								my.data[4].remove(card);
								my.data[5].push(card);
								let mcb = new MultiCallback();
								my.setAllBack(mcb.pipe());
								my.handRevise(mcb.pipe());
								mcb.all(callback);
							});
						}
					});
				});
				return;
			}
		} else if (card.no == 23) {
			if (my.counter[1] >= 2) {
				my.choose(900321,900232, function() {
					effect['战力'] = 1;
					setTimeout(callback, 0);
				}, function() {
					my.drawCard(1, callback);
				});
				return;
			}
		} else if (card.no == 24) {
			my.drawCard(1, function() {
				my.choose(900151, 900152, function() {
					if (my.counter[1]>=3) {
						my.drawCard(1, callback);
					} else {
						setTimeout(callback, 0);
					}
				}, function() {
					var mc = new MultiCallback();
					let cnt = 0, cnt2=0;
					for (let i=0; i<my.data[4].length; i++) {
						let card = my.data[4][i];
						if (my.isBase(card)) cnt++;
					}
					if (!cnt) {
						if (my.counter[1]>=3) {
							my.drawCard(1, callback);
						} else {
							setTimeout(callback, 0);
						}
						return;
					}
					let lefts = my.getLefts(cnt, 5, 200, 1140);
					for (let i=0; i<my.data[4].length; i++) {
						let card = my.data[4][i];
						if (!my.isBase(card)) continue;
						card.setZIndex(800+i);
						card.move(lefts[cnt2++], 280).action(mc.pipe(function() {
							card.activeShowBig();
						}));
					}
					mc.all(function() {
						for (let i=0; i<my.data[4].length; i++) {
							let card = my.data[4][i];
							if (!my.isBase(card)) continue;
							card.setBorder(2);
							card.onclick(function() {
								my.data[4].remove(card);
								let mcb = new MultiCallback();
								my.trashCard(card, mcb.pipe());
								my.handRevise(mcb.pipe());
								mcb.all(function() {
									if (my.counter[1]>=3) {
										my.drawCard(1, callback);
									} else {
										setTimeout(callback, 0);
									}
								});
							});
						}
					});
				});
			});
			return;
		} else if (card.no == 26) {
			(function() {
				my._shuffle();
				var cards = [];
				for (let i=0; i<7; i++) {
					if (my.data[3].length-1-i>=0) {
						cards.push(my.data[3][my.data[3].length-1-i]);
					}
				}
				for (var i=0; i<cards.length; i++) my.data[3].pop();
				var cnt=0, cnt2=0;
				for (var i=0; i<cards.length; i++) {
					let card = cards[i];
					if (my.isType(card, '武器') || my.isType(card, '武技')) {
						cnt++;
					}
				}
				let lefts = my.getLefts(cnt, 5, 200, 1140);
				let mc = new MultiCallback();
				for (var i=0; i<cards.length; i++) {
					let card = cards[i];
					if (my.isType(card, '武器') || my.isType(card, '武技')) {
						card.setBorder(0);
						card.divShow();
						card.setBack();
						card.setShrink();
						card.setZIndex(800+i, true);
						card.expand().rotate().move(lefts[cnt2++], 480)
							.action(mc.pipe(function() {
							card.activeShowBig();
						}));
					}
				}
				mc.all(function() {
					function _flush() {
						my.interactive(false);
						for (let j=0; j<cards.length; j++) {
							let card = cards[j];
							if (card && (my.isType(card, '武器') || my.isType(card, '武技'))){
								card.divShow();
							}
						}
						if (!cnt) {
							for (var j=0; j<cards.length; j++) {
								if (cards[j]) my.data[5].push(cards[j]);
							}
							my._shuffle();
							setTimeout(callback, 0);
						}
						for (let i=0; i<cards.length; i++) {
							let card = cards[i];
							if (!card) continue;
							if (my.isType(card, '武器') || my.isType(card, '武技')) {
								my._examHandCard(card, function(ncard) {
									cnt--;
									cards[cards.indexOf(ncard)] = null;
									for (let j=0; j<cards.length; j++) {
										if (cards[j]) cards[j].divHide();
									}
									my.castCard(ncard, _flush);
								});
							}
						}
					}
					_flush();
				});
			})();
			return;
		}
		setTimeout(callback, 0);
	}
	choose(n1,n2,callback1, callback2) {
		let card = new Card(n1, true);
		let card2 = new Card(n2, true);
		card.setZIndex(800);
		card.setPos(540,290);
		card.setBorder(2);
		card.onclick(function() {
			card2.destroy();
			card.setBorder(1);
			card.wait(500).action(function() {
				card.destroy();
				setTimeout(callback1, 0);
			});
		});
		card2.setZIndex(800);
		card2.setPos(680,290);
		card2.setBorder(2);
		card2.onclick(function() {
			card.destroy();
			card2.setBorder(1);
			card2.wait(500).action(function() {
				card2.destroy();
				setTimeout(callback2, 0);
			});
		});
	}
	trashCard(card, callback) {
		this.data[6].push(card);
		let pos = this.getDecoratePos(6, true);
		var my = this;
		this.gr.log('--废弃'+Resources.CardData[card.no].name);
		if ([67,68,69].indexOf(card.no)>=0) my.data[0]+=1;
		my.updateData();
		card.shrink().move(pos[0], pos[1]).action(function() {
			card.divHide();
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
		mc.all(callback);
	}
	countingCard(card, effect, callback){ 
		// 结算
		var my = this;
		var len = my.gr.playPile.length;
		var lefts = my.getLefts(len, -45, my.playPilePos[0][0], my.playPilePos[1][0]);
		
		let mc = new MultiCallback();
		for (let i=0; i<len; i++) {
			let card2 = my.gr.playPile[i];
			card2.setZIndex(i+1, true);
			card2.setPos(lefts[i], my.playPilePos[0][1])
			card2.fadeIn(mc.pipe(function() {
				if (i+1 == len) card2.activeShowBig();
			}));
		}
		mc.all(function() {
			if (effect['营火']) {
				my.data[2] += effect['营火'];
				my.gr.log('--获得营火'+effect['营火']);
			}
			if (effect['战力']) {
				my.attack(effect['战力']);
				my.gr.log('--获得战力'+effect['战力']);
			}
			if (effect['生命']) {
				my.data[0] += effect['生命'];
				my.gr.log('--获得生命'+effect['生命']);
			}
			
			my.updateData();
			my.opponent.updateData(); 
			my.interactive();
			setTimeout(callback, 0);
		});
	}
	buyCard(card) {
		var my = this;
		this.interactive(true);
		my.interactive(false);
		// 获得时
		if (card.no==25) {
			let pos = my.getDecoratePos(3, true);
			my.data[3].push(card);
			card.shrink().move(pos[0], pos[1]).action(function() {
				my.updateData();
				card.divHide();
				my.gr.fillCard(function() {
					my.interactive();
				});
			});
			return;
		}
		let pos = my.getDecoratePos(5, true);
		my.data[5].push(card);
		card.shrink().move(pos[0], pos[1]).action(function() {
			my.updateData();
			card.divHide();
			my.gr.fillCard(function() {
				my.interactive();
			});
		});
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
		
		$('#gamebody').append($div);
		this.setPos(40,20);
		this.poses = [[19,24],[239,24],[409,24],[552,24],[698,24],[843,24],[988,24],[1206,24]];
		this.heroPos = [[50,530],[50,280]];
		this.castArea = [[280,220], [950,500]];
		this.playPilePos = [[270,320], [450,320]];
		this.seed = 5;
	}
	log(text) {
		console.log(text);
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
	turnOff() {
		this.btn.attr("disabled",true);
		this.btn.html(this.btn.data.off);
	}
	fillCard(callback) {
		var my = this;
		var mc = new MultiCallback();
		for (let i=0; i<5; i++) {
			if (!this.buyPile[i]) {
				this.buyPile[i] = this.commonPile.pop();
				var pos = my.getPos(i+2);
				this.buyPile[i].rotate().move(pos[0], pos[1]).action(mc.pipe());
			}
		}
		mc.all(function() {
			setTimeout(callback, 0);
		});
	}
	init(seed, herono, isAfter=false, callback) {
		var my = this;
		Math.setSeed(seed);
		this.firePile = [];
		this.commonPile = [];
		this.playPile = [];
		this.trashPile = [];
		this.buyPile = new Array(5);
		
		var pos0 = this.getPos(0);
		var pos1 = this.getPos(1);
		for (let i=9; i<=44; i++) {
			for (var j=0; j<Resources.CardData[i].number; j++) {
				this.commonPile.push(new Card(i, true));
			}
		}
		for (let i=0; i<=10; i++) {
			let card = new Card(69, true);
			card.setPos(pos1[0], pos1[1]);
			card.activeShowBig();
			this.firePile.push(card);
		}
		Math.shuffle(this.commonPile);
		this.commonPile.push(new Card(25, true)); ////////
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
}


$(function() {
	document.onselectstart = function(){return false;};
	// document.body.style.cursor = 'wait';
	Resources.ready(function(){
		var gr = new GameRule();
		gr.init(101, [2,2]);
		
	});
});





