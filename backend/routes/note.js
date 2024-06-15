const express = require('express');
const router = express.Router();
const Notes = require('../models/Notes');
const fetchUser = require('../middleware/fetchuser')
const { body, validationResult } = require('express-validator');

//Route : 1 - Get all the notes using GET "api/note/fetchallnotes". Login Required
router.get('/fetchallnotes', fetchUser, async (req, res) => {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes)
})

//Route : 2 - To add the notes using POST "api/note/addnote". Login Required
router.post('/addnote', fetchUser, [
    body('title', 'Enter a valid Title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {

    try {

        const { title, description, tag } = req.body;

        //if there are errors return bad request and errors

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Notes({
            title,
            description,
            tag,
            user: req.user.id
        })

        const savedNotes = await note.save()
        res.json(savedNotes)

    } catch (error) {
        console.log(err.message);
        res.status(500).send("Internal Server Error");
    }
})

//Route : 3 - Update an existing note using PUT "api/note/addnote". Login Required
router.put('/updatenote/:id', fetchUser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        //create a new note
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        //find the note to be updated and update it.
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }
        if (note.user.toString() !== req.user.id) { return res.status(401).send("Not Allowed") }
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ note });
    } catch (error) {
        console.log(err.message);
        res.status(500).send("Internal Server Error");
    }
})

//Route : 4 - Delete an existing note using Delete "api/note/deletenote". Login Required
router.delete('/deletenote/:id', fetchUser, async (req, res) => {
    try {
        //find the note to be deleted and delete it.
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        //Allow deletion onlyif users owns this note.
        if (note.user.toString() !== req.user.id) { return res.status(401).send("Not Allowed") }
        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        console.log(err.message);
        res.status(500).send("Internal Server Error");
    }
})
module.exports = router