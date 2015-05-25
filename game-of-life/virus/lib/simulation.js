var Game = require("./game"),
    Promise = require("es6-promise").Promise;

module.exports = Simulation;

/**
 * @constructor
 * @param {Game} game
 * @param {Number} iterations
 */
function Simulation(svg, map, options) {
    this.svg = svg;
    this.map = map;
    this.n = options.iterations || 100;
}

Simulation.prototype.run = function(times, wait) {
    times = times || this.n;
    wait  = wait  || 4000;

    this.game = new Game(this.svg, this.map);

    var game = this.game,
        simulationPromise = new Promise(simulation);

    this.promise = simulationPromise.then(success, failure);
    return this;
    
    function simulation(resolve, reject) {
        var count = 1,
            interval = setInterval(function() {
                simulate(count, resolveWrapper, rejectWrapper);
                count++;
            }, wait);
            function resolveWrapper(message) {
                clearInterval(interval);
                resolve(message);
            }
            function rejectWrapper(err) {
                clearInterval(interval);
                reject(err);
            }
    }

    function simulate(count, resolve, reject) {
        var message,
            simError;
        if (count > times) {
            resolve(">>> Simulation complete!");
        }
        else {
            try {
                console.log("Tick");
                game.tick();
            } catch (err) {
                message = "Simulation failed on turn number " + count + ".";
                console.log(message);
                reject(err);
            }
        }
    }
};

function success(message) {
    console.log(message);
}

function failure(err) {
    console.log("Simulation failure. Here's the error: ", err);
}

/**
 * @constructor
 * @extends Error
 * @param {Error} err - Original error
 * @param {String} message - New message
 */
function SimulationError(err, message) {
    this.message = message + "\n Original Error message: " + err.message + "\n";
    this.stack = err.stack;
}
SimulationError.prototype = Object.create(Error.prototype);
SimulationError.prototype.name = "SimulationError";