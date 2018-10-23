
learningmusic.ableton.com

var $;
$ = $ || {};
(function Mat2dkit($) {
	//2D变换组件
	// rotate 逆时针
	function Mat() {
		this.type = 'Mat';
		this.get = function (x, y) {
			if (x>2 || x<0 || y>2 || y<0) throw new Error('矩阵访问失败');
			return this.array[x*3+y];
		}
		this.set = function (x, y, value) {
			if (x>2 || x<0 || y>2 || y<0) throw new Error('矩阵访问失败');
			this.array[x*3+y] = value;
		}
		this.mul = function (mat) {
			var res = new Mat();
			for (let i=0; i<3; i++) {
				for (let j=0; j<3; j++) {
					res.set(i,j,this.get(i,0)*mat.get(0,j)+this.get(i,1)*mat.get(1,j)+this.get(i,2)*mat.get(2,j));
				}
			}
			return res;
		}
		this.tran = function(a,b) {return new Mat('tran',a,b).mul(this);}
		this.rotate = function(radian) {return new Mat('rotate',radian).mul(this);}
		this.symX = function() {return (new Mat('symX')).mul(this);}
		this.symY = function() {return (new Mat('symY')).mul(this);}
		this.log = function () {
			console.log(this.array.slice(0,3).join(' ')+'\n'+
				this.array.slice(3,6).join(' ')+'\n'+
				this.array.slice(6,9).join(' ')+'\n');
		}
		this.array = new Array(9);
		for (let i=0; i<9; i++) this.array[i] = 0;
		this.set(0,0,1);
		this.set(1,1,1);
		this.set(2,2,1);
		if (arguments.length > 0) {
			if (arguments[0] == 'tran') {
				this.set(0,2,arguments[1] || 0);
				this.set(1,2,arguments[2] || 0);
			} else if (arguments[0] == 'rotate') {
				var radian = arguments[1] || 0;//Math.PI*(arguments[1] || 0)/180;
				var sin = Math.sin(radian);
				var cos = Math.cos(radian);
				this.set(0,0,cos);
				this.set(0,1,-sin);
				this.set(1,0,sin);
				this.set(1,1,cos);
			} else if (arguments[0] == 'symX') {
				this.set(0,0,1);
				this.set(1,1,-1);
				
			} else if (arguments[0] == 'symY') {
				this.set(0,0,-1);
				this.set(1,1,1);
			}
		}
	}
	//$.Mat = Mat;
	$.tran = function(dx,dy){return new Mat('tran', dx,dy);};
	$.rotate = function(radian){return new Mat('rotate', radian);};
	$.symX = function(){return new Mat('symX');};
	$.symY = function(){return new Mat('symY');};
	function leftmul(point, mat) {
		if (!(point instanceof Array) || point.length>2) throw new Error('point应是长度为2的Array');
		var x = mat.get(0,0)*point[0]+mat.get(0,1)*point[1]+mat.get(0,2)*1;
		var y = mat.get(1,0)*point[0]+mat.get(1,1)*point[1]+mat.get(1,2)*1;
		return [x,y];
	}
	Array.prototype.tran = function(dx,dy){return leftmul(this,new Mat('tran',dx,dy));};
	Array.prototype.rotate = function(radian){return leftmul(this,new Mat('rotate',radian));};
	Array.prototype.symX = function(){return leftmul(this,new Mat('symX'));};
	Array.prototype.symY = function(){return leftmul(this,new Mat('symY'));};
	Array.prototype.shape = function(mat){return leftmul(this, mat);};
	Array.prototype.log = function(){console.log(this);};
})($);







