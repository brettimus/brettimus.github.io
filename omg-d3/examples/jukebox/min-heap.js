
module.exports = MinHeap;

function MinHeap(maxSize) {
    this.ledger = {};
    this.maxSize = maxSize;
    this.heap = [];
    this.size = 0;
}

MinHeap.prototype.add = function(node) {
    if (!this.heap[0]) {
        this.root = null;
        // this.ledger[node.name] = node.data;
    }
    else {

    }
    this.heap[this.heap.length];
    // Add to bottom level of heap
    // compare with parent
    // if correct, stop
    // if not, swap with parent
    // repeat
};


function Node(name, value, data) {
    this.name = name;
    this.value = value;
    this.data = data;
}






/**
 * mehhhhh old shit
 */

function TopSongs(maxLength) {
    this.maxLength = maxLength;
    this.data = {};
    this.length = 0;
    this.min = null;
    this.max = null;
}
TopSongs.prototype.add = function(song) {
    this.data[song.uid()] = song;
};
TopSongs.prototype.addIf = function(song, predicate) {
    var uid = song.uid(),
        data = this.data;

    predicate = predicate || this._addIfPredicate;

    if (predicate(song)) {
        this.add(song);
    }
};

TopSongs.prototype._addIfPredicate = function(song) {
    var uid = song.uid(),
        data = this.data;

    if (!this.min) this.min = song;
    if (data[uid].count < this.min.count) {
        if (this.length < this.maxLength) {
            this.add(song);
        }
    }

    if (!this.max) this.max = song;
    if (data[uid].count > this.max.count) {
        
    }
        this.max = song;
};