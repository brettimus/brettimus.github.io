var Vector = require("./vector");

module.exports = Grid;

/**
 * The two-dimensional space in which life exists for a given World. The top left square in a grid is (0,0). Internally, values are stored in an Array of length Grid.width*Grid.height.
 * @constructor
 * @param {number} width - Width of grid instance in ...units.
 * @param {number} height - Height of grid instance in ...units.
 * @property {string[]} space - The contents of a grid instance. Units.
 *
 */
function Grid(width, height) {
    this.width = width;
    this.height = height;
    this.space = new Array(width*height);
}

/**
 * Given a Vector, returns whether that Vector lies within the boundaries of the grid.
 * @method
 * @param {Vector} 
 * @returns {Boolean}
 */
Grid.prototype.isInside = function(vector) {
    return vector.x >= 0 && vector.x < this.width &&
            vector.y >= 0 && vector.y < this.height;
};

/**
 * Retrieves the value of a square on the Grid.
 * @method
 * @param {Vector} vector - A coordinate
 * @return {String}
 */
Grid.prototype.get = function(vector) {
    var i = this._indexFromVector(vector);
    return this.space[i];
};

/**
 * Sets the value of a square on the Grid.
 * @method
 * @param {Vector} vector - Position of a Grid square.
 * @param {string} value - Contents of a Grid square, one character.
 */
Grid.prototype.set = function(vector, value) {
    var i = this._indexFromVector(vector);
    this.space[i] = value;
};

 /**
  * Iterates over every square in the Grid. Starts at (0,0) and moves across rows left-to-right.
  * @method
  * @param {function} f
  * @param {object} context
  */
Grid.prototype.forEach = function(f, context) {
    var x,
        y;
    for (y = 0; y < this.height; y++) {
      for (x = 0; x < this.width; x++) {
          var vector = new Vector(x, y),
              i = this._indexFromVector(vector),
              value = this.space[i];

          if (value != null) f.call(context, value, vector);
        }
    }
};

 /**
  * Iterates over every square in the Grid and returns a new Grid of matching stuff.
  * @method
  * @param {function} f
  * @param {object} context
  */
Grid.prototype.filter = function(f, context) {
    var x,
        y,
        result = new Grid(this.width, this.height);
    for (y = 0; y < this.height; y++) {
        for (x = 0; x < this.width; x++) {
            var vector = new Vector(x, y),
                i = this._indexFromVector(vector),
                value = this.space[i];

            if (value != null) {
                if (f.call(context, value, vector)) {
                    result.set(vector, value);
                }
            }
        }
    }
    return result;
};

 /**
  * Helper that finds an index for a given Vector's value within the internal Grid.space property.
  * @method
  * @access private
  * @param {Vector} vector
  * @return number
  */
  Grid.prototype._indexFromVector = function(vector) {
    return vector.x + this.width * vector.y;
  };