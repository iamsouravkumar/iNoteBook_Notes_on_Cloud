import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import noteContext from '../context/notes/noteContext';
import NoteItem from './NoteItem';
import AddNote from './AddNote'
const Notes = (props) => {
    const context = useContext(noteContext);
    let navigate = useNavigate()
    const { notes, getNotes, editNote } = context;
    useEffect(() => {
        if (localStorage.getItem("token")) {
            getNotes()
        }
        else {
            navigate("/login")
        }
        //eslint-disable-next-line
    }, [])

    const [note, setNote] = useState({ id: '', etitle: "", edescription: "", etag: "" });
    const ref = useRef(null)
    const closeref = useRef(null)
    const updateNote = (currentNote) => {
        ref.current.click();
        setNote({ id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag })
    }
    const handleClick = (e) => {
        editNote(note.id, note.etitle, note.edescription, note.etag);
        closeref.current.click();
        props.showAlert("Updated Successfully", "success")
    }
    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    }
    return (
        <>
            <AddNote showAlert={props.showAlert} />
            <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Edit Note
            </button>
            <div className=" add-n modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Update Note</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        {/*modal body st */}
                        <div className="modal-body">
                            <form className=''>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input type="text" className="form-control" name="etitle" id="exampleInputEmail1" aria-describedby="emailHelp" value={note.etitle} minLength={5} required={true} onChange={onChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="desc" className="form-label">Description</label>
                                    <input type="text" className="form-control" name="edescription" id="edescription" value={note.edescription} minLength={5} required={true} onChange={onChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="tag" className="form-label">Tag</label>
                                    <input type="text" className="form-control" name="etag" id="etag" value={note.etag} onChange={onChange} />
                                    {/* modal body end */}
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button ref={closeref} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button disabled={note.etitle.length < 5 || note.edescription.length < 5} onClick={handleClick} type="button" className="btn btn-primary">Update Note</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row my-3'>
                <h2 className='note text-center'>Your Notes</h2>
                <div className='container text-center'>
                    <h3>{notes.length === 0 && 'No Notes to Display'}</h3>
                </div>
                {notes.map((note) => {
                    return <NoteItem key={note._id} updateNote={updateNote} showAlert={props.showAlert} note={note} />
                })}
            </div>
        </>
    )
}
export default Notes;