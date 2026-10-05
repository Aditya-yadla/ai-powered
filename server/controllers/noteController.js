const Note = require('../models/Note');
const { inMemoryStore, saveInMemoryStore } = require('../config/db');

// Helper to seed sample student notes for demo if fallback memory store is empty
const seedSampleNotes = (userId) => {
  if (inMemoryStore.notes.filter((n) => n.user.toString() === userId.toString()).length === 0) {
    const sampleNotes = [
      {
        _id: 'note_seed_1',
        user: userId,
        title: 'Data Structures: Binary Search Trees (BST)',
        subject: 'Computer Science',
        topic: 'Algorithms & Data Structures',
        content: 'A Binary Search Tree is a node-based binary tree data structure which has the following properties: The left subtree of a node contains only nodes with keys lesser than the node key. The right subtree of a node contains only nodes with keys greater than the node key. Time complexity for search, insertion, and deletion is O(log n) on average and O(n) in worst case (unbalanced tree). Self-balancing BSTs like AVL trees and Red-Black trees guarantee O(log n) time operations.',
        keywords: ['BST', 'Tree', 'Binary Search', 'Data Structures', 'Algorithms'],
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        _id: 'note_seed_2',
        user: userId,
        title: 'Thermodynamics First & Second Laws',
        subject: 'Physics',
        topic: 'Thermodynamics',
        content: 'First Law of Thermodynamics states that energy cannot be created or destroyed, only transformed from one form to another: Delta U = Q - W where U is internal energy, Q is heat added, W is work done by system. Second Law states that entropy of an isolated system always increases over time. Heat flows spontaneously from higher temperature to lower temperature. Clausius statement: No process is possible whose sole result is the transfer of heat from a cooler body to a hotter body.',
        keywords: ['Entropy', 'Heat', 'Energy', 'Thermodynamics', 'Laws of Physics'],
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
      },
      {
        _id: 'note_seed_3',
        user: userId,
        title: 'Database Normalization: 1NF to 3NF',
        subject: 'Computer Science',
        topic: 'Database Management Systems',
        content: 'Database normalization is the process of structuring a relational database to reduce data redundancy and improve data integrity. 1NF (First Normal Form) requires atomic values and unique row identification. 2NF requires 1NF and no partial dependencies (non-key attributes depend on whole primary key). 3NF requires 2NF and no transitive dependencies (non-key attributes depend only on primary key, not on other non-key attributes). BCNF (Boyce-Codd Normal Form) is a stricter version of 3NF.',
        keywords: ['Database', 'Normalization', '3NF', 'SQL', 'DBMS'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    inMemoryStore.notes.push(...sampleNotes);
    saveInMemoryStore();
  }
};

// @desc    Get all notes for logged in user (with search and category filter)
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { search, subject, topic } = req.query;

    if (inMemoryStore.isFallback) {
      seedSampleNotes(userId);
      let notes = inMemoryStore.notes.filter((n) => n.user.toString() === userId.toString());

      if (subject && subject !== 'All') {
        notes = notes.filter((n) => n.subject.toLowerCase() === subject.toLowerCase());
      }

      if (topic && topic !== 'All') {
        notes = notes.filter((n) => n.topic.toLowerCase() === topic.toLowerCase());
      }

      if (search) {
        const q = search.toLowerCase();
        notes = notes.filter((n) =>
          n.title.toLowerCase().includes(q) ||
          n.subject.toLowerCase().includes(q) ||
          n.topic.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          (n.keywords && n.keywords.some((k) => k.toLowerCase().includes(q)))
        );
      }

      // Sort newest first
      notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return res.json({
        success: true,
        count: notes.length,
        data: notes
      });
    }

    // MongoDB Mongoose query
    let query = { user: userId };

    if (subject && subject !== 'All') {
      query.subject = { $regex: new RegExp(subject, 'i') };
    }

    if (topic && topic !== 'All') {
      query.topic = { $regex: new RegExp(topic, 'i') };
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { subject: searchRegex },
        { topic: searchRegex },
        { content: searchRegex },
        { keywords: searchRegex }
      ];
    }

    const notes = await Note.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ success: false, message: error.message || 'Error fetching notes' });
  }
};

