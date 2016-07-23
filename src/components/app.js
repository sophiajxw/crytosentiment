import React, { Component } from 'react';
import Immutable from 'immutable';
import Note from './note';
import AddBar from './add_bar';

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

  addNote(title) {
    const newNote = {
      title,
      text: '',
      x: 100,
      y: 100,
      zIndex: z++,
    };
    console.log(newNote);
    this.setState({
      notes: this.state.notes.set(title, newNote),
    });
    console.log(this.state.notes.size);
  }

  deleteNote(title) {
    this.setState({
      notes: this.state.notes.delete(title),
    });
  }

  updateNote(id, fields) {
    this.setState({
      notes: this.state.notes.update(id, (n) => { return Object.assign({}, n, fields); }),
    });
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
