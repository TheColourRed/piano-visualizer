import React from "react";

const lineWidth = 2;
const tuneF = 440; 
const xScale = 0.0001;
const yScale = 500;
const decayActive = 0.98;
const decayInActive = 0.75;
const intervalTime = 20;
const intervalIncrement = 0.25;

class Canvas extends React.Component {

  constructor(props) {
    super(props)
    this.amplitudes = new Map([]);
    this.amplitudeTotal = 0; 
  }

  state = {
    timeOffset: 0
  }

  componentDidMount() {
    this.interval = setInterval(this.updateOnInterval, intervalTime);
    this.updateCanvas();
  }
  
  componentDidUpdate() {
    for(var note of this.props.activeNotes) {
      if(!this.amplitudes.has(note)) {
        this.amplitudes.set(note, 1);
      }
    }
    this.updateCanvas();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  updateOnInterval = () => {
    this.setState({timeOffset: this.state.timeOffset + intervalIncrement});
    for (let [midi, amp] of this.amplitudes) {
      if(this.props.activeNotes.includes(midi) && amp > 0) {
        this.amplitudes.set(midi, amp * decayActive);
      } else if(amp > 0.01) {
        this.amplitudes.set(midi, amp * decayInActive);
      } else {
        this.amplitudes.delete(midi);
      }
    }
  }

  updateCanvas() {
    const ctx = this.refs.canvas.getContext('2d');
    let w = this.props.width;
    let h = this.props.height;
    let yOffset = h/2;
    let xOffset = w/2;
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = lineWidth;
    var gradient=ctx.createLinearGradient(100,0,w-100,0);
    gradient.addColorStop(0,'black');
    gradient.addColorStop(0.25,'red');
    gradient.addColorStop(0.75,'magenta');
    gradient.addColorStop(1,'black');

    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();
    ctx.moveTo(0, yOffset);

    let ampTotal = 0;
    for(let[, amp] of this.amplitudes) {
      ampTotal += amp;
    }

    for (var x = -5; x < w+5; x+=3) {
      let y = 0;
      for(let [midi] of this.amplitudes) {
        let frequency = this._midiToFrequency(midi) * xScale;
        let amplitude = this.amplitudes.get(midi) * yScale / (ampTotal + 1);
        let phase = this.state.timeOffset - xOffset;
        
        y += amplitude * Math.sin((frequency * x + phase));
      }
      ctx.lineTo(x, y + yOffset);
    }

    ctx.strokeStyle=gradient;
    ctx.stroke();
  }

  _midiToFrequency = midi => Math.pow(2, (midi-69)/12) * tuneF;

  render() {
    return (
      <canvas ref="canvas" width={this.props.width} height={this.props.height}/>
    );
  }
}

export default Canvas;
