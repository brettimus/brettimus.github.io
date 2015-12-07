var APP_CONFIG = {
    animationDuration: 2000, // ms
    initialPositionNoise: [-5, 5],
    initialRotationNoise: [-45, 45],
    animationTranslationNoise: [-142, 142],

    emojiSize: "normal",
    getEmojiSize: function getEmojiSize() {
        if (this.emojiSize === "normal") {
            return 20;
        }
        if (this.emojiSize === "large") {
            return 50;
        }
    }.bind(APP_CONFIG),
};

var $appContainer = $("main");

initializePizza($appContainer);
addEmojiListener($appContainer);
addFormListeners();
// clickCenterOfPizza();

function addEmojiListener($container) {

    // A queue of functions
    var QUEUE = createAnimationQueue();

    $container.click(handleClick);

    function handleClick(event) {
        var xCoord = event.pageX;
        var yCoord = event.pageY;
        var clickCoordinate = {
            x: xCoord,
            y: yCoord,
        };

        // Each member of the queue is a function that takes a callback/
        // The callback is invoked on `transitionend`,
        // which is what enables us to synchronize click events
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
        var noiseRange = APP_CONFIG.animationTranslationNoise;
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
        var api = {};

        api.enqueue = enqueue;

        return api;

        function enqueue(command) {
            var animation = createAnimationFromCommand(command);
            var wasEmpty = isEmpty();

            q.push(animation);

            if (wasEmpty) processQueueUntilEmpty();

            return api;
        }

        function dequeue() {
            return q.shift();
        }

        function processQueueUntilEmpty() {
            if (isEmpty()) return;

            head()
              .runAnimation()
              .then(dequeue)
              .then(processQueueUntilEmpty);

            return api;
        }

        function isEmpty() {
            return q.length === 0;
        }

        function head() {
            return q[0];
        }

        function createAnimationFromCommand(command) {
            // NB we expect that `command` takes a callback as its first and only parameter
            var animation = {
                callbacks: [],
                runAnimation: modifiedCommand,
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
                animation.callbacks.forEach(invoke);
            }

            function invoke(f) {
                f();
            }
        }
    }
}


function initializePizza($container) {

    tileWithPizza($container);

    function tileWithPizza($elt) {
        var width = $elt.width();
        var height = $elt.height();

        // emoji spans are ~(20px X 20px)
        var rows = Math.ceil(width / 20) + 1;  // we add 1 to purposely overflow
        var cols = Math.ceil(height / 20) + 1;

        var row, col;
        var pizza;
        for (row = 0; row <= rows; row++) {
            for (col = 0; col <= cols; col++) {
                pizza = makePizzaElement();
                $elt.append(pizza);
            }
        }
    }

    function makePizzaElement() {
        var result = createContainer();
        result.classList.add("emoji");
        result.textContent = "🍕";
        addPositionalNoise(result);
        addElementTransition(result, { duration: APP_CONFIG.animationDuration, });
        return result;
    }

    function addPositionalNoise(element) {
        addElementTranslation(element);
        addElementRotation(element);
    }

    function createContainer() {
        return document.createElement("span");
    }
}


// Utilities
// (Common functions repeated across top-level scopes)
function randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addElementTransition(element, options) {
    var duration = options.duration || APP_CONFIG.animationDuration;
    var transition = "all " + duration + "ms ease-in-out";
    element.style.WebkitTransition = transition;
    element.style.transition = transition;
}

function addElementTranslation(element, options) {
    var xNoise = randomInRange.apply(null, APP_CONFIG.initialPositionNoise);
    var yNoise = randomInRange.apply(null, APP_CONFIG.initialPositionNoise);
    var noisyTranslation = "translateX(" + xNoise + "px) translateY(" + yNoise + "px) translateZ(0px)";
    addTransform(element, noisyTranslation);
}

function addElementRotation(element, range) {
    var rotateNoise = randomInRange.apply(null, range || APP_CONFIG.initialRotationNoise); // adding rotational noise makes future translations a little more difficult. hardcoding to 0 for now.
    var noisyRotation = " rotate(" + rotateNoise + "deg)";
    addTransform(element, noisyRotation);
}

function addTransform(element, transform) {
    element.style.webkitTransform += transform;
    element.style.transform += transform;
}

function forEachEmoji(f) {
    var emoji = [].slice.call(document.querySelectorAll(".emoji"));
    emoji.forEach(f);
}

function clickCenterOfPizza() {
    var $target = $("main").click(); // function name is a misnomer... FIXME
}


// Form controls
// 
function addFormListeners() {

    var $duration = $("[name='duration']");
    var duration = (function($duration){
        $duration.get(0).value = APP_CONFIG.animationDuration;

        var api = {};

        var handler = defaultHandler;
        $duration.change(handler);

        function defaultHandler(event) {
            var newDuration = parseInt(event.target.value);
            if (isNaN(newDuration)) {
                renderError({ originalValue: event.target.value, });
                return;
            }

            APP_CONFIG.animationDuration = newDuration;
            forEachEmoji(function(emoji, i) {
                addElementTransition(emoji, { duration: newDuration, });
            });
        }

        function renderError(errorInfo) {
            console.log("Error parsing form input value for animation duration.")
        }


        return api;
    })($duration);

    var $translationNoise = $("[name='translation-noise']");
    var translationNoise = (function($translationNoise){
        $translationNoise.get(0).value = APP_CONFIG.animationTranslationNoise.toString();

        var api = {};
        
        var handler = defaultHandler;
        $translationNoise.change(handler);

        function defaultHandler(event) {
            var newNoise = parseRangeFromString(event.target.value);
            // TODO - validate
            APP_CONFIG.animationTranslationNoise = newNoise;
        }

        return api;
    })($translationNoise);

    var $rotationNoise = $("[name='rotation-noise']");
    var rotationNoise = (function($rotationNoise){
        $rotationNoise.get(0).value = APP_CONFIG.initialRotationNoise.toString();

        var api = {};
        
        var handler = defaultHandler;
        $rotationNoise.change(handler);

        function defaultHandler(event) {
            var newNoise = parseRangeFromString(event.target.value);
            // TODO - validate
            APP_CONFIG.initialRotationNoise = newNoise;
            forEachEmoji(function(emoji, i) {
                addElementRotation(emoji);
            });
        }

        return api;
    })($rotationNoise);

    function parseRangeFromString(str) {
        var result = str.split(",").map(function(i) { return parseInt(i); });
        return result;
    }
}