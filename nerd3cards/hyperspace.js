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
    function positioner(chartHeight, chartWidth, init_theta, delta_theta, randomize) {
        var h = chartHeight || 1000,
            w = chartWidth  || 1000,
            r = 2*Math.max(chartWidth, chartHeight),
            theta = init_theta || 0,
            delta_theta = delta_theta || .05,
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
            theta += delta_theta; // for now
            theta = theta % (2 * Math.PI)
        }

        var decrement_theta = function() {
            theta -= delta_theta; // for now
            if (theta < 0) theta += 2 * Math.PI;
        }

        var update = function(isCounterClockwise) {
            if (randomize) {
                theta = Math.random() * Math.PI * 2
            }
            else {
                isCounterClockwise ? decrement_theta() : increment_theta();
            }
            update_cx_cy();
        }

        return function(isCounterClockwise) {
            update(isCounterClockwise);
            return {
                cx: cx,
                cy: cy
            };
        };
    }

    
    var make_dot_flinger = function(color, init_theta, delta_theta, isCounterClockwise) {
        color = color || "black";
        var rotation = positioner(height, width, init_theta, delta_theta);
        var dot_flinger = function() {
            svg.append("circle")
                .attr({
                    cx: width/2,
                    cy: height/2,
                    r: 5,
                    fill: color
                })
                .transition()
                .duration(5000)
                .attr(rotation(isCounterClockwise))
                .remove();
        };

        return dot_flinger;
    };

    var pulse = function(pulseRadius, pulsePoints) {
        pulseRadius = pulseRadius || 2000;
        pulsePoints = pulsePoints || 12;
        var fake_data;
        var coords = d3.mouse(svg.node());
        var rand_id = Math.floor(Math.random() * 100);
        svg.selectAll(".pulse-"+rand_id)
            .data([1,1,1,1,1,1,1,1,1])
            .enter()
            .append("circle")
            .attr({
                "class": "pulse",
                r: 5,
                cx: coords[0],
                cy: coords[1]
            })
            .transition()
            .duration(1500)
            .attr({
                cx: function(d,i) { return coords[0] + pulseRadius*Math.cos((i)*2*Math.PI/pulsePoints);},
                cy: function(d,i) { return coords[1] + pulseRadius*Math.sin((i)*2*Math.PI/pulsePoints);}
            })

        setTimeout(function(){
            svg.selectAll(".pulse-"+rand_id).remove();
        }, 3000);

    }

    svg.on("click", pulse);

    var make_dot_flingers = function(init_theta_noise, delta_theta) {
        init_theta_noise = init_theta_noise || 0;
        delta_theta = delta_theta || .05;
        var meh1 = make_dot_flinger("black", init_theta_noise + Math.PI/2, delta_theta);
        var meh2 = make_dot_flinger("black", init_theta_noise + Math.PI/2, delta_theta, true);
        var meh3 = make_dot_flinger("black", init_theta_noise + Math.PI, delta_theta);
        var meh4 = make_dot_flinger("black", init_theta_noise + Math.PI, delta_theta, true);
        var meh5 = make_dot_flinger("black", init_theta_noise + 3*Math.PI/2, delta_theta);
        var meh6 = make_dot_flinger("black", init_theta_noise + 3*Math.PI/2, delta_theta, true);
        var meh7 = make_dot_flinger("black", init_theta_noise, delta_theta);
        var meh8 = make_dot_flinger("black", init_theta_noise, delta_theta, true);
        return [meh1, meh2, meh3, meh4, meh5, meh6, meh7, meh8];
    }


    var trippy_shit = function() {
        var randomIntervalTime = Math.random() * 500 + 50;
        var theta_noise = Math.random() * Math.PI * 2;

        make_dot_flingers(theta_noise).forEach(function(flinger){
            var meh0 = setInterval(flinger, randomIntervalTime);
            setTimeout(function(){ clearInterval(meh0); }, 5000);
        });
    }

    // set an interval that changes the global interval
    trippy_shit(0);
    setInterval(trippy_shit, 4000)


    setInterval(make_dot_flinger("rgba(0,0,0,.85)", 0, .2), 150);
    setInterval(make_dot_flinger("rgba(0,0,0,.85)", 0, .2, true), 150);
    setInterval(make_dot_flinger("rgba(0,0,0,.85)", Math.PI, .2), 150);
    setInterval(make_dot_flinger("rgba(0,0,0,.85)", Math.PI, .2, true), 150);


    var rotation = positioner(height, width, false, false, true);
    var dot_flinger = function() {
        svg.append("circle")
            .attr({
                cx: width/2,
                cy: height/2,
                r: 5,
                fill: "yellow"
            })
            .transition()
            .duration(5000)
            .attr(rotation())
            .remove();
    };

    setInterval(dot_flinger, 50);


})();

