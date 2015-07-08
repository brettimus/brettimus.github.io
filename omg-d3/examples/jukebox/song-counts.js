module.exports = SongCounts;

function SongCounts() {
    this.ledger = {};
    this.list   = [];
}

SongCounts.prototype.add = function(song) {
    var uid = song.uid();
    if (!this.ledger[uid]) {
        this.ledger[uid] = song;
        this.list.push(song);
    }
    this.ledger[uid].timestamps.push(song.timestamps.pop());
    this.ledger[uid].count++;

};