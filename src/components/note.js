import React, { Component } from 'react';
import Draggable from 'react-draggable';
import Textarea from 'react-textarea-autosize';
import marked from 'marked';


class Note extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
    };

    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onDrag = this.onDrag.bind(this);
  }

  onEdit(event) {
    if (this.state.isEditing) {
      this.setState({ isEditing: true });
      return <div>editing!</div>;
    } else {
      this.setState({ isEditing: false });
    }
  }

  onDelete() {
    this.props.onDeleteNote(this.props.id);
  }

  onUpdate(event) {
    this.props.updateNote(this.props.id, { text: event.target.value });
  }

  onDrag(event, ui) {
    this.props.updateNote(this.props.id, { x: ui.x, y: ui.y });
  }

  render() {
    return (
      <Draggable
        handle=".note-mover"
        grid={[25, 25]}
        defaultPosition={{ x: 50, y: 50 }}
        position={{ x: this.props.note.x, y: this.props.note.y }}
        onStart={this.onStartDrag}
        onDrag={this.onDrag}
        onStop={this.onStopDrag}
      >
        <div>
          <div>
            <span id="note_title">{this.props.note.title}</span>
            <i id="note_item" onClick={this.onDelete} className="fa fa-trash-o" />
            <i id="note_item" type="checkbox" onClick={this.onEdit} className="fa fa-pencil-square-o" aria-hidden="true" />
            <i id="note_item" className="fa fa-arrows-alt note-mover" aria-hidden="true"></i>
          </div>
          <textarea id="text" value={this.props.note.text} onChange={this.onUpdate} />
        </div>
      </Draggable>
    );
  }

}

export default Note;
