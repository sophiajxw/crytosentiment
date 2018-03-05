import React, { Component } from 'react';

class ToolTip extends Component {
  render() {
    const { hoverLoc, activePoint } = this.props;
    const svgLocation = document.getElementsByClassName('linechart')[0].getBoundingClientRect();

    let placementStyles = {};
    placementStyles.width = '100px';
    placementStyles.left = hoverLoc + svgLocation.left - 50;

    return (
      <div className="hover" style={placementStyles}>
        <div className="date">{activePoint.d}</div>
        <div className="price">{activePoint.p}</div>
      </div>
    );
  }
}

export default ToolTip;
