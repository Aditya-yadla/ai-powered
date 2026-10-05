const express = require('express');
const router = express.Router();
const {
  saveAIResult,
  getAIResults,
  deleteAIResult
} = require('../controllers/aiResultController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getAIResults)
  .post(saveAIResult);

router.delete('/:id', deleteAIResult);

module.exports = router;
