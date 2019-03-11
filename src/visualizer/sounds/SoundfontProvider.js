import React from "react";
import PropTypes from "prop-types";
import Soundfont from "soundfont-player";

class SoundfontProvider extends React.Component {
  static propTypes = {
    instrumentName: PropTypes.string.isRequired,
    sustain: PropTypes.bool.isRequired,
    onPlayNote: PropTypes.func,
    onStopNote: PropTypes.func,
    hostname: PropTypes.string.isRequired,
    format: PropTypes.oneOf(["mp3", "ogg"]),
    soundfont: PropTypes.oneOf(["MusyngKite", "FluidR3_GM"]),
    audioContext: PropTypes.instanceOf(window.AudioContext)
  };

  static defaultProps = {
    format: "mp3",
    soundfont: "MusyngKite",
    instrumentName: "acoustic_grand_piano"
  };

  constructor(props) {
    super(props);
    this.state = {
      activeAudioNodes: {},
      instrument: null
    };

    this.playNote = this.playNote.bind(this);
  }

  componentDidMount() {
    this.loadInstrument(this.props.instrumentName);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.instrumentName !== this.props.instrumentName) {
      this.loadInstrument(this.props.instrumentName);
    }
  }

  loadInstrument = instrumentName => {
    // Re-trigger loading state
    this.setState({
      instrument: null
    });
    Soundfont.instrument(this.props.audioContext, instrumentName, {
      format: this.props.format,
      soundfont: this.props.soundfont,
      nameToUrl: (name, soundfont, format) => {
        return `${this.props.hostname}/${soundfont}/${name}-${format}.js`;
      }
    }).then(instrument => {
      this.setState({
        instrument
      });
    });
  };

  playNote = midiNumber => {
    this.props.audioContext.resume().then(() => {
      const audioNode = this.state.instrument.play(midiNumber);
      this.setState({
        activeAudioNodes: Object.assign({}, this.state.activeAudioNodes, {
          [midiNumber]: audioNode
        })
      });
      this.props.onPlayNote(midiNumber);
    });
  };

  stopNote = midiNumber => {
    this.props.audioContext.resume().then(() => {
      // This sets held notes only and sustain should not be acknowledged
      this.props.onStopNote(midiNumber); 
      if (this.props.sustain) {
        const audioNode = this.state.activeAudioNodes[midiNumber];
        if (audioNode) {
          audioNode.stop();
        }
        return;
      }
      const audioNode = this.state.activeAudioNodes[midiNumber];
      audioNode.stop();
      this.setState({
        activeAudioNodes: Object.assign({}, this.state.activeAudioNodes, {
          [midiNumber]: null
        })
      });
    });
  };

  // Clear any residual notes that don't get called with stopNote
  stopAllNotes = () => {
    this.props.audioContext.resume().then(() => {
      const activeAudioNodes = Object.values(this.state.activeAudioNodes);
      activeAudioNodes.forEach(node => {
        if (node) {
          node.stop();
        }
      });
      this.setState({
        activeAudioNodes: {}
      });
    });
  };

  render() {
    return this.props.render({
      isLoading: !this.state.instrument,
      playNote: this.playNote,
      stopNote: this.stopNote,
      stopAllNotes: this.stopAllNotes
    });
  }
}

export default SoundfontProvider;
