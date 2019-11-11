(function _addSeededRandom2Math() {
    Math._seed = 5;
    Math.setSeed = function(s) {
        Math._seed = s;
    };
    Math.seededRandom = function(min, max) {
        max = (max || 1) + 1;
        min = min || 0;
        Math._seed = (Math._seed * 9301 + 49297) % 233280;
        var rnd = Math._seed / 233280.0;
        return Math.floor(min + rnd * (max - min));
    };
    Math.Random = function(min, max) {
        max++;
        return Math.floor(min + Math.random() * (max - min));
    };
    Math.shuffle = function(arr) {
        var len = arr.length,
            tmp;
        if (len <= 1) return;
        for (var i = 0; i < len; i++) {
            let aim = Math.seededRandom(0, len - 1);
            tmp = arr[i];
            arr[i] = arr[aim];
            arr[aim] = tmp;
        }
        return arr;
    };
    Array.prototype.back = function() {
        if (!this.length) return null;
        return this[this.length - 1];
    }
})();

(function _addRemove2Array() {
    Array.prototype.indexOf = function(val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) return i;
        }
        return -1;
    };
    Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };
    Array.prototype.uniquePush = function(val) {
        if (this.indexOf(val) < 0) {
            this.push(val);
        }
    };
    String.prototype.startWith = function(str) {
        var reg = new RegExp("^" + str);
        return reg.test(this);
    }
    String.prototype.endWith = function(str) {
        var reg = new RegExp(str + "$");
        return reg.test(this);
    }
})();

function delHtmlTag(str) {
    return str.replace(/<[^>]+>/g, "");
}