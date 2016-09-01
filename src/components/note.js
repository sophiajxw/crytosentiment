import React, { Component } from 'react';
import Draggable from 'react-draggable';
import Textarea from 'react-textarea-autosize';
import marked from 'marked';

import Resizable from './Resizable';
import ResizableBox from './ResizableBox';
import '../style.scss';

class Note extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      width: 100,
      height: 100,
    };

    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onStartDrag = this.onStartDrag.bind(this);
    this.onDrag = this.onDrag.bind(this);
    this.onEditRender = this.onEditRender.bind(this);
    this.onTextRender = this.onTextRender.bind(this);
  }

  onEdit() {
    if (this.state.isEditing) {
      this.setState({ isEditing: false });
    } else {
      this.setState({ isEditing: true });
    }
  }

  onEditRender() {
    if (this.state.isEditing) {
      return <i className="fa fa-pencil-square-o" onClick={this.onEdit} />;
    } else {
      return <i className="fa fa-check-square-o" onClick={this.onEdit} />;
    }
  }

  onDelete() {
    this.props.onDeleteNote(this.props.id);
  }

  onUpdate(event) {
    this.props.updateNote(this.props.id, { text: event.target.value });
  }

  onResize = (event, { element, size }) => {
    this.setState({ width: size.width, height: size.height });
    this.props.updateNote(this.props.id, { width: size.width, height: size.height });
  };
//          <div id="greyarea" dangerouslySetInnerHTML={{ __html: marked(this.props.note.text || '') }} />
//              <span>{this.props.note.text}</span>


  onTextRender() {
    if (this.state.isEditing) {
      return (
        <textarea id="text" value={this.props.note.text} onChange={this.onUpdate} />
      );
    } else {
      return (
        <div className="greyarea">
          <Resizable height={this.props.note.height} width={this.props.note.width} onResize={this.onResize}>
            <div style={{ width: this.props.note.width + 'px', height: this.props.note.height + 'px' }}>
              <div dangerouslySetInnerHTML={{ __html: marked(this.props.note.text || '') }} />
            </div>
          </Resizable>
        </div>
      );
    }
  }

  onStartDrag() {
    if (document.getElementById(this.props.id) === null) {
      console.log('nullll');
    } else {
      document.getElementById(this.props.id).style.zIndex = this.props.zIndex;
    }
    this.props.updateZ(this.props.zIndex + 1);
    this.props.updateNote(this.props.id, { zIndex: this.props.zIndex });
  }

  onDrag(event, ui) {
    this.props.updateNote(this.props.id, { x: ui.x, y: ui.y });
  }

  render() {
    return (
      <Draggable
        handle=".note-mover"
        grid={[50, 50]}
        defaultPosition={{ x: 50, y: 50 }}
        position={{ x: this.props.note.x, y: this.props.note.y }}
        zIndex={this.props.note.zIndex}
        onStart={this.onStartDrag}
        onDrag={this.onDrag}
        onStop={this.onStopDrag}
      >
        <div className="note" id={this.props.id} style={{ zIndex: this.props.note.zIndex }}>
          <div className="top">
            <span id="note_title">{this.props.note.title}</span>
            <i id="note_item" onClick={this.onDelete} className="fa fa-trash-o" />
            {this.onEditRender()}
            <i id="note_item" className="fa fa-arrows-alt note-mover" aria-hidden="true"></i>
          </div>
          {this.onTextRender()}
        </div>
      </Draggable>
    );
  }

}

export default Note;
