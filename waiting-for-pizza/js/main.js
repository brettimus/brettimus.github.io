var APP_CONFIG = {
    animationDuration: 2000, // ms
};

var $appContainer = $("main");

initializePizza($appContainer);
addTouchListener($appContainer);

function addTouchListener($container) {

    var QUEUE = createAnimationQueue();

    $container.click(handleClick)

    function handleClick(event) {
        var xCoord = event.pageX;
        var yCoord = event.pageY;
        var clickCoordinate = {
            x: xCoord,
            y: yCoord,
        };

        QUEUE.enqueue(function (callback) {
            flockPizzaToCoordinate(clickCoordinate, callback);
        });
    }

    function flockPizzaToCoordinate(coordinate, callback) {
        var animationProps = getEmojiAnimationProps(coordinate);

        addNoiseToAnimationProps(animationProps);
        executeAnimations(animationProps, callback);
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

    function addNoise(n, range) {
        return n + randomInRange.apply(null, range);
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
            if (q.isLocked()) printLockWarning();

            q.lock()
              .head()
              .run()
              .then(q.unlock)
              .then(q.dequeue)
              .then(q.doit);

            return q;
        };

        // lock/unlock is a hacky way to flag that there's an animation in progress
        q.lock = function() {
            isBusy = true;
            return q;
        }

        q.unlock = function() {
            isBusy = false;
            return q;
        }

        q.isLocked = function() {
            return isBusy;
        }

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

        function printLockWarning() {
            console.log("%c[WARNING!] Pizza animation queue is executing a command even though the lock is on...", "color: darkred; font-weight: bold;")
        }

        function printEmptyWarning()  {
            console.log("%c[WARNING!] Pizza animation queue is trying to execute a command even though it is empty...", "color: darkred; font-weight: bold;") 
        }
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

function randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}