


var Game = {};

Game.Init = function () {
	Game.Width = window.innerWidth;
	Game.Height = window.innerHeight;
	Game.CardWidth = 151;
	Game.CardHeight = 273;
	Game.EventPos = [840, 70];
	Game.CardsPos = [80, 70];
	Game.DrawPilePos = [100, 50];
	Game.MessageTipPos = [570, 340];
	Game.ButtonsPos = [Game.EventPos[0] -30, Game.EventPos[1] + 250];
	Resources.Load(function () {
		GameObject.Init();
		
		Game.DataShow = Control.getDataShow(Game.EventPos[0]+200, Game.EventPos[1]);
		// GameObject.HandsDiv Control.getCardUnit
		Game.CardUnit = Control.getCardUnit();	// 用来表示抽牌堆的顶部
		
		Game.hazardPile = GameObject.AllCards['hazardCard'].slice(15,30).shuffle();
		Game.drawPile = GameObject.AllCards['battleCard'].slice(0,4);//.shuffle();
		Game.drawPile = Game.drawPile.concat(GameObject.AllCards['hazardCard'].slice(0,15));//.shuffle();
		Game.agingPile = GameObject.AllCards['agingCard'].slice().shuffle();
		/* Game.drawPile.forEach(function(key) {
			console.log(key.toString());
		}); */
		Game.discardPile = [];			// 丢弃的冒险牌
		Game.discardBattlePile = [];	// player丢弃的牌
		Game.destroyedPile = [];		// 摧毁的牌
		Game.hands = [];				// 手牌

		Game.cardsTmp = GameObject.getCardWarp();  		// 用来移动抽过来的卡的卡套
		Game.cardsTmpForDestroy = GameObject.getCardWarp();// 用来移动废弃的牌的卡套
		Game.cardsTmpDisCard = GameObject.getCardWarp(); // 用来移动丢弃的牌的卡套
		Game.cardsTmpDisCardSave = GameObject.getCardWarp();// 用来保存丢弃的牌的卡套
		
		Game.cardsMiddle = [GameObject.getCardWarp(),
				GameObject.getCardWarp()]; 				// 用来冒险牌二选一的卡套
		Game.currentMiddle = null;						// 当前选中的冒险牌的卡套
		Game.curHazardCard = null;						// 当前选中的冒险牌
		Game.selected = null; 							// 当前选择的卡
		Game.Data = {};
		Game.Data.health = 20;
		Game.Data.healthMax = 24;
		Game.Data.freeChoose = 0;		// 总免费次数
		Game.Data.freeChoosed = 0;		// 已用免费次数
		Game.Data.curAttack = 0;		// 当前攻击力
		Game.Data.aimAttack = 0;		// 目标攻击力
		Game.Data.step = 0; 			// 游戏的阶段
		Game.Data.curStep = 0; 			// 当前回合的阶段
		setTimeout(function () {
			Game.Loop();
		}, 0);
	});
}

