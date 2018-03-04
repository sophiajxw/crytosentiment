import React, { Component } from 'react';
<<<<<<< HEAD
=======
// import Immutable from 'immutable';
import axios from 'axios';
// import Note from './note';
// import AddBar from './add_bar';
>>>>>>> 829a59c63fdef9fa736b2328fecb7773aca2b860

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
    };

    this.fetchData = this.fetchData.bind();
    this.renderSenti = this.renderSenti.bind();
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

    if (ticker === 'btc') {
      url = 'https://apiv2.bitcoinaverage.com/indices/global/history/BTCUSD?period=daily&?format=json';
    } else if (ticker === 'eth') {
      url = 'https://apiv2.bitcoinaverage.com/indices/global/history/LTCUSD?period=daily&?format=json';
    } else if (ticker === 'dash') {
      url = 'https://apiv2.bitcoinaverage.com/indices/global/history/DASHUSD?period=daily&?format=json';
    } else if (ticker === 'xrp') {
      url = 'https://apiv2.bitcoinaverage.com/indices/global/history/XRPUSD?period=daily&?format=json';
    } else if (ticker === 'lit') {
      url = 'https://apiv2.bitcoinaverage.com/indices/global/history/LTCUSD?period=daily&?format=json';
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
    })
    .catch(error => {
      console.log(error);
    });

    this.fetchData(ticker);
  }

  fetchData(type) {
    axios.get(`${ROOT_URL}/${type}`)
      .then(
        (response) => {
          console.log(response.data);
          this.setState({
            hasResponse: true,
            sentiResponse: response.data,
          });
        }).catch(error => {
          console.log(error);
        });
  }

  renderSenti() {
    return (
      <div>
        <span>Positive: {this.state.sentiResponse}</span>
        {this.state.sentiResponse}
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
        <div className="lineChart">
          <div className="header">Current Price: </div>
          <LineChart data={this.state.data} />
        </div>
        {this.state.hasResponse && this.renderSenti()}
      </div>
    );
  }
}


export default App;
