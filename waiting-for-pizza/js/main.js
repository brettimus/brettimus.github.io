
var $appContainer = $("main");

initializePizza($appContainer);
addTouchEvent($appContainer);

function addTouchEvent($container) {
    $container.click(handleClick)

    function handleClick(event) {
        var xCoord = event.pageX;
        var yCoord = event.pageY;

        flockPizzaToCoordinate({
            x: xCoord,
            y: yCoord,
        })
    }

    function flockPizzaToCoordinate(coordinate) {
        var animationProps = getEmojiAnimationProps(coordinate);

        addNoiseToAnimationProps(animationProps);
        executeAnimations(animationProps);
    }

    function getEmojiAnimationProps(coordinate) {
        var result = [];
        $(".emoji").each(function(i, elt) {
            var $emoji = $(this),
                emojiX = $emoji.offset().left,
                emojiY = $emoji.offset().top;

            var xTranslate = coordinate.x - emojiX;
            var yTranslate = coordinate.y - emojiY;

            result.push({
                e: $emoji,
                p: {
                    translateX: xTranslate,
                    translateY: yTranslate,                    
                },
                o: {
                    duration: 2000,
                }
            });
        });
        return result;
    }

    function addNoiseToAnimationProps(animations) {
        var noiseRange = [-142, 142];
        animations.forEach(function(a) {
            var x = a.p.translateX;
            var y = a.p.translateY;
            a.p.translateX = addNoise(x, noiseRange);
            a.p.translateY = addNoise(y, noiseRange);
        });
    }

    function executeAnimations(animations) {
        animations.forEach(function(animation) {
            // $.Velocity(animation);
            var elt = animation.e.get(0);
            var translation = animation.p;
            addTranslation(elt, translation);
        });
    }

    function addTranslation(element, translation) {
        var x = Math.floor(translation.translateX);
        var y = Math.floor(translation.translateY);
        var t = " translateX(" + x + "px) translateY(" + y + "px)";
        // element.style.webkitTransform += t;
        element.style.transform += t;
    }

    function addNoise(n, range) {
        return n + randomInRange.apply(null, range);
    }
}


function initializePizza($container) {

    tileWithPizza($container);

    function tileWithPizza($elt) {
        var width = $elt.width();
        var height = $elt.height();

        // emoji spans are ~(20px X 20px)
        var rows = Math.ceil(width / 20);
        var cols = Math.ceil(height / 20);

        var row, col;
        var pizza;
        for (row = 0; row < rows; row++) {
            for (col = 0; col < cols; col++) {
                pizza = makePizzaElement();
                $elt.append(pizza);
            }
        }

    }

    function makePizzaElement(options) {
        var defaults = {
            height: 10,
            width: 10,
        }
        options = $.extend({}, defaults, options);

        var result = createContainer();
        result.classList.add("emoji");
        result.textContent = "🍕";
        addPositionalNoise(result);
        addTransition(result);
        return result;
    }

    function addTransition(element) {
        element.style.WebkitTransition = "all 2s ease-in-out";
        element.style.transition = "all 2s ease-in-out";
    }

    function addPositionalNoise(element) {
        var xNoise = randomInRange(-5, 5);
        var yNoise = randomInRange(-5, 5);
        var rotateNoise = randomInRange(0, 0);
        var noisyTranslation = "translateX(" + xNoise + "px) translateY(" + yNoise + "px)";
        var noisyRotation = "rotate(" + rotateNoise + "deg)";
        var noisyTransform = noisyTranslation + " " + noisyRotation;
        element.style.webkitTransform = noisyTransform;
        element.style.transform = noisyTransform;
    }

    function createContainer() {
        return document.createElement("span");
    }
}

function randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}