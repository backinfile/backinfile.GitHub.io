
function htmlphone() {
	return '	<div class="weui-cells">'
		+'	  <a class="weui-cell weui-cell_access" href="../linegame/index.html">'
		+'		<div class="weui-cell__bd">'
		+'		  <p>连连看</p>'
		+'		</div>'
		+'		<div class="weui-cell__ft">'
		+'		</div>'
		+'	  </a>'
		+'	  <a class="weui-cell weui-cell_access" href="../canvas/index.html">'
		+'		<div class="weui-cell__bd">'
		+'		  <p>黑白画板</p>'
		+'		</div>'
		+'		<div class="weui-cell__ft">'
		+'		</div>'
		+'	  </a>'
		+'	  <a class="weui-cell weui-cell_access" href="../chess.html">'
		+'		<div class="weui-cell__bd">'
		+'		  <p>象棋</p>'
		+'		</div>'
		+'		<div class="weui-cell__ft">'
		+'		</div>'
		+'	  </a>'
		+'	  <a class="weui-cell weui-cell_access" href="../billion/billion.html">'
		+'		<div class="weui-cell__bd">'
		+'		  <p>炉石小兵</p>'
		+'		</div>'
		+'		<div class="weui-cell__ft">'
		+'		</div>'
		+'	  </a>'
		+'	  <a class="weui-cell weui-cell_access" href="../chatroom.html">'
		+'		<div class="weui-cell__bd">'
		+'		  <p>简易聊天室</p>'
		+'		</div>'
		+'		<div class="weui-cell__ft">'
		+'		</div>'
		+'	  </a> '
		+'	  <a class="weui-cell weui-cell_access" href="../circle/circle.html">'
		+'		<div class="weui-cell__bd">'
		+'		  <p>circle</p>'
		+'		</div>'
		+'		<div class="weui-cell__ft">'
		+'		</div>'
		+'	  </a>'
		+'	</div>';
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
					anicnt -= 4;
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