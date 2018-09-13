
var width = 1000;
var height = 600;
var unitSize = 40;
var diff = 1;
var cr = 3; 		//圆角
var globaldata = {};
var $canvas = null;

function randInt(min, max) {return Math.floor(Math.random()*(max-min+1)+min);}


$(function() {
	$canvas = $('canvas');
	$canvas.click(onclick);
	init();
	gameflush();
	
});

function gameflush() { 
	$canvas.clearCanvas();
	updatevmap(globaldata.mainMap.unitWidth,globaldata.mainMap.unitHeight,globaldata.mainMap.map);
	globaldata.mainMap.render();
	globaldata.dataShow.render();
	globaldata.mainPlayer.render();
}


function init() {
	globaldata['colors'] = ['#FFF', '#EEE', '#333', '#0A0', '#FC0', '#FC0'];
	// 空地1，墙2，草3，宝箱4, 空宝箱5, 不可见0
	globaldata['items'] = get_weapons();
	
	globaldata['mainMap'] = new MainMap();
	globaldata['dataShow'] = new DataShow();
	globaldata['mainPlayer'] = get_player('战士');
	globaldata.mainPlayer.init('啦啦啦');
	//globaldata.mainPlayer.pos = putOn(globaldata.mainMap.unitWidth, globaldata.mainMap.unitHeight, globaldata.mainMap.map);
	globaldata.mainPlayer.pos = [1,1];
	console.log(globaldata.mainPlayer.pos);
	globaldata.mainPlayer.items.push(globaldata.items[0]);
	globaldata.mainPlayer.items.push(globaldata.items[1]);
}

