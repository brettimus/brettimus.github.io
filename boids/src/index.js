var Sky = require("./sky");
var Vector = require("./vector");
var extend = require("./utils").extend;

global.emojiBoids = emojiBoids;

/**
 *
 */
function emojiBoids(selector, options) {
    /**
     * Options include
     * - Emoji subset 
     * - Turns ... TODO
     * - Interval (ms)
     * - Pizza
     */
    selector = selector || "body";
    var container = document.querySelector(selector),
        containerDims = container.getBoundingClientRect();
    var sky,
        defaults = {
            emojis: ["🍕"],
            boids: 120,
            flockTo: new Vector(containerDims.width/2, containerDims.height/2),
            interval: 210,
            turns: null,
            xMin: 0,
            xMax: containerDims.width,
            yMin: 0,
            yMax: containerDims.height,
        };
    options = extend({}, defaults, options);

    sky = new Sky(container, options);

    if (options.turns) {
        sky.moveBoids();
    } else {
        setInterval(function() {
            sky.moveBoids();
        }, options.interval);
    }

    return {
        sky: sky,
    };
}