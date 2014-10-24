Hyperspace = (function(){
    if (!d3) throw new Error("d3 must be loaded to enter hyperspace");

    // event listeners for window sizes

    var hyperspace_node = d3.select(".hyperspace").node();
    var height = hyperspace_node.clientHeight;
    var width = hyperspace_node.clientWidth;

    var svg = d3.select(".hyperspace")
                .append("svg");
    svg.attr({
        height: height,
        width: width
    });

    // new place to send circles function
    function positioner(chartHeight, chartWidth) {
        var h = chartHeight || 1000,
            w = chartWidth  || 1000,
            r = 2*Math.max(chartWidth, chartHeight),
            theta = 0,
            cx,
            cy;

        var update_cx_cy = function() {
            var quadrant = Math.ceil(theta % (Math.PI/4));
            //update cx
            cx = r * Math.cos(theta);
            if (quadrant > 2) cx = -cx
            cx += w/2

            //update cy
            cy = -r*Math.sin(theta) + h/2;
            if (quadrant === 2 || quadrant === 3) cy = -cy
        };

        var increment_theta = function () {
            // theta += .05; // for now
            // theta = theta % (2 * Math.PI)
            theta = Math.random() * Math.PI * 2
        }

        var update = function() {
            increment_theta();
            update_cx_cy();
        }

        return function() {
            update();
            return {
                cx: cx,
                cy: cy
            };
        };
    }

    var rotation = positioner(height, width);
    var fling_dot = function() {
        svg.append("circle")
            .attr({
                cx: width/2,
                cy: width/2,
                r: 5
            })
            .transition()
            .duration(5000)
            .attr(rotation())
            .remove();
    }

    setInterval(fling_dot, 100);

    // 
    function adjustFrame() {

    }


})();

