# Game of Life with a Virus
## Summary 

This is Conway's Game of Life with a small bit of interactivity.

An observer can click on a square to "infect" it, which turn its living color into a semi-transparent red.

Then, whenever the infected cell is live, it will in turn infect its living neighbors.

The only cure to the virus is clicks!!!

## To run
Open `dist/index.html` in a browser and start clickin'. 
If you go into the console, there are two global vars exposed so you can go to town. 

1. `svg` is a d3 selection of the svg element on the page
2. `sim` is the simulation object. see `src/simulation.js` if you want to use it's (not at all finalized) interface.


## TODO
* jsdoc comments are a bit out of whack
* there's cruft everywhere
* zomg tests