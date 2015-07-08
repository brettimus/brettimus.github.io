module.exports = Song;

function Song(row) {
    this.data   = row.slice(1);
    this.artist = row[1];
    this.title  = row[3];
    this.count  = 0;
    this.timestamps = [row[0]];
}

Song.prototype.uid = function(row) {
    var data = row || this.data;
    return data[1] + data[3];
};