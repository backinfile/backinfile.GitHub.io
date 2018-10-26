
var $;
$ = $ || {};

(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime +  timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

(function ($) {
	var functions = [];
	var last_time = 0;
	var cur_time = 0;
	var delta = 0;
	(function animloop(time){
	  requestAnimationFrame(animloop);
	  last_time = cur_time;
	  cur_time = time;
	  if (last_time>0 && cur_time>0)
		  delta = cur_time-last_time;
	  for (var i=0; i<functions.length; i++) {
		  functions[i](delta);
	  }
	})(0);
	$.animationFrame = function(func) {
		functions.push(func);
	}
})($);

