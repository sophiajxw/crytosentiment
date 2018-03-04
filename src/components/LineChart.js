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

  getSvgX(x) {
    const { svgWidth } = this.props;
    return (x / this.getMaxX() * svgWidth);
  }
  getSvgY(y) {
    const { svgHeight } = this.props;
    return svgHeight - (y / this.getMaxY() * svgHeight);
  }

  makePath() {
    const { data, color } = this.props;
    let pathD = 'M ' + this.getSvgX(data[0].x) + ' ' + this.getSvgY(data[0].y) + ' ';
    pathD += data.map((point, i) => {
      return 'L ' + this.getSvgX(point.x) + ' ' + this.getSvgY(point.y) + ' ';
    });
    return (
      <path className="linechart_path" d={pathD} style={{ stroke: color }} />
    );
  }

  makeAxis() {
    const minX = this.getMinX();
    const maxX = this.getMaxX();
    const minY = this.getMinY();
    const maxY = this.getMaxY();

    console.log(minX);
    console.log(maxX);
    console.log(minY);
    console.log(maxY);

    return (
      <g className="linechart_axis">
        <line
          x1={this.getSvgX(minX)} y1={this.getSvgY(minY)}
          x2={this.getSvgX(maxX)} y2={this.getSvgY(minY)}
        />
        <line
          x1={this.getSvgX(minX)} y1={this.getSvgY(minY)}
          x2={this.getSvgX(minX)} y2={this.getSvgY(maxY)}
        />
      </g>
    );
  }

  render() {
    const { svgHeight, svgWidth } = this.props;
    return (
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
        {this.makePath()}
        {this.makeAxis()}
      </svg>
    );
  }
}
LineChart.defaultProps = {
  data: [],
  color: '#f22183',
  svgHeight: 500,
  svgWidth: 500,
};

export default LineChart;
