const AIResult = require('../models/AIResult');
const { inMemoryStore, saveInMemoryStore } = require('../config/db');

// @desc    Save AI explanation or summary result
// @route   POST /api/ai-results
// @access  Private
const saveAIResult = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { noteId, result_type, result_content, source_title } = req.body;

    if (!result_type || !result_content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide result_type and result_content'
      });
    }

    if (inMemoryStore.isFallback) {
      const newResult = {
        _id: 'airesult_' + Date.now(),
        user: userId,
        note: noteId || null,
        result_type,
        result_content,
        source_title: source_title || 'Study Material',
        createdAt: new Date().toISOString()
      };
      inMemoryStore.aiResults.unshift(newResult);
      saveInMemoryStore();
      return res.status(201).json({
        success: true,
        message: 'AI Result saved successfully',
        data: newResult
      });
    }

    const aiResult = await AIResult.create({
      user: userId,
      note: noteId || null,
      result_type,
      result_content,
      source_title: source_title || 'Study Material'
    });

    res.status(201).json({
      success: true,
      message: 'AI Result saved successfully',
      data: aiResult
    });
  } catch (error) {
    console.error('Save AI Result error:', error);
    res.status(500).json({ success: false, message: error.message || 'Error saving AI Result' });
  }
};

// @desc    Get all saved AI results for user
// @route   GET /api/ai-results
// @access  Private
const getAIResults = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    if (inMemoryStore.isFallback) {
      const results = inMemoryStore.aiResults.filter(
        (r) => r.user.toString() === userId.toString()
      );
      return res.json({ success: true, count: results.length, data: results });
    }

    const results = await AIResult.find({ user: userId })
      .populate('note', 'title subject topic')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching AI results' });
  }
};

// @desc    Delete a saved AI result
// @route   DELETE /api/ai-results/:id
// @access  Private
const deleteAIResult = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const resultId = req.params.id;

    if (inMemoryStore.isFallback) {
      const index = inMemoryStore.aiResults.findIndex(
        (r) => r._id.toString() === resultId && r.user.toString() === userId.toString()
      );
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Saved AI result not found' });
      }
      inMemoryStore.aiResults.splice(index, 1);
      saveInMemoryStore();
      return res.json({ success: true, message: 'AI result deleted successfully' });
    }

    const result = await AIResult.findOneAndDelete({ _id: resultId, user: userId });
    if (!result) {
      return res.status(404).json({ success: false, message: 'Saved AI result not found' });
    }

    res.json({ success: true, message: 'AI result deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error deleting AI result' });
  }
};

module.exports = {
  saveAIResult,
  getAIResults,
  deleteAIResult
};
