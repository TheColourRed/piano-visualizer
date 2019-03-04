import React from "react";
import { Piano, KeyboardShortcuts, MidiNumbers } from "react-piano";
import SoundfontProvider from "./sounds/SoundfontProvider";
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

class Keyboad extends React.Component {

  onPlayNoteInput = midiNumber => {
    this.props.setActiveNotes({
      activeNotes: this.props.activeNotes.concat(midiNumber)
    });
  };

  render() {
    return (
      <div className="keyboard--felt h-100">
        <SoundfontProvider
          instrumentName="acoustic_grand_piano"
          audioContext={audioContext}
          hostname={soundfontHostname}
          render={({ isLoading, playNote, stopNote }) => (
            <Piano
              noteRange={noteRange}
              playNote={playNote}
              stopNote={stopNote}
              onPlayNoteInput={this.onPlayNoteInput}
              disabled={isLoading}
              keyboardShortcuts={keyboardShortcuts}
            />
          )}
        />
      </div>
    );
  }
}

export default Keyboad;
