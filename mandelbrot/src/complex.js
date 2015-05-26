var Vector = require("./vector");

/**
 * Creates a complex number
 * @constructor
 * @extends Vector
 * @param {number} x - The real part
 * @param {number} y - The imaginary part
 */
function Complex(x, y) {
    Vector.call(this, x, y);
}
Complex.prototype = Object.create(Vector.prototype);

/**
 * Multiplies two complex numbers.
 * @method
 * @return {Complex}
 */
Complex.prototype.times = function(other) {
    var newX = this.x*other.x - this.y*other.y,
        newY = this.x*other.y + this.y*other.x;
    return new Complex(newX, newY);
};

/**
 * Squares the instance of Complex
 * @method
 * @return {Complex}
 */
Complex.prototype.square = function() {
    return this.times(this);
};

/**
 * @prop {number} length
 * @this Complex
 * @instance
 * @readonly
 */
Object.defineProperty(Complex.prototype, "length", {
    get: function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
});

/**
 * More computationally efficient than Complex.length
 * @prop {number} squareLength
 * @this Complex
 * @instance
 * @readonly
 */
Object.defineProperty(Complex.prototype, "squareLength", {
    get: function() {
        return this.x * this.x + this.y * this.y;
    }
});