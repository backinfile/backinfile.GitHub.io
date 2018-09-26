

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
	this.getAllvalues = function () {
		var values = [];
		var queue = [this];
		while(queue.length) {
			var node = queue.shift();
			if (node) {
				values.push(node.value);
				queue.push(node.left);
				queue.push(node.right);
			} else {
				values.push(null);
			}
		}
		return values;
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

var r = 20;
var dist = 40;
var $canvas = $('canvas');
var width = $canvas.width();
var height = $canvas.height();
var startpos = [width/2, r];
var Animation = {
	list: [],
	lastpos: {},
	lastdepths: {},
	push: function(state) {this.list.push(state);},
	init: function(nums, trees) {this.nums = nums; this.trees=trees;},
	start: function () {
		this.initdraw();
		function loop() {
			if (!Animation.list.length) return;
			var state = Animation.list[1];
			// animation ////////////////////////////////////
			var unitSize = width/state.length;
			for (var i=0; i<state.length; i++) {
				console.log(state[i]);
				var pos = [[width/3/2+width/3*i, r]];
				var depths = new Array(state[i].length);
				for (var j=state[i].length-1; j>=0; j--) depths[j]=0;
				for (var j=state[i].length-1; j>=0; j--) {
					if (state[i][j] === null) continue;
					depths[j] = Math.round(depths[j]);
					if (j>0) {
						if (j%2) depths[Math.round((j-1)/2)] += 0.5; 
						else depths[Math.round((j-2)/2)] += 0.5;
					}
				}
				console.log('depths', depths);
				for (var j=0; j<state[i].length; j++) {
					if (state[i][j] === null) continue;
					console.log(pos);
					var depth = 1;	///////////////////////////////////////////////
					pos[2*j+1] = [pos[j][0]-Animation.getoffsetX(depth), pos[j][1]+Animation.getoffsetY(depth)];
					pos[2*j+2] = [pos[j][0]+Animation.getoffsetX(depth), pos[j][1]+Animation.getoffsetY(depth)];
					var lastpos = Animation.lastpos[state[i][j]];
					$canvas.animateLayerGroup('Gtree'+state[i][j], {
						x: '+='+(pos[j][0]-lastpos[0]),
						y: '+='+(pos[j][1]-lastpos[1])
					}, 'fast');
				}
			}
			
			//setInterval(loop, 500);
		}
		setTimeout(loop, 500);
	},
	initdraw: function() {
		var sin = this.getSin(1);
		var cos = this.getCos(1);
		function draw(tree) {
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
		}
		for (var i=0; i<this.nums.length; i++) {
			this.trees[i].pos = [r, r+r*2*i];
			draw(this.trees[i]);
			this.lastpos[this.nums[i]] = [r, r+r*2*i];
			this.lastdepths[i] = 0;
		}
	},
	getSin: function(depth) {
		return (r*Math.pow(2,depth)-r)/(2*r+dist);
	},
	getCos: function(depth) {
		return Math.sqrt(1-Math.pow(this.getSin(depth), 2));
	},
	getoffsetY: function(depth) {
		return (2*r+dist)*this.getCos(depth);
	},
	getoffsetX: function(depth) {
		return (2*r+dist)*this.getSin(depth);
	}
};

var nums = [4,2,3,1];
var trees = new Array(nums.length);
for (var i=0; i<nums.length; i++) {
	trees[i] = new Tree(nums[i]);
}
var head = trees[0];

Animation.init(nums,trees);

for (var i=1; i<nums.length; i++) {
	head.insertBS(trees[i]);
	//console.log(head);
	Animation.push(getState(nums, trees));
}

function getState(nums, trees) {
	var foot = [];
	var ret = [];
	for (var i=0; i<nums.length; i++) {
		if (trees[i].left) foot[nums.indexOf(trees[i].left.value)] = true;
		if (trees[i].right)foot[nums.indexOf(trees[i].right.value)] = true;
	}
	for (var i=0; i<nums.length; i++) {
		if (foot[i]) continue;
		ret.push(trees[i].getAllvalues());
	}
	return ret;
}


Animation.start();



