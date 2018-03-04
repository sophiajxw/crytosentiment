import React, { Component } from 'react';

class LineChart extends Component {

  getMinX() {
    const { data } = this.props;
    return data[0].x;
  }
  getMaxX() {
    const { data } = this.props;
    return data[data.length - 1].x;
  }
  // GET MAX & MIN Y
  getMinY() {
    const { data } = this.props;
    return data.reduce((min, p) => p.y < min ? p.y : min, data[0].y);
  }

  getMaxY() {
    const { data } = this.props;
    return data.reduce((max, p) => p.y > max ? p.y : max, data[0].y);
  }

  render() {
    return (
      <svg>
      </svg>
    );
  }
}
LineChart.defaultProps = {
  data: [],
  color: '#2196F3',
  svgHeight: 300,
  svgWidth: 700,
};
export default LineChart;
