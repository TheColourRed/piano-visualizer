import React from "react";
import Canvas from "./Canvas";
import Keyboard from "./Keyboard";
import Dashboard from "./Dashboard";
import ContainerDimensions from 'react-container-dimensions'

class Visualizer extends React.Component {
  
  state = {
    activeNotes: []
  };

  addActiveNote = midiNumber => {
    if(this.state.activeNotes.includes(midiNumber)) {
      return;
    } else {
      this.setState({
        activeNotes: this.state.activeNotes.concat(midiNumber)
      });
    }
  }

  removeActiveNote = midiNumber => {
    if(this.state.activeNotes.includes(midiNumber)) {
      let arr = [...this.state.activeNotes];
      arr.splice(arr.indexOf(midiNumber),1);
      this.setState({activeNotes: arr});
    }
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
                activeNotes={this.state.activeNotes}
              />
            }
          </ContainerDimensions>
          </div></div>
        <div className="dashboard">
          <div className="mt-4">
            <strong>Recorded notes</strong>
            <div>{JSON.stringify(this.state.activeNotes)}</div>
          </div>
          <Dashboard />
        </div>
        <div className="keyboard">
          <Keyboard 
            addActiveNote={this.addActiveNote}
            removeActiveNote={this.removeActiveNote}
          />
        </div>
      </div>
    );
  }
}

export default Visualizer;
