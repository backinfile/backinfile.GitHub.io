
(function NumKit($) {
	Math.randInt = function(min, max) {return Math.floor(Math.random()*(max-min+1)+min);}
	if (!Array.prototype.shuffle) {
		Array.prototype.shuffle = function() {
			for (var i=0; i<this.length; i++) {
				var rnd = Math.randInt(0, this.length-1);
				if (rnd == i) continue;
				var x = this[i];
				this[i] = this[rnd];
				this[rnd] = x;
			}
			return this;
		}
	}
})($);


var hookClick = (function() {
	var functions = [];
	document.body.onclick = function(e) {
		for (var i=0; i<functions.length; i++) {
			functions[i](e);
		}
	}
	return function(func) {
		functions.push(func);
	}
})();


var CardColor = {
	Heart		:0,	//红桃
	Spade		:1,	//黑桃
	Diamond		:2,	//方块
	Club		:3,	//梅花
	RedJoker	:4, //大王
	BlackJoker	:5,	//小王
	Back		:6	//背面
};
var CardValue = [1,2,3,4,5,6,7,8,9,10,11,12,13];
CardColor.names = ['红桃', '黑桃', '方块', '梅花', '大王', '小王'];
CardValue.names = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

var Card = (function() {
	function Card(color, value, pos) {
		this.ishide = true;
		this.color = color;
		this.value = value;
		this.curPos = [0,0];
		var width = 180;
		var height = 250;
		var scale = 0.25;
		this.width = width;
		this.height = height;
		this.scale = scale;
		var div = document.createElement('div');
		this.div = div;
		div.style.width = width+'px';
		div.style.height = height+'px';
		div.style.backgroundImage = 'url('+'img/cards3.jpg'+')';
		div.style.backgroundRepeat = 'no-repeat';
		div.style.backgroundPosition = -pos[0]+'px '+(-pos[1])+'px';
		div.style.transform = 'scale('+scale+','+scale+')';
		div.style.boxShadow='5px 5px 5px black';
		div.style.borderRadius = '15px';
		div.style.position = 'fixed';
		div.style.left = 0;
		div.style.top = 0;
		div.style.visibility = 'hidden';
		var my = this;
		div.onclick = function() {
			$.clicked = my;
			//console.log(my+'');
		}
		document.body.appendChild(div);
	}
	Card.prototype = {
		keyValue: function() {
			if (this.color == CardColor.RedJoker) return 1000;
			if (this.color == CardColor.BlackJoker) return 900;
			if (this.value == 2) return 800;
			if (this.value == 1) return 700;
			return this.value;
		},
		show: function() { // make sure that use after moveTo
			this.div.style.visibility = 'visible';
		},
		hide: function() {
			this.div.style.visibility = 'hidden';
		},
		setLayer: function(layer) {
			this.div.style.zIndex = layer;
		},
		toString: function() {
			var str = CardColor.names[this.color];
			if (this.color>3) return str;
			str += CardValue.names[this.value-1];
			return str;
		},
		moveTo: function(x,y) {
			this.div.style.left=x-this.width/2;
			this.div.style.top=y-this.height/2;
			this.curPos[0] = x;
			this.curPos[1] = y;
		},
		moveBy: function(x,y) {
			this.moveTo(this.curPos[0]+x, this.curPos[1]+y);
		},
		moveToSlowly: function(x,y,speed=7) { 
			if (!this.movement) {
				this.movement = {state:false}
			}
			this.movement.aim = [x,y];
			this.movement.speed = speed;
			this.movement.state = true;
		},
		moveBySlowly: function(x,y,speed=7) { 
			this.moveToSlowly(this.curPos[0]+x,this.curPos[1]+y,speed);
		},
		update: function(delta) {
			if (this.movement && this.movement.state) {
				var dx = this.movement.aim[0]-this.curPos[0];
				var dy = this.movement.aim[1]-this.curPos[1];
				var fx = dx>0?1:-1, fy = dy>0?1:-1;
				var r = Math.sqrt(dx*dx+dy*dy);
				if (r>0.0001) {
					var ux = dx/r*fx, uy = dy/r*fy;
					var mx = Math.min(Math.abs(dx), this.movement.speed*delta*ux);
					var my = Math.min(Math.abs(dy), this.movement.speed*delta*uy);
					this.curPos[0] += mx*fx;
					this.curPos[1] += my*fy;
					this.moveTo(this.curPos[0], this.curPos[1]);
				} else {
					this.movement.state = false;
					console.log('stop', dx,dy,r );
				}
			}
		}
	};
	return Card;
})();

