const React = require("react");

const NoteList = require("./note-list");
const NoteForm = require("./note-form");

const App = React.createClass({

    // componentDidMount() {
    //     document.body.addEventListener("click", this.handleClick);
    // },

    // componentWillUnmout() {
    //     document.body.removeEventListener("click", this.handleClick);
    // },

    handleClick(event) {
        this.props.store.dispatch({
            type: "EXIT_NOTE_EDITING",
        });
    },

    toRainbowChar(char, key) {
        return (
            <span key={key} className="rainbow-char">
                {char}
            </span>
        );
    },

    render() {
        return (
            <div>
                <p className="notes-lede" onClick={this.handleClick}>
                    {"Shorts".split("").map(this.toRainbowChar)}
                    <span className="notes-sub">
                        A delightful little way to leave yourself short notes.
                    </span>
                </p>
                <NoteList store={this.props.store} />
                <NoteForm onClick={this.handleClick} store={this.props.store}/>
            </div>
        );
    },
});

module.exports = App;