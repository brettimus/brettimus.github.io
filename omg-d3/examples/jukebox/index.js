// TODO - load into postgres... these data would be so much better in postgres

// TODO - clean dates
//        current format is acceptable to moment

var csv    = require("fast-csv"),
    fs     = require("fs"),
    moment = require("moment");

var Song       = require("./song"),
    SongCounts = require("./song-counts");

countSongs(saveTop100);

// Transformer
function saveTop100(err, songs) {
    var result = songs.list.sort(function(a, b) { // descending sort
            return b.count - a.count;
        })
        .slice(0, 100); // top 100
    // result.forEach(function(d) { // momentify dates
    //     d.timestamps = d.timestamps.map(function(t) {
    //         return moment(t).format();
    //     });
    // });
    saveFile("./jukebox-top100.csv", result);
}

// Reader
function countSongs(next) {
    var path = "./jukebox.csv";
    var songs = new SongCounts();
    var stream = fs.createReadStream("./jukebox.csv");
    var csvStream = csv()
        .on("data", function(data) {
            songs.add(new Song(data));
        })
        .on("error", function(err) {
            console.log("Error in csvStream");
            next(err, null);
        })
        .on("end", function() {
            console.log("Done reading", path);
            next(null, songs);
        });

    stream.pipe(csvStream);
}

// Writer
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