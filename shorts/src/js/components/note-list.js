const React = require("react");

const NoteInput = () => ({
    componentDidMount() {
        let input = this.refs.noteInput;
        this.focus(input);
    },

    focus(input) {
        if (!input) return;
        input.focus();
        input.setSelectionRange(0, input.value.length);
    },

    render() {
        return (
            <form ref="noteForm" onSubmit={ this.props.handleSubmit }>
                <input className="input input-update"
                  ref="noteInput"
                  onChange={ this.props.handleChange } 
                  value={ this.props.value } />
            </form>
        );
    }
});

const NoteUpdateButton = () => ({
    handleClick(event) {
        event.stopPropagation();
        event.preventDefault();

        this.props.updateNote();
    },

    render() {
        return (
            <button className="button button-note-action"
                onClick={(e) => this.handleClick(e) } >
                <span className="emoji">👍</span>
                <span className="button-note-action-text">
                    Update
                </span>
            </button>
        );
    },
});

const Note = () => ({

    deleteNote() {
        let { id } = this.props;
        this.props.store.dispatch({
            type: "DELETE_NOTE",
            id,
        }); 
    },

    handleChange(event) {
        let { id } = this.props;
        let { value } = event.target;
        this.props.store.dispatch({
            type: "EDIT_EXISTING_NOTE_INPUT",
            id,
            value,
        });
    },

    handleSubmit(event) {
        event.stopPropagation();
        event.preventDefault();

        this.updateNote();
    },

    toggleEdit() {
        let { id } = this.props;
        this.props.store.dispatch({
            type: "TOGGLE_NOTE_EDIT",
            id,
        }); 
    },

    updateNote() {
        let { id } = this.props;
        this.props.store.dispatch({
            type: "UPDATE_NOTE",
            id,
        }); 
    },

    handleDelete(event) {
        event.stopPropagation();
        event.preventDefault();

        this.deleteNote();
    },

    handleToggleEdit(event) {
        event.stopPropagation();
        event.preventDefault();

        this.toggleEdit();
    },

    render() {
        let { isEditing, editValue, body } = this.props.note;

        if (isEditing) {
            return (
                <li className="note">
                    <div className="note-body">
                        <NoteInput value={editValue}
                          handleSubmit= { (e) => this.handleSubmit(e) }
                          handleChange={ (e) => this.handleChange(e) } />
                    </div>
                    <div className="note-buttons">
                        <NoteUpdateButton updateNote={ () => this.updateNote() } />
                    </div>
                </li>
            );
        }
        return (
            <li className="note" onClick={ () => this.toggleEdit() }>
                <div className="note-body">
                    {body}
                </div>
                <div className="note-buttons">
                    <button className="button button-note-action"
                        onClick={ (e) => this.handleDelete(e) }>
                    
                        <span className="emoji">🔥</span>
                        <span className="button-note-action-text">
                            Delete
                        </span>
                    </button>
                </div>
            </li>
        );
    },
});

const NoteList = () => ({
    getNotes() {
        let {notes} = this.props.store.getState();
        if (notes.length === 0) return this.noNotesMessage();
        return notes.map((note, i) => <Note key={i} id={i} note={note} store={this.props.store} />)
    },

    noNotesMessage() {
        return (
            <p className="no-notes">
                No shorts? No problem!
                <br />
                <small>
                    Write yourself a short note below and tap the 
                    &nbsp;
                    <span className="emoji">🎉</span>
                </small>
            </p>
        );
    },

    render() {
        return (
            <div className="notes-container">
                <ul className="notes-list">
                    {this.getNotes()}
                </ul>
            </div>
        );
    },
});

module.exports = NoteList;