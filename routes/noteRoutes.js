import express from 'express'

const router = express.Router()

import Note from '../models/Notes.js'
import { authMiddleware } from '../utils/auth.js'
 
// Apply authMiddleware to all routes in this file
router.use(authMiddleware);
 
// GET /api/notes - Get all notes for the logged-in user
// THIS IS THE ROUTE THAT CURRENTLY HAS THE FLAW
router.get('/', async (req, res) => {
  // This currently finds all notes in the database.
  // It should only find notes owned by the logged in user.
  try {
    const notes = await Note.find({user: req.user._id});
    res.json(notes);
  } catch (err) {
    res.status(500).json(err);
  }
});
 
// POST /api/notes - Create a new note
router.post('/', async (req, res) => {
  try {
    const note = await Note.create({
      ...req.body,
      // The user ID needs to be added here
      user: req.user._id
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json(err);
  }
});

 
// PUT /api/notes/:id - Update a note
router.put('/:id', async (req, res) => {
  try {
    // This needs an authorization check
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'No note found with this id!' });
    }

    if(note.user.toString() !== req.user._id){
      return res.status(403).json({message: 'User is not authorized to update this note'})
    }

    const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    res.json(updatedNote);

  } catch (err) {
    res.status(500).json(err);
  }
});
 
// DELETE /api/notes/:id - Delete a note
router.delete('/:id', async (req, res) => {
  try {
    // This needs an authorization check
     const note = await Note.findById(req.params.id);

     if (!note) {
      return res.status(404).json({ message: 'No note found with this id!' });
    }

     if(note.user.toString() !== req.user._id){
      return res.status(403).json({message: 'User is not authorized to delete this note'})
    }

    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Note deleted!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get Single Note
router.get('/:id', async (req, res) => {
  
  try {

    const note = await Note.findOne({user: req.user._id, _id:req.params.id});

     if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json(note);
  } catch (err) {
    res.status(500).json(err);
  }
});
 
export default router