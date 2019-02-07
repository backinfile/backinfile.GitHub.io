

var GO = null;
$(function() {
	$('#game').hide();
	
	//  get a nickname
	var nickname = (function getNickname(){
		var nickname = $.cookie('nickname');
		if (!nickname) {
			while (true) {
				nickname = prompt("为自己取个名字：", '');
				nickname = $.trim(nickname);
				if (!nickname) {
					alert("名字不能为空");
				} else if (/<|>/.test(nickname)) {
					alert("名字含有非法字符");
				} else {
					$.cookie('nickname', nickname, { expires: 30 });
					break;
				}
			}
		}
		$('#nickname').html(nickname);
		return nickname;
	})();
	
	// init
	BmobSocketIo.initialize("05ecb2c89b86a7362f8b0636b5707ee3");
	Bmob.initialize("05ecb2c89b86a7362f8b0636b5707ee3", "331dba9b3ef885519bbc0784ff65f8ce");
	
	var User = Bmob.Object.extend("user");
	var Match = Bmob.Object.extend("match");
	var Game = Bmob.Object.extend("game");
	var user_obj = null;
	
	// check nickname
	var query = new Bmob.Query(User);
	query.equalTo("nickname", nickname);
	query.find({
		success: function(results) {
			if (!results.length) {
				var user = new User();
				user.set('nickname', nickname);
				user.save(null, {
					success: function(obj) {
						user_obj = obj;
						start();
						
					},
					error: function(obj, error) {}
				});
			} else {
				user_obj = results[0];
				start();
				GO = results[0];
			}
		}
	});
	
	// keep alive
	setInterval(function() {
		if (user_obj) {
			user_obj.increment('keepalive');
			user_obj.save();
			
			var query = new Bmob.Query(User);
			var date = new Date();
			date.setSeconds(date.getSeconds()-7);
			query.greaterThan('updatedAt', date);
			query.count({
				success: function(cnt) {
					$('#nickname').html(nickname+'('+'当前在线'+cnt+'人)');
					//console.log(cnt,date);
				},
				error: function(error) {}
			});
			
		}
	}, 3000);
	
	function start() {
		user_json = {id:user_obj.id, nickname:user_obj.get('nickname')};
		console.log('登陆成功');
		$('#match').on('click', function() {
			$('#match').html('正在匹配');
			checkWaitedMatch();
		});
		
	}
	function checkWaitedMatch() {
		console.log('查找正在等待的player...');
		var query = new Bmob.Query(Match);
		query.equalTo('second', null);
		var date = new Date();
		date.setSeconds(date.getSeconds()-5);
		query.greaterThan('updatedAt', date);
		query.first({'success':function(object) {
			if (object) {
				console.log('找到！',object.get('first'));
				lastMoveTime = new Date();
				object.set('second', user_json);
				object.save(null,{'success':function() {
					gamestart(2, object.get('first'));
				}});
			} else {
				console.log('没找到，正在发布匹配消息..');
				var match = new Match();
				match.set('first', user_json);
				match.save(null, {'success':function(match) {
					console.log('发布成功', match.id);
					wait4opponent(match);
				}});
			}
		}});
	}
	function wait4opponent(match) {
		var inter = setInterval(function() {
			match.increment('keepalive');
			match.save();
		}, 3000);
		var query = new Bmob.Query(Match);
		function wait() {
			query.get(match.id, {'success':function(match) {
				var second = match.get('second');
				if (second) {
					clearInterval(inter);
					console.log('准备开始！', second);
					gamestart(1, second);
				} else {
					console.log('等待中...');
					lastMoveTime = new Date();
					setTimeout(wait, 2000);
				}
			}});
		}
		wait();
	}
	
	// 棋盘显示
	var myturn = null;
	var lastMoveTime = null;
	var opponent_json = null;
	var myflag = 1;
	var grids = new Array(9);
	grids.fill(0);

	function set(n, flag) {
		//var n = x*3+y-4;
		if (flag==0) {
			$('#game').children().eq(n).css('background', '');
		} else if (flag==1) {
			$('#game').children().eq(n).css('background', 'url(x.png)');
		} else if (flag==2) {
			$('#game').children().eq(n).css('background', 'url(circle.png)');
		}
		grids[n] = flag;
	}
	var $grid = $('#game').children();
	for (let i=0; i<9; i++) {
		$grid.eq(i).on('click', function() {
			if (myturn && !grids[i]) {
				set(i, myflag);
				sendMsg(i);
				myturn = 0;
				$('body').css("cursor","wait");
			}
		});
	}
	function sendMsg(n) {
		var g = new Game();
		g.set('player', user_obj.id);
		g.set('action', n);
		g.save();
	}
	function getMsg() {
		if (!myturn) {
			var query = new Bmob.Query(Game);
			query.equalTo('player', opponent_json.id);
			query.greaterThan('updatedAt', lastMoveTime);
			query.first({success:function(obj) {
				if (obj) {
					lastMoveTime = new Date();
					set(obj.get('action') ,3-myflag);
					myturn = 1;
					$('body').css("cursor","pointer");
				}
				setTimeout(getMsg, 1000);
			}});
		} else {
			setTimeout(getMsg, 1000);
		}
	}
	
	function gamestart(flag, opponent) {
		console.log('对局开始！', flag, opponent);
		myflag = flag;
		myturn = flag-1;
		opponent_json = opponent;
		$('#game').show();
		$('#match').hide();
		$('#tip').html('正在与'+opponent.nickname+'进行对战');
		if (myturn) {
			$('body').css("cursor","pointer");
		} else {
			$('body').css("cursor","wait");
		}
		getMsg();
	}
}); 


/* BmobSocketIo.onInitListen = function() {
	  //BmobSocketIo.updateTable("Chat");
	};

	BmobSocketIo.onUpdateTable = function(tablename,data) {   
	 
	 if( tablename=="Chat" ) {
	 }
	}; */