// @desc    Get single note by ID
// @route   GET /api/notes/:id
// @access  Private
const getNoteById = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const noteId = req.params.id;

    if (inMemoryStore.isFallback) {
      const note = inMemoryStore.notes.find(
        (n) => n._id.toString() === noteId && n.user.toString() === userId.toString()
      );
      if (!note) {
        return res.status(404).json({ success: false, message: 'Note not found or unauthorized' });
      }
      return res.json({ success: true, data: note });
    }

    const note = await Note.findOne({ _id: noteId, user: userId });
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found or unauthorized' });
    }

    res.json({ success: true, data: note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching note' });
  }
};

// @desc    Create new note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { title, subject, topic, content, keywords } = req.body;

    if (!title || !subject || !topic || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, subject, topic, and content'
      });
    }

    const keywordList = Array.isArray(keywords)
      ? keywords
      : typeof keywords === 'string'
      ? keywords.split(',').map((k) => k.trim()).filter(Boolean)
      : [];

    if (inMemoryStore.isFallback) {
      const newNote = {
        _id: 'note_' + Date.now(),
        user: userId,
        title,
        subject,
        topic,
        content,
        keywords: keywordList,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      inMemoryStore.notes.unshift(newNote);
      saveInMemoryStore();
      return res.status(201).json({
        success: true,
        message: 'Note created successfully',
        data: newNote
      });
    }

    const note = await Note.create({
      user: userId,
      title,
      subject,
      topic,
      content,
      keywords: keywordList
    });

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: note
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ success: false, message: error.message || 'Error creating note' });
  }
};

// @desc    Update existing note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const noteId = req.params.id;
    const { title, subject, topic, content, keywords } = req.body;

    const keywordList = Array.isArray(keywords)
      ? keywords
      : typeof keywords === 'string'
      ? keywords.split(',').map((k) => k.trim()).filter(Boolean)
      : undefined;

    if (inMemoryStore.isFallback) {
      const noteIndex = inMemoryStore.notes.findIndex(
        (n) => n._id.toString() === noteId && n.user.toString() === userId.toString()
      );
      if (noteIndex === -1) {
        return res.status(404).json({ success: false, message: 'Note not found or unauthorized' });
      }

      const existing = inMemoryStore.notes[noteIndex];
      inMemoryStore.notes[noteIndex] = {
        ...existing,
        title: title || existing.title,
        subject: subject || existing.subject,
        topic: topic || existing.topic,
        content: content || existing.content,
        keywords: keywordList !== undefined ? keywordList : existing.keywords,
        updatedAt: new Date().toISOString()
      };
      saveInMemoryStore();

      return res.json({
        success: true,
        message: 'Note updated successfully',
        data: inMemoryStore.notes[noteIndex]
      });
    }

    let note = await Note.findOne({ _id: noteId, user: userId });
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found or unauthorized' });
    }

    if (title) note.title = title;
    if (subject) note.subject = subject;
    if (topic) note.topic = topic;
    if (content) note.content = content;
    if (keywordList !== undefined) note.keywords = keywordList;

    const updatedNote = await note.save();

    res.json({
      success: true,
      message: 'Note updated successfully',
      data: updatedNote
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error updating note' });
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const noteId = req.params.id;

    if (inMemoryStore.isFallback) {
      const noteIndex = inMemoryStore.notes.findIndex(
        (n) => n._id.toString() === noteId && n.user.toString() === userId.toString()
      );
      if (noteIndex === -1) {
        return res.status(404).json({ success: false, message: 'Note not found or unauthorized' });
      }

      inMemoryStore.notes.splice(noteIndex, 1);
      saveInMemoryStore();
      return res.json({ success: true, message: 'Note deleted successfully' });
    }

    const note = await Note.findOneAndDelete({ _id: noteId, user: userId });
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found or unauthorized' });
    }

    res.json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error deleting note' });
  }
};

// @desc    Get subjects list & dashboard statistics
// @route   GET /api/notes/stats
// @access  Private
const getNoteStats = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    let notes = [];
    if (inMemoryStore.isFallback) {
      seedSampleNotes(userId);
      notes = inMemoryStore.notes.filter((n) => n.user.toString() === userId.toString());
    } else {
      notes = await Note.find({ user: userId });
    }

    const totalNotes = notes.length;
    const subjectMap = {};
    notes.forEach((n) => {
      subjectMap[n.subject] = (subjectMap[n.subject] || 0) + 1;
    });

    const subjects = Object.keys(subjectMap).map((name) => ({
      name,
      count: subjectMap[name]
    }));

    res.json({
      success: true,
      stats: {
        totalNotes,
        totalSubjects: subjects.length,
        subjects,
        recentNotes: notes.slice(0, 5)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching stats' });
  }
};

module.exports = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  getNoteStats
};
