module.exports = Game;

var Grid = require("./grid"),
    Cell = require("./cell"),
    Vector = require("./vector"),
    View = require("./view"),
    isNully = require("./utilities").isNully;

/**
 * A basic Game that is built to handle evolution of its squares.
 * @constructor
 * @param {d3.selection} svg - Where we draw the game
 * @param {Boolean[][]} map - An array of arrays. Each value represents whether a cell on the board is alive or dead.
 * @property {Grid} grid
 * @property {Object} svg
 */
function Game(svg, map) {

    var grid = new Grid(map[0].length, map.length);

    this.svg = svg;
    this.grid = grid;

    var cellWidth  = +svg.attr("width") / grid.width,
        cellHeight = +svg.attr("height") / grid.height;

    this.attrs = {
        cx: function(d) { return d.vec.x*cellWidth + cellWidth/2; },
        cy: function(d) { return d.vec.y*cellHeight + cellHeight/2; },
        fill: function(d) { return d.cell.infected ? "red" : "#222"; },
        opacity: function(d) { return d.cell.alive ? 0.42 : 0; },
        r: 2,
    };

    this.cellData = [];

    this.cells = this.svg.selectAll(".cell");

    map.forEach(function(line, y) {
        var vec,
            cell;
        for (var x = 0; x < line.length; x++) {
            vec = new Vector(x, y);
            cell = new Cell("#cell-"+vec.x+"-"+vec.y, line[x]);
            grid.set(vec, cell);
            this.cellData.push({vec: vec, cell: cell});
        }
    }, this);

    this.svg
        .on("click", function(){
            var elt = d3.select(this);
            var coords = d3.mouse(this);
            console.log(coords);
            var cellRow = Math.floor(coords[0] / cellWidth),
                cellCol = Math.floor(coords[1] / cellHeight);
            console.log(cellRow, cellCol);
            grid.get(new Vector(cellRow, cellCol)).invertInfection();
            window.requestAnimationFrame(function() {
                svg.selectAll(".ring")
                    .data([coords])
                    .enter()
                    .append("circle")
                    .attr({
                        cx: function(d) { return d[0]; },
                        cy: function(d) { return d[1]; },
                        fill: "transparent",
                        opacity: 0.2,
                        stroke: "red",
                        "stroke-width": 2,
                        r: 4,
                    })
                    .transition()
                    .ease("linear")
                    .duration(650)
                    .attr("r", 150)
                    .attr("opacity", 0)
                    .remove();
            });

        });

    this.cells
        .data(this.cellData)
        .enter()
        .append("circle")
        .classed("cell", true)
        .attr(this.attrs)
        .transition()
        .duration(600);

    this.svg
        .selectAll(".cell-mask")
        .data(this.cellData)
        .enter()
        .append("rect")
        .classed("cell-mask", true)
        .attr({
            x: function(d) { return d.vec.x*cellWidth; },
            y: function(d) { return d.vec.y*cellHeight; },
            fill: "transparent",
            width: cellWidth,
            height: cellHeight
        });
}

/**
 * Creates a human-readable representation of the Game.grid property.
 * @method
 * @return {string}
 */
Game.prototype.toString = function() {
    var output = "",
        x,
        y;
    for (y = 0; y < this.grid.height; y++) {
        for (x = 0; x < this.grid.width; x++) {
            var cell = this.grid.get(new Vector(x, y));
            output += cell.alive ? "X" : "O";
        }
        output += "\n";
    }
    return output;
};

/**
 * Gives all Cell objects a chance to live or die.
 * and update the Game.grid to reflect their actions.
 * @method
 */
Game.prototype.tick = function() {
    var toChangeCount = 0;

    // Change the life of cells that need to be changed
    this.grid.filter(function(cell, vector) {
        return cell.willChangeLife(new View(this, vector));
    }, this).forEach(function(cell, vector) {
        toChangeCount++;
        cell.invert();
    }, this);
    
    // Change the health of cells that were infected
    this.grid.filter(function(cell, vector) {
        return cell.willChangeHealth(new View(this, vector));
    }, this).forEach(function(cell, vector) {
        toChangeCount++;
        cell.infect();
    }, this);

    if (toChangeCount === 0) return; // stops the screen from vibrating

    this.svg
        .selectAll(".cell")
        .data(this.cellData)
        .transition()
        // .delay(function(d, i) { return i % 100; })
        .duration(function(d, i) { return 400; })
        .attr(this.attrs);

};

/**
 * Contains logic that allows cell to live and die. Ignores nonsensical input.
 * @method
 * @private
 * @param {Cell} cell
 * @param {Vector} vector
 */
Game.prototype.letAct = function(cell, vector) {
    var change = cell.act(new View(this, vector));
    if (change) {
        cell.draw(this.svg, vector);
    }
};