Game.Loop = function () {  // 选择冒险牌
	//GameObject.HandsDiv 
	console.log('loop!');
	GameObject.Mask.show(true);
	GameObject.Message.show(600, 500, '选择一张冒险卡');
	var cardsPos = [[450, 180], [750, 180]];
	var cards = [null, null];
	for (let i = 0; i < 2; i++) {
		cards[i] = Game.hazardPile.pop();
		if (!cards[i]) {
			Game.hazardPile	 = Game.discardPile.slice().shuffle();
			Game.discardPile = [];
			Game.Data.step++;
			console.log('step++');
			cards[i] = Game.hazardPile.pop();
		}
		cards[i].div.setRotate(false);
		cards[i].div.canBeSelect(true);
		Game.cardsMiddle[i].div.setLayer(101);
		Game.cardsMiddle[i].add(cards[i]);
		Game.cardsMiddle[i].div.setPos(cardsPos[i][0], cardsPos[i][1]);
		Game.cardsMiddle[i].div.show(true);
		cards[i].div.div.onclick = function () {
			// 选择第i张冒险牌，弃掉第1-i张冒险牌
			Game.currentMiddle = Game.cardsMiddle[i];
			Game.cardsMiddle[1 - i].remove(cards[1 - i]);
			Game.cardsMiddle[1 - i].div.show(false);
			var rotate = 0;
			cards[i].div.div.onclick = function flip(){
				rotate += 180;
				cards[i].div.div.onclick = null;
				Control.Animation.CardDivFlip(cards[i], rotate, function() {
					cards[i].div.div.onclick = flip;
				});
			};
			cards[1 - i].div.div.onclick = null;
			cards[i].div.canBeSelect(false);
			cards[1 - i].div.canBeSelect(false);
			Game.discardPile.push(cards[1 - i]);
			GameObject.Message.show(false);
			setTimeout(function () {
				Control.Animation.CardsDivMove(Game.cardsMiddle[i], cardsPos[i], Game.EventPos, function () {
					//GameObject.Buttons.show(true);
					Game.curHazardCard = cards[i];
					//console.log('end');
					Game.FirstCheckStates();
				});
			}, 0);
		}
		Game.tmpcard = cards[i];
	}
}

