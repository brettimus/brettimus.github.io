function canvasMandelbrot(left, top, width, options) {
    options = options || {};
    options.height = options.height || 500;
    options.width = options.width || 500;
    options.scale = options.scale || 10;
    options.canvas = touch("canvas", options.width, options.height);
    options.context = options.canvas.getContext('2d');
    options.context.clearRect(0, 0, options.canvas.width, options.canvas.height);

    var translateX = options.translateX || 100,
        translateY = options.translateY || 100;

    mandelbrot(left, top, width, options);
}


//svg is borked D: it looks like shit
function svgMandelbrot(options) {
    options = options || {};
    options.height = options.height || 500;
    options.width = options.width || 500;
    options.scale = options.scale || 10;
    options.svg = d3.select("body")
            .append("svg").attr({
                width: 500,
                height: 500,
            });

    mandelbrot(0, 0, 1, options);
}



function mandelbrot(left, top, width, options) {
    options = options || {};
    countMax = options.countMax || 100;
    scale = options.scale || 1;
    var j,
        k,
        count,
        ca,
        cb,
        zx,
        zx2,
        zy,
        zy2,
        xtemp,
        pixelColor;
    for (j = 1; j <= 150; j++) {
        for (k = 1; k <= 150; k++) {
            count = 0;
            ca = left + j*width / 150;
            cb = top + k*width / 150;
            zx = 0;
            zy = 0;
            for (count = 1; count <= countMax; count++) {
                zx2 = zx*zx;
                zy2 = zy*zy;
                if (zx2 + zy2 > 4) break;
                xtemp = zx*zx - zy*zy;
                zy = 2 * zx * zy + cb;
                zx = xtemp + ca;
            }
            pixelColor = color(count);
            if (options.canvas) {
                drawCanvas(options.context,
                    zx,
                    zy,
                    { color: pixelColor,
                    translateX: options.translateX,
                    translateY: options.translateY,
                    scale: scale });
            } else if (options.svg) {
                drawSVG(options.svg,
                        zx,
                        zy,
                        { color: pixelColor,
                            translateX: options.translateX,
                            translateY: options.translateY,
                            scale: scale });
            }
        }
    }

    function color(count) {
        var altCount;
        if (count === countMax) {
            console.log("Yayy! 100");
            return "#222222";
        }
        else {
            altCount = Math.floor(count % 10);
            if (altCount < 5) return "#888888";
            else return "#2ba6cb";
        }
    }
}

function drawSVG(svg, x, y, options) {
    color = options.color;
    translateX = options.translateX || 0;
    translateY = options.translateY || 0;
    scale = options.scale || 1;
    svg.append("rect").attr({
        x: (x*scale) + translateY,
        y: (y*scale) + translateY,
        fill: color,
        width: scale,
        height: scale,
    });
}

function drawCanvas(context, x, y, options) {
    scale = options.scale || 1;
    translateX = options.translateX || 0;
    translateY = options.translateY || 0;
    color = options.color;
    // window.requestAnimationFrame(function() {
        context.fillStyle = color;
        context.fillRect(x*scale +translateX, y*scale +translateY, 1, 1);
    // });
}


function touch(tagName, width, height) {
    width = width || 500;
    height = height || 500;
    var element = document.querySelector(tagName);
    if (!element) {
        element = document.createElement(tagName);
        document.body.appendChild(element);
    }
    element.width = width;
    element.height = height;
    return element;
}