function MainMap() {
	this.pos = [0,0];
	this.shape = [width*0.7, height];
	this.unitWidth = Math.floor(this.shape[0]/unitSize) -1;
	this.unitHeight = Math.floor(this.shape[1]/unitSize) -1;
	this.map = new Array(this.unitWidth);
	initmap(this.unitWidth,this.unitHeight,this.map);
	this.vmap = new Array(this.unitWidth);
	initmap(this.unitWidth,this.unitHeight,this.vmap);
	var dx = (this.shape[0]-this.unitWidth*unitSize)/2;
	var dy = (this.shape[1]-this.unitHeight*unitSize)/2;
	this.dx = dx;
	this.dy = dy;
	this.render = function() {
		$canvas.drawRect({
			fillStyle: 'green',
			x:this.pos[0],y:this.pos[1],
			width:this.shape[0],
			height:this.shape[1],
			fromCenter:false
		});
		for (var i=0; i<this.unitWidth; i++) {
			for (var j=0; j<this.unitHeight; j++) {
				var col = null;
				if (globaldata.mainPlayer && this.vmap[i][j]<0.5) col = globaldata.colors[6];
				else col = globaldata.colors[this.map[i][j]];
				$canvas.drawRect({
					fillStyle: col,
					x:this.pos[0]+dx+unitSize*i+diff,
					y:this.pos[1]+dy+unitSize*j+diff,
					width:unitSize-diff*2,
					height:unitSize-diff*2,
					fromCenter:false,
					cornerRadius: cr
				});
			}
		}
		if (globaldata.mainPlayer) {
			$canvas.drawText({
			  fillStyle: '#000',
			  x: this.pos[0]+dx+unitSize*globaldata.mainPlayer.pos[0]+unitSize/2, 
			  y: this.pos[1]+dy+unitSize*globaldata.mainPlayer.pos[1]+unitSize/2,
			  fontSize: unitSize/2.2,
			  fontFamily: 'Verdana, sans-serif',
			  text: globaldata.mainPlayer.type,
			  fromCenter: true,
			});
		}
	}
};
function DataShow() {
	this.pos = [width*0.7, 0];
	this.shape = [width-width*0.7, height];
	this.pos1 = [width*0.7, 0];
	this.shape1 = [width-width*0.7, height*0.45];
	this.pos2 = [width*0.7, height*0.45];
	this.shape2 = [width-width*0.7, height*0.1];
	this.pos3 = [width*0.7, height*0.55];
	this.shape3 = [width-width*0.7, height*0.45];
	
	this.select_pos = null;
	this.action = [true,true,true,false,true];
	this.actiontext = ['移动', '攻击', '拾取', '发动技能', '结束回合'];
	this.select_action = -1;
	this.flag = true;
	
	this.render = function() {
		$canvas.drawRect({
			fillStyle: 'green',
			x:this.pos[0],y:this.pos[1],
			width:this.shape[0],
			height:this.shape[1],
			fromCenter:false
		});
		var dif = 14;
		$canvas.drawRect({
			strokeStyle: '#c33',
			strokeWidth: 4,
			fillStyle: '#3a3',
			x:this.pos1[0]+dif,y:this.pos1[1]+dif,
			width:this.shape1[0]-dif-dif,
			height:this.shape1[1]-dif-dif,
			fromCenter:false
		});
		$canvas.drawRect({
			strokeStyle: '#c33',
			strokeWidth: 4,
			fillStyle: '#3a3',
			x:this.pos3[0]+dif,y:this.pos3[1]-dif,
			width:this.shape3[0]-dif-dif,
			height:this.shape3[1],
			fromCenter:false
		});
		$canvas.drawRect({
			fillStyle: '#3A3',
			x:this.pos[0]-2,y:this.pos[1],
			width:4,
			height:this.shape[1],
			fromCenter:false
		});
		if (this.select_pos) {
			var dx = globaldata.mainMap.dx;
			var dy = globaldata.mainMap.dy;
			var pos = globaldata.mainMap.pos;
			var diff2 = 1.5;
			$canvas.drawRect({
				strokeStyle: '#22A',
				strokeWidth: 4,
				x:pos[0]+dx+unitSize*this.select_pos[0]+diff+diff2,
				y:pos[1]+dy+unitSize*this.select_pos[1]+diff+diff2,
				width:unitSize-diff*2-diff2*2,
				height:unitSize-diff*2-diff2*2,
				fromCenter:false,
				cornerRadius: cr
			});
		}
		for (var i=0; i<this.action.length; i++) {
			if (this.action[i]) {
				var col = '#22A';
				if (this.select_action == i) {
					col = '#AA2';
					this.select_action = -1;
					setTimeout(function() {
						gameflush();
					}, 400);
				}
				$canvas.drawRect({
					strokeStyle: col,
					strokeWidth: 4,
					x:this.pos3[0]+unitSize,
					y:this.pos3[1]+unitSize*i+unitSize/2,
					width:unitSize*3,
					height:unitSize*3/4,
					fromCenter:false,
					cornerRadius: cr
				});
				$canvas.drawText({
				  fillStyle: '#222',
				  x: this.pos3[0]+unitSize*5/4, 
				  y: this.pos3[1]+unitSize*i+unitSize*2/3,
				  fontSize: unitSize/2.2,
				  fontFamily: 'Verdana, sans-serif',
				  text: this.actiontext[i],
				  fromCenter: false,
				});
			}
		}
	}
}


function onclick(e) {
	var mainMap = globaldata.mainMap;
	var mainPlayer = globaldata.mainPlayer;
	var dataShow = globaldata.dataShow;
	var x = Math.floor((e.offsetX-mainMap.dx)/unitSize);
	var y = Math.floor((e.offsetY-mainMap.dy)/unitSize);
	if (x>=0 && x<mainMap.unitWidth && y>=0 && y<mainMap.unitHeight) {
		dataShow.select_pos = [x,y];
		console.log("click:",x,y);
	} else if (e.offsetX>dataShow.pos3[0]+unitSize && e.offsetX<=dataShow.pos3[0]+unitSize*4) {
		for (var i=0; i<dataShow.action.length; i++) {
			if (e.offsetY>dataShow.pos3[1]+unitSize*(i+1/2) && e.offsetY<dataShow.pos3[1]+unitSize*(i+5/4)) {
				dataShow.select_action = i;
				console.log(i);
			}
		}
	}
	gameflush();
}