Game.FirstCheckStates = function () {
	Game.Data.freeChoose = Game.curHazardCard.data.aim.white;
	Game.Data.freeChoosed = 0;
	Game.Data.curStep = Game.Data.step;
	GameObject.Buttons.showSole(1);
	GameObject.Buttons.show(Game.ButtonsPos[0],Game.ButtonsPos[1]);
	GameObject.Buttons.onclick[1] = function() { // 结算
		if (Game.selected) {
			Game.selected.div.selected(false);
			Game.selected = null;
		}
		var dAttack = Game.Data.curAttack - Game.Data.aimAttack;
		if (dAttack >= 0) {
			Game.Data.health += 1; 	// 恢复
			Game.DataUpdate();
			
			Game.discardBattlePile.push(Game.curHazardCard);
			for (let i=0; i<Game.hands.length; i++) {
				Game.hands[i].div.recover();
				Game.discardBattlePile.push(Game.hands[i]);
				GameObject.HandsDiv.remove(Game.hands[i]);
			}
			Game.currentMiddle.remove(Game.curHazardCard);
			Game.hands = [];
			Game.Loop();
		} else {
			// 结算摧毁牌时
			
			GameObject.Buttons.showSole(1, false);
			GameObject.Buttons.showSole(0, false);
			
			dAttack *= -1;
			Game.Data.health -= dAttack; 	// 受伤	
			Game.DataUpdate();	
			// GameObject.MessageTip.show(Game.MessageTipPos[0], Game.MessageTipPos[1], 
				// '选择至多消耗'+dAttack+'的牌(已选0)');
				
			var selectedCards = [];
			function CheckDestroyable() {
				var cnt = 0;
				for (let i=0; i<Game.hands.length; i++) {
					if (selectedCards[i]) {
						let card = Game.hands[i];
						cnt += card.data.cost;
					}
				}
				GameObject.Buttons.showSole(2, cnt <= dAttack);
				GameObject.MessageTip.show(Game.MessageTipPos[0], Game.MessageTipPos[1], 
					'选择至多消耗'+dAttack+'的牌(已选'+cnt+')');
			}
			CheckDestroyable();
			for (let i=0; i<Game.hands.length; i++) {
				// console.log('deal', i);
				let card = Game.hands[i];
				selectedCards[i] = false;
				card.onDestroyClickDown =  function() {
					card.div.selected(true);
					selectedCards[i] = true;
					card.div.div.onclick = card.onDestroyClickUp;
					CheckDestroyable();
				}
				card.onDestroyClickUp = function() {
					card.div.selected(false);
					selectedCards[i] = false;
					card.div.div.onclick = card.onDestroyClickDown;
					CheckDestroyable();
				}
				card.div.div.onclick = card.onDestroyClickDown;
			}
			GameObject.Buttons.onclick[2] = function() {
				GameObject.MessageTip.show(false);
				GameObject.Buttons.show([]);
				
				// 摧毁卡牌
				for (let i=0; i<Game.hands.length; i++) {
					if (selectedCards[i]) {
						var card = Game.hands[i];
						card.div.selected(false);
						GameObject.HandsDiv.remove(card);
						Game.destroyedPile.push(card);
					}
				}
				
				// 摧毁完毕 游戏继续
				Game.discardBattlePile.push(Game.curHazardCard);
				for (let i=0; i<Game.hands.length; i++) {
					if (!selectedCards[i]) {
						var card = Game.hands[i];
						card.div.recover();
						Game.discardBattlePile.push(card);
						GameObject.HandsDiv.remove(card);
					}
				}
				Game.currentMiddle.remove(Game.curHazardCard);
				Game.hands = [];
				Game.Loop();
			}
		}
	}
	GameObject.Buttons.onclick[0] = function() { // 发动技能
		var skill = Game.selected.data.skill;
		var card = Game.selected;
		card.div.div.onclick = null;
		card.div.canBeSelect(false);
		card.div.used(true);
		card.used = true;
		card.div.selected(false);
		card.onclick = null;
		Game.selected = null;
		GameObject.Buttons.show([]);
		if (skill.LIFE) {
			Game.Data.health += skill.LIFE;
			if (Game.Data.health > Game.Data.healthMax)
				Game.Data.health = Game.Data.healthMax;
			Game.LoopCheckStates();
		} else if (skill.STEP) {
			Game.Data.curStep--;
			if (Game.Data.curStep<0) Game.Data.curStep=0;
			Game.LoopCheckStates();
		} else if (skill.COPY) {
			!function() {
				var selected = null;
				function CheckCopy() {
					GameObject.Buttons.showSole(2, selected?true:false);
				}
				CheckCopy();
				GameObject.Buttons.onclick[2] = function() {
					// skill
					var attack = getCurrentAttackInHand(selected);
					card.buff.COPY = {attack:attack};
					// 通用
					GameObject.Buttons.showSole(2, false);
					Game.LoopCheckStates();
					selected.div.selected(false);
					card.div.div.onclick = null;
				}
				for (let i=0; i<Game.hands.length; i++) {
					let hcard = Game.hands[i];
					if (hcard === card) {
						card.div.div.onclick = null;
						continue;
					}
					hcard.onCopyClickDown =  function() {
						hcard.div.selected(true);
						hcard.div.div.onclick = hcard.onCopyClickUp;
						if (selected) {
							selected.div.div.onclick = selected.onCopyClickDown;
							selected.div.selected(false);
						}
						selected = hcard;
						CheckCopy();
					}
					hcard.onCopyClickUp = function() {
						hcard.div.selected(false);
						hcard.div.div.onclick = hcard.onCopyClickDown;
						selected = null;
						CheckCopy();
					}
					hcard.div.div.onclick = hcard.onCopyClickDown;
				}
			}();
		} else if (skill.DESTORY) {
			!function() {
				var selected = null;
				function CheckSkill() {
					GameObject.Buttons.showSole(2, selected?true:false);
				}
				CheckSkill();
				GameObject.Buttons.onclick[2] = function() {
					GameObject.Buttons.showSole(2, false);
					selected.div.selected(false);
					card.div.div.onclick = null;
					
					Game.hands.remove(selected);
					
					var pos = GameObject.HandsDiv.getCardPos(selected);
					var index = GameObject.HandsDiv.getCardStation(selected);
					Game.cardsTmpForDestroy.div.setAlpha(1);
					Game.cardsTmpForDestroy.add(selected);
					Game.cardsTmpForDestroy.div.show(true);
					Game.cardsTmpForDestroy.div.setLayer(index+50);
					Control.Animation.CardsDesTroy(Game.cardsTmpForDestroy, pos, function() {
						Game.cardsTmpForDestroy.remove(selected);
						GameObject.HandsDiv.animateRemove2(index, function() {
							console.log('done');
							Game.LoopCheckStates();
						});
					});
					
				}
				for (let i=0; i<Game.hands.length; i++) {
					let hcard = Game.hands[i];
					if (hcard === card) {
						card.div.div.onclick = null;
						continue;
					}
					hcard.onSkillClickDown =  function() {
						hcard.div.selected(true);
						hcard.div.div.onclick = hcard.onSkillClickUp;
						if (selected) {
							selected.div.div.onclick = selected.onSkillClickDown;
							selected.div.selected(false);
						}
						selected = hcard;
						CheckSkill();
					}
					hcard.onSkillClickUp = function() {
						hcard.div.selected(false);
						hcard.div.div.onclick = hcard.onSkillClickDown;
						selected = null;
						CheckSkill();
					}
					hcard.div.div.onclick = hcard.onSkillClickDown;
				}
			}();
		} else if (skill.CARD) {
			card.div.div.onclick = null;
			Game.CardUnit.drawCard(function() {
				if (skill.CARD == 2) {
					Game.CardUnit.drawCard(function() {
						Game.LoopCheckStates();
					});
				} else {
					Game.LoopCheckStates();
				}
			});
			
		} else if (skill.DOUBLE) {
			!function() {
				var selected = null;
				function CheckSkill() {
					GameObject.Buttons.showSole(2, selected?true:false);
				}
				CheckSkill();
				GameObject.Buttons.onclick[2] = function() {
					selected.buff.DOUBLE = true;
					
					GameObject.Buttons.showSole(2, false);
					selected.div.selected(false);
					card.div.div.onclick = null;
					Game.LoopCheckStates();
					
				}
				for (let i=0; i<Game.hands.length; i++) {
					let hcard = Game.hands[i];
					if (hcard === card) {
						card.div.div.onclick = null;
						continue;
					}
					hcard.onSkillClickDown =  function() {
						hcard.div.selected(true);
						hcard.div.div.onclick = hcard.onSkillClickUp;
						if (selected) {
							selected.div.div.onclick = selected.onSkillClickDown;
							selected.div.selected(false);
						}
						selected = hcard;
						CheckSkill();
					}
					hcard.onSkillClickUp = function() {
						hcard.div.selected(false);
						hcard.div.div.onclick = hcard.onSkillClickDown;
						selected = null;
						CheckSkill();
					}
					hcard.div.div.onclick = hcard.onSkillClickDown;
				}
			}();

		} else if (skill.VISION) {
			/* card.div.div.onclick = null;
			Game.LoopCheckStates(true);
			Game.CardUnit.drawCard(function() {
				Game.LoopCheckStates(true);
				Game.CardUnit.drawCard(function() {
					Game.LoopCheckStates(true);
					Game.CardUnit.drawCard(function() {
						Game.LoopCheckStates(true);
						var selected = [];
						function CheckSkill() {
							var flag = true;
							for (let i=0; i<Game.hands.length; i++) {
								if (Game.hands.length-i > 3 && selected[i]) {
									flag = false;
								}
							}
							GameObject.Buttons.showSole(2, flag);
						}
						CheckSkill();
						GameObject.Buttons.onclick[2] = function() {
							GameObject.Buttons.showSole(2, false);
							selected.div.selected(false);
							card.div.div.onclick = null;
							
							var cnt = 0;
							var len = Game.hands.length;
							function _clear() {
								Game.LoopCheckStates();
							}
							function _destroy(j) {
								if (selected[len-1-i]) {
									var selectedCard = Game.hands[len-1-j];
									Game.hands.remove(selectedCard);
									
									var pos = GameObject.HandsDiv.getCardPos(selectedCard);
									var index = GameObject.HandsDiv.getCardStation(selectedCard);
									Game.cardsTmpForDestroy.div.setAlpha(1);
									Game.cardsTmpForDestroy.add(selectedCard);
									Game.cardsTmpForDestroy.div.show(true);
									Game.cardsTmpForDestroy.div.setLayer(index+50);
									Control.Animation.CardsDesTroy(Game.cardsTmpForDestroy, pos, function() {
										Game.cardsTmpForDestroy.remove(selectedCard);
										GameObject.HandsDiv.animateRemove2(index, function() {
											if (j<3) _destroy(j+1);
											else {
												_clear();
											}
										});
									});
								} else {
									if (j<3) _destroy(j+1);
									else {
										_clear();
									}
								}
							}
							_destroy(0);
							
						}
						for (let i=0; i<Game.hands.length; i++) {
							let hcard = Game.hands[i];
							if (Game.hands.length-i > 3) {
								hcard.div.selected(false);
								hcard.div.div.onclick = null;
								continue;
							}
							hcard.onSkillClickDown =  function() {
								hcard.div.selected(true);
								hcard.div.div.onclick = hcard.onSkillClickUp;
								selected[i] = true;
								CheckSkill();
							}
							hcard.onSkillClickUp = function() {
								hcard.div.selected(false);
								hcard.div.div.onclick = hcard.onSkillClickDown;
								selected[i] = false;
								CheckSkill();
							}
							hcard.div.div.onclick = hcard.onSkillClickDown;
						}
					});
				});
			}); */
		} else {
			Game.LoopCheckStates();
		}
	}
	Game.LoopCheckStates();
}
function getCurrentAttackInHand(card) {
	var attack = card.data.attack;
	if (card.buff && card.buff.size()>0) {
		if (card.buff.COPY) {
			attack = card.buff.COPY.attack;
			console.log('copy', attack);
		}
		if (card.buff.DOUBLE) {
			attack *= 2;
		}
	}
	return attack;
}

