var Boid  = require("./emoji-boid"),
    range = require("./utils").range;

module.exports = Sky;

// TODO - needs dimensions

/**
 *
 */
function Sky(elt, options) {
    this.boids = null;
    this.bounds = {
        xMin: options.xMin,
        xMax: options.xMax,
        yMin: options.yMin,
        yMax: options.yMax,
    };
    this.canvas = elt;
    this.emojis = options.emojis;
    this.interval = options.interval;
    this.flockTo = options.flockTo;

    this.initialize(options);
}

/**
 *
 */
Sky.prototype.initialize = function(options) {
    this.boids = this.makeBoids(this.emojis, options.boids);
    this.boids.forEach(function(b) {
        b.draw(this.canvas);
    }, this);
};

/**
 *
 */
Sky.prototype.moveBoids = function() {
    window.requestAnimationFrame(function() {
        this.boids.forEach(function(b) {
            window.requestAnimationFrame(function() {
                b.move(this.boids, this.flockTo, this.bounds);
            }.bind(this));
        }, this);
    }.bind(this));
};

/**
 *
 */
Sky.prototype.makeBoids = function(emojis, boidsCount) {
    return range(boidsCount).map(function(seed) {

        var randIndex = Math.floor(Math.random()*this.emojis.length),
            emoji     = this.emojis[randIndex];
        return new Boid(this, emoji, seed);

    }, this);
};