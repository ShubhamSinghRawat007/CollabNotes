import { Router } from 'express';
import { createNote, getNote, updateNote, getNotes } from '../controllers/noteController.js';

const router = Router();

router.post('/', createNote);
router.get('/:id', getNote);
router.put('/:id', updateNote);
router.get('/', getNotes); 

export default router;
