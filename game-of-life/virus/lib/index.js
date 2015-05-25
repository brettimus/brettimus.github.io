var d3 = require("d3"),
    Simulation = require("./simulation"),
    Game = require("./game"),
    Grid = require("./grid"),
    Vector = require("./vector");

var w = window.innerWidth,
    h = window.innerHeight;

var gridWidth = 50,
    gridHeight = 50;

global.svg = d3.select("body")
            .append("svg").attr({
                width: w,
                height: h,
            });



map = new Array(gridHeight);
for (var y = 0; y < gridHeight; y++) {
    map[y] = new Array(gridWidth);
    for (var x = 0; x < gridWidth; x++) {
        map[y][x] = !!Math.floor(Math.random()*2);
    }
}

global.sim = (new Simulation(svg, map, 1000)).run(250, 450);
