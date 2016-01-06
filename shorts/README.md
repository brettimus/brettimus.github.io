# Shorts
A delightful little way to leave yourself short notes.

## Overview
We make use of the following tools/libraries:
- Webpack
- React
- Redux
- Babel (JSX + Stage2)
- SCSS
- HTML5 boilerplate
- pure.css (including normalize)

This is a fairly intense setup for such a small app. 

Why? well, for starters, we leaned pretty heavily on [this boilerplate](https://github.com/brettimus/booty-booty-boilerplate). Secondly, React and Redux are just plain fun :grin:. (And fun is good!)

To test out the app, open the `index.html` file in your fave browser. (If opening `index.html` fails horrendously, see the “Building” section at the bottom of this document.) Alternatively, [just go here](http://brettim.us/shorts/).

## How the interface works
- Add notes in the input box and tap the :tada: emoji.
- Start editing a note by tapping it. (The previous note's text will be automagically selected—how neat!)
- Update a note by tapping the :thumbs_up: button
- Delete a note by tapping the :fire: button

## How the code works
We are saving _almost_ all of the application state in localStorage, so we get some nifty features in our UI for free. E.g., if you are editing a note and click refresh, the application will remember that you were editing said note, and the interface will reflect that. (Hats off to Redux.)

### Data
The most important function is `saveNotes`. This is what Redux's main reducer calls to save the application state into localStorage.

Data management is abstracted away using an adapter-like pattern. That way, if we choose to move away from localStorage, we merely have to write a new adapter that conforms to the interface that our db module expects. (That being said, anything that isn't client-based will probably be async, and the current adapter interface would probably need tweaking to accomodate async update patterns.)

## Short Critique (_haaaa get it?_)
Let's be our own harshest critics.

### React component responsibilities
The responsibilities of each component are not fully fleshed out. The Redux store is being passed as a prop to several components that only use it on an ad hoc basis. A good item on the refactor-list would be to only pass functionality that surrounds the store to those components.

### That's a big reducer
The main reducer could do well to be split up. That file is an eyesore right now.

### UI
The UI needs some sprucing. Animations are a must. We'll leave it at that for now.

### Feature Detection
We do not feature-detect localStorage. It would be kind of us to warn our users if their particular browser lacked the localStorage api (e.g., ios Safari in private browsing mode).

### Scaling
Every time we save an edit, etc, we are serializing our entire app's state and shoving it into localStorage. This would not scale well.

However, it's hard to envision a world where someone stores **billions of notes** to themselves. But who are we to judge, ya know?

## Building
You need `node`, `npm`, and `make` to build. Then, do the following:

- install dependencies `npm i`
- build `make`

Upon which opening `index.html` should serve the app. :confetti_ball:

## Developing
To get going on your own:
- clone this repo
- install dependencies `npm i`
- build the distribution `make`
- start the dev server `npm start`

`npm start` kicks off the webpack dev server on port `8899` with hot reloading.

:heart: :fire: :computer: :grin:
