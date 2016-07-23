import React, { Component } from 'react';

class AddBar extends Component {
  constructor(props) {
    super(props);
    this.state = { title: '' };

    this.onInputChange = this.onInputChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onInputChange(event) {
    this.setState({ title: event.target.value });
  }

  onFormSubmit(event) {
    event.preventDefault();
    console.log('In form submit');
    this.props.onCreateClick(this.state.title);
    this.setState({ title: '' });
  }

  render() {
    return (
      <form onSubmit={this.onFormSubmit} className="bar">
        <input id="searchbar" onChange={this.onInputChange} value={this.state.title} placeholder={"Title"} />
        <span>
          <button id="button" type="submit">Add</button>
        </span>
      </form>
    );
  }
}

export default AddBar;
