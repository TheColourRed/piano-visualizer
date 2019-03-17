import React from "react";
import Canvas from "./Canvas";
import Keyboard from "./Keyboard";
import Dashboard from "./Dashboard";
import GradientColorPicker from "./GradientColorPicker"
import ContainerDimensions from 'react-container-dimensions'

class Visualizer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      pressedNotes: [],
      stickyKey: false,
      sustain: false,
      exposure: 25,
      phaseChange: 2.5,
      scale: 1,
      translate: 0,
      colors: [
        {r: '220', g: '20', b: '60', a: '1'}, 
        {r: '255', g: '0', b: '255', a: '1'}
      ],
      colorValues: [33, 66]
    };
  }

  pressNote = midiNumber => {
    if(!this.state.pressedNotes.includes(midiNumber)) {
      this.setState({
        pressedNotes: this.state.pressedNotes.concat(midiNumber)
      });
    } else if(this.state.stickyKey) {
      let arr = [...this.state.pressedNotes];
      arr.splice(arr.indexOf(midiNumber),1);
      this.setState({pressedNotes: arr});
    }
  }

  onStopNote = midiNumber => {
    if(this.state.stickyKey) {
      // The piano's active status is removed by the time this is called and needs to be re-rendered
      this.setState({pressedNotes: this.state.pressedNotes.slice()});
    } else if(this.state.pressedNotes.includes(midiNumber)) {
      let arr = [...this.state.pressedNotes];
      arr.splice(arr.indexOf(midiNumber),1);
      this.setState({pressedNotes: arr});
    }
  }
  
  setExposure = value => this.setState({exposure: value});
  
  setPhaseChange = value =>  this.setState({phaseChange: value});

  setScale = value => this.setState({scale: value});

  setTranslate = value => this.setState({translate: value});

  toggleSustain = () => this.setState({sustain: !this.state.sustain});
  
  toggleStickyKey = () => {
    this.setState({
      pressedNotes: [],
      stickyKey: !this.state.stickyKey
    });
  }

  onColorChange = (color, index) => {
    let arr = this.state.colors;
    arr[index] = color.rgb;
    this.setState({ colors: arr })
  }

  onColorValueChange = (colorValues) => {
    this.setState({ colorValues: colorValues })
  }

  render() {
    return (
      <div className="visualizer">
        <GradientColorPicker
          colors={this.state.colors}
          colorValues={this.state.colorValues}
          onColorChange={this.onColorChange}
          onColorValueChange={this.onColorValueChange}
        />
        <div className="canvas">
          <ContainerDimensions>
            {({ width, height }) => 
              <Canvas 
                width={width} 
                height={height} 
                colors={this.state.colors}
                colorValues={this.state.colorValues}
                pressedNotes={this.state.pressedNotes}
                sustain={this.state.sustain}
                stickyKey={this.state.stickyKey}
                exposure={this.state.exposure}
                phaseChange={this.state.phaseChange}
                scale={this.state.scale}
                translate={this.state.translate}
              />
            }
          </ContainerDimensions>
        </div>
        <div className="dashboard">
          <Dashboard 
            exposure={this.state.exposure}
            setExposure={this.setExposure}
            phaseChange={this.state.phaseChange}
            setPhaseChange={this.setPhaseChange}
            scale={this.state.scale} 
            setScale={this.setScale}
            translate={this.state.translate}
            setTranslate={this.setTranslate}
            stickyKey={this.state.stickyKey}
            onStickyKey={this.toggleStickyKey}
          />
        </div>
        <div className="keyboard">
          <Keyboard 
            onPlayNoteInput={this.pressNote}
            onStopNote={this.onStopNote}
            pressedNotes={this.state.stickyKey ? this.state.pressedNotes : undefined}
            sustain={this.state.sustain}
            onSustain={this.toggleSustain}
            stickyKey={this.state.stickyKey}
          />
        </div>
      </div>
    );
  }
}

export default Visualizer;
