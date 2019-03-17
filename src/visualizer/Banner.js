import React from "react";

class Banner extends React.Component {
  render() {
    return (
      <div className="banner">
        <img className="banner--text" src={require('./res/SINE WAVES & SUMS.svg')} alt={'Sine waves & Sums'}/>
        <div className="banner--gradient"/>
      </div>
    );
  }
}

export default Banner;
