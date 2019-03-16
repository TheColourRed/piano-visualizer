import React from "react";
import ReactDOM from 'react-dom';
// import PropTypes from "prop-types";
import { ChromePicker } from 'react-color';
import { Range } from 'react-range';
import { CSSTransition } from "react-transition-group"

const MAX = 100;
const MIN = 0;
const STEP = 1;

class GradientColorPicker extends React.Component {
  constructor(props) {
    super(props)
  
    this.state = {
      displayColorPicker: [false, false, false],
      colors: [
        {
          r: '220',
          g: '20',
          b: '60',
          a: '1',
        }, {
          r: '255',
          g: '0',
          b: '255',
          a: '1',
        }, {
          r: '96',
          g: '125',
          b: '139',
          a: '1',
        }
      ],
      values: [25, 50, 75],
      disableRange: false
    }
  }

  componentWillMount() {
    document.addEventListener('click', this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, false);
  }

  handleClick = e => {
    if(!ReactDOM.findDOMNode(this).contains(e.target)) {
      var arr = [];
      for(var i = 0; i < this.state.displayColorPicker.length; i++) {
        arr.push(false);
      }
      this.setState({ displayColorPicker: arr })
    }
  }

  handleChange = (color, index) => {
    let arr = [...this.state.colors];
    arr[index] = color.rgb;
    this.setState({colors: arr});
  };

  setColorPicker = (index, value) => {
    let arr = this.state.displayColorPicker;
    arr[index] = value;
    this.setState({ displayColorPicker: arr })
  };

  renderThumb = ({ props, isDragged, index }) => {
    let mid = (MAX - MIN)/2;

    return (
      <div className="gradientColorPicker_track_thumb--container" {...props}>
        <div className="gradientColorPicker_track_thumb" 
          onMouseDown={() => this.setColorPicker(index, !this.state.displayColorPicker[index])} 
          style={{...props.style, 
            backgroundColor: `rgba(${ this.state.colors[index].r }, ${ this.state.colors[index].g }, ${ this.state.colors[index].b}, 1)`
          }}
        />
        <CSSTransition
          in={this.state.displayColorPicker[index]}
          timeout={300}
          unmountOnExit
          classNames="gradientColorPicker_picker"
        >
          <div 
            onMouseEnter={() => this.setState({disableRange: true})} 
            onMouseLeave={() => {
              this.setState({disableRange: false});
              this.setColorPicker(index, false);
            }} 
            style={{
              transform: `translate(${(-100 * ((this.state.values[index] - mid)/mid)) - 100}px, 20px)`
            }}
          >
            <ChromePicker disableAlpha={true} color={ this.state.colors[index] } onChange={ (color) => this.handleChange(color, index) } />
          </div> 
        </CSSTransition>
      </div>
    );
  }
  
  getRenderTrack(values, min, max) {
    return ({ props, children }) => (
      <div className="gradientColorPicker--container">
        <div className="gradientColorPicker--progress"
          style={{...props.style}}
        >
          <div {...props} className="gradientColorPicker_track">
            {children}
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="gradientColorPicker">
        <Range 
          disabled={this.state.disableRange}
          allowOverlap
          values={this.state.values}
          step={STEP}
          min={MIN}
          max={MAX}
          onChange={values => this.setState({ values })}
          renderTrack={this.getRenderTrack(this.state.values, MIN, MAX)}
          renderThumb={this.renderThumb}
        />
      </div>
    );
  }
}

export default GradientColorPicker;