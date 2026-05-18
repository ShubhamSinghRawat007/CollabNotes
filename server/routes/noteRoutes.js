import { Router } from 'express';
import { createNote, getNote, updateNote, getNotes, deleteNote } from '../controllers/noteController.js';

const router = Router();

router.post('/', createNote);
router.get('/:id', getNote);
router.put('/:id', updateNote);
router.get('/', getNotes); 
router.delete('/:id', deleteNote);

export default router;
