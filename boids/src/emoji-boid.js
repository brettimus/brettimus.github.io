var Vector = require("./vector"),
    rules  = require("./rules");

var BooTemplate       = require("boo-templates"),
    transformTemplate = new BooTemplate("{{operator}}({{operand}})"),
    range = require("./utils").range;

module.exports = Boid;

/**
 *
 */
function Boid(sky, emoji, seed, bounds) {
    this.sky     = sky;
    this.element = null;
    this.emoji   = emoji;

    this.initialize(seed, this.sky.bounds);
}

Boid.prototype.draw = function(elt) {
    elt.appendChild(this.element);
};

/**
 *
 */
Boid.prototype.initialize = function(seed, bounds) {
    //  TODO config starting
    var x = Math.floor(Math.random()*(bounds.xMax - bounds.xMin)) + bounds.xMin + this.sky.flockTo.x;
    var y = Math.floor(Math.random()*(bounds.yMax - bounds.yMin)) + bounds.yMin + this.sky.flockTo.y;
    this.position = new Vector(x, y);
    this.velocity = new Vector(0, 0);

    this.element = document.createElement("span");
    this.element.innerHTML = this.emoji;

    this.element.style.position        = "absolute";
    this.element.style.top             = y;
    this.element.style.left            = x;

    this.element.style.transition      = "transform "+this.sky.interval+"ms ease-in-out"; // TODO config
    this.element.style.transform       = "";
    this.element.style.webkitTransform = "";
};

/**
 *
 */
Boid.prototype.move = function(boids, flockTo) {
    var moveDiff = this.moveDiff(boids, flockTo),
        x = moveDiff.x,
        y = moveDiff.y;

    this.velocity = this.velocity.add(moveDiff);
    this.position = this.position.add(this.velocity);

    // window.requestAnimationFrame(function() {
        this.translate(x, y);
    // }.bind(this));
};

/**
 *
 */
Boid.prototype.moveDiff = function(boids, flockTo, bounds) {
    var v1 = rules.flock(this, boids),
        v2 = rules.repel(this, boids),
        v3 = rules.matchVelocity(this, boids),
        v4 = rules.congregate(this, flockTo),
        v5 = rules.boundPosition(this, this.sky.bounds);

    return v1.add(v2.add(v3.add(v4.add(v5))));
};

/**
 *
 */
Boid.prototype.translate = function(x, y, z) {
    z = z || 0;
    var translateString = transformTemplate.compile({
        operator: "translate3d",
        operand : [x + "px", y+"px", z+"px"],
    });

    this.element.style.webkitTransform += translateString;
    this.element.style.transform       += translateString;
};