var CardButton = (function() {
	function CardButton(text, x, y) {
		// console.log('in');
		var div = document.createElement('a');
		this.div = div;
		var width = 46;
		var height = 20;
		this.width = width;
		this.height = height;
		var scale = 0.8;
		this.scale = scale;
		div.style.width = width+'px';
		//div.style.height = height+'px';
		div.style.left = x+'px';
		div.style.top = y+'px';
		div.style.transform = 'scale('+scale+','+scale+')';
		div.classList.add("CardButton");
		div.style.backgroundColor='#999';
		div.style.boxShadow = '1px 3px';
		var my = this;
		div.onmouseover = function() {
			div.style.backgroundColor='#888';
		}
		div.onmouseout = function() {
			div.style.backgroundColor='#999';
			div.style.boxShadow = '1px 3px';
		}
		div.onmousedown = function() {
			div.style.backgroundColor='#666';
			div.style.boxShadow = '0px 1px';
		}
		div.onmouseup = function() {
			div.style.backgroundColor='#888';
			div.style.boxShadow = '1px 3px';
			if (my.onclick) my.onclick();
		}
		div.innerHTML = text;
		document.body.appendChild(div);
		this.useable = true;
	}
 	CardButton.prototype = {
		setUseable: function(useable) {
			var div = this.div;
			var my = this;
			this.useable = useable;
			if (useable) {
				div.style.backgroundColor='#999';
				div.style.boxShadow = '1px 3px';
				div.onmouseover = function() {
					div.style.backgroundColor='#888';
				}
				div.onmouseout = function() {
					div.style.backgroundColor='#999';
					div.style.boxShadow = '1px 3px';
				}
				div.onmousedown = function() {
					div.style.backgroundColor='#666';
					div.style.boxShadow = '0px 1px';
				}
				div.onmouseup = function() {
					div.style.backgroundColor='#888';
					div.style.boxShadow = '1px 3px';
					if (my.onclick) my.onclick();
				}
			} else {
				div.style.backgroundColor='#666';
				div.style.boxShadow = '0px 1px';
				div.onmouseover = null;
				div.onmouseout = null;
				div.onmousedown = null;
				div.onmouseup = null;
			}
		}
	}
	return CardButton;
})();


function loadImage() {
	var urls = ['img/cards.jpg', 'img/player.png'];
	var loadCnt = 0;
	for (var i=0; i<urls.length; i++) {
		var img = new Image();
		img.onload = function() {
			loadCnt++;
			if (loadCnt >= urls.length) {
				console.log('load done!');
				gameInit();
			}
		}
		img.src = urls[i];
	}
}
loadImage();

