import React from "react";

class Banner extends React.Component {
  render() {
    return (
      <div className="banner">
        <img className="banner--text" src={require('./res/SINE WAVES & SUMS.svg')} alt={'Sine waves & Sums'}/>
      </div>
    );
  }
}

export default Banner;
