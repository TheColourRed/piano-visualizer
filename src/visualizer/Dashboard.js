import React from "react";
import PropTypes from "prop-types";
import classNames from 'classnames';
import Select from 'react-select';
import { Range, getTrackBackground } from 'react-range';
import themes from './res/Themes';

  const exposureMax = 100;
  const exposureMin = 0;
  const exposureStep = 5;

  const phaseMax = 100;
  const phaseMin = 0;
  const phaseStep = 0.5;

  const scaleMax = 5;
  const scaleMin = -5;
  const scaleStep = 1;

  const translateMax = 999;
  const translateMin = -999;
  const translateStep = 1;

  const colorStopMax = 10;
  const colorStopMin = 2;

class Dashboard extends React.Component {
  
  static propTypes = {
    exposure: PropTypes.number.isRequired,
    setExposure: PropTypes.func.isRequired,
    phaseChange: PropTypes.number.isRequired,
    setPhaseChange: PropTypes.func.isRequired,
    scale: PropTypes.number.isRequired,
    setScale: PropTypes.func.isRequired,
    translate: PropTypes.number.isRequired,
    setTranslate: PropTypes.func.isRequired,
    stickyKey: PropTypes.bool.isRequired,
    onStickyKey:  PropTypes.func.isRequired,
    colorStopCount: PropTypes.number.isRequired,
    onAddColorStop: PropTypes.func.isRequired,
    onRemoveColorStop: PropTypes.func.isRequired,
    setTheme: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      exposure: [this.props.exposure],
      phaseChange: [this.props.phaseChange],
      scaleRange: [this.scaleToRange(this.props.scale)],
      translate: [this.props.translate] 
    }
  }

  renderThumb = ({ props, isDragged }) => (
    <div className="dashboard_track_thumb"
      {...props}
      style={{...props.style}}
    />
  )

  getRenderTrack(values, min, max) {
    return ({ props, children}) => (
      <div className="dashboard_track--container">
        <div className="dashboard_track--progress"
          style={{...props.style,
            background: getTrackBackground({
              values: values,
              colors: ["transparent", "#666"],
              min: min,
              max: max
            })
        }}>
          <div {...props} className="dashboard_track">
            {children}
          </div>
        </div>
      </div>
    )
  }

  scaleToRange = (value) => {
    return Math.log(value)/Math.log(2);
  }

  rangeToScale = (value) => {
    return 2 ** value;
  }

  rangeToScaleString = (value) => {
    return value >= 0 ? 2 ** value : `1/${2 ** -(value)}`;
  }

  render() {
    let selectStyle = {
      control: styles => ({ ...styles, borderColor: 'black', backgroundColor: '#404040', color: 'white'}),
      placeholder: styles => ({ ...styles,  borderColor: 'black', color: 'white' }),
      singleValue: (styles, { data }) => ({ ...styles, borderColor: 'black', color: 'white' }),
      option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        return {...styles,
          backgroundColor: isDisabled ? null : isSelected ? 'black' : isFocused ? 'lightgrey' : 'grey',
          color: isDisabled ? '#ccc' : isSelected ? 'white' : 'black',
        };
      },
    }
    let selectTheme = (theme) => ({
      ...theme,
      borderRadius: '4px',
      spacing: {
        ...theme.spacing,
        controlHeight: '25px',
        baseUnit: '1',
        menuGutter: '4'
      },
      colors: {
      ...theme.colors,
        primary: 'black'
      },
    });

    return (
      <div className="h-100 container-fluid"> 
        <div className="h-100 row vertical-align">
        {/* Right Column */}
        <div className="col-4 h-100">
            <div className="row h-50 py-2 vertical-align">
              <label>{`Translate: ${this.state.translate} rads`}</label>
              <Range 
                max={translateMax} 
                min={translateMin} 
                step={translateStep}
                values={this.state.translate} 
                renderTrack={this.getRenderTrack(this.state.translate, translateMin, translateMax)}
                renderThumb={this.renderThumb}
                onChange={value => {
                    this.setState({translate: value}); 
                    this.props.setTranslate(value[0])}} 
              />
            </div>
            <div className="row h-50 py-2 vertical-align">
              <label>{`Scale: X${this.rangeToScaleString(this.state.scaleRange)}`}</label>
              <Range 
                max={scaleMax} 
                min={scaleMin} 
                step={scaleStep}
                values={this.state.scaleRange} 
                renderTrack={this.getRenderTrack(this.state.scaleRange, scaleMin, scaleMax)}
                renderThumb={this.renderThumb}
                onChange={value => {
                    this.setState({scaleRange: value}); 
                    this.props.setScale(this.rangeToScale(value[0]))}} 
              />
            </div>
          </div>
          {/* Middle Column */}
          <div className="col-4 h-100">
            <div className="row h-50 py-2 vertical-align">
              <label>{`Exposure: ${this.state.exposure}%`}</label>
              <Range 
                max={exposureMax} 
                min={exposureMin} 
                step={exposureStep}
                values={this.state.exposure} 
                renderTrack={this.getRenderTrack(this.state.exposure, exposureMin, exposureMax)}
                renderThumb={this.renderThumb}
                onChange={value => {
                    this.setState({exposure: value}); 
                    this.props.setExposure(value[0])}} 
              />
            </div>
            <div className="row h-50 py-2 vertical-align">
              <label>{`Δ Phase: ${Number(this.state.phaseChange).toFixed(1)}% 2π/frame`}</label>
              <Range 
                max={phaseMax}
                min={phaseMin} 
                step={phaseStep}
                values={this.state.phaseChange} 
                renderTrack={this.getRenderTrack(this.state.phaseChange, phaseMin, phaseMax)}
                renderThumb={this.renderThumb}
                onChange={value => {
                  this.setState({phaseChange: value}); 
                  this.props.setPhaseChange(value[0])}} 
              />       
            </div>
          </div>
          {/* Right column */}
          <div className="col-2 h-100">
            <div className="row h-50 py-2 vertical-align">
              <label>Sticky Keys - No Decay</label>
              <div className="w-100">
                <div className={classNames('dashboard_button', {
                    'dashboard--toggle-on' : this.props.stickyKey
                  })}
                  onMouseDown={this.props.onStickyKey}
                />
              </div>
            </div>
            <div className="h-50 row vertical-align">
                
            </div>
          </div>
          {/* Far Right column */}
          <div className="col-2 h-100">
            <div className="row h-50 pb-1 vertical-align">
              <label>{`Color stops: ${this.props.colorStopCount}`}</label>
              <div className="w-100 px-5">
                <div className="dashboard_button--up" 
                  onMouseDown={this.props.colorStopCount < colorStopMax ? this.props.onAddColorStop : null}/>
                <div className="dashboard_button--down" 
                  onMouseDown={this.props.colorStopCount > colorStopMin ? this.props.onRemoveColorStop : null}/>
              </div>
            </div>
            <div className="row h-50 py-2 vertical-align">
              <div className="w-100 px-3">
                <div className="dashboard_select--gradient-wrap">
                  <Select 
                    menuPlacement="top" 
                    options={themes}
                    defaultValue={themes[0]}
                    label="Themes"
                    styles={selectStyle}
                    theme={selectTheme}
                    onChange={(option) => this.props.setTheme(option.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
