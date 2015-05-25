var directions = require("./directions").directions,
    charFromElement = require("./utilities").charFromElement,
    randomElement = require("./utilities").randomElement,
    isNully = require("./utilities").isNully;

module.exports = View;


/**
 * Inspects the surroundings (8 neighboring squares) of a square.
 * @constructor
 * @param {Grid} grid - The grid on which the view
 * @param {Vector} vector - The current square from which to inspect the View.grid.
 */
function View(game, vector) {
    this.game = game;
    this.vector = vector;
}

/**
 * Returns whether cell in given direction is alive. Out-of-bounds returns false.
 * @method
 * @param {string} direction - The direction in which to look.
 * @return {Bool}
 */
View.prototype.lookAlive = function(dir) {
    var target = this.vector.plus(directions[dir]);
    if (this.game.grid.isInside(target)) {
        return this.game.grid.get(target).alive;
    }
    else {
        // TODO wrap around the board
        return false;
    }
};

/**
 * Returns whether cell in given direction is infected. Out-of-bounds returns false.
 * @method
 * @param {string} direction - The direction in which to look.
 * @return {Bool}
 */
View.prototype.infected = function(dir) {
    var target = this.vector.plus(directions[dir]);
    if (this.game.grid.isInside(target)) {
        return this.game.grid.get(target).infected;
    }
    else {
        // TODO wrap around the board
        return false;
    }
};


/**
 * Returns a count of all living neighbor cells and whether there exists an infected neighbor (alive or dead).
 * @method
 * @return {Object}
 */
View.prototype.neighbors = function() {
    var aliveCount = 0,
        dir,
        infected;

    for (dir in directions) {
        if (this.lookAlive(dir)) {
            aliveCount ++;
        }
        if (this.infected(dir)) {
            infected = true;
        }
    }
    return {
        alive: aliveCount,
        infected: infected
    };
};

/**
 * Returns a count of living neighbor cells.
 * @method
 * @return {number}
 */
View.prototype.livingNeighborsCount = function() {
    var aliveCount = 0,
        dir;
    for (dir in directions) {
        if (this.lookAlive(dir)) {
            aliveCount ++;
        }
    }
    return aliveCount;
};

/**
 * Returns whether there exist infected neighbor cells.
 * @method
 * @return {number}
 */
View.prototype.hasInfectedNeighbor = function() {
    var dir;
    for (dir in directions) {
        if (this.infected(dir)) {
            return true;
        }
    }
    return false;
};

/**
 * Returns whether there exist living infected neighbor cells.
 * @method
 * @return {number}
 */
View.prototype.hasInfectedLivingNeighbor = function() {
    var dir;
    for (dir in directions) {
        if (this.infected(dir) && this.lookAlive(dir)) {
            return true;
        }
    }
    return false;
};