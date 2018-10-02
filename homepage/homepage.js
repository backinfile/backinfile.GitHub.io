
var content = [
	['彩色画板','../canvasV2/index.html'],
	['黑白画板','../canvas/index.html'],
	['连连看', '../linegame/index.html'],
	['象棋','../chess.html'],
	['circle','../circle/circle.html'],
	['炉石小兵','../billion/billion.html'],
	['聊天室','../chatroom.html'],
	];

function htmlcontent(name, url) {
	return '  <a class="weui-cell weui-cell_access" href="'+url+'">'
		+'		<div class="weui-cell__bd">'
		+'		  <p>'+name+'</p>'
		+'		</div>'
		+'		<div class="weui-cell__ft">'
		+'		</div>'
		+'	  </a>';
}

function htmlphone() {
	var html = '<div class="weui-cells">';
	for (var i=0; i<content.length; i++) {
		html += htmlcontent(content[i][0], content[i][1]);
	}
	html += '</div>';
	return html;
}
function htmlpc() {
	return '<div id="left">'
		+htmlphone()
		+'</div>'
		+'<div id="right">'
		+'<img class="arrow" src="img/arrowblue.png">'
		+'</div>';
}

var ispc = true;
if ($(document).width()<800) {
	ispc = false;
	$('#body').html(htmlphone());
} else {
	$('#body').html(htmlpc());
}

if (ispc) {
	$(function() {
		var folded = false;
		$arrow = $('.arrow');
		$left = $('#left');
		$right = $('#right');
		$arrow.css('cursor', 'pointer');
		$arrow.css('rotate', 90);
		$arrow.click(function() {
			if (!folded) {
				var anicnt = 5;
				var ani = setInterval(function() {
					$left.css('width', 25-anicnt+"%");
					$right.css('width', 75+anicnt+"%");
					$arrow.css('rotate', 90+180/25*anicnt);
					anicnt += 4;
					if (anicnt > 25) {
						clearInterval(ani);
						$arrow.css('rotate', 270);
						$left.css('width', '0%');
						$right.css('width', '100%');
						folded = true;
					}
				}, 20);
			} else {
				var anicnt = 25;
				var ani = setInterval(function() {
					$left.css('width', 25-anicnt+"%");
					$right.css('width', 75+anicnt+"%");
					$arrow.css('rotate', 90+180/25*anicnt);
					anicnt -= 3;
					if (anicnt < 0) {
						clearInterval(ani);
						$arrow.css('rotate', 90);
						$left.css('width', '25%');
						$right.css('width', '75%');
						folded = false;
					}
				}, 20);
			}
		});

	});
}