function gameInit() {
	var allCards = [];
	$.allCards = allCards;
	var width = 180;
	var height = 250;
	function getCards(color, offsetX, offsetY, gapX, gapY) {
		for (var i=0; i<5; i++) {
			var card = new Card(color,i+1,
				[offsetX+i*(width+gapX), offsetY]);
			allCards.push(card);
		}
		for (var i=0; i<5; i++) {
			var card = new Card(color,i+6,
				[offsetX+i*(width+gapX), offsetY+height+gapY]);
			allCards.push(card);
		}
		for (var i=0; i<3; i++) {
			var card = new Card(color,i+11,
				[offsetX+i*(width+gapX), offsetY+2*(height+gapY)]);
			allCards.push(card);
		}
	}
	getCards(CardColor.Heart, 1133, 19, 23.5, 16.5);
	getCards(CardColor.Spade, 25, 19, 23.35, 16);
	getCards(CardColor.Diamond, 25, 890, 23.2, 17);
	getCards(CardColor.Club, 1134, 891, 23.2, 16.5);
	var RedJoker = new Card(CardColor.RedJoker,0,[635, 552]);
	allCards.push(RedJoker);
	var BlackJoker = new Card(CardColor.BlackJoker,0,[1744, 555]);
	allCards.push(BlackJoker);
	var Back = new Card(CardColor.Back,0,[838, 552]);
	/* $.card = card;
	card.moveTo(100,100);
	card.moveToSlowly(200,200); */
	$.getCard = function(color, value) {
		if (color == CardColor.Back) return Back;
		if (color == CardColor.RedJoker) return RedJoker;
		if (color == CardColor.BlackJoker) return BlackJoker;
		return allCards[color*13+value-1];
	}
	$.animationFrame(function(delta){
		delta /= 1000/60;
		for (var i=0; i<allCards.length; i++) {
			allCards[i].update(delta);
		}
	});

	boardInit();
}
var Player = (function() {
	function Player() {
		this.hands = [];
		this.nickname = 'Null';
		var width = 429;
		var height = 408;
		var scale = 0.1;
		this.width = width;
		this.height = height;
		this.scale = scale;
		var div = document.createElement('div');
		this.div = div;
		div.style.position = 'fixed';
		div.style.visibility = 'hidden';
		div.style.width = width+'px';
		div.style.height = height+'px';
		div.style.backgroundImage = 'url(img/player.png)';
		div.style.transform = 'scale('+scale+','+scale+')';
		div.style.color = 'white';
		div.style.fontSize = '20em';
		div.innerHTML = '0';
		var span = document.createElement('div');
		span.style.color = 'white';
		span.style.position = 'fixed';
		span.style.fontSize = '10px';
		span.style.width = width*scale+'px';
		span.style.textAlign = 'center';
		this.span = span;
		document.body.appendChild(div);
		document.body.appendChild(span);
		
		this.oldNum = 0;
		this.isShowCard = false;
		this.ai = 1; // base ai
	}
	Player.prototype = {
		show: function(x,y) {
			this.div.style.left = x-this.width/2;
			this.div.style.top = y-this.height/2;
			this.div.style.visibility = 'visible';
			this.span.style.left = x-this.width*this.scale/2;
			this.span.style.top = y-this.height*this.scale/2-12;
		},
		say: function(text) {
			this.span.innerHTML = text;
		},
		update: function(delta) {
			if (this.hands.length != this.oldNum) {
				this.oldNum = this.hands.length;
				this.div.innerHTML = this.oldNum;
			}
			/* if (this.isShowCard) {
				var x = this.pos[0];
				var y = this.pos[1];
			} */
		},
		showCards: function(x,y) {
			this.isShowCard = true;
			this.pos = [x,y];
			this.selected = {};
			var selected = this.selected;
			this.handShow();
			var my = this;
			hookClick(function() {
				if ($.clicked) {
					var card = $.clicked;
					if (my.hands.indexOf(card) >= 0) {
						if (selected[card]) {
							card.moveBy(0,15);
							selected[card] = false;
						} else {
							card.moveBy(0,-15);
							selected[card] = true;
						}
					}
				}
			});
			var next = new CardButton('不出', 350,260);
			next.setUseable(false);
			next.onclick = function() {
				console.log('next');
				my.playCard(false);
				setTimeout(function() {
					GameLoop.nextPlayer();
				}, 200);
			}
			var action = new CardButton('出牌', 270,260);
			action.setUseable(false);
			action.onclick = function() {
				console.log('action');
				var nhands = [];
				var put = [];
				for (var i=0; i<my.hands.length; i++) {
					if (!my.selected[my.hands[i]]) {
						nhands.push(my.hands[i]);
						//console.log(i, my.hands[i]+'', my.selected[my.hands[i]]);
					} else {
						//my.hands[i].hide();
						put.push(my.hands[i]);
						my.selected[my.hands[i]] = false;
					}
				}
				my.putCardsOnBoard(put);
				$.curCards = put;
				$.curCardsFrom = my;
				my.hands = nhands;
				my.handShow();
				my.playCard(false);
				GameLoop.nextPlayer();
			}
			var tip = new CardButton('提示', 190,260);
			tip.setUseable(false);
			tip.onclick = function() {
				console.log('tip');
			}
			this.next = next;
			this.action = action;
			this.tip = tip;
			//console.log('after');
		},
		putCardsOnBoard: function(cards) {
			var position = $.players.indexOf(this);
			var x = 300;
			var y = 200;
			if (position == 1) {
				x = 130; y = 110;
			} else if (position == 2) {
				x = 430; y = 110;
			}
			if (cards.length) {
				cards = this.sortCards(cards);
				var mid = Math.floor(cards.length/2);
				for (var i=0; i<cards.length; i++) {
					var card = cards[i];
					card.moveTo(x+14*(i-mid),y);
					console.log(x+14*(i-mid),y,card+'');
					card.show();
					card.setLayer(50+(i-mid));
				}
				/* setTimeout(function() {
					for (var i=0; i<cards.length; i++) {
						cards[i].hide();
					}
				},2000); */
			}
		},
		handShow:function() {
			this.sortCards();
			var hands = this.hands;
			var x = this.pos[0];
			var y = this.pos[1];
			if (hands.length) {
				var mid = Math.floor(hands.length/2);
				for (var i=0; i<hands.length; i++) {
					var card = hands[i];
					card.moveTo(x+14*(i-mid),y);
					card.show();
					card.setLayer(50+(i-mid));
				}
			}
		},
		setSelect: function(isTrue) {
			if (isTrue) {
				this.div.classList.remove('opacity');
			} else {
				this.div.classList.add('opacity');
			}
		},
		sortCards: function(cards = null) {
			if (cards) {
				return cards.sort(function(a,b) {
					return b.keyValue()-a.keyValue();
				});
			} else {
				this.hands = this.hands.sort(function(a,b) {
					return b.keyValue()-a.keyValue();
				});
				return this.hands;
			}
		},
		setAI: function(ai) {
			this.ai = ai;
		},
		checkPlayable: function(inCards, outCards) {
			if (!inCards) {
				if (outCards.length == 1) return true;
				if (outCards.length == 2) {
					//console.log('value',outCards[0],outCards[1]);
					if (outCards[0].value === outCards[1].value) return true;
					if (outCards[1].color+outCards[0].color === 
						CardColor.RedJoker+CardColor.BlackJoker) return true;
					return false;
				}
			}
			return false;
		},
		playCard: function(isTrue) {
			if (!this.functions)
				this.functions = [null];
			var functions = this.functions;
			if (isTrue) {
				this.tip.setUseable(true);
				this.next.setUseable(true);
				var my = this;
				functions[0] = function() {
					var outCards = [];
					for (var i=0; i<my.hands.length; i++) {
						if (my.selected[my.hands[i]]) outCards.push(my.hands[i]);
					}
					//$.outCards = outCards;
					//$.selected = my.selected;
					if (my.checkPlayable(null, outCards)) {
						my.action.setUseable(true);
						console.log('in functions[0]', functions);
					} else {
						my.action.setUseable(false);
					}
				};
				functions[0]();
				if (!this.hooked) {
					hookClick(function() {
						for (var i=0; i<functions.length; i++) {
							if (functions[i])functions[i]();
						}
					});
					hookClick(function() {
						$.clicked = null;
					});
					this.hooked = true;
				}
			} else {
				console.log('in');
				functions[0] = null;
				this.tip.setUseable(false);
				this.next.setUseable(false);
				this.action.setUseable(false);
			}
		},
		play: function() {
			if (this.ai == 1) {
				var my = this;
				setTimeout(function() {
					if (my.hands.length) {
						my.Select([my.hands[0]]);
						my.Put();
					} else {
						my.say('过');
						GameLoop.nextPlayer();
					}
				}, 300);
			} else if (this.ai == 0) {
				if ($.startPlayer == this) {
					this.playCard(true);
				} 
				/* else if (!$.curCrads || $.curCradsFrom==this) {
					
				} */
				//GameLoop.nextPlayer();
			}
		},
		Select: function(cards) {
			if (!this.selected) this.selected = {};
			for (var i=0; i<cards.length; i++) {
				this.selected[cards[i]] = true;
			}
		},
		Put: function() {
			var my = this;
			var nhands = [];
			var put = [];
			for (var i=0; i<my.hands.length; i++) {
				if (!my.selected[my.hands[i]]) {
					nhands.push(my.hands[i]);
				} else {
					put.push(my.hands[i]);
				}
			}
			//console.log(nhands.join(' '),'asdf',put.join(' '));
			if (this.checkPlayable(/* $.curCards */null, put)) {
				my.hands = nhands;
				my.selected = {};
				my.putCardsOnBoard(put);
				$.curCards = put;
				$.curCardsFrom = my;
			} else {
				my.selected = {};
			}
			GameLoop.nextPlayer();
		}
	};
	return Player;
})();

