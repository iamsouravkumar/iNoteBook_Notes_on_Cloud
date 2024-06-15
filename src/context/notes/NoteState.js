import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const host = 'http://localhost:5000'
  const notesInitial = []

  const [notes, setNotes] = useState(notesInitial)

  //GET a Note.
  const getNotes = async () => {
    //API call
    const response = await fetch(`${host}/api/note/fetchallnotes/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token")
      }
    });
    const json = await response.json();
    setNotes(json);
  }
  //ADD a Note
  const addNote = async (title, description, tag) => {
    //API call
    const response = await fetch(`${host}/api/note/addnote/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token")
      },
      body: JSON.stringify({ title, description, tag }),
    });

    const note = await response.json();
    setNotes(notes.concat(note))
  }

  //Delete a Note
  const deleteNote = async (id) => {
    //API call
    const response = await fetch(`${host}/api/note/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token")
      },
    });
    const json = await response.json()
    console.log(json);
    const newNote = notes.filter((note) => { return note._id !== id })
    setNotes(newNote)
  }

  //Edit Note
  const editNote = async (id, title, description, tag) => {
    const response = await fetch(`${host}/api/note/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token")
      },
      body: JSON.stringify({ id, title, description, tag }),
    });
    const json = await response.json()
    console.log(json);
    
    let newNotes = JSON.parse(JSON.stringify(notes));
    //logic to edit in client
    for (let index = 0; index < notes.length; index++) {
      const element = notes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }
    setNotes(newNotes)
  }
  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </NoteContext.Provider>
  )
}
export default NoteState;