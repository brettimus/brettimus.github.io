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