function boardInit() {
	var allCards = $.allCards.slice();
	allCards.shuffle();
	var players = new Array(3);
	for (var i=0; i<3; i++) {
		players[i] = new Player();
		players[i].hands = allCards.slice(0+17*i,17+17*i);
		players[i].sortCards();
		//console.log(players[i].hands.join('\n'));
	}
	players[0].hands.push(allCards[17*3]);
	players[0].hands.push(allCards[17*3+1]);
	players[0].hands.push(allCards[17*3+2]);
	players[0].sortCards();
	var width = window.innerWidth;
	var height = window.innerHeight;
	$.width = width;
	$.height = height;
	
	players[0].show(30,240);
	players[1].show(30,100);
	players[2].show(500,100);
	
	players[0].showCards(300,340);
	//players[0].say('过');
	players[0].setSelect(true);
	players[1].setSelect(false);
	players[2].setSelect(false);
	players[0].setAI(0);
	players[1].setAI(1);
	players[2].setAI(1);
	
	$.animationFrame(function(delta){
		delta /= 1000/60;
		for(var i=0; i<players.length; i++) {
			players[i].update(delta);
		}
	});
	
	GameLoop.gameStart(players);
}

var GameLoop = (function() {
	var curPlayerId = -1;
	var GameLoop =  {
		gameStart: function(players) {
			$.players = players;
			$.hostPlayer = players[0];	// 地主
			$.startPlayer = players[0];  // 第一个出牌的人
			$.curCards = null;		// 当前牌型
			$.curCardsFrom = null;	// 当前牌型来自谁
			$.oldCards = [];
			this.nextPlayer();
		},
		nextPlayer: function() {
			setTimeout(function() {
				if ($.curPlayer) {
					$.curPlayer.setSelect(false);
					$.curPlayer.say('');
				}
				if ($.curCards) {
					for (var i=0; i<$.oldCards.length; i++) {
						if ($.curCardsFrom == $.oldCards[i][1]) {
							var cards = $.oldCards[i][0];
							for (var j=0; j<cards.length; j++) {
								cards[j].hide();
							}
						}
					}
					if ($.oldCards.length>=$.players.length) {
						var cards = $.oldCards[0][0];
						var cardsFrom = $.oldCards[0][1];
						$.oldCards.shift();
						for (var i=0; i<cards.length; i++) {
							cards[i].hide();
						}
					}
					$.oldCards.push([$.curCards, $.curCardsFrom]);
				}
				curPlayerId++;
				curPlayerId %= $.players.length;
				$.curPlayer = $.players[curPlayerId];
				$.curPlayer.setSelect(true);
				
				for (var i=0; i<$.oldCards.length; i++) {
					if ($.oldCards[i][1] == $.curPlayer) {
						var cards = $.oldCards[i][0];
						for (var j=0; j<cards.length; j++) {
							cards[j].hide();
						}
					}
				}
				
				$.curPlayer.play();
			}, 1000);
		}
	}
	return GameLoop;
})();





