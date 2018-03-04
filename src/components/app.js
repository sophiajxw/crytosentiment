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
  }

  onClickBitcoin() {
    fetch('https://apiv2.bitcoinaverage.com/indices/global/history/BTCUSD?period=daily&?format=json', { mode: 'cors' })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Error fetching Cryto prices.');
      }
    })
    .then(data => {
      console.log(data);
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
          <button type="button" className="btn" onClick={this.onClickBitcoin}>Bitcoin</button>
          <button type="button" className="btn" onClick={this.onClickEthereum}>Ethereum</button>
          <button type="button" className="btn" onClick={this.onClickBitcoinCash}>Bitcoin Cash</button>
          <button type="button" className="btn" onClick={this.onClickLitecoin}>Litecoin</button>
          <button type="button" className="btn" onClick={this.onClickXRP}>XRP</button>
        </div>
        <LineChart data={this.state.data} />
        {this.state.hasResponse && this.renderSenti()}
      </div>
    );
  }
}

export default App;
