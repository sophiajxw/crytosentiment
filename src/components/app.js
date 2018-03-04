import React, { Component } from 'react';
import Immutable from 'immutable';
import axios from 'axios';
// import Note from './note';
// import AddBar from './add_bar';

const ROOT_URL = 'http://localhost:5000';

class App extends Component {
  constructor(props) {
    super(props);

    // init component state here
    this.state = {
      hasResponse: false,
      data: [],
    };

    this.fetchData = this.fetchData.bind();
  }

  // {this.state.notes.entrySeq().map(([id, note]) => {
  //   return (
  //     <div />
  //   );
  // })}

  componentDidMount() {

  }

  fetchData() {
    axios.get(`${ROOT_URL}`)
      .then(
        (response) => {
          console.log(response);
          this.setState({
            hasResponse: true,
            data: response,
          });
        }).catch(error => {
          console.log(error);
        });
  }


  // getData() {
  //   fetch(`${ROOT_URL}?token=${TOKEN}`)
  //     .then(
  //       (response) => {
  //         console.log(response);
  //         this.setState({
  //           hasResponse: true,
  //           data: response,
  //         });
  //       },
  //       (error) => {
  //         console.log(error);
  //       }
  //     );
  // }

  render() {
    return (
      <div className="maincontainer">
        <span>Yo</span>
      </div>
    );
  }
}

export default App;
