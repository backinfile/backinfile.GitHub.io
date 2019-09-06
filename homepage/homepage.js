
var content = [
	['SwitchBoard','../SwitchBoard/index.html'],
	['营火战争单机版','../firefight/index.html'],
	['井字棋','../chess99/index.html'],
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
	return '<li><a onclick="'+"_hmt.push(['_trackEvent', 'nav', 'click', '"+name+"'])"+'" href='+url+'>'+name+'</a></li>';
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
		$('.rightimage').css("opacity","0.75"); 
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
	
	texts.push(`　嗯。我的梦想实现了，
　也留下美好的回忆，
　我已经没有任何遗憾了。`);
	texts.push(`我出生时的情形？
嗯，稍微有点印象。

我在昏暗的森林里独自哇哇大哭。

虽然寂寞也是我哭的原因，但不知道为什么，内心很悲伤。
如果就这样一直没被前辈们发现，我想，我大概会哭成一滩水洼吧……不，我们的体质还满匪夷所思，这番话有一半是认真的。

现在？现在已经没问题了。生活又没有平稳到可以让我因为寂寞难过而哭哭啼啼的。
……欸，做什么。你那是什么温柔的眼神？
感觉好像被你当成小孩，真令人火大。
-----珂朵莉·诺塔·瑟尼欧里斯`);
	texts.push(`不会。我并没做什么
需要让你道谢的事。
-----奈芙莲·卢可·印萨尼亚`);
	texts.push(`那就是我最早以前的记忆。
那天风有点强，云也不多。天空看起来像会把人吸进去，嗯，就是那种感觉。
如果就那样站着不动，感觉似乎会融入风中消失呢。那也无妨。我就那样想着这些事，一直呆站着。

……这个世界濒临毁灭了。
重要的东西全在许久之前就已经被摧毁。留下来的事物全都没有价值。
虽然我不晓得理由，可是刚出生时的我，思考的尽是那种事情。

我想，那样的情绪……
肯定和你现在心里所想的一样。
-----艾瑟雅·麦杰·瓦尔卡里斯`);
	texts.push(`「你拖着这副惨兮兮的身体搏斗，
　不就是认真把命豁出去了吗？
　拚成那样很恶心耶。」
-----艾瑟雅·麦杰·瓦尔卡里斯`);
	texts.push(`啊……
我出生时的情形吗？
虽然用问题来回答问题怪怪的，可是你为什么要问那种事？

所谓的人生，是从出生起就开始的喔。
而我们的人生就是属于我们的。
若是出生时还无法忘怀前世宿命之类的东西，那怎么对得起我们此时此刻所过的每一天嘛。

所以啰，如果技官能像之前一样，只看着眼前的我们几个，并投注爱情，那就再好不过啦。
……呃，刚才说的那番话是要让你害羞的喔，并没叫你一脸正经地点头喔。
-----艾瑟雅·麦杰·瓦尔卡里斯`);
	texts.push(`这与是现代或是古代无关。
只要能吃到美味东西的时代，
全都是美好时代喔。」

-----妮戈兰`);
	texts.push(`「麻烦妳等会儿。我想起一件事情要问。」
「咦？」
差点关上的门又缓缓打开。
「我来这里，是要管理商会所拥有的兵器。」
「嗯。」
少女漠然点头。
「然后，这里是用来收藏那些兵器的仓库。」
「是啊。」
她再次点头。
「──可是，我再怎么看，也不觉得这里看起来像仓库。要管理的兵器在哪里？」
威廉环顾房内。
再看向窗外。
无论怎么看，这里只是座居住设施。没有夸张到像仓库的建筑。
「还有……或许这不是适合拿来问当事人的问题，但妳们是什么人？
为什么会待在应该是军方设施的这块地方？」
少女用看不出表情的眼神朝威廉望了几秒钟。
「……你连那些都不知道就过来了？」
珂朵莉眯起眼睛低语。
「而且，你什么不知道就陪着那些孩子玩闹？
难道你属于当场想到什么就做什么，都不会想太多的那种人？」
「唔。」
威廉并非没有自觉。他无言以对。
「哎，算了。反正也没有什么好隐瞒，我告诉你。
你刚才的第二个问题，就是第一个问题的答案。
第一个问题则是第二个问题的答案。」`);
	texts.push(`对方跟平常一样，将小妹傻眼到不行的视线一笑置之，然后又说：
『被拒绝久了，我自己也觉得事情变得很有趣。之后我就向她提出了各种挑战，想把东西赢到手。比训练课程的成绩、比食量，还比过纸牌。可是我完全赢不了。因为赢不过她，我又继续挑战，当时真的好开心。』
听到这里，珂朵莉已经猜得出故事的结局了。
珂朵莉不晓得这个自封她姊姊的妖精上头还有哪个姊姊。既然她不认识，就表示她来这里的时候，对方已经不在了。
或许自己不应该过问胸针的事。珂朵莉这样的想法，似乎显露在脸上了。对方拍了拍她的背说：
『哎，最后是我不战而胜。这故事真不痛快，对不对？
不知道为什么，她只有那一天没戴着胸针上战场。东西就留在她房间桌上。所以喽，后来这东西就变成我的了。』
对方啊哈哈哈哈哈地笑了出来，珂朵莉听不出刚才那段故事里有什么逗趣成分。
『虽然我自己也觉得不合适，但我就是觉得自己也要一直戴着才可以。想拿也拿不下来啊，这玩意儿。』

再重复一次。珂朵莉不太喜欢她。
然而──事后回想起来──其实她也没有那么讨厌对方。
因此，在对方没有从战场上回来的那一天，珂朵莉去了她的房间。
门没有上锁。敞开的房里一团乱，四处可见脱掉乱扔的内衣裤，或者玩了就没收拾的纸牌。
在那样的房间里，只有桌上是乾乾净净的。

一尘不染的光亮桌面中央，有颗银色胸针落寞地被遗留在那里。`);
	texts.push(``);
}
