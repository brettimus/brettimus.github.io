const React = require("react");

const NoteInput = () => ({
    render() {
        return (
            <input 
                className="input input-add" 
                onChange={this.props.handleChange} 
                placeholder={"Type in me! I dare ya."}
                value={this.props.value} />
        );
    },
});

const NoteButton = () => ({
    render() {
        return (
            <button className="button button-add" onClick={this.props.handleClick}>
                {this.props.children}
            </button>
        );
    },
});

const NoteForm = React.createClass({
    handleButtonClick(event) {
        event.stopPropagation();
        event.preventDefault();

        this.props.store.dispatch({ type: "ADD_NOTE", });
    },

    handleInputChange(event) {
        event.stopPropagation();
        event.preventDefault();

        let {store} = this.props;
        let {value} = event.target;
        store.dispatch({
            type: "EDIT_NEW_NOTE_INPUT",
            value,
        });
    },

    handleSubmit(event) {
        this.props.store.dispatch({ type: "ADD_NOTE", });
    },

    render() {
        let {store} = this.props;
        let state = store.getState();
        return (
            <form onClick={this.props.onClick} onSubmit={this.handleSubmit} className="note-form note-form-fixed">
                <NoteInput 
                  handleChange={this.handleInputChange} 
                  value={state.newNoteInput} />

                <NoteButton handleClick={this.handleButtonClick}>
                    🎉
                </NoteButton>
            </form>
        );
    },
});

module.exports = NoteForm;