Game.DataUpdate = function() {
	Game.DataShow.showHealth(Game.Data.health, Game.Data.healthMax);
	Game.DataShow.showAttack(Game.Data.curAttack);
	Game.DataShow.showAimAttack(Game.Data.aimAttack);
	Game.DataShow.showFreeChoose(Game.Data.freeChoose);
	Game.DataShow.showStep(Game.Data.curStep);
}

Game.LoopCheckStates = function(blockSkill=false) {
	console.log('loop check');
	// 按钮处理
	GameObject.Buttons.showSole(1, true);
	!function() {
		if (!Game.selected){ //&& Game.selected.data.skill.size()>0) {
			GameObject.Buttons.showSole(0, false);
			return;
		}
		GameObject.Buttons.showSole(0, true);
	}();
	
	
	
	// 数值更新
	var hasFreeCard = true;
	!function _LoopDataUpdata() {
		var attackCnt = 0;
		var stepname = Resources.StepName;
		Game.Data.aimAttack = Game.curHazardCard.data.aim[stepname[Game.Data.curStep]];
		var max = -10, max2zero = false;
		Game.hands.forEach(function(card) {
			var tmp = getCurrentAttackInHand(card);
			if (tmp > max) max = tmp;
			card.data.attack;
			if (card.data.skill['STOP']) hasFreeCard = false;
			if (card.data.skill.MAX2ZERO) max2zero = true;
			
			attackCnt += tmp;
			// console.log(tmp);
		});
		if (max2zero && max != -10) attackCnt -= max;
		if (Game.Data.freeChoosed >= Game.Data.freeChoose) hasFreeCard = false;
		
		Game.Data.curAttack = attackCnt;
		Game.DataUpdate();
	}();
	
	// 给每张有技能的手牌添加点击事件
	!function _AddClickForHands() {
		for (let i=0; i<Game.hands.length; i++) {
			let card = Game.hands[i];
			if (card.div.div.onclick && (card.div.div.onclick === card.onclick ||
				card.div.div.onclick === card.onclickUp)) {
				continue;
			}
			if (card.used) console.log('used!!!');
			if (!blockSkill && !card.used && card.data.skill.size()>0 && card.type!='agingCard') {
				card.div.canBeSelect(true);
				card.onclick = function () {
					// console.log('click', card.toString());
					if (Game.selected) {
						Game.selected.div.div.onclick = Game.selected.onclick;
						Game.selected.div.selected(false);
					}
					Game.selected = card;
					card.div.selected(true);
					card.div.div.onclick = card.onclickUp;
					Game.LoopCheckStates();
				}
				card.onclickUp = function() {
					// console.log('false click', card.toString());
					if (Game.selected) {
						Game.selected.div.selected(false);
						Game.selected = null;
					}
					card.div.div.onclick = card.onclick;
					Game.LoopCheckStates();
				}
				card.div.div.onclick = card.onclick;
				card.div.canBeSelect(true);
			} else {
				card.div.div.onclick = null;
				card.div.canBeSelect(false);
			}
		}
	}();
	
	
	// 从牌堆抽牌时
	//Game.DrawCard = Game.CardUnit.drawCard
	function CardUnitClick(callback) {
		Game.Data.freeChoosed++;
		if (!hasFreeCard) Game.Data.health -= 1;
		
		var card = Game.CardUnit.front;
		Game.CardUnit.unsetFront();
		Game.CardUnit.flip();
		
		Game.cardsTmp.add(card);
		Game.cardsTmp.div.setPos(Game.DrawPilePos[0],Game.DrawPilePos[1]);
		Game.cardsTmp.div.show(true);
		Game.cardsTmp.div.setLayer(80);
					// 处理抽到的卡
					card.buff = {};
					card.used = false;
					card.div.used(false);
					card.div.canBeSelect(false);
					card.div.div.onclick = null;
					Game.newCard = card;
		
		
		function MoveCard() {
			// 卡牌移动
			GameObject.HandsDiv.animatePush(function() {
				Control.Animation.CardsDivMove(Game.cardsTmp, Game.DrawPilePos, 
					GameObject.HandsDiv.getPushedPos(), function() {
						
					
					// 处理抽到的卡
					card.buff = {};
					card.used = false;
					card.div.used(false);
					card.div.canBeSelect(false);
					card.div.div.onclick = null;
					
					Game.cardsTmp.remove(card);
					Game.cardsTmp.div.show(false);
					GameObject.HandsDiv.push(card);
					// console.log('add to hands',card.toString());
					Game.hands.push(card);
					
					Game.LoopCheckStates();
					if (callback) callback();
				});
			});
		}
		
		card.div.recover();
		if (card.type == 'hazardCard') {
			//card.div.setRotate(true);
			//card.div.setLayer(90);
			Control.Animation.CardDivFlip(card, true, function() {
				// console.log('animateRotate done!');
				setTimeout(MoveCard,200);
			});
		} else {
			setTimeout(MoveCard,200);
		}
	}
	
	// 设置牌堆
	Game.CardUnit.setTip(true, true, hasFreeCard?'免费':'生命值-1', null, CardUnitClick, Game.drawPile, function() {
		//用完一次牌堆
		console.log('aging....');
		var card = Game.agingPile.pop();
		if (card) Game.discardBattlePile.push(card);
		for (let i=0; i<Game.discardBattlePile.length; i++) {
			var card = Game.discardBattlePile[i];
			card.div.setRotate(false);
		}
		Game.drawPile = Game.discardBattlePile.slice().shuffle();
		Game.discardBattlePile = [];
		Game.CardUnit.data.autoload = Game.drawPile;
	});
}