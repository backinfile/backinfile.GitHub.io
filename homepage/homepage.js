
var content = [
	['贝塞尔曲线','../curve/index.html'],
	['shadow','../tank/index.html'],
	['彩色画板','../canvasV3/index.html'],
	['黑白画板','../canvas/index.html'],
	['连连看', '../linegame/index.html'],
	['象棋','../chess.html'],
	['circle','../circle/circle.html'],
	['炉石小兵','../billion/billion.html'],
	['聊天室','../chatroom.html'],
	];
	
var left = 15;

function htmlcontent(name, url) {
	/* return '  <a class="weui-cell weui-cell_access" href="'+url+'">'
		+'		<div class="weui-cell__bd">'
		+'		  <p>'+name+'</p>'
		+'		</div>'
		+'		<div class="weui-cell__ft">'
		+'		</div>'
		+'	  </a>'; */
	return '<li><a href='+url+'>'+name+'</a></li>';
}

function htmlphone() {
	/* var html = '<div class="weui-cells">';
	for (var i=0; i<content.length; i++) {
		html += htmlcontent(content[i][0], content[i][1]);
	}
	html += '</div>';
	return html; */
	var html = '<ul>';
	for (var i=0; i<content.length; i++) {
		html += htmlcontent(content[i][0], content[i][1]);
	}
	html += '</ul>';
	return html;
}
function htmlpc() {
	return '<div id="left">'
		+htmlphone()
		+'</div>'
		+'<div id="right">'
		+'<img class="arrow" src="img/arrowblue.png">'
		+'<img class="rightimage" src="img/ke9.jpg">'
		+'<div class="text"><div>'
		+'</div>';
}

var ispc = true;
var texts = [];
if ($(document).width()<800) {
	ispc = false;
	$('#body').html(htmlphone());
} else {
	$('#body').html(htmlpc());
}

if (ispc) {
	$(function() {
		(function loadImage(){
			var im = new Image();
			im.onload = (function() {
				var $image = $('.rightimage');
				$image[0].src = im.src;
				$image.css("opacity","0.75"); 
			});
			im.src = 'img/ke8.jpeg';
		})();
		
		(function ArrowControl() {
			$arrow = $('.arrow');
			$left = $('#left');
			$right = $('#right');
			$arrow.css('cursor', 'pointer');
			
			/* var folded = false;
			$arrow.css('rotate', 90); */
			var folded = true;
			$arrow.css('rotate', 270);
			$left.css('width', '0%');
			$right.css('width', '100%');
			
			var left = left || 15;
			var right = 100 - left;
			$arrow.click(function() {
				if (!folded) {
					var anicnt = 5;
					var ani = setInterval(function() {
						$left.css('width', left-anicnt+"%");
						$right.css('width', right+anicnt+"%");
						$arrow.css('rotate', 90+180/25*anicnt);
						anicnt += 3;
						if (anicnt > left) {
							clearInterval(ani);
							$arrow.css('rotate', 270);
							$left.css('width', '0%');
							$right.css('width', '100%');
							folded = true;
						}
					}, 20);
				} else {
					var anicnt = left;
					var ani = setInterval(function() {
						$left.css('width', left-anicnt+"%");
						$right.css('width', right+anicnt+"%");
						$arrow.css('rotate', 90+180/25*anicnt);
						anicnt -= 3;
						if (anicnt < 0) {
							clearInterval(ani);
							$arrow.css('rotate', 90);
							$left.css('width', left+'%');
							$right.css('width', right+'%');
							folded = false;
						}
					}, 20);
				}
			});
		})();
		
		
		putwords(texts[randInt(0,texts.length-1)], $('.text'));
		
		
	});
}

var returnchar = '\n';
function randInt(a,b){return Math.floor(Math.random()*(b-a+1))+a;}

