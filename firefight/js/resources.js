
var Resources = (function() {
	var loadImageList = [];
	var isloaded = false;
	return {
		loadImage: function(url) {
			if (!isloaded) loadImageList.push(url);
		},
		ready: function(callback) {
			isloaded = true;
			var cnt = 0;
			for (let i=0; i<loadImageList.length; i++) {
				var img = new Image();
				img.onload = function() {
					cnt++;
					if (cnt >= loadImageList.length)  {
						if (callback) callback();
					}
				}
				img.src = loadImageList[i];
			}
		}
	};
})();

Resources.loadImage('img/cardspos.png');
Resources.loadImage('img/disappear.gif');
Resources.loadImage('img/0000.jpg');
Resources.loadImage('img/0001.jpg');
Resources.loadImage('img/0002.jpg');
Resources.loadImage('img/0004.jpg');
Resources.loadImage('img/0006.jpg');
Resources.loadImage('img/0007.jpg');
Resources.loadImage('img/0009.jpg');
for (var i=10; i<=44; i++) {
	Resources.loadImage('img/00'+i+'.jpg');
}
Resources.loadImage('img/0067.jpg');
Resources.loadImage('img/0068.jpg');
Resources.loadImage('img/0069.jpg');
Resources.loadImage('img/900231.jpg');
Resources.loadImage('img/900232.jpg');
Resources.loadImage('img/900151.jpg');
Resources.loadImage('img/900152.jpg');
Resources.loadImage('img/900201.jpg');
Resources.loadImage('img/900202.jpg');
Resources.loadImage('img/900203.jpg');
Resources.loadImage('img/900204.jpg');
Resources.loadImage('img/900205.jpg');
Resources.loadImage('img/900206.jpg');
Resources.loadImage('img/900207.jpg');
Resources.loadImage('img/900208.jpg');
Resources.loadImage('img/900381.jpg');
Resources.loadImage('img/900382.jpg');
Resources.loadImage('img/900411.jpg');
Resources.loadImage('img/900412.jpg');
Resources.loadImage('img/900421.jpg');
Resources.loadImage('img/900422.jpg');

Resources.CardData = {
	9: {name:'起势',		type:'武技',style:'气功',number:2,cost:1,ability:{},effect:{'战力':1}},
	10:{name:'龙头戏画',	type:'武技',style:'气功',number:2,cost:3,ability:{'聚气':5},effect:{'战力':1}},
	11:{name:'真气贯通',	type:'武技',style:'气功',number:2,cost:4,ability:{},effect:{'生命':1,'营火':2}},
	12:{name:'疾风迅雷',	type:'武技',style:'气功',number:2,cost:2,ability:{'聚气':5},effect:{}},
	13:{name:'猜猜拳'  ,	type:'武技',style:'气功',number:1,cost:5,ability:{'聚气':5},effect:{'战力':2}},
	14:{name:'震空波动拳',	type:'武技',style:'气功',number:1,cost:8,ability:{'聚气':8},effect:{'营火':3}},
	15:{name:'缠',			type:'法术',style:'气功',number:2,cost:3,ability:{'聚气':4},effect:{'营火':2}},
	16:{name:'念气流转',	type:'法术',style:'气功',number:1,cost:6,ability:{},effect:{'营火':2}},
	17:{name:'练气',		type:'法术',style:'气功',number:3,cost:2,ability:{'聚气':4},effect:{}},
	18:{name:'念气手套',	type:'装备',style:'气功',number:2,cost:4,ability:{'流放':true},effect:{'营火':1},durable:2},
	19:{name:'心源道服',	type:'装备',style:'气功',number:3,cost:8,ability:{'护卫':true,'获得时':true},effect:{},durable:3},
	20:{name:'四大行',		type:'特殊',style:'气功',number:1,cost:1,ability:{'获得时':true},effect:{}},
	
	21:{name:'直拳',		type:'武技',style:'连击',number:3,cost:1,ability:{'流放':true},effect:{}},
	22:{name:'勾拳',		type:'武技',style:'连击',number:2,cost:2,ability:{'连击':1},effect:{'战力':1}},
	23:{name:'摆拳',		type:'武技',style:'连击',number:2,cost:3,ability:{'连击':2},effect:{'战力':1}},
	24:{name:'双重垫步',	type:'武技',style:'连击',number:2,cost:4,ability:{'连击':3},effect:{}},
	25:{name:'肝脏打击',	type:'武技',style:'连击',number:2,cost:5,ability:{'获得时':true},effect:{'战力':2}},
	26:{name:'轮摆式移位',	type:'武技',style:'连击',number:1,cost:8,ability:{},effect:{'战力':2}},
	27:{name:'暗影步',		type:'法术',style:'连击',number:1,cost:4,ability:{},effect:{}},
	28:{name:'四妖拳',		type:'法术',style:'连击',number:1,cost:6,ability:{},effect:{}},
	29:{name:'疾跑',		type:'法术',style:'连击',number:2,cost:3,ability:{},effect:{'营火':2}},
	30:{name:'激素调节',	type:'法术',style:'连击',number:2,cost:2,ability:{'连击':2},effect:{}},
	31:{name:'一步拳套',	type:'装备',style:'连击',number:1,cost:5,ability:{'获得时':true},effect:{'战力':1},durable:2},
	32:{name:'冠军腰带',	type:'装备',style:'连击',number:1,cost:7,ability:{'获得时':true},effect:{},durable:3},
	
	33:{name:'勇德赋力',	type:'武技',style:'聚流',number:2,cost:4,ability:{},effect:{}},
	34:{name:'断片涤净',	type:'武技',style:'聚流',number:2,cost:1,ability:{'不同风格':3},effect:{}},
	35:{name:'分枝击',		type:'武技',style:'聚流',number:2,cost:2,ability:{'不同风格':2},effect:{'战力':1}},
	36:{name:'艾思波赋力',	type:'法术',style:'聚流',number:2,cost:3,ability:{},effect:{}},
	37:{name:'断片感应',	type:'法术',style:'聚流',number:2,cost:2,ability:{'获得时':true},effect:{'营火':1}},
	38:{name:'聚流',		type:'法术',style:'聚流',number:1,cost:7,ability:{},effect:{}},
	39:{name:'斑特赋力',	type:'法术',style:'聚流',number:2,cost:3,ability:{},effect:{'生命':1}},
	40:{name:'遗忘之轮',	type:'装备',style:'聚流',number:1,cost:3,ability:{'获得时':true},effect:{},durable:3},
	41:{name:'水之道',		type:'特殊',style:'聚流',number:2,cost:4,ability:{},effect:{'营火':0,'战力':0}},
	42:{name:'水之舞',		type:'特殊',style:'聚流',number:1,cost:6,ability:{},effect:{'营火':0,'战力':0}},
	43:{name:'涡心联结',	type:'特殊',style:'聚流',number:2,cost:5,ability:{},effect:{}},
	44:{name:'涡心涌动',	type:'特殊',style:'聚流',number:1,cost:8,ability:{},effect:{'战力':3}},
	
	67:{name:'走脸',		type:'无',style:'基础',number:2,cost:0,ability:{},effect:{'战力':1}},
	68:{name:'营火',		type:'无',style:'基础',number:8,cost:0,ability:{},effect:{'营火':1}},
	69:{name:'营火火',		type:'无',style:'基础',number:10,cost:3,ability:{},effect:{'营火':2}}

};






