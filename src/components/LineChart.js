import React, { Component } from 'react';

// code adapted from https://github.com/bmorelli25/interactive-bitcoin-price-chart/
class LineChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hoverLoc: null,
      activePoint: null,
    };
  }

  getMinX() {
    const { data } = this.props;
    return data[0].x;
  }

  getMaxX() {
    const { data } = this.props;
    return data[data.length - 1].x;
  }

  getMinY() {
    const { data } = this.props;
    return data.reduce((min, p) => p.y < min ? p.y : min, data[0].y);
  }

  getMaxY() {
    const { data } = this.props;
    return data.reduce((max, p) => p.y > max ? p.y : max, data[0].y);
  }

  getSvgX(x) {
    const { svgWidth, yLabelSize } = this.props;
    return yLabelSize + (x / this.getMaxX() * (svgWidth - yLabelSize));
  }
  getSvgY(y) {
    const { svgHeight, xLabelSize } = this.props;
    return ((svgHeight - xLabelSize) * this.getMaxY() - (svgHeight - xLabelSize) * y) / (this.getMaxY() - this.getMinY());
  }

  makePath() {
    const { data, color } = this.props;
    let pathD = 'M ' + this.getSvgX(data[0].x) + ' ' + this.getSvgY(data[0].y) + ' ';

    pathD += data.map((point, i) => {
      return 'L ' + this.getSvgX(point.x) + ' ' + this.getSvgY(point.y) + ' ';
    }).join('');

    return (
      <path className="linechart_path" d={pathD} style={{ stroke: color }} />
    );
  }

  makeArea() {
    const { data } = this.props;
    let pathD = 'M ' + this.getSvgX(data[0].x) + ' ' + this.getSvgY(data[0].y) + ' ';

    pathD += data.map((point, i) => {
      return 'L ' + this.getSvgX(point.x) + ' ' + this.getSvgY(point.y) + ' ';
    }).join('');

    pathD += 'L ' + this.getSvgX(this.getMaxX()) + ' ' + this.getSvgY(this.getMinY()) + ' '
    + 'L ' + this.getSvgX(this.getMinX()) + ' ' + this.getSvgY(this.getMinY()) + ' ';

    return <path className="linechart_area" d={pathD} />;
  }

  makeAxis() {
    const { yLabelSize } = this.props;

    return (
      <g className="linechart_axis">
        <line
          x1={this.getSvgX(this.getMinX()) - yLabelSize} y1={this.getSvgY(this.getMinY())}
          x2={this.getSvgX(this.getMaxX())} y2={this.getSvgY(this.getMinY())}
          strokeDasharray="5"
        />
        <line
          x1={this.getSvgX(this.getMinX()) - yLabelSize} y1={this.getSvgY(this.getMaxY())}
          x2={this.getSvgX(this.getMaxX())} y2={this.getSvgY(this.getMaxY())}
          strokeDasharray="5"
        />
      </g>
    );
  }

  makeLabels() {
    const { svgHeight, svgWidth, xLabelSize, yLabelSize } = this.props;
    const padding = 5;
    return (
      <g className="linechart_label">
        {/* Y AXIS LABELS */}
        <text transform={`translate(${yLabelSize / 2}, 20)`} textAnchor="middle">
          {this.getMaxY().toLocaleString('us-EN', { style: 'currency', currency: 'USD' })}
        </text>
        <text transform={`translate(${yLabelSize / 2}, ${svgHeight - xLabelSize - padding})`} textAnchor="middle">
          {this.getMinY().toLocaleString('us-EN', { style: 'currency', currency: 'USD' })}
        </text>
        {/* X AXIS LABELS */}
        <text transform={`translate(${yLabelSize}, ${svgHeight})`} textAnchor="start">
          {this.props.data[0].d}
        </text>
        <text transform={`translate(${svgWidth}, ${svgHeight})`} textAnchor="end">
          {this.props.data[this.props.data.length - 1].d}
        </text>
      </g>
    );
  }

  getCoords(e) {
    const { svgWidth, data, yLabelSize } = this.props;
    const svgLocation = document.getElementsByClassName('linechart')[0].getBoundingClientRect();
    const adjustment = (svgLocation.width - svgWidth) / 2;
    const relativeLoc = e.clientX - svgLocation.left - adjustment;

    let svgData = [];
    data.map((point, i) => {
      svgData.push({
        svgX: this.getSvgX(point.x),
        svgY: this.getSvgY(point.y),
        d: point.d,
        p: point.p,
      });
    });

    let closestPoint = {};
    for (let i = 0, c = 500; i < svgData.length; i++) {
      if (Math.abs(svgData[i].svgX - this.state.hoverLoc) <= c) {
        c = Math.abs(svgData[i].svgX - this.state.hoverLoc);
        closestPoint = svgData[i];
      }
    }

    if (relativeLoc - yLabelSize < 0) {
      this.stopHover();
    } else {
      this.setState({
        hoverLoc: relativeLoc,
        activePoint: closestPoint,
      });
      this.props.onChartHover(relativeLoc, closestPoint);
    }
  }

  stopHover() {
    this.setState({ hoverLoc: null, activePoint: null });
    this.props.onChartHover(null, null);
  }

  makeActivePoint() {
    const { color, pointRadius } = this.props;
    return (
      <circle
        className="linechart_point"
        style={{ stroke: color }}
        r={pointRadius}
        cx={this.state.activePoint.svgX}
        cy={this.state.activePoint.svgY}
      />
    );
  }

  createLine() {
    const { svgHeight, xLabelSize } = this.props;
    return (
      <line className="hoverLine"
        x1={this.state.hoverLoc} y1={-8}
        x2={this.state.hoverLoc} y2={svgHeight - xLabelSize}
      />
    );
  }

  render() {
    const { svgHeight, svgWidth } = this.props;
    return (
      <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className={'linechart'}
        onMouseLeave={() => this.stopHover()}
        onMouseMove={(e) => this.getCoords(e)}
      >
        <g>
          {this.makeAxis()}
          {this.makePath()}
          {this.makeArea()}
          {this.makeLabels()}
          {this.state.hoverLoc ? this.createLine() : null}
          {this.state.hoverLoc ? this.makeActivePoint() : null}
        </g>
      </svg>
    );
  }
}

LineChart.defaultProps = {
  data: [],
  color: '#2196F3',
  pointRadius: 5,
  svgHeight: 300,
  svgWidth: 900,
  xLabelSize: 20,
  yLabelSize: 80,
};

export default LineChart;
