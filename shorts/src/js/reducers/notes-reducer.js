const {getNotes, saveNotes} = require("../db/index");

const initialState = {
  newNoteInput: "",
  notes: getNotes(),
};

const notesReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_NOTE'                 : return addNote(state, action);
    case 'UPDATE_NOTE'              : return updateNote(state, action);
    case 'DELETE_NOTE'              : return deleteNote(state, action);
    case 'TOGGLE_NOTE_EDIT'         : return toggleNoteEdit(state, action);
    case 'EDIT_EXISTING_NOTE_INPUT' : return editExistingNoteInput(state, action);
    case 'EDIT_NEW_NOTE_INPUT'      : return editNewNoteInput(state, action);
    case 'EXIT_NOTE_EDITING'        : return exitNoteEditing(state, action);
    default                         : return state;
  }
};

module.exports = notesReducer;

function addNote(state, action) {
  let body = state.newNoteInput;
  let newNote = createNote({ body });
  let notes = [newNote, ...state.notes];
  saveNotes(notes);
  let newNoteInput = "";
  return  {...state, notes, newNoteInput};
}

function updateNote(state, action) {
  let { id } = action;
  let oldNotes = state.notes;
  let oldNote = oldNotes[id];
  let newNote = createNote({ body: oldNote.editValue });
  let notes = [
    ...oldNotes.slice(0, id),
    newNote,
    ...oldNotes.slice(id+1)
  ];
  saveNotes(notes);
  return { ...state, notes };
}

function deleteNote(state, action) {
  let { id } = action;
  let oldNotes = state.notes;
  let notes = [
    ...oldNotes.slice(0, id),
    ...oldNotes.slice(id+1)
  ];
  saveNotes(notes);
  return { ...state, notes };
}

function toggleNoteEdit(state, action) {
  let { id } = action;
  let oldNotes = state.notes;
  let oldNote = oldNotes[id];
  let isEditing = !oldNote.isEditing;
  let newNote = { ...oldNote, isEditing };
  let notes = [
    ...oldNotes.slice(0, id).map(turnOffEditingMode),
    newNote,
    ...oldNotes.slice(id+1).map(turnOffEditingMode)
  ];
  saveNotes(notes);
  return { ...state, notes };
}

function editExistingNoteInput(state, action) {
  let {id, value} = action;
  let oldNotes = state.notes;
  let oldNote = oldNotes[id];
  let newNote = { ...oldNote, editValue: value };
  let notes = [
    ...oldNotes.slice(0, id),
    newNote,
    ...oldNotes.slice(id+1)
  ];
  saveNotes(notes);
  return { ...state, notes };
}

function editNewNoteInput(state, action) {
  let newNoteInput = action.value;
  return  { ...state, newNoteInput };
}

function exitNoteEditing(state, action) {
  let notes = state.notes.map(turnOffEditingMode);
  saveNotes(notes);
  return { ...state, notes }
}

// TODO - move these elsewhere

function createNote({ body = "", isEditing = false }) {
  return {
    body,
    isEditing,
    editValue: body,
  };
}

function turnOffEditingMode(note) {
  let isEditing = false;
  return { ...note, isEditing };
}