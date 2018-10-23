
var $;
$ = $ || {};

(function Dragkit($){
	//canvas拖拽组件s
	var is_log = true;
	function Mouse(node) {
		this.state = false;
		this.draglist = [];		//x1, y1, x2, y2, true/false:true means not stop
		this.clicklist = [];	//x, y
		this.addClick = function(e){this.clicklist.push(e);};
		this.addDrag = function(obj, e, delay=10){this.draglist.push([obj, e,delay]);};
		this.off = function(){this.draglist=[];this.clicklist=[];}
		var ms = this;
		node.onmousedown = function (e) {
			ms.state = true;
			ms.t = new Date().getTime();
			ms.lastt = new Date().getTime();
			ms.pos = [e.offsetX, e.offsetY];
		};
		node.onmouseup = function(e) {
			if (ms.state) {
				if (new Date().getTime() - ms.t < 150 || 
						(ms.pos[0]==e.offsetX && ms.pos[1]==e.offsetY)) {
					for(var i=0; i<ms.clicklist.length; i++) {
						ms.clicklist[i](e.offsetX, e.offsetY);
					}
					if(is_log) console.log('click');
				} else {
					for(var i=0; i<ms.draglist.length; i++) {
						ms.draglist[i][1].call(ms.draglist[i][0], 
									ms.pos[0],ms.pos[1],
									e.offsetX, e.offsetY, false);
					}
					if(is_log) console.log('dragdown');
				}
				ms.state = false;
			}
		};
		node.onmousemove = function(e) {
			if (ms.state) {
				var t = new Date().getTime();
				for(var i=0; i<ms.draglist.length; i++) {
					if (t - ms.lastt > ms.draglist[i][2] ) {
						ms.draglist[i][1].call(ms.draglist[i][0], 
									ms.pos[0],ms.pos[1],
									e.offsetX, e.offsetY, true);
					}
				}
				ms.lastt = t;
				if(is_log) console.log('drag');
			}
		};
	}
	$.getMouseState = function(node) {
		return new Mouse(node);
	}
})($);