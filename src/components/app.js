import React, { Component } from 'react';
import Immutable from 'immutable';
import Note from './note';
import AddBar from './add_bar';
import * as firebase from '../firebase';

// example class based component (smart component)
let z = 0;

class App extends Component {
  constructor(props) {
    super(props);

    // init component state here
    this.state = {
      notes: Immutable.Map(),
    };

    this.addNote = this.addNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
    this.updateNote = this.updateNote.bind(this);
  }

  componentDidMount() {
    firebase.fetchNotes(newNotes =>
      this.setState({
        notes: Immutable.Map(newNotes),
      })
    );
  }

  addNote(title) {
    const newNote = {
      title,
      text: '',
      x: 100,
      y: 100,
      zIndex: z++,
    };
    firebase.createNote(newNote);
  }

  deleteNote(title) {
    firebase.deleteNote(title);
  }

  updateNote(id, fields) {
    firebase.updateNote(id, fields);
  }

  render() {
    return (
      <div>
        <AddBar onCreateClick={this.addNote} />
        {this.state.notes.entrySeq().map(([id, note]) => {
          return (
            <Note updateNote={this.updateNote}
              onDeleteNote={this.deleteNote} note={note} key={id} id={id}
            />
          );
        })}
      </div>
    );
  }
}

export default App;
