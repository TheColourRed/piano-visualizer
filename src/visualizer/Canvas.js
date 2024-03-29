import React from "react";
import PropTypes from "prop-types";

const lineWidth = 3;
const tuneF = 440; 
const xScale = 0.0001;
const yScale = 0.95;
const exposureScale = 1.05;
const decayActive = 0.98;
const decayInActive = 0.60;

class Canvas extends React.Component {

  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    colors: PropTypes.arrayOf(PropTypes.object),
    colorValues: PropTypes.arrayOf(PropTypes.number),
    pressedNotes: PropTypes.arrayOf(PropTypes.number).isRequired,
    sustain: PropTypes.bool.isRequired,
    stickyKey: PropTypes.bool.isRequired,
    exposure: PropTypes.number.isRequired,
    phaseChange: PropTypes.number.isRequired,
    scale: PropTypes.number.isRequired,
    translate: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      phaseOffset: 0
    }

    this.amplitudes = new Map([]);
  }

  componentDidMount() {
    requestAnimationFrame(this.updateCanvas);
  }
  
  componentDidUpdate(prevProps) {
    this.updateAmplitudeAttack(prevProps);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  updatePhase = () => {
    this.setState({
      phaseOffset: this.state.phaseOffset + 2 * Math.PI * this.props.phaseChange / 100
    });
  }

  updateAmplitudeAttack = (prevProps) => {
    if(prevProps.sustain && prevProps.sustain !== this.props.sustain) {
      this.amplitudes.clear();
    }

    for(var note of this.props.pressedNotes) {
      if(!prevProps.pressedNotes.includes(note)) {
        this.amplitudes.set(note, 1);
      }
    }
  }

  updateAmplitudeDecay = () => {
    for (let [midi, amp] of this.amplitudes) {
      if(this.props.stickyKey) {
        if(!this.props.pressedNotes.includes(midi)) {
          this.amplitudes.delete(midi);
        }
      } else if(amp < 0.002) {
        this.amplitudes.delete(midi);
      } else if (this.props.sustain || this.props.pressedNotes.includes(midi)) {
        this.amplitudes.set(midi, amp * decayActive);
      } else {
        this.amplitudes.set(midi, amp * decayInActive);
      }
    }
  }

  buildGradient = gradient => {
    for(var i = 0; i < this.props.colors.length; i++) {
      gradient.addColorStop(
        this.props.colorValues[i]/100, 
        `rgba(${ this.props.colors[i].r }, ${ this.props.colors[i].g }, ${ this.props.colors[i].b}, 1)`);
    }
    return gradient;
  }

  midiToFrequency = midi => Math.pow(2, (midi-69)/12) * tuneF;

  getNormalizationScale = () => {
    let scale = 0;
    for(let [,amp] of this.amplitudes) {
      scale += amp;
    }
    return scale < 1 ? 1 : 1/scale;
  }

  updateCanvas = () => {
    const ctx = this.refs.canvas.getContext('2d');
    let w = this.props.width;
    let h = this.props.height;
    let yOffset = h/2;
    let xOffset = w/2;
    
    ctx.lineJoin = 'round';
    ctx.lineWidth = lineWidth;

    ctx.strokeStyle = this.buildGradient(ctx.createLinearGradient(0,0,w,0));

    ctx.fillStyle = `rgba(0,0,0,${Math.pow(exposureScale, -this.props.exposure)})`;
    ctx.fillRect(0, 0, w, h);

    ctx.beginPath();

    let normalizeScale = this.getNormalizationScale();
    let phase = - this.state.phaseOffset;
    for (var x = -5; x < w+5; x+=3) {
      let y = yOffset;
      for(let [midi] of this.amplitudes) {
        let frequency = this.midiToFrequency(midi) * xScale;
        let amplitude = (yScale * yOffset) * (this.amplitudes.get(midi) * normalizeScale);
        
        y += amplitude * Math.sin(frequency * (this.props.scale * (x - xOffset - this.props.translate)) + phase);
      }
      ctx.lineTo(x, y);
    }
    
    ctx.lineTo(w+5, yOffset);

    ctx.stroke();

    this.updatePhase();
    this.updateAmplitudeDecay();
    requestAnimationFrame(this.updateCanvas);
  } 

  render() {
    return (
      <canvas ref="canvas" width={this.props.width} height={this.props.height}/>
    );
  }
}

export default Canvas;
