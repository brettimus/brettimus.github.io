module.exports = Vector;

function Vector(x, y) {
    this.x = x;
    this.y = y;
}

Vector.prototype.add = function(v) {
    return new Vector(this.x + v.x, this.y + v.y);
};

Vector.prototype.subtract = function(v) {
    return new Vector(this.x - v.x, this.y - v.y);
};

Vector.prototype.scale = function(k) {
    return new Vector(this.x * k, this.y * k);
};

Vector.prototype.distanceFrom = function(v) {
    return Math.sqrt(sq(this.x - v.x) + sq(this.y - v.y));
};

Vector.prototype.squaredDistanceFrom = function(v) {
    return sq(this.x - v.x) + sq(this.y - v.y);
};

function sq(n) {
    return Math.pow(n, 2);
}