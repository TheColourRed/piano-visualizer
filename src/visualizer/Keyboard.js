import React from "react";
import PropTypes from "prop-types";
import { Piano, KeyboardShortcuts, MidiNumbers } from "react-piano";
import SoundfontProvider from "./sounds/SoundfontProvider";
import classNames from 'classnames';
import "react-piano/dist/styles.css";

// webkitAudioContext fallback needed to support Safari
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const soundfontHostname = "https://d1pzp51pvbm36p.cloudfront.net";

// TODO the notes should be dynamic depending on screen size
const noteRange = {
  first: MidiNumbers.fromNote("a0"),
  last: MidiNumbers.fromNote("c8")
};

const keyboardShortcuts = KeyboardShortcuts.create({
  firstNote: MidiNumbers.fromNote("a3"),
  lastNote: MidiNumbers.fromNote("d5"),
  keyboardConfig: KeyboardShortcuts.QWERTY_ROW
});

class Keyboard extends React.Component {

  static propTypes = {
    onPlayNote: PropTypes.func,
    onStopNote: PropTypes.func,
    onPlayNoteInput: PropTypes.func,
    pressedNotes: PropTypes.arrayOf(PropTypes.number),
    stickyKey: PropTypes.bool.isRequired,
    sustain: PropTypes.bool.isRequired,
    onSustain: PropTypes.func
  }

  down = false;

  componentDidMount(){
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("keyup", this.handleKeyUp);
  }                            

  handleKeyDown = event => {
    if(this.down) {
      return;
    } else {
      this.down = true;
    }

    if (event.key === ' ') {
      this.props.onSustain();
    }
  };

  handleKeyUp = event => {
    this.down = false;
    if (event.key === ' ') {
      this.props.onSustain();
    }
  };

  render() {
    return (
      <div className="h-100">
        <div className="keyboard_keys">
          <div className="keyboard--felt"/>
          <SoundfontProvider
            instrumentName="acoustic_grand_piano"
            audioContext={audioContext}
            hostname={soundfontHostname}
            sustain={this.props.sustain}
            onStopNote={this.props.onStopNote}
            pressedNotes={this.props.pressedNotes}
            stickyKey={this.props.stickyKey}
            render={({ isLoading, playNote, stopNote }) => (
              <Piano
                noteRange={noteRange}
                playNote={playNote}
                stopNote={stopNote}
                onPlayNoteInput={this.props.onPlayNoteInput}
                disabled={isLoading}
                activeNotes={this.props.pressedNotes}
                keyboardShortcuts={keyboardShortcuts}
              />
            )}
          />
        </div>
        <div className="keyboard_footer vertical-align">
          <div className={classNames('keyboard_footer--sustain', {
              'keyboard_footer--active' : this.props.sustain
            })}
            onMouseDown={this.props.onSustain}
          />
        </div>
      </div>
    );
  }
}

export default Keyboard;
