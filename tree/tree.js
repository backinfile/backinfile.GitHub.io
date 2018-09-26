/* 
var game = null;

$(function() {
	$canvas = $('canvas');
	var width = $canvas.width();
	var height = $canvas.height();
	var r = 20;
	var dist = 40;
	var startpos = [width/2, r];
	var trans = [0,0];
	
	function Tree(value) {
		this.pos = [0,0];
		this.value = value;
		this.child = [null, null];
		this.balance = 0;
		this.setLeft = function(tree){this.child[0] = tree;}
		this.setRight = function(tree){this.child[1] = tree;}
		this.getLeft = function(){return this.child[0];}
		this.getRight = function(){return this.child[1];}
		this.layerid = ['tree'+value,'Ttree'+value,'Ltree'+value,'Rtree'+value,'Gtree'+value];
		this.draw = function(deep) {
			var angle = 30;
			var radian = Math.PI*angle/180;
			$canvas.drawArc({
				layer:true,
				name:this.layerid[0],
				groups:[this.layerid[4]],
				x:this.pos[0]+trans[0],
				y:this.pos[1]+trans[1],
				radius:r,
				fillStyle:'#999'
			});
			var text = this.value+'';
			$canvas.drawText({
				layer:true,
				name:this.layerid[1],
				groups:[this.layerid[4]],
				strokeStyle: '#555',
				strokeWidth: 2,
				x: this.pos[0]+trans[0], 
				y: this.pos[1]+trans[1],
				fontSize: r,
				fontFamily: 'Verdana, sans-serif',
				text: text
			});
			$canvas.drawRect({
				layer:true,
				name:this.layerid[2],
				groups:[this.layerid[4]],
				fillStyle: '#AAA',
				width:10, 
				height: dist,
				x: this.pos[0]+trans[0]-r*Math.sin(radian)-dist*Math.sin(radian)/2, 
				y: this.pos[1]+trans[1]+r*Math.cos(radian)+dist*Math.cos(radian)/2,
				//rotate:30,
				visible:true
			});
			$canvas.drawLine({
				layer:true,
				name:this.layerid[3],
				groups:[this.layerid[4]],
				strokeStyle: '#AAA',
				strokeWidth: 10,
				x1: this.pos[0]+trans[0]+r*Math.sin(radian), 
				y1: this.pos[1]+trans[1]+r*Math.cos(radian),
				x2: this.pos[0]+trans[0]+r*Math.sin(radian)+dist*Math.sin(radian), 
				y2: this.pos[1]+trans[1]+r*Math.cos(radian)+dist*Math.cos(radian),
				visible:true
			});
		}
	}
	
	function Game() {
		var nums = [5,2,4,3];
		for (var i=0; i<nums.length; i++) {
			var t = new Tree(nums[i]);
			t.pos = [r,r+2*r*i];
			t.draw();
		}
		$canvas.animateLayerGroup('Gtree'+5, {
			x:startpos[0],
			y:startpos[1]
		},'slow');
		$canvas.animateLayerGroup('Gtree'+5, {
			x:'+='+startpos[0],
			y:'+='+startpos[1]
		},'slow');
		$canvas.animateLayer('Ltree'+4, {
			x:600,
			y:400
		},'slow');
		$canvas.animateLayer('tree'+4, {
			x:600,
			y:400
		},'slow');
		$canvas.drawArc({
			layer:true,
			x:600,
			y:400,
			radius:10,
			fillStyle:'black'
		});
		var t = new Tree(10);
		t.pos = [400,400];
		t.draw();
		
	};
	Game();
});
 */
 
var r = 20;
var dist = 40;
var sin = Math.sin(Math.PI/4);
var cos = Math.cos(Math.PI/4);
var $canvas = $('canvas');
var width = $canvas.width();
var height = $canvas.height();
var startpos = [width/2, r];
var sins = [Math.sin(Math.PI/7),Math.sin(Math.PI/6),Math.sin(Math.PI/5),Math.sin(Math.PI/4)];
var coss = [Math.cos(Math.PI/7),Math.cos(Math.PI/6),Math.cos(Math.PI/5),Math.cos(Math.PI/4)];

