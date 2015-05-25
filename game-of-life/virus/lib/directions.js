/** @module directions */
var Vector = require("./vector");

/**
 * @static
 */
var directionNames = "n ne e se s sw w nw".split(" ");

/**
 * @static
 */
module.exports.directions = {
    "n" : new Vector( 0, -1),
    "ne": new Vector( 1, -1),
    "e" : new Vector( 1,  0),
    "se": new Vector( 1,  1),
    "s" : new Vector( 0,  1),
    "sw": new Vector(-1,  1),
    "w" : new Vector(-1,  0),
    "nw": new Vector(-1, -1),
};

module.exports.names = directionNames;

/**
 * Computes relative direction from a given direction, looking (45*n) degrees clockwise.
 * @example dirplus("n", 1) = "ne";
 * @function dirPlus
 * @access public
 * @param {string} dir - Starting direction.
 * @param {number} n
 */
module.exports.dirPlus = function(dir, n) {
    var index = directionNames.indexOf(dir);
    return directionNames[(index + n + 8) % 8];
};