function People() {
	this.name = '';
	this.headpic = '';
	this.type = '';
	this.pos = [0,0];
	this.Health = 100;
	this.quick = 0.3;
	this.aim = 0.5;
	this.attack = 0;
	this.sight = 3;
	this.luck = 0.1;
	this.items = [];
	this.armor = 0;
	this.speed = 3;
	this.CD = 0;
	this.init = function(name='',headpic='') {
		this.health = this.Health;
		this.name = name;
		this.headpic = headpic;
	}
	this.update = function() {
		
	}
	this.render = function() {
		var npos = globaldata.dataShow.pos1;
		var nshape = globaldata.dataShow.shape1;
		var tus = nshape[0];
		var buff = '名字：'+this.name+'\n'+'职业：'+this.type+'\n';
		buff += '生命：'+this.health+'\n';
		buff += '命中：'+this.aim+'\n';
		buff += '攻击：'+this.attack+'\n';
		buff += '攻击CD：'+this.CD+'\n';
		buff += '护甲：'+this.armor+'\n';
		buff += '敏捷：'+this.quick+'\n';
		buff += '速度：'+this.speed+'\n';
		buff += '幸运：'+this.luck+'\n';
		buff += '装备：';
		for (var i=0; i< this.items.length; i++) {
			buff += this.items[i].name;
			if (i+1 < this.items.length) buff += '，';
		}
		if (this.items.length == 0) buff += '无';
		$canvas.drawText({
		  fillStyle: '#CCC',
		  strokeStyle: '#AFA',
		  strokeWidth: 1,
		  x: npos[0]+tus/10, y: npos[1]+tus/13,
		  fontSize: tus/22,
		  fontFamily: 'Verdana, sans-serif',
		  text: buff,
		  fromCenter: false,
		  lineHeight: 1.5,
		  align: 'left'
		});
	}
}
function get_player(type='战士'){
	var t = new People(globaldata);
	t.type = type;
	if (type == '刺客') {
		t.Health = 70;
		t.quick = 0.3;
		t.aim = 0.9;
		t.attack = 20;
		t.sight = 4;
		t.luck = 0.6;
		t.speed = 3;
	} else if (type == '盗贼') {
		t.Health = 120;
		t.quick = 0.5;
		t.aim = 0.7;
		t.attack = 0;
		t.sight = 5;
		t.luck = 0.3;
		t.speed = 3;
	} else if (type == '战士') {
		t.Health = 100;
		t.quick = 0.3;
		t.aim = 0.5;
		t.attack = 0;
		t.sight = 3;
		t.luck = 0.1;
		t.speed = 3;
	} else if (type == '守卫') {
		t.Health = 150;
		t.quick = 0.1;
		t.aim = 0.5;
		t.attack = 20;
		t.sight = 2;
		t.luck = 0.04;
		t.speed = 3;
	}
	t.init();
	return t;
}

function Weapon() {
	this.name = '';
	this.position = '';
	this.attack = 0;
	this.armor = 0;
	this.CD = 0;
	this.range = 0;
	this.sight = 0;
	this.speed = 0;
	this.aim = 0;
	this.quick = 0;
}
function get_weapons(){
	var ret = [];
	var t = new Weapon();
	t.name = '拳套';
	t.position = 'hand';
	t.attack = 25;
	t.armor = 5;
	t.range = 1;
	t.CD = 0;
	t.aim = 0.4;
	ret.push(t);
	var t = new Weapon();
	t.name = '刺刀';
	t.position = 'hand';
	t.attack = 70;
	t.range = 2;
	t.CD = 0;
	t.aim = 0;
	ret.push(t);
	var t = new Weapon();
	t.name = '手枪';
	t.position = 'hand';
	t.attack = 45;
	t.armor = 0;
	t.range = 3;
	t.CD = 1;
	t.aim = 0.3;
	ret.push(t);
	var t = new Weapon();
	t.name = '狙击枪';
	t.position = 'hand';
	t.attack = 100;
	t.armor = 0;
	t.range = 10;
	t.CD = 5;
	t.aim = 0.6;
	ret.push(t);
	var t = new Weapon();
	t.name = '望远镜';
	t.position = 'hand';
	t.sight = 3;
	ret.push(t);
	var t = new Weapon();
	t.name = '护甲';
	t.position = 'body';
	t.armor = 15;
	t.speed = -1;
	ret.push(t);
	var t = new Weapon();
	t.name = '披风';
	t.position = 'body';
	t.speed = 1;
	t.quick = 0.3;
	ret.push(t);
	var t = new Weapon();
	t.name = '头盔';
	t.position = 'head';
	t.armor = 20;
	ret.push(t);
	var t = new Weapon();
	t.name = '鞋子';
	t.position = 'foot';
	t.armor = 5;
	t.speed = 2;
	ret.push(t);
	
	
	return ret;
}


