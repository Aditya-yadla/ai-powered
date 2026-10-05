const express = require('express');
const router = express.Router();
const {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  getNoteStats
} = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getNotes)
  .post(createNote);

router.get('/stats', getNoteStats);

router.route('/:id')
  .get(getNoteById)
  .put(updateNote)
  .delete(deleteNote);

module.exports = router;
