
if ($(document).width()>600) {
	$('#body').width(400);
}


function Minion() {
	this.Health = 1;	// fixed attributes
	this.Attack = 1;
	this.Shield = false;
	
	this.health = 1;	// variable attributes
	this.attack = 1;
	this.shield = false;
	
	this.name = '勇者';
	this.color = 'red';
	this.skills = {};
	this.init = function (){
		this.attack = this.Attack;
		this.health = this.Health;
		this.shield = this.Shield;
	}
	this.shape = function(){
		var tmp = this.attack+'/'+this.health;
		if (this.shield) tmp += '圣盾';
		return tmp;
	}
	this.msg = function(){
		return '<font color="'+this.color+'">'+this.name+'('+this.shape()+')'+'</font>';
	}
	this.hurt = function(attack){
		if (!this.shield) {
			msgp.addmsg(this.msg()+'受到'+attack+'点伤害');
			this.health -= attack;
			msgp.appendmsg('-->'+this.msg());
			if (this.health <= 0){
				msgp.addmsg(this.msg()+'死亡。');
				return false;
			}
		} else {
			msgp.addmsg(this.msg()+'失去圣盾');
			this.shield = false;
		}
		return true;
	}
}

function get_bosses() {
	var mins = []
	var minion = new Minion();
	minion.name = '企鹅';
	minion.color = 'black';
	minion.Health = 1;
	minion.init();
	mins.push(minion);
	var minion = new Minion();
	minion.name = '侍从';
	minion.color = 'black';
	minion.Health = 1;
	minion.Shield = true;
	minion.init();
	mins.push(minion);
	var minion = new Minion();
	minion.name = '铜须';
	minion.color = 'green';
	minion.Health = 4;
	minion.Attack = 2;
	minion.init();
	mins.push(minion);
	var minion = new Minion();
	minion.name = '雪人';
	minion.color = 'green';
	minion.Health = 5;
	minion.Attack = 4;
	minion.init();
	mins.push(minion);
	var minion = new Minion();
	minion.name = '母牛';
	minion.color = 'blue';
	minion.Health = 5;
	minion.Attack = 4;
	minion.Shield = true;
	minion.init();
	mins.push(minion);
	var minion = new Minion();
	minion.name = '大表哥';
	minion.color = 'blue';
	minion.Health = 12;
	minion.Attack = 12;
	minion.init();
	mins.push(minion);
	
	
	
	return mins;
}




function attack(ma, mb) {
	msgp.addmsg('');
	msgp.addmsg(ma.msg()+'发起攻击：');
	var flag = mb.hurt(ma.attack);
	loadboss(mb);
	if (!flag){
		return 'win';
	}
	msgp.addmsg(mb.msg()+'反击：');
	var flag = ma.hurt(mb.attack);
	loadplayer(ma);
	if (!flag){
		return 'lose';
	}
	return 'next';
}


function Messagepipe() {
	this.msg = '<br><br><br><br><br><br>';
	this.addmsg = function(m){
		this.msg += '<br>'+m;
		if (this.msg.startsWith('<br>')){
			this.msg = this.msg.slice(4);
		}
		$('#msg').html('<div class="weui-cells__title">'+this.msg+'</div>');
		$('#msg').scrollTop( $('#msg')[0].scrollHeight );
	}
	this.appendmsg = function(m){
		this.msg += m;
		$('#msg').html('<div class="weui-cells__title">'+this.msg+'</div>');
		$('#msg').scrollTop( $('#msg')[0].scrollHeight );
	}
}


function loadplayer (ma){
	$('#player').html(ma.msg())
}
function loadboss(ma){
	$('#boss').html(ma.msg())
}

function Game() {
	
	var bosses = get_bosses();
	var warrior = new Minion();
	var level = 0;
	loadplayer(warrior);
	loadboss(bosses[level]);
	msgp = new Messagepipe();
	var orihtml = '';
	var ori = [];
	
	this.attack = function(){
		var flag = attack(warrior, bosses[level]);
		//msgp.addmsg(flag);
		if (flag == 'win') {
			if (level+1 >= bosses.length) {
				msgp.addmsg('<br>恭喜通关');
				this.attack = function(){};
			} else {
				msgp.addmsg('<br>进入下一关');
				msgp.addmsg('获得一次进化机会');
				warrior.init();
				loadplayer(warrior);
				value = this.rndgen();
				ori = value[0];
				orihtml = $('#btns').html();
				$('#btns').html(value[1]);
				level += 1;
				loadboss(bosses[level]);
			}
		} else if (flag == 'lose') {
			msgp.addmsg('<br>游戏结束');
			this.attack = function(){};
		}
	}
	this.rndgen = function (){
		var ori = ['+1/+1', '+3攻击力', '+3生命值', '圣盾'];
		for (i=0; i<3; i++) {
			var t = Math.floor(Math.random()*ori.length);
			if (t != i) {
				var tmp = ori[t];
				ori[t] = ori[i];
				ori[i] = tmp;
			}
		}
		var html = '<div class="weui-cells__title">选择一项</div>'+
			'<a href="javascript:game.selects(0);" class="weui-btn weui-btn_primary">'+ori[0]+'</a>'+
			'<a href="javascript:game.selects(1);" class="weui-btn weui-btn_primary">'+ori[1]+'</a>'+
			'<a href="javascript:game.selects(2);" class="weui-btn weui-btn_primary">'+ori[2]+'</a>';
		return [ori, html];
	}
	this.selects = function (n) {
		var eff = ori[n];
		if (eff == '+1/+1') {
			warrior.Health += 1;
			warrior.Attack += 1;
		} else if (eff == '+3攻击力') {
			warrior.Attack += 3;
		} else if (eff == '+3生命值') {
			warrior.Health += 3;
		} else if (eff == '圣盾') {
			warrior.Shield += 3;
		}
		warrior.init();
		$('#btns').html(orihtml);
		loadplayer(warrior);
	}
}

var game = new Game();



