module.exports = Vector;

/**
 * A set of (x,y) coordinates in space.
 * @constructor
 * @param {number} x - x-coordinate
 * @param {number} y - y-coordinate
 */
function Vector(x, y) {
    this.x = x;
    this.y = y;
}

/**
 * Vector addition. Returns a new Vector that is the result of adding another Vector to the calling Vector object.
 * @method
 * @param {Vector} vector
 * @returns {Vector}
 */
Vector.prototype.plus = function plus(w) {
    return new Vector(this.x + w.x, this.y + w.y);
};