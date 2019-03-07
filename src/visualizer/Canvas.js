import React from "react";

const lineWidth = 3;
const tuneF = 440; 
const xScale = 0.0001;
const yScale = 500;
const intervalTime = 20;
const intervalIncrement = 0.25;

class Canvas extends React.Component {

  constructor(props) {
    super(props)
    this.amplitudes = new Map([]);
  }

  state = {
    timeOffset: 0
  }

  componentDidMount() {
    this.interval = setInterval(this.updateIntervals, intervalTime);
    this.updateCanvas();
  }
  
  componentDidUpdate() {
    this.props.activeNotes.forEach((note) => {
      if(!this.amplitudes.has(note)) {
        this.amplitudes.set(note, 1);
      }
    });
    this.updateCanvas();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  updateIntervals = () => {
    this.setState({timeOffset: this.state.timeOffset + intervalIncrement});
    this.amplitudes.forEach((value, key, map) => {
      console.log(value);
      if(this.props.activeNotes.includes(key)) {
        if(value > 0) {
          map.set(key, value - 0.01);
        }
      } else {
        map.delete(key);
      }
    });
  }

  updateCanvas() {
    const ctx = this.refs.canvas.getContext('2d');
    let w = this.props.width;
    let h = this.props.height;
    let yOffset = h/2;
    let xOffset = w/2;
    
    ctx.lineWidth = lineWidth;
    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();

    ctx.moveTo(0, yOffset);
    ctx.lineTo(w, yOffset);
    ctx.moveTo(xOffset, 0);
    ctx.lineTo(xOffset, h);
    
    ctx.moveTo(0, yOffset);
    let aTotal = Array.from(this.amplitudes.values()).reduce(((s, a) => s + a),1);
    for (var x = -5; x < w+5; x++) {
      let y = 0;
      for(var i = 0; i < this.props.activeNotes.length; i++) {
        let midi = this.props.activeNotes[i];
        let frequency = this._midiToFrequency(midi) * xScale;
        let amplitude = this.amplitudes.get(midi) * yScale / aTotal;
        let phase = this.state.timeOffset - xOffset;
        y += amplitude * Math.sin((frequency * x + phase));
        // console.log(`midi: ${midi}, frequency: ${frequency}, amplitude: ${amplitude}, phase: ${phase}, y: ${y}`);
      }
      ctx.lineTo(x, y + yOffset);
    }

    ctx.stroke();
  }

  _midiToFrequency = midiNumber => Math.pow(2, (midiNumber-69)/12) * tuneF;

  render() {
    return (
      <canvas ref="canvas" width={this.props.width} height={this.props.height}/>
    );
  }
}

export default Canvas;
