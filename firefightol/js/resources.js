
var Resources = (function() {
	var loadImageList = [];
	var isloaded = false;
	return {
		loadImage: function(url) {
			if (!isloaded) loadImageList.push(url);
		},
		ready: function(callback) {
			var total = loadImageList.length;
			isloaded = true;
			var cnt = 0;
			for (let i=0; i<loadImageList.length; i++) {
				var img = new Image();
				img.onload = function() {
					cnt++;
					if (cnt >= loadImageList.length)  {
						if (callback) callback();
					} else {
						$('#per').html(Math.floor(cnt/total*100)+'%');
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
for (var i=10; i<=81; i++) {
	Resources.loadImage('img/00'+i+'.jpg');
}
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
Resources.loadImage('img/900531.jpg');
Resources.loadImage('img/900532.jpg');
Resources.loadImage('img/900533.jpg');
Resources.loadImage('img/900722.jpg');
Resources.loadImage('img/900771.jpg');
Resources.loadImage('img/900772.jpg');
Resources.loadImage('img/healthDigit.png');
Resources.loadImage('img/healthbg.png');
Resources.loadImage('img/bg.png');
Resources.loadImage('img/attackNumber.png');
Resources.loadImage('img/btn.png');
Resources.loadImage('img/btn2.png');
Resources.loadImage('img/cost.png');
Resources.loadImage('img/durable.png');
Resources.loadImage('img/durablebg.png');
Resources.loadImage('img/fireNumber.png');
Resources.loadImage('img/healthDigit.png');
Resources.loadImage('img/法术.png');
Resources.loadImage('img/特殊.png');
Resources.loadImage('img/无.png');
Resources.loadImage('img/武技.png');
Resources.loadImage('img/装备.png');

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
	19:{name:'心源道服',	type:'装备',style:'气功',number:1,cost:8,ability:{'护卫':true,'获得时':true},effect:{},durable:3},
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
	40:{name:'遗忘之轮',	type:'装备',style:'聚流',number:1,cost:3,ability:{'获得时':true},effect:{},durable:2},
	41:{name:'水之道',		type:'特殊',style:'聚流',number:2,cost:4,ability:{},effect:{'营火':0,'战力':0}},
	42:{name:'水之舞',		type:'特殊',style:'聚流',number:1,cost:6,ability:{},effect:{'营火':0,'战力':0}},
	43:{name:'涡心联结',	type:'特殊',style:'聚流',number:2,cost:5,ability:{},effect:{}},
	44:{name:'涡心涌动',	type:'特殊',style:'聚流',number:1,cost:8,ability:{},effect:{'战力':3}},
	
	45:{name:'灵感鉴定',	type:'武技',style:'精神',number:2,cost:2,ability:{},effect:{}},
	46:{name:'知识鉴定',	type:'武技',style:'精神',number:2,cost:3,ability:{},effect:{}},
	47:{name:'力量鉴定',	type:'武技',style:'精神',number:3,cost:4,ability:{},effect:{}},
	48:{name:'无形触手',	type:'法术',style:'精神',number:2,cost:1,ability:{},effect:{}},
	49:{name:'心灵震爆',	type:'法术',style:'精神',number:2,cost:2,ability:{'探查':1},effect:{'战力':1}},
	50:{name:'理智激荡',	type:'法术',style:'精神',number:2,cost:3,ability:{'探查':1},effect:{}},
	51:{name:'暗夜呢喃',	type:'法术',style:'精神',number:2,cost:4,ability:{'获得时':true},effect:{'营火':2}},
	52:{name:'噩梦化身',	type:'法术',style:'精神',number:1,cost:5,ability:{},effect:{}},
	53:{name:'梦境回溯',	type:'法术',style:'精神',number:1,cost:6,ability:{'探查':3},effect:{'生命':1}},
	54:{name:'san值崩溃',	type:'法术',style:'精神',number:1,cost:8,ability:{},effect:{}},
	55:{name:'死灵之书',	type:'装备',style:'精神',number:1,cost:7,ability:{},effect:{},durable:3},
	56:{name:'深海之梦',	type:'特殊',style:'精神',number:1,cost:5,ability:{},effect:{}},
	
	57:{name:'燃至灰烬',	type:'武技',style:'街斗',number:1,cost:2,ability:{},effect:{'战力':1}},
	58:{name:'认真走脸',	type:'武技',style:'街斗',number:2,cost:2,ability:{},effect:{}},
	59:{name:'乌鸦坐飞机',	type:'武技',style:'街斗',number:2,cost:3,ability:{'背水':true, '流放':true},effect:{}},
	60:{name:'猛踹',		type:'武技',style:'街斗',number:2,cost:3,ability:{},effect:{}},
	61:{name:'头槌',		type:'武技',style:'街斗',number:2,cost:4,ability:{'流放':true},effect:{}},
	62:{name:'挑衅',		type:'法术',style:'街斗',number:2,cost:3,ability:{},effect:{}},
	63:{name:'怒气燃烧',	type:'法术',style:'街斗',number:1,cost:6,ability:{},effect:{}},
	64:{name:'酒吧凶器',	type:'装备',style:'街斗',number:2,cost:4,ability:{'流放':true},effect:{'战力':1},durable:2},
	65:{name:'超重量武器',	type:'装备',style:'街斗',number:1,cost:8,ability:{'获得时':true},effect:{'战力':2},durable:3},
	66:{name:'板砖',		type:'特殊',style:'街斗',number:5,cost:1,ability:{'获得时':true},effect:{}},
	
	67:{name:'走脸',		type:'无',style:'基础',number:2,cost:0,ability:{},effect:{'战力':1}},
	68:{name:'营火',		type:'无',style:'基础',number:8,cost:0,ability:{},effect:{'营火':1}},
	69:{name:'营火火',		type:'无',style:'基础',number:10,cost:3,ability:{},effect:{'营火':2}},

	70:{name:'致盲射线',	type:'武技',style:'充能',number:2,cost:2,ability:{},effect:{'战力':1}},
	71:{name:'内维尔闪光',	type:'武技',style:'充能',number:2,cost:3,ability:{'背水':true},effect:{}},
	72:{name:'集束切割',	type:'武技',style:'充能',number:2,cost:4,ability:{'充能':3},effect:{'战力':2}},
	73:{name:'激光制导',	type:'法术',style:'充能',number:2,cost:3,ability:{},effect:{}},
	74:{name:'第一激发态',	type:'法术',style:'充能',number:2,cost:3,ability:{'充能':1},effect:{'营火':2}},
	75:{name:'粒子束反转',	type:'法术',style:'充能',number:1,cost:4,ability:{'流放':true},effect:{}},
	76:{name:'第二激发态',	type:'法术',style:'充能',number:2,cost:5,ability:{'充能':3},effect:{'营火':2}},
	77:{name:'电眼逼人',	type:'法术',style:'充能',number:1,cost:8,ability:{},effect:{}},
	78:{name:'谐振腔',		type:'装备',style:'充能',number:1,cost:5,ability:{},effect:{},durable:2},
	79:{name:'红宝石激光器',type:'装备',style:'充能',number:1,cost:6,ability:{'充能':6},effect:{'营火':1},durable:2},
	80:{name:'基态',		type:'特殊',style:'充能',number:3,cost:1,ability:{'充能':1},effect:{'营火':1}},
	81:{name:'佩里夫特',	type:'特殊',style:'充能',number:1,cost:7,ability:{'获得时':true},effect:{},durable:0},
};






