
var Control = {};
Control.ready = null;

Control.loadImage = function() {
	var loadimages = [];
	var keys = Object.keys(Resources.Images);
	for (var i=0; i<keys.length; i++) {
		var res = Resources.Images[keys[i]];
		var img = new Image();
		img.onload = function() {
			img.res = res;
			loadImage.push(img);
			if (loadimages.length >= keys.length) {
				
			}
		}
		img.src = res.path;
	}
}
Control.loadImage();