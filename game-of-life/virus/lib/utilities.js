
/**
 * Uniformly samples a random element from an Array.
 * @function randomElement
 * @param {Array} array
 * @return {*}
 */
module.exports.randomElement = function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
};

/**
 * Checks whether a value is null or undefined.
 * @function isNully
 * @param {*} value
 * @return {Boolean}
 */
function isNully(value) {
    return value == null;
}
module.exports.isNully = isNully;