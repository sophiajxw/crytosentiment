import firebase from 'firebase';

var config = {
  apiKey: 'AIzaSyC2M9piwJCT8xDjkpKWtTGZ0WkwmTAw2UM',
  authDomain: 'cs52-hw3.firebaseapp.com',
  databaseURL: 'https://cs52-hw3.firebaseio.com',
  storageBucket: 'cs52-hw3.appspot.com',
  rules: {
    read: true,
    write: true,
  },
};

firebase.initializeApp(config);

// Get a reference to the database service
const database = firebase.database();

export function fetchNotes(callback) {
  database.ref('notes').on('value', snapshot => {
    callback(snapshot.val());
  });
}

export function createNote(note) {
  database.ref('notes').push(note);
}

export function updateNote(id, new_content) {
  database.ref('notes').child(id).update(new_content);
}

export function deleteNote(id) {
  database.ref('notes').child(id).remove();
}
