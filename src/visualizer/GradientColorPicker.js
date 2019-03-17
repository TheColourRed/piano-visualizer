import React from "react";
import ReactDOM from 'react-dom';
import PropTypes from "prop-types";
import { ChromePicker } from 'react-color';
import { Range } from 'react-range';
import { CSSTransition } from "react-transition-group"

const MAX = 100;
const MIN = 0;
const STEP = 1;

class GradientColorPicker extends React.Component {

  static propTypes = {
    colors: PropTypes.arrayOf(PropTypes.object),
    colorValues: PropTypes.arrayOf(PropTypes.number),
    onColorChange: PropTypes.func,
    onColorValueChange: PropTypes.func
  }

  constructor(props) {
    super(props)
  
    this.state = {
      displayColorPicker: [false, false, false],
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

  setDisplayColorPicker = (index, value) => {
    let arr = this.state.displayColorPicker;
    arr[index] = value;
    this.setState({ displayColorPicker: arr })
  };

  renderThumb = ({ props, isDragged, index }) => {
    let mid = (MAX - MIN)/2;

    return (
      <div className="gradientColorPicker_track_thumb--container" {...props}>
        <div className="gradientColorPicker_track_thumb" 
          onMouseDown={() => this.setDisplayColorPicker(index, !this.state.displayColorPicker[index])} 
          style={{...props.style, 
            backgroundColor: `rgba(${ this.props.colors[index].r }, ${ this.props.colors[index].g }, ${ this.props.colors[index].b}, 1)`
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
              this.setDisplayColorPicker(index, false);
            }} 
            style={{
              transform: `translate(${(-100 * ((this.props.colorValues[index] - mid)/mid)) - 100}px, -235px)`
            }}
          >
            <ChromePicker disableAlpha={true} color={ this.props.colors[index] } onChange={ (color) => this.props.onColorChange(color, index) } />
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
      <Range 
        disabled={this.state.disableRange}
        values={this.props.colorValues}
        step={STEP}
        min={MIN}
        max={MAX}
        onChange={values => this.props.onColorValueChange(values)}
        renderTrack={this.getRenderTrack(this.props.colorValues, MIN, MAX)}
        renderThumb={this.renderThumb}
      />
    );
  }
}

export default GradientColorPicker;