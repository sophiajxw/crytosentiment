import React, { Component } from 'react';
import axios from 'axios';

const ROOT_URL = 'http://localhost:5000';

import LineChart from './LineChart';


class App extends Component {
  constructor(props) {
    super(props);

    // init component state here
    this.state = {
      hasResponse: false,
      data: {},
      sentiResponse: {},
      currentPrice: 0,
      ticker: '',
      hoverLoc: null,
      activePoint: null,
    };

    this.fetchData = this.fetchData.bind(this);
    this.renderSenti = this.renderSenti.bind(this);
    this.onClickCryto = this.onClickCryto.bind(this);
  }

  componentWillMount() {
    const data = [];
    for (let x = 0; x <= 30; x++) {
      const random = Math.random();
      const temp = data.length > 0 ? data[data.length - 1].y : 50;
      const y = random >= 0.45 ? temp + Math.floor(random * 20) : temp - Math.floor(random * 20);
      data.push({ x, y });
    }
    this.setState({ data });
  }

  onClickCryto(ticker) {
    const that = this;

    let url = 'https://apiv2.bitcoinaverage.com/indices/global/history/BTCUSD?period=daily&?format=json';

    if (ticker === 'bitcoin') {
      url = 'https://apiv2.bitcoinaverage.com/indices/global/history/BTCUSD?period=daily&?format=json';
      this.setState({ ticker: 'Bitcoin' });
    } else if (ticker === 'ethereum') {
      url = 'https://apiv2.bitcoinaverage.com/indices/global/history/ETHUSD?period=daily&?format=json';
      this.setState({ ticker: 'Ethereum' });
    } else if (ticker === 'dash') {
      url = 'https://apiv2.bitcoinaverage.com/indices/local/history/DASHUSD?period=daily&?format=json';
      this.setState({ ticker: 'Dash' });
    } else if (ticker === 'xrp') {
      url = 'https://apiv2.bitcoinaverage.com/indices/global/history/XRPUSD?period=daily&?format=json';
      this.setState({ ticker: 'XRP' });
    } else if (ticker === 'litecoin') {
      url = 'https://apiv2.bitcoinaverage.com/indices/global/history/LTCUSD?period=daily&?format=json';
      this.setState({ ticker: 'Litecoin' });
    }

    fetch(url, { mode: 'cors' })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Error fetching Cryto prices.');
      }
    })
    .then(data => {
      const dataSet = data.slice(0, 60);
      const newSet = [];

      for (let x = 0; x <= 59; x++) {
        const y = dataSet[59 - x].average;
        newSet.push({ x, y });
      }

      that.setState({ data: newSet });
      that.setState({ currentPrice: newSet[0].y });
    })
    .catch(error => {
      console.log(error);
    });

    this.fetchData(ticker);
  }

  handleChartHover(hoverLoc, activePoint) {
    this.setState({
      hoverLoc,
      activePoint,
    });
  }

  fetchData(type) {
    // const that = this;
    axios.get(`${ROOT_URL}/${type}`)
      .then((response) => {
        console.log(response.data);
        this.setState({
          hasResponse: true,
          sentiResponse: response.data,
        });
      }).catch((error) => {
        console.log(error);
      });
  }

  renderSenti() {
    return (
      <div>
        <span>Positive: {this.state.sentiResponse.positive}% </span>
        <span>Positive: {this.state.sentiResponse.negative}% </span>
        <ul>
          {this.state.sentiResponse.tweet.map((tweet, index) => {
            return (
              <li key={index}>
                <span>{tweet.text}</span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  render() {
    return (
      <div className="maincontainer">
        <span id="title">IBM Watson Cryptocurrency Sentiment Analysis</span>
        <div className="button-group">
          <button type="button" className="btn" onClick={() => this.onClickCryto('bitcoin')}>Bitcoin</button>
          <button type="button" className="btn" onClick={() => this.onClickCryto('ethereum')}>Ethereum</button>
          <button type="button" className="btn" onClick={() => this.onClickCryto('dash')}>Dash</button>
          <button type="button" className="btn" onClick={() => this.onClickCryto('litecoin')}>Litecoin</button>
          <button type="button" className="btn" onClick={() => this.onClickCryto('xrp')}>XRP</button>
        </div>
        {this.state.currentPrice !== 0 &&
          <div className="chart">
            <div id="header">Current {this.state.ticker} Price: {this.state.currentPrice} USD</div>
            <LineChart data={this.state.data} onChartHover={(a, b) => this.handleChartHover(a, b)} />
            <div id="anotation">{this.state.ticker} price in the past hour</div>
          </div>
        }
        {this.state.currentPrice === 0 && <div className="chart" />}
        {this.state.hasResponse && this.renderSenti()}
      </div>
    );
  }
}

// {this.state.hasResponse && this.renderSenti()}


export default App;
