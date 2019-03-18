import React from "react";
import Canvas from "./Canvas";
import Keyboard from "./Keyboard";
import Dashboard from "./Dashboard";
import GradientColorPicker from "./GradientColorPicker"
import themes from './res/Themes';
import CustomProperties from "react-custom-properties";
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
      colors: themes[0].value.colors,
      colorValues: themes[0].value.values
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
    let arr = [...this.state.colors];
    arr[index] = color.rgb;
    this.setState({ colors: arr })
  }

  onColorValueChange = (colorValues) => {
    this.setState({ colorValues: colorValues })
  }

  addColorStop = () => {
    let colorArr = [...this.state.colors];
    let valueArr = [];
    
    colorArr.push(colorArr[colorArr.length-1]);
    for(var i = 1; i <= colorArr.length; i++) {
      valueArr.push(Math.floor(i * 100 / (colorArr.length + 1)));
    }

    this.setState({ colors: colorArr, colorValues: valueArr })
  }

  removeColorStop = () => {
    let colorArr = [...this.state.colors];
    let valueArr = [];
    
    colorArr.pop();
    for(var i = 1; i <= colorArr.length; i++) {
      valueArr.push(Math.floor(i * 100 / (colorArr.length + 1)));
    }

    this.setState({ colors: colorArr, colorValues: valueArr });
  }

  setTheme = (theme) => {
    console.log(theme);
    this.setState({ colors: theme.colors, colorValues: theme.values });
  }

  setGradient = () => {
    let gradient = `linear-gradient(to right, `
    for(var i = 0; i < this.state.colors.length; i++) {
      gradient += `rgba(${ this.state.colors[i].r }, ${ this.state.colors[i].g }, ${ this.state.colors[i].b}, 1) ${this.state.colorValues[i]}%`;
      if(i < this.state.colors.length - 1) {
        gradient += ', '
      }
    }
    gradient += ')';
    return gradient;
  }

  render() {
    return (
      <div className="visualizer">
        <CustomProperties global properties={{'--main-gradient': this.setGradient()}}/>
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
        <div className="gradientColorPicker">
          <GradientColorPicker
            colors={this.state.colors}
            colorValues={this.state.colorValues}
            onColorChange={this.onColorChange}
            onColorValueChange={this.onColorValueChange}
          />
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
            colorStopCount={this.state.colors.length}
            onAddColorStop={this.addColorStop}
            onRemoveColorStop={this.removeColorStop}
            setTheme={this.setTheme}
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
