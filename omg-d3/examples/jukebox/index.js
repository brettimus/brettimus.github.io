// TODO - load into postgres... these data would be so much better in postgres

// TODO - clean dates
//        current format is acceptable to moment

var fs = require("fs"),
    csv = require("fast-csv");


(function countSongs() {
    var songs = new SongCounts();
    var stream = fs.createReadStream("./jukebox.csv");
    var csvStream = csv()
        .on("data", function(data) {
            songs.add(new Song(data));
        })
        .on("end", function() {
            console.log("done");
            var result = songs.list.sort(function(a, b) {
                return b.count - a.count;
            }).slice(0, 100);

            saveFile("./jukebox-top100", result);
        });

    stream.pipe(csvStream);
})();

function saveFile(path, data) {
    var stream = fs.createWriteStream(path);
    var csvStream = csv.createWriteStream({headers: false});

    stream
        .on("finish", function() {
            console.log("Done writing new file:", path);
        });

    csvStream.pipe(stream);
    data.forEach(function(s) {
        var toWrite = s.data.concat([s.count, JSON.stringify(s.timestamps)]);
        csvStream.write(toWrite);
    });
    csvStream.end();
}

// Data Structures

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