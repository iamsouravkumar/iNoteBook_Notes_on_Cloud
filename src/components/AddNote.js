import React, { useContext, useState } from 'react'
import noteContext from '../context/notes/noteContext';
const AddNote = (props) => {
    const context = useContext(noteContext);
    const { addNote } = context;
    const [note, setNote] = useState({ title: "", description: "", tag: "" });
    const handleClick = (e) => {
        e.preventDefault();
        addNote(note.title, note.description, note.tag);
        setNote({ title: "", description: "", tag: "" })
        props.showAlert("Added Successfully", "success")
    }
    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    }
    return (
        <>
            <div className='add-n container my-3'>
                <h1 className='add text-center'>Add a Note</h1>
                <form className=''>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input type="text" className="form-control" name="title" id="exampleInputEmail1" aria-describedby="emailHelp" minLength={5} required onChange={onChange} value={note.title}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="desc" className="form-label">Description</label>
                        <input type="text" className="form-control" name="description" id="description" minLength={5} required onChange={onChange} value={note.description}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="tag" className="form-label">Tag</label>
                        <input type="text" className="form-control" name="tag" id="tag" onChange={onChange} value={note.tag}/>
                    </div>
                    <button disabled={note.title.length < 5 || note.description.length < 5} type="submit" className="btn btn-primary" onClick={handleClick}>Add Note</button>
                </form>
            </div>
        </>
    )
}

export default AddNote