function putwords(t, jqnode) {
	var cnt = 1;
	t = t.replace(/\n/g, '<br>');
	function type() {
		if (t[cnt] == '<') cnt += 3;
		jqnode.html(t.slice(0,cnt)+'_');
		cnt++;
		if (cnt >= t.length) {
			jqnode.html(t);
		} else 
			setTimeout(type, 100);
	}
	type();
}
if (ispc) {
	
	texts.push(`我原本以为，自己迟早能像那个人一样成为杰出的大人。
我原本相信，自己迟早能像那个人一样成为出色的妖精兵。

只要坚持到最后，梦想就会实现。
我信仰着这句话，一路奔驰至今。

------虽然我还没有放弃。
但我已经厌倦持续奔跑了。

对于末日的到来，
我心里其实怀有一丝期盼。

------提亚忒.席巴.伊格纳雷欧`);
	texts.push(`『对不起对不起对不起！』

呃......以前我有个朋友。
在我出生的森林附近有座村子，他就住在那里。他似乎是打破了『不能进入森林』的嘱咐跑进去玩，而发现了刚出生的我。

我们很快变得很要好。
他教我唱歌，还教我吹草笛。
差不多在第三天吧。村里的人认为孩子被森林妖精迷惑，于是大为光火地来讨伐我。
当时，我那个朋友拼了命地袒护我。他跟大人说：我不是坏妖精，我是他重要的朋友......
虽然我已经连他的名字和长相都不记得了，唯有当时的心情，我到现在都还记得一清二楚。
我觉得......非常高兴。

所以，对于妖精诞生瞬间会抱持的奇妙情绪，我并不像其他人一样记得那么清楚。
我也觉得有一点可惜就是了。

------菈琪旭.尼克思.瑟尼欧里斯`);
	texts.push(`『噢，我很幸福啊！』

我出生时的情形?噢，我记得非常清楚喔。
我回过神来，发现自己坐在昏暗的洞穴里。还有，感觉乱恐怖的。
嗯~与其说是我在害怕，感觉更像有某个人透过我在害怕......我不太会形容，反正就是有那样的感觉。
总之，我怕要想要『哇~』地叫出来。要是一直不吭声，我觉得自己好像就会这样溶化消失。
所以喽，我就这样喊了！
哇~嘎啊~咕哇~！
结果，我就变得比较不害怕了！

......咦，啊~你果然也是那么觉得吗?
哇哈哈，其实我也那么觉得。
我跟以前没有什么改变。只是从独自吵闹的小孩变成了和大家一起吵闹的小孩而已。
但是这样就够了。因为我还满喜欢我们的这个样子！


------可蓉.琳.布尔加特里欧`);
	texts.push(`『该怎么说好呢......你很坦率，但并不老实。』

自己诞生时的情形啊......我不太想仔细去回忆。
不，并没有发生很多严重的事情。当时我孤零零地坐在因为火灾森林而烧光的森林里。

该怎么说呢......当时我心里充满了像是空虚，也像是失望，感觉来路不明的漆黑情绪。
我怀着那种情绪，什么也不做，只是茫然地望着烧得焦黑的树木与众多野兽。
刚诞生的我能在那场火灾中活下来，肯定只是出于幸运。
当然，我还是有被火花之类的东西稍微烫伤。但在我身受重伤之前，年长的妖精兵们就发现我了。

......是啊，谁晓得呢。当时的漆黑情绪不知道消失到哪里去了。说不定，目前仍有一丝那样的情绪埋藏在我心中的某个角落。

------潘丽宝.诺可.卡黛娜`);
	texts.push(`我决定喽，妖精兵。
无论是大义名分或大陆群的未来，那些都无关紧要。

------我就是要阻挠你们。

------费奥多尔.杰斯曼`);
	texts.push(`一直要在一起，这么相信着。
不论发生什么都是朋友，这么想象着。
记忆崩坏也好，心灵消失也好，
甚至这身体变成了别的人也好。大家自始至终都相亲相爱，从未怀疑过。

没有人指谪那份软弱，
没有人责难那份愚昧。
可是，尽管如此。
或者说，正因为如此。
离别时刻的到来，比任何刀刃更加锋利地，
摧残着少女们的心口。`);
	texts.push(`“终于，我想明白了。
你所期望的世界的事。
你过去对任何人都很温柔的事。
还有你那扭曲的温柔，过去让所有人的心情都变得痛苦的事。”

“所以呢，费奥多尔，
我最终，下定决心了呦。”`);
}
