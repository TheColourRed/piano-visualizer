import React from "react";
import Canvas from "./Canvas";
import Keyboard from "./Keyboard";
import Dashboard from "./Dashboard";
import ContainerDimensions from 'react-container-dimensions'

class Visualizer extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      pressedNotes: [],
      sustain: false,
      exposure: 20,
      phaseChange: 1
    };
  }

  pressNote = midiNumber => {
    if(this.state.pressedNotes.includes(midiNumber)) {
      return;
    } else {
      this.setState({
        pressedNotes: this.state.pressedNotes.concat(midiNumber)
      });
    }
  }

  letGoNote = midiNumber => {
    if(this.state.pressedNotes.includes(midiNumber)) {
      let arr = [...this.state.pressedNotes];
      arr.splice(arr.indexOf(midiNumber),1);
      this.setState({pressedNotes: arr});
    }
  }

  toggleSustain = () => this.setState({sustain: !this.state.sustain});

  setExposure = value => this.setState({exposure: value});

  setPhaseChange = value =>  this.setState({phaseChange: value});

  render() {
    return (
      <div className="visualizer">
        <div className="canvas-border-wrap"><div className="canvas">
          <ContainerDimensions>
            { ({ width, height }) => 
              <Canvas 
                width={width} 
                height={height} 
                pressedNotes={this.state.pressedNotes}
                sustain={this.state.sustain}
                exposure={this.state.exposure}
                phaseChange={this.state.phaseChange}
              />
            }
          </ContainerDimensions>
          </div></div>
        <div className="dashboard">
          <Dashboard 
            exposure={this.state.exposure}
            setExposure={this.setExposure}
            phaseChange={this.state.phaseChange}
            setPhaseChange={this.setPhaseChange}
          />
        </div>
        <div className="keyboard">
          <Keyboard 
            onPlayNote={this.pressNote}
            onStopNote={this.letGoNote}
            sustain={this.state.sustain}
            onSustain={this.toggleSustain}
          />
        </div>
      </div>
    );
  }
}

export default Visualizer;