function putOn(w, h, map) {
	var cnt = 0;
	for (var i=0; i<w; i++) {
		for (var j=0; j<h; j++) {
			if (map[i][j] == 1) cnt++;
		}
	}
	console.log(cnt);
	cnt = Math.floor(cnt*Math.random());
	console.log(cnt);
	for (var i=0; i<w; i++) {
		for (var j=0; j<h; j++) {
			if (map[i][j] == 1) {
				cnt--;
				if (!cnt) return [i,j];
			}
		}
	}
	return null;
}



function initmap(w, h, map) {
	/* for (var i=0; i<w; i++) {
		var t = new Array(h);
		for (var j=0; j<h; j++) {
			if (Math.random()<0.12) tt = 2;
			else if (Math.random()<0.1)tt = 3;
			else if (Math.random()<0.1)tt = 4;
			else tt = 1;
			t[j] = tt;
		}
		map[i] = t;
	} */
	for (var i=0; i<w; i++) {
		var t = new Array(h);
		for (var j=0; j<h; j++) {
			t[j] = 1;
		}
		map[i] = t;
	}
	for(var i=0; i<7; i++) map[3][2+i] = 2;
	for(var i=0; i<7; i++) map[12][5+i] = 2;
	for(var i=0; i<7; i++) map[6+i][2] = 2;
	for(var i=0; i<7; i++) map[3+i][11] = 2;
	
	for(var i=0; i<3; i++) map[4][4+i] =  3;
	for(var i=0; i<3; i++) map[11][5+i] = 3;
	for(var i=0; i<3; i++) map[6+i][1] =  3;
	for(var i=0; i<5; i++) map[2+i][10] = 3;
	for(var i=0; i<2; i++) map[2][11+i] = 3;
	
	map[2][4] =  4;
	map[14][5] = 4;
	map[9][1] =  4;
	map[3][12] = 4;
	
	map[7][7] = 4;
	map[7][6] = 4;
	map[8][6] = 4;
	map[8][7] = 4;
}

function updatevmap(w, h, vmap) {
	return;
	if (!globaldata.mainPlayer) return;
	for (var i=0; i<w; i++) {
		for (var j=0; j<h; j++) {
			vmap[i][j] = -1;
		}
	}
	var pos = globaldata.mainPlayer.pos;
	vmap[pos[0]][pos[1]] = 1;
	var map = globaldata.mainMap.map;
	var queue = [pos];
	for (var i=0; i<w; i++) {
		for (var j=0; j<h; j++) {
			if (Math.abs(i-pos[0])+Math.abs(j-pos[1]) <= globaldata.mainPlayer.sight) {
				function vmapdsp(x,y) {
					if (!(x>=0 && x<w && y>=0 && y<h)) return;
					if (!(Math.abs(i-pos[0])+Math.abs(j-pos[1]) <= globaldata.mainPlayer.sight)) return;
					if (pos == [x,y]) {
						vmap[x][y] = 1;
					} else {
						var fx = (x-pos[0])>0?1:-1;
						var fy = (y-pos[1])>0?1:-1;
						if (Math.abs(i-pos[0])==Math.abs(j-pos[1])){
							if (vmap[x-fx][y-fx] == -1) vmapdsp(x-fx,y-fy);
							vmap[x][y] = vmap[x-fx][y-fx];
						} else {
							if (vmap[x-fx][y-fx] == -1) vmapdsp(x-fx,y-fy);
							if (Math.abs(i-pos[0])>Math.abs(j-pos[1])) {
								if (vmap[x-fx][y] == -1) vmapdsp(x-fx,y);
								vmap[x][y] = (vmap[x-fx][y-fx]*2+vmap[x-fx][y])/3;
							} else if (Math.abs(i-pos[0])<Math.abs(j-pos[1])) {
								if (vmap[x][y-fy] == -1) vmapdsp(x,y-fy);
								vmap[x][y] = (vmap[x-fx][y-fx]*2+vmap[x][y-fy])/3;
							}
						}
					}
				}
				vmapdsp(i,j);
			}
		}
	}
}






