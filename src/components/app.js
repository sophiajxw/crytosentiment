import React, { Component } from 'react';
import Immutable from 'immutable';
import axios from 'axios';
// import Note from './note';
// import AddBar from './add_bar';

const ROOT_URL = 'http://localhost:5000';

import LineChart from './LineChart';


class App extends Component {
  constructor(props) {
    super(props);

    // init component state here
    this.state = {
      hasResponse: false,
      data: {},
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

    fetch('https://apiv2.bitcoinaverage.com/indices/global/history/BTCUSD?period=daily&?format=json', { mode: 'cors' })
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
    fetchData('Bitcoin');
  }

  // {this.state.notes.entrySeq().map(([id, note]) => {
//   return (
//     <div />
//   );
// })}

  fetchData(type) {
    axios.get(`${ROOT_URL}/${type}`)
      .then(
        (response) => {
          console.log(response.data);
          this.setState({
            hasResponse: true,
            data: response.data,
          });
        }).catch(error => {
          console.log(error);
        });
  }


  renderSenti() {
    return (
      <div>
        {this.state.data}
      </div>
    );
  }

  render() {
    return (
      <div className="maincontainer">
        <span id="title">IBM Watson Cryptocurrency Sentiment Analysis</span>
        <div className="button-group">
          <button type="button" className="btn" onClick={this.onClickCryto('btc')}>Bitcoin</button>
          <button type="button" className="btn" onClick={this.onClickCryto('eth')}>Ethereum</button>
          <button type="button" className="btn" onClick={this.onClickCryto('dash')}>Dash</button>
          <button type="button" className="btn" onClick={this.onClickCryto('lit')}>Litecoin</button>
          <button type="button" className="btn" onClick={this.onClickCryto('xrp')}>XRP</button>
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
