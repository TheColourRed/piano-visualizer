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
      stickyKey: false,
      sustain: false,
      exposure: 25,
      phaseChange: 2.5
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

  letGoNote = midiNumber => {
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

  toggleSustain = () => this.setState({sustain: !this.state.sustain});
  
  toggleStickyKey = () => {
    this.setState({
      pressedNotes: [],
      stickyKey: !this.state.stickyKey
    });
  }

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
                stickyKey={this.state.stickyKey}
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
            stickyKey={this.state.stickyKey}
            onStickyKey={this.toggleStickyKey}
          />
        </div>
        <div className="keyboard">
          <Keyboard 
            onPlayNote={this.pressNote}
            onStopNote={this.letGoNote}
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
