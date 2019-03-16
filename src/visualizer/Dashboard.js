import React from "react";
import PropTypes from "prop-types";
import classNames from 'classnames';
import { Range, getTrackBackground } from 'react-range';


  const exposureMax = 100;
  const exposureMin = 0;
  const exposureStep = 5;

  const phaseMax = 100;
  const phaseMin = 0;
  const phaseStep = 0.5;

  const scaleMax = 10;
  const scaleMin = 1;
  const scaleStep = 1;

  const translateMax = 999;
  const translateMin = -999;
  const translateStep = 1;

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
    onStickyKey:  PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      exposure: [this.props.exposure],
      phaseChange: [this.props.phaseChange],
      scale: [this.props.scale],
      translate: [this.props.translate] 
    }
  }

  renderThumb = ({ props }) => (
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

  render() {
    return (
      <div className="h-100 container-fluid">
        <div className="h-100 row vertical-align">
          <div className="col-4">
            <label>Sticky Keys - No Decay</label>
            <div className={classNames('dashboard_button', {
                'dashboard--toggle-on' : this.props.stickyKey
              })}
              onMouseDown={this.props.onStickyKey}
            />
          </div>
          <div className="col-4">
            <label>{`Scale: X${this.state.scale}`}</label>
            <Range 
              max={scaleMax} 
              min={scaleMin} 
              step={scaleStep}
              values={this.state.scale} 
              renderTrack={this.getRenderTrack(this.state.scale, scaleMin, scaleMax)}
              renderThumb={this.renderThumb}
              onChange={value => {
                  this.setState({scale: value}); 
                  this.props.setScale(value[0])}} 
            />
          </div>
          <div className="col-4">
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
          <div className="col-4">
              {/* Column for other buttons */}
          </div>
          <div className="col-4">
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
          <div className="col-4">
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
      </div>
    );
  }
}

export default Dashboard;
