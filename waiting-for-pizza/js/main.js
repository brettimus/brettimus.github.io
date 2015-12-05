var APP_CONFIG = {
    animationDuration: 2000, // ms
};

var $appContainer = $("main");

initializePizza($appContainer);
addTouchListener($appContainer);

function addTouchListener($container) {

    var $elementCache = [];
    var animationQueue = createAnimationQueue();

    initializeCache($elementCache);
    addListener($container);

    function initializeCache(cache) {
        $(".emoji").each(function(i, elt) {
            var $emoji = $(this),
                x = $emoji.offset().left,
                y = $emoji.offset().top;

            cache.push({
                $e: $emoji,
                x: x,
                y: y,
            })
        })
    }

    function addListener($elt) {
        $elt.click(handleClick);        
    }

    function handleClick(event) {
        var xCoord = event.pageX;
        var yCoord = event.pageY;
        var clickCoordinate = {
            x: xCoord,
            y: yCoord,
        };

        animationQueue.enqueue(function (callback) {
            flockPizzaToCoordinate(clickCoordinate, callback);
        });
    }

    function flockPizzaToCoordinate(coordinate, callback) {
        var animationProps = getEmojiAnimationProps(coordinate);

        addNoiseToAnimationProps(animationProps);
        executeAnimations(animationProps, callback);
    }

    function getEmojiAnimationProps(coordinate) {
        // var result = [];
        // $(".emoji").each(function(i, elt) {
        //     var $emoji = $(this),
        //         emojiX = $emoji.offset().left,
        //         emojiY = $emoji.offset().top;

        //     var xTranslate = coordinate.x - emojiX;
        //     var yTranslate = coordinate.y - emojiY;

        //     result.push({
        //         e: $emoji,
        //         p: {
        //             translateX: xTranslate,
        //             translateY: yTranslate,                    
        //         },
        //         o: {
        //             duration: 2000,
        //         }
        //     });
        // });
        // return result;

        return $elementCache.map(function(cachedElement) {
            var $emoji = cachedElement.$e;
            var xTranslate = coordinate.x - cachedElement.x;
            var yTranslate = coordinate.y - cachedElement.y;

            // update cached positions
            cachedElement.x = coordinate.x;
            cachedElement.y = coordinate.y;

            return {
                e: $emoji,
                p: {
                    translateX: xTranslate,
                    translateY: yTranslate,                    
                },
                o: {
                    duration: 2000,
                }
            };
        });
    }

    function addNoiseToAnimationProps(animations) {
        var noiseRange = [-142, 142];
        animations.forEach(function(a, i) {
            var xNoise = randomInRange.apply(null, noiseRange);
            var yNoise = randomInRange.apply(null, noiseRange);

            a.p.translateX += xNoise;
            a.p.translateY += yNoise;

            // update cached positions
            $elementCache[i].x += xNoise;
            $elementCache[i].y += yNoise;
        });
    }

    function executeAnimations(animations, callback) {

        animations.forEach(function(animation) {
            // $.Velocity(animation);
            var elt = animation.e.get(0);
            var translation = animation.p;
            addTranslation(elt, translation);
        });

        if (callback) {
            registerCallbackAfterAnimations(callback, animations)
        }

        function registerCallbackAfterAnimations(callback, animations) {
            var lastAnimation = animations[animations.length - 1];
            var elt = lastAnimation.e.get(0);

            elt.addEventListener("transitionend", modCallback);

            function modCallback() {
                callback();
                elt.removeEventListener("transitionend", modCallback)
            }
        }
    }

    function addTranslation(element, translation) {
        var x = Math.floor(translation.translateX);
        var y = Math.floor(translation.translateY);
        var t = " translateX(" + x + "px) translateY(" + y + "px)";
        // element.style.webkitTransform += t;
        element.style.transform += t;
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
        var duration = APP_CONFIG.animationDuration;
        var transition = "all " + duration + "ms ease-in-out";
        element.style.WebkitTransition = transition;
        element.style.transition = transition;
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

function createAnimationQueue() {
    var q = [];
    var isBusy = false;

    q.enqueue = function(command) {
        var animation = createAnimationFromCommand(command);
        var wasEmpty = q.isEmpty();
        q.push(animation);

        if (wasEmpty) {
            q.doit();
        }

        return q;
    };

    q.dequeue = function() {
        return q.shift();
    };

    q.doit = function() {
        if (q.isEmpty()) return;

        q.head()
          .run()
          .then(q.dequeue)
          .then(q.doit);

        return q;
    };

    q.isEmpty = function() {
        return q.length === 0;
    };

    q.head = function() {
        return q[0];
    };

    q.last = function() {
        if (arguments.length) {
            q[q.length - 1] = arguments[0];
            return q;
        }
        return q[q.length - 1];
    };

    return q;

    function createAnimationFromCommand(command) {
        var animation = {
            callbacks: [],
            run: modifiedCommand,
        };

        animation.then = addCallback;

        return animation;

        function addCallback(callback) {
            animation.callbacks.push(callback);
            return animation;
        }

        function modifiedCommand() {
            command(runCallbacks);
            return animation;
        }

        function runCallbacks() {
            animation.callbacks.forEach(function(f) { f(); });
        }
    }
}

function randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}