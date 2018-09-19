
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
				anicnt += 2;
				if (anicnt > 25) {
					clearInterval(ani);
					$arrow.css('rotate', 270);
					$left.css('width', '0%');
					$right.css('width', '100%');
					folded = true;
				}
			}, 500/25);
		} else {
			var anicnt = 25;
			var ani = setInterval(function() {
				$left.css('width', 25-anicnt+"%");
				$right.css('width', 75+anicnt+"%");
				$arrow.css('rotate', 90+180/25*anicnt);
				anicnt -= 2;
				if (anicnt < 0) {
					clearInterval(ani);
					$arrow.css('rotate', 90);
					$left.css('width', '25%');
					$right.css('width', '75%');
					folded = false;
				}
			}, 500/25);
		}
	});

});