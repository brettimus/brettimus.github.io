const adapter = require("./local-storage-adapter");

const saveNotes = (notes) => {
    adapter.save("notes", notes);
};

const getNotes = () => {
    let notes = adapter.get("notes");
    if (notes) return notes;
    else       return [];
};

module.exports = {
    getNotes,
    saveNotes,
};