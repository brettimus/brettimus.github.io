(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
    loadJSON: loadJSON,
};

/**
 * Shallow-copies an arbitrary number of objects' properties into the first argument. Applies "last-in-wins" policy to conflicting property names.
 * @function loadJSON
 * @param {string} path
 * @param {function} success
 * @param {function} error
 */
function loadJSON(path, success, error, context) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        context = context || this;
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success) {
                    success.call(context, JSON.parse(xhr.responseText));
                }
            } else {
                if (error) {
                    error.call(context, xhr);
                }
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
    return xhr;
}
},{}],2:[function(require,module,exports){
module.exports = {
    first: first,
    isArray: isArray,
    randomInArray: randomInArray,
    range: range,
};

/**
 * Returns first element of array to return true in the given predicate function.
 * @function isArray
 * @param {array} ary
 * @param {function} predicate
 * @return {*}
 */
function first(ary, predicate, context) {
    var len = ary.length;
    for (var i = 0; i < len; i++) {
        if (predicate.call(context, ary[i])) {
            return ary[i];
        }
    }
}

/**
 * @function isArray
 * @param {*} o
 * @return {boolean}
 */
function isArray(o) {
    return Object.prototype.toString.call(o) === "[object Array]";
}

/**
 * 
 * @function range
 * @param {number} start
 * @param {number} end
 * @param {number} [step]
 */
function range(start, end, step) {
    step = step || 1;
    var result = [];
    for (;start <= end; start += step) result.push(start);
    return result;
}

/**
 * 
 * @function randomInArray
 * @param {array} ary
 * @return {*}
 */
function randomInArray(ary) {
    return ary[Math.floor(Math.random() * ary.length)];
}
},{}],3:[function(require,module,exports){
module.exports = {
    ajax: require("./ajax"),
    array: require("./array"),
    extend: extend,
    nTimes: nTimes,
    nully: nully,
    replaceAll: replaceAll,
    test: {
        assert: function(bool, message) {
            if (!bool) console.log(message);
        }
    }
};


function nTimes(n, fun) {
    var counter = n;
    if (n <= 0) return;
    while (counter--) fun(n - counter);
}

/**
 * Tests whether value is null or undefined
 * @function esacpeRegExp
 */
function nully(x) {
    return x == null;
}

/**
 * Escapes a string for use in RegExp
 * @function esacpeRegExp
 */
function escapeRegExp(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }

/**
 * Globally replaces a given string in another string
 * @function replaceAll
 * @param {stirng} [options] - RegExp options (like "i").
 **/
function replaceAll(string, toReplace, replaceWith, options) {
    options = options || "";
    var reOpts = "g" + options,
        re     = new RegExp(escapeRegExp(toReplace), reOpts);

    return string.replace(re, replaceWith);
}

/**
 * Shallow-copies an arbitrary number of objects' properties into the first argument. Applies "last-in-wins" policy to conflicting property names.
 * @function extend
 * @param {...Object} o
 */
function extend(o) {
    var args   = [].slice.call(arguments, 0),
        result = args[0];

    for (var i=1; i < args.length; i++) {
        result = extendHelper(result, args[i]);
    }

    return result;
}

/**
 * Shallow-copies one object into another.
 * @function extendHelper
 * @param {Object} destination - Object into which `source` properties will be copied.
 * @param {Object} source - Object whose properties will be copied into `destination`.
 */
function extendHelper(destination, source) {
    // thanks be to angus kroll
    // https://javascriptweblog.wordpress.com/2011/05/31/a-fresh-look-at-javascript-mixins/
    for (var k in source) {
        if (source.hasOwnProperty(k)) {
          destination[k] = source[k];
        }
    }
    return destination;
}
},{"./ajax":1,"./array":2}],4:[function(require,module,exports){
var B = require("boots-utils");

module.exports = Compiler;

/**
 * @constructor
 * @param {string} [open] - margs beginning of template string that's to be evaluated
 * @param {string} [close] - marks end of template string that's to be evaluated
 */
function Compiler(open, close) {
    this.open  = open  || "{{";
    this.close = close || "}}";
}

/**
 * Compiles a string in the given object's context 
 * @method
 */
Compiler.prototype.compile = function(string, object) {
    for (var prop in object) {
        if (object.hasOwnProperty(prop)) {
            string = B.replaceAll(string, this.open+prop+this.close, object[prop]);
        }
    }
    return string;
};
},{"boots-utils":3}],5:[function(require,module,exports){
(function (global){
var Compiler = require("./compiler");
var Template = require("./template");
var BooTemplate = Template;
BooTemplate.Compiler = Compiler;
module.exports = Template;
global.BooTemplate = BooTemplate;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./compiler":4,"./template":6}],6:[function(require,module,exports){
var Compiler = require("./compiler");

module.exports = Template;

/**
 * @constructor
 * @param {string} template - The template string
 * @param {string} [open] - margs beginning of a template value that's to be evaluated
 * @param {string} [close] - marks end of a template value that's to be evaluated
 */
 function Template(template, open, close) {
    this.template = template;
    this.compiler = new Compiler(open, close);
 }

/**
 * Wraps Compiler~compile with the target string scoped to Template~string
 * @method
 * @param {object} o - Ojbect whose values are inserted into the string.
 * @return {string}
 */
 Template.prototype.compile = function(o) {
     return this.compiler.compile(this.template, o);
 };


},{"./compiler":4}],7:[function(require,module,exports){
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

    this.element.style.transition      = "transform "+this.sky.interval+"ms linear"; // TODO config
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
},{"./rules":9,"./utils":11,"./vector":12,"boo-templates":5}],8:[function(require,module,exports){
(function (global){
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
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./sky":10,"./utils":11,"./vector":12}],9:[function(require,module,exports){
var Vector = require("./vector");

module.exports = {
    boundPosition: boundPosition,
    congregate: congregate,
    flock: flock,
    matchVelocity: matchVelocity,
    repel: repel,
};

// move towards the center of mass of emoji boids!
function flock(boid, boids) {
    // calculate the 'perceived' center of mass
    var centerOfMass = _perceivedCenterOfMass(boid, boids);
    // move 1% towards center of mass
    return (centerOfMass.subtract(boid.position)).scale(1 / 100); // TODO configure 100
}

function _perceivedCenterOfMass(boid, boids) {
    var center = boids.reduce(function(result, b) {

        if (boid === b) return result;
        return result.add(b.position);
        
    }, new Vector(0, 0));

    return center.scale(1/(boids.length - 1));
}

// keep away from other emoji boids!
function repel(boid, boids) {
    // TODO configure 10000
    return boids.reduce(function(result, b) {

        if (boid === b)
            return result;
        if (b.position.squaredDistanceFrom(boid.position) < 10000)
            return result.subtract(b.position.subtract(boid.position));

        return result;

    }, new Vector(0,0));
}

// match velocity of nearby emoji boids!
function matchVelocity(boid, boids) {
    var perceivedAvgVelocity = _perceivedVelocity(boid, boids);
    return perceivedAvgVelocity.scale(1/8); // configure 8
}

function _perceivedVelocity(boid, boids) {
    var sumOfVelocities = boids.reduce(function(result, b) {
        if (b === boid) return result;
        return result.add(b.velocity);
    }, new Vector(0,0));

    return sumOfVelocities.scale(1/(boids.length - 1));
}

// have the boids flock towards a particular spot
function congregate(boid, flockTo) {
    return flockTo.subtract(boid.position).scale(1 / 100); //TODO configure
}

function boundPosition(boid, bounds) {
    var result = new Vector(0,0);

    if (boid.position.x < bounds.xMin) {
        result.x = 10;
    }
    else if (boid.position.x > bounds.xMax) {
        result.x = -10;
    }

    if (boid.position.y < bounds.yMin) {
        result.y = 10;
    }
    else if (boid.position.y > bounds.yMax) {
        result.y = -10;
    }
    return result;
}
},{"./vector":12}],10:[function(require,module,exports){
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
},{"./emoji-boid":7,"./utils":11}],11:[function(require,module,exports){
module.exports = {
  extend: extend,
  range: range,
};


/**
 * Shallow-copies an arbitrary number of objects' properties into the first argument. Applies "last-in-wins" policy to conflicting property names.
 * @function extend
 * @param {...Object} o
 */
function extend(o) {
    var args   = [].slice.call(arguments, 0),
        result = args[0];

    for (var i=1; i < args.length; i++) {
        result = extendHelper(result, args[i]);
    }

    return result;
}

/**
 * Shallow-copies one object into another.
 * @function extendHelper
 * @param {Object} destination - Object into which `source` properties will be copied.
 * @param {Object} source - Object whose properties will be copied into `destination`.
 */
function extendHelper(destination, source) {
    // thanks be to angus kroll
    // https://javascriptweblog.wordpress.com/2011/05/31/a-fresh-look-at-javascript-mixins/
    for (var k in source) {
        if (source.hasOwnProperty(k)) {
          destination[k] = source[k];
        }
    }
    return destination;
}


function range(from, to, step) {
    if (arguments.length === 1) {
        return range(0, arguments[0], 1);
    }
    step = step || 1;
    result = [];
    while(to > from) {
      result.push(to);
      to -= step;
    }
    return result;
}
},{}],12:[function(require,module,exports){
module.exports = Vector;

function Vector(x, y) {
    this.x = x;
    this.y = y;
}

Vector.prototype.add = function(v) {
    return new Vector(this.x + v.x, this.y + v.y);
};

Vector.prototype.subtract = function(v) {
    return new Vector(this.x - v.x, this.y - v.y);
};

Vector.prototype.scale = function(k) {
    return new Vector(this.x * k, this.y * k);
};

Vector.prototype.distanceFrom = function(v) {
    return Math.sqrt(sq(this.x - v.x) + sq(this.y - v.y));
};

Vector.prototype.squaredDistanceFrom = function(v) {
    return sq(this.x - v.x) + sq(this.y - v.y);
};

function sq(n) {
    return Math.pow(n, 2);
}
},{}]},{},[8]);
