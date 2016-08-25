import React, { Component } from 'react';
import Immutable from 'immutable';
import Note from './note';
import AddBar from './add_bar';
import * as firebase from '../firebase';

// example class based component (smart component)

class App extends Component {
  constructor(props) {
    super(props);

    // init component state here
    this.state = {
      notes: Immutable.Map(),
      zIndex: 0,
    };

    this.addNote = this.addNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
    this.updateNote = this.updateNote.bind(this);
    this.updateZ = this.updateZ.bind(this);
  }

  componentDidMount() {
    firebase.fetchNotes(newNotes =>
      this.setState({
        notes: Immutable.Map(newNotes),
      })
    );

    firebase.fetchZ(z =>
      this.setState({
        zIndex: z.val().zIndex,
      })
    );
  }


  addNote(title) {
    const newNote = {
      title,
      text: '',
      x: 100,
      y: 100,
      zIndex: this.state.zIndex,
    };
    firebase.updateZ(this.state.zIndex++);
    firebase.createNote(newNote);
    console.log(this.state.zIndex);
  }

  deleteNote(title) {
    firebase.deleteNote(title);
  }

  updateNote(id, fields) {
    firebase.updateNote(id, fields);
  }

  updateZ(index) {
    firebase.updateZ(index);
    // this.setState({ zIndex: this.state.zIndex + 1 });
  }

  render() {
    return (
      <div>
        <AddBar onCreateClick={this.addNote} />
        {this.state.notes.entrySeq().map(([id, note]) => {
          return (
            <Note updateNote={this.updateNote}
              onDeleteNote={this.deleteNote}
              updateZ={this.updateZ}
              note={note} key={id} id={id}
              zIndex={this.state.zIndex}
            />
          );
        })}
      </div>
    );
  }
}

export default App;
