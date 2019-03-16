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

class Dashboard extends React.Component {
  
  static propTypes = {
    exposure: PropTypes.number.isRequired,
    setExposure: PropTypes.func,
    phaseChange: PropTypes.number.isRequired,
    setPhaseChange: PropTypes.func,
    stickyKey: PropTypes.bool.isRequired,
    onStickyKey:  PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.state = {
      exposure: [this.props.exposure],
      phaseChange: [this.props.phaseChange]
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
        <div className="dashboard_track--outer"
          style={{...props.style,
            background: getTrackBackground({
            values: values,
            colors: ["transparent", "#666"],
            min: min,
            max: max
            })
          }}
        >
          <div {...props} className="dashboard_track--inner">
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
          <div className="col-6">
          <label>Sticky Keys - No Decay</label>
            <div className={classNames('dashboard_button', {
                'dashboard--toggle-on' : this.props.stickyKey
              })}
              onMouseDown={this.props.onStickyKey}
            />
          </div>
          <div className="col-6">
            <div>
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
                    this.props.setExposure(value)}} 
              />
            </div>
          </div>
          <div className="col-6"/>
          <div className="col-6">
            <div>
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
                  this.props.setPhaseChange(value)}} 
              />       
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
