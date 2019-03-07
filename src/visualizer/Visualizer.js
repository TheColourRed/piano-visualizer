import React from "react";
import Canvas from "./Canvas";
import Keyboard from "./Keyboard";
import Dashboard from "./Dashboard";
import ContainerDimensions from 'react-container-dimensions'

class Visualizer extends React.Component {
  
  state = {
    activeNotes: []
  };

  addActiveNote = noteNumber => {
    if(this.state.activeNotes.includes(noteNumber)) {
      return;
    } else {
      this.setState({
        activeNotes: this.state.activeNotes.concat(noteNumber)
      });
    }
  }

  removeActiveNote = noteNumber => {
    if(this.state.activeNotes.includes(noteNumber)) {
      this.setState({
        activeNotes: this.state.activeNotes.filter(note => note !== noteNumber)
      });
    } else {
      return;
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
