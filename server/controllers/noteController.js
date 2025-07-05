import Note from '../models/Note.js';

// Create a new note
export const createNote = async (req, res) => {
  try {
    const note = new Note({ title: req.body.title });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get a note by ID
export const getNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a note
export const updateNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { content: req.body.content, updatedAt: Date.now() },
      { new: true }
    );
    console.log('Updated note:', note);
    
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getNotes = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const notes = await Note.find()
      .sort({ updatedAt: -1 })
      .limit(limit);
    res.json(notes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};