function Tree(value) {
	this.value = value;
	this.depth = 1;
	this.left = null;
	this.right = null;
	this.getAllnodes = function (nodes=null) {
		nodes = nodes || [];
		nodes.push(this);
		if (this.left) this.left.getAllnodes(nodes);
		if (this.right) this.right.getAllnodes(nodes);
		return nodes;
	}
	this.setdepth = function() {
		this.depth = 0;
		if (this.left) this.depth = Math.max(this.depth, this.left.depth);
		if (this.right)this.depth = Math.max(this.depth, this.right.depth);
		this.depth++;
	}
	this.getBalance = function() {
		var left = 0;
		var right = 0;
		if (this.left) left = this.left.depth;
		if (this.right)right= this.right.depth;
		return right-left;
	}
	this.insertOri = function(tree) {
		var value = tree.value;
		if (value == this.value) return true;
		if (value < this.value) {
			if (this.left) 
				return this.left.insert(tree);
			this.left = tree;
			return true;
		} else {
			if (this.right) 
				return this.right.insert(tree);
			this.right = tree;
			return true;
		}
	}
	this.insertBS = function(tree) {	
		var value = tree.value;
		if (value == this.value) return;
		if (value < this.value) {
			if (this.left) this.left.insertBS(tree);
			else this.left = tree;
		} else {
			if (this.right)this.right.insertBS(tree);
			else this.right = tree;
		}
		this.setdepth();
	}
	this.insertBSAM = function(tree) {	
		var value = tree.value;
		if (value == this.value) return;
		if (value < this.value) {
			if (this.left) this.left.insertBSAM(tree);
			else {
				this.left = tree;
				Animation.push(['tree',[tree,tree.pos, Animation.getLeftpos(this)]]);
			}
		} else {
			if (this.right)this.right.insertBSAM(tree);
			else {
				this.right = tree;
				Animation.push(['tree',[tree,tree.pos, Animation.getRightpos(this)]]);
			}
		}
		var olddepth = this.depth;
		this.setdepth();
		if (this.depth != olddepth) {
			
		}
	}
	this.adjust = function() {	// return the new head tree
		if (Math.abs(this.getBalance()) <= 1) return this;
		if(this.left) this.left = this.left.adjust();
		if(this.right) this.right = this.right.adjust();
		this.setdepth();
		if (this.getBalance() < 0) {
			if (this.left.getBalance() > 0) {
				var left = this.left;
				var leftright = this.left.right;
				var leftrightleft = this.left.right.left;
				var leftrightright = this.left.right.right;
				var head = leftright;
				head.left = left;
				head.right = this;
				head.right.left = leftrightright;
				head.left.right = leftrightleft;
				head.left.setdepth();
				head.right.setdepth();
				head.setdepth();
				return head;
			} else {
				var left = this.left;
				var leftright = this.left.right;
				var head = left;
				head.right = this;
				head.right.left = leftright;
				head.right.setdepth();
				head.setdepth();
				return head;
			}
		} else {
			if (this.right.getBalance() > 0) {
				var right = this.right;
				var rightleft = this.right.left;
				var head = right;
				head.left = this;
				head.left.right = rightleft;
				head.left.setdepth();
				head.setdepth();
				return head;
			} else {
				var right = this.right;
				var rightleft = this.right.left;
				var rightleftright = this.right.left.right;
				var rightleftleft = this.right.left.left;
				var head = rightleft;
				head.right = right;
				head.left = this;
				head.left.right = rightleftleft;
				head.right.left = rightleftright;
				head.right.setdepth();
				head.left.setdepth();
				head.setdepth();
				return head;
			}
		}
	}
}

