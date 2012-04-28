var util = (function() {

Function.prototype.method = function (fname, func) {
    this.prototype[fname] = func;
    return this;
};

Array.prototype.forEach = function(func) {
    for (var i = 0; i < this.length; i++) {
        func(this[i]);
    }
    return this;
};

Array.prototype.last = function() {
    return this[this.length - 1];
};

Array.prototype.foldl = function(func, base) {
    var ans = base;
    this.forEach(function(ele) {
        ans = func(ele, ans);
    });
    return ans;
}

})();
