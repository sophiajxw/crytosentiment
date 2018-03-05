import React, { Component } from 'react';
import axios from 'axios';

const ROOT_URL = 'http://localhost:5000';

import LineChart from './LineChart';
import ToolTip from './ToolTip';

class App extends Component {
  constructor(props) {
    super(props);

    // init component state here
    this.state = {
      hasResponse: true,
      data: {},
      sentiResponse: {
        positive: 23,
        negative: 15,
        ptweets: [
          {
            text: 'this is a mock tweet #1 sdafsdaf sdfsdfsd',
          },
          {
            text: 'this is a mock tweet #1 dsafsadf sdfsdfsdfdsfdsafsd',
          },
          {
            text: 'this is a mock tweet #1 sdaf sdafsdaf dsafdsfdsfdsfdsafsdfsdaf',
          },
          {
            text: 'this is a mock tweet #1 dsaf sda fasdf dsf ',
          },
          {
            text: 'this is a mock tweet #1 sadf sd sdaf sdaf sdaf dsaf dsafdsf',
          },
        ],
        ntweets: [
          {
            text: 'this is a mock tweet #1ads fidslfjlsdaflksdjaflk dsalkkfklsdajfl;ksdajf',
          },
          {
            text: 'another mock tweet sdlakfjlskdjflkasdjflkd lksdjaf lksdjflk;sadfds flksda',
          },
          {
            text: 'this is a mock tweet #1 sdaflkjlksdfjlksda lkdsjf klsdajf lksdjflkdsjflka sdj',
          },
          {
            text: 'this is a mock tweet #1 sadklfjlksdjfalk lksdfjlksadfj dsaf lkjlkdsfa j',
          },
          {
            text: 'this is a mock tweet #1 sdaklfjlkdsjaflkadsjf lsdkajf lkdsjf lkds fsda ',
          },
        ],
      },
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
        const t = 59 - x;
        let d = t + ' min ago';
        if (t === 0) d = 'now';
        const p = '$ ' + y;
        newSet.push({ d, p, x, y });
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
        <span className="sentiTitle">Tweets from verified users</span>
        <div className="senti">
          <div className="sentiContainer">
            <span className="positiveNum">Positive: {this.state.sentiResponse.positive}% </span>
            <ul>
              {this.state.sentiResponse.ptweets.map((tweet, index) => {
                return (
                  <li className="positiveTweets" key={index}>
                    <span>{tweet.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="sentiContainer">
            <span className="negativeNum">Negative: {this.state.sentiResponse.negative}% </span>
            <ul>
              {this.state.sentiResponse.ntweets.map((tweet, index) => {
                return (
                  <li className="negativeTweets" key={index}>
                    <span>{tweet.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="maincontainer">
        <div className="top">
          <img src="https://scontent.fzty2-1.fna.fbcdn.net/v/t34.0-12/28721652_1644944218893229_680542085_n.png?oh=333dd2a66969965596ff828b6071310c&oe=5A9E90A5" />
          <span id="title">IBM Watson Cryptocurrency Sentiment Analysis</span>
        </div>
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
            <div className="row">
              <div className="popup">
                {this.state.hoverLoc ? <ToolTip hoverLoc={this.state.hoverLoc} activePoint={this.state.activePoint} /> : null}
              </div>
            </div>
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


export default App;