var Animation = {
	animationList: [],
	depthList: [],
	getLeftpos: function(tree) {
		var pos = tree.pos;
		return [pos[0]-(2*r+dist)*sin, pos[1]+(2*r+dist)*cos];
	},
	getRightpos: function(tree) {
		var pos = tree.pos;
		return [pos[0]+(2*r+dist)*sin, pos[1]+(2*r+dist)*cos];
	},
	getSinCosBydepth: function(depth) {
		var sin = (r*Math.pow(2,depth))/(2*r+dist);
		var cos = Math.sqrt(1-sin*sin);
		return [sin, cos];
	},
	createDepthList: function() {
		this.depthList = [];
	},
	addToDepthList: function(ani) {
		this.depthList.push(ani);
	},
	closeDepthList: function() {
		this.push(['depth', this.depthList]);
	},
	draw:function(tree) {
		var value = tree.value;
		var layerid = ['tree'+value,'Ttree'+value,'Ltree'+value,'Rtree'+value,'Gtree'+value];
		var pos = tree.pos;
		$canvas.drawArc({
			layer:true,
			name:layerid[0],
			groups:[layerid[4]],
			x:pos[0],
			y:pos[1],
			radius:r,
			fillStyle:'#999'
		});
		var text = value+'';
		$canvas.drawText({
			layer:true,
			name:layerid[1],
			groups:[layerid[4]],
			strokeStyle: '#555',
			strokeWidth: 2,
			x: pos[0], 
			y: pos[1],
			fontSize: r,
			fontFamily: 'Verdana, sans-serif',
			text: text
		});
		$canvas.drawLine({
			layer:true,
			name:layerid[2],
			groups:[layerid[4]],
			strokeStyle: '#AAA',
			strokeWidth: 10,
			x1: pos[0]-r*sin, 
			y1: pos[1]+r*cos,
			x2: pos[0]-r*sin-dist*sin, 
			y2: pos[1]+r*cos+dist*cos,
			visible:true
		});
		$canvas.drawLine({
			layer:true,
			name:layerid[3],
			groups:[layerid[4]],
			strokeStyle: '#AAA',
			strokeWidth: 10,
			x1: pos[0]+r*sin, 
			y1: pos[1]+r*cos,
			x2: pos[0]+r*sin+dist*sin, 
			y2: pos[1]+r*cos+dist*cos,
			visible:true
		});
	},
	push:function(ani) {
		Animation.animationList.push(ani);
		//console.log('push',ani)
	},
	animate: function(ani, callback) {
		var tree = ani[0];
		if (ani[1] == 'left'){
			$canvas.setLayer('Ltree'+tree.value, {
				visible:ani[2]
			}).drawLayers();
			if (callback) callback();
		} else if (ani[1] == 'right') {
			$canvas.setLayer('Rtree'+tree.value, {
				visible:ani[2]
			}).drawLayers();
			if (callback) callback();
		} else {
			var flag = 0;
			$canvas.animateLayerGroup('Gtree'+tree.value,{
				x:'+='+(ani[2][0]-ani[1][0]),
				y:'+='+(ani[2][1]-ani[1][1])
			}, {
				duration: 'slow',
				complete: function(){
					flag += 1;
					if (flag == 4) {
						if (callback) callback();
					}
				}
			});
		}
	},
	depthAnimate: function (props, callback) {
		// props[0] == 'depth'
		console.log(props);
		var flag = 0;
		var cnt = 0;
		for (var i=0; i<props[1].length; i++) {
			var prop = props[1][i];
			var value = prop[0].value;
			if (typeof(prop[1]) == 'string') {
				var layerid = 'Ltree'+value;
				if (prop[1] == 'right') layerid = 'Rtree'+value;
				if (prop[2] === true || prop[2] === false) {
					$canvas.setLayer(layerid, {
						visible: prop[2]
					});
				} else {
					cnt++;
					$canvas.animateLayer(layerid, {
						x2: '+='+prop[3][0],
						y2: '+='+prop[3][1],
					}, {
						duration: 'slow',
						complete: function(){
							flag += 1;
							if (flag == cnt) {
								if (callback) callback();
							}
						}
					});
				}
			} else {
				var startpos = prop[1];
				var endpos = prop[2];
				var movepos = [endpos[0]-startpos[0], endpos[1]-startpos[1]];
				//console.log('endpos',startpos);
				cnt += 4;
				$canvas.animateLayer('Gtree'+value, {
					x: '+='+movepos[0],
					y: '+='+movepos[1]
				}, {
					duration: 'slow',
					complete: function(){
						flag += 1;
						if (flag == cnt) {
							if (callback) callback();
						}
					}
				});
			} 
		}
		if (!cnt) {
			if (callback) callback();
		}
	},
	treeAnimate: function (props, callback) {
		// prop[0] == 'tree'
		console.log('tree',prop);
		var prop = props[1];
		var tree = prop[0];
		var startpos = prop[1];
		var endpos = prop[2];
		var movepos = [endpos[0]-startpos[0], endpos[1]-startpos[1]];
		var trees = tree.getAllnodes();
		var flag = 0;
		for (var i=0; i<trees.length; i++) {
			trees[i].pos = [trees[i].pos[0]+movepos[0], trees[i].pos[1]+movepos[1]];
			$canvas.animateLayerGroup('Gtree'+trees[i].value, {
				x: '+='+movepos[0],
				y: '+='+movepos[1]
			}, {
				duration: 'slow',
				complete: function(){
					flag += 1;
					if (flag == 4*trees.length) {
						if (callback) callback();
					}
				}
			});
		}
	},
	
	start: function() {
		function animationLoop() {
			//console.log(Animation.animationList);
			if (Animation.animationList.length) {
				var ani = Animation.animationList.shift();
				if (ani[0] == 'depth')
					Animation.depthAnimate(ani, animationLoop);
				else 
					Animation.treeAnimate(ani, animationLoop);
			} else {
				setTimeout(animationLoop, 500);
			}
		}
		animationLoop();
	},
};



//var nums = [10, 1, 20, -5, 5, 15, 25, 3, 8, 9];
//var nums = [10, 1, 20, -5, -7];
var nums = [10, 15, 8, 13,18, 17,5,3];

var trees = new Array(nums.length);

for (var i=0; i<nums.length; i++) { 
	trees[i] = new Tree(nums[i]);
	trees[i].pos = [r,r+2*r*i];
	Animation.draw(trees[i]);
}
var head = trees[0];
Animation.push(['tree', [head,head.pos,startpos]]);
for (var i=1; i<trees.length; i++) {
	head.insertBSAM(trees[i]);
	//head = head.adjust();
	//console.log(i);
}
Animation.start();
console.log(head);

//Animation.depthAnimate(['depth', [[head, head.pos,[100,100]]]], function(){console.log('done!');});
