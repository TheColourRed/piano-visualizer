import React from "react";
import Canvas from "./Canvas";
import Keyboard from "./Keyboard";
import Dashboard from "./Dashboard";
import ContainerDimensions from 'react-container-dimensions'

class Visualizer extends React.Component {
  
  state = {
    activeNotes: [10]
  };

  setActiveNotes = value => {
    this.setState({
      activeNotes: Object.assign({}, this.state.activeNotes, value),
    });
  };

  render() {
    return (
      <div className="visualizer">
        <div className="canvas-border-wrap"><div className="canvas">
          <ContainerDimensions>
            { ({ width, height }) => 
              <Canvas width={width} height={height} activeNotes={this.state.activeNotes} />
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
            activeNotes={this.state.activeNotes}
            setActiveNotes={this.setActiveNotes}
          />
        </div>
      </div>
    );
  }
}

export default Visualizer;
