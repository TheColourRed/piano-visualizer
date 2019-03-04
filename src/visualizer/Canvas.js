import React from "react";

const lineWidth = 3;

class Canvas extends React.Component {

  componentDidMount() {
    this.updateCanvas();
  }
  
  componentDidUpdate() {
    this.updateCanvas();
  }

  updateCanvas() {
    const ctx = this.refs.canvas.getContext('2d');
    let w = this.props.width;
    let h = this.props.height;
    let yOffset = h/2;
    let xOffset = w/2;
    
    console.log(this.props.activeNotes);
    let m = this.props.activeNotes;
    let f = Math.pow(2, (m-69)/12) * 440;

    ctx.lineWidth = lineWidth;
    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();
    ctx.moveTo(0, yOffset);

    for (var x = -5; x < w+5; x++) {
      let y = 300 * Math.sin(0.0001 * f * x);
      ctx.lineTo(x, y + yOffset);
    }

    ctx.stroke();
  }

  render() {
    return (
      <canvas ref="canvas" width={this.props.width} height={this.props.height}/>
    );
  }
}

export default Canvas;
