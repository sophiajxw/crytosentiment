import React, { Component } from 'react';
import LineChart from './LineChart';

class App extends Component {
  constructor(props) {
    super(props);

    // init component state here
    this.state = { data: [] };
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
  }

  onClickEthereum() {

  }

  onClickBitcoinCash() {

  }

  onClickLitecoin() {

  }

  onClickXRP() {

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
      </div>

    );
  }
}

export default App;
