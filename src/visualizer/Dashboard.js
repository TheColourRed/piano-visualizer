import React from "react";
// import InputRange from 'react-input-range';
import { Range } from 'react-range';
// import 'react-input-range/lib/css/index.css';
class Dashboard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      exposure: [this.props.exposure],
      phaseChange: [this.props.phaseChange]
    }
  }

  renderTrack = ({ props, children }) => (
    <div
      {...props}
      style={{
        ...props.style,
        margin: 'auto',
        height: '0.625em',
        width: '80%',
        boxShadow: 'inset 0 3px 2px black',
        backgroundColor: 'dimGrey'
      }}
    >
      {children}
    </div>
  )

  renderThumb = ({ props }) => (
    <div
      {...props}
      style={{
        ...props.style,
        height: '0.625em',
        width: '0.625em',
        backgroundColor: '#ccc',
        borderLeft: 'black solid 0.2em',
        borderRight: 'black solid 0.2em'
      }}
    />
  )

  render() {
    return (
      <div className="h-100 container-fluid">
        <div className="h-100 row vertical-align">
          <div className="col-6">
            <div>
              <label>{`Exposure: ${this.state.exposure}%`}</label>
              <Range 
                max={100} 
                min={0} 
                step={5}
                values={this.state.exposure} 
                renderTrack={this.renderTrack}
                renderThumb={this.renderThumb}
                onChange={value => {
                    this.setState({exposure: value}); 
                    this.props.setExposure(value)}} 
              />
            </div>
          </div>
          <div className="w-100"></div>
          <div className="col-6">
            <div>
              <label>{`Δ Phase: ${this.state.phaseChange}% 2π/frame`}</label>
              <Range 
                max={100}
                min={0} 
                step={1}
                values={this.state.phaseChange} 
                renderTrack={this.renderTrack}
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
