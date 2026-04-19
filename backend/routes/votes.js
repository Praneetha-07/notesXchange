const express = require('express');
const Vote = require('../models/Vote');
const Note = require('../models/Note');
const { protect } = require('../middleware/auth');

const router = express.Router();

// POST /api/votes/:noteId — upvote or downvote a note
router.post('/:noteId', protect, async (req, res) => {
  try {
    const { voteType } = req.body;

    if (!['upvote', 'downvote'].includes(voteType)) {
      return res.status(400).json({ message: 'voteType must be upvote or downvote' });
    }

    const note = await Note.findById(req.params.noteId);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    const existingVote = await Vote.findOne({ userId: req.user._id, noteId: req.params.noteId });

    let delta = 0;
    let userVote = null;

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // Toggle off — remove vote
        await existingVote.deleteOne();
        delta = voteType === 'upvote' ? -1 : 1;
        userVote = null;
      } else {
        // Switch vote type
        delta = voteType === 'upvote' ? 2 : -2;
        existingVote.voteType = voteType;
        await existingVote.save();
        userVote = voteType;
      }
    } else {
      // New vote
      await Vote.create({ userId: req.user._id, noteId: req.params.noteId, voteType });
      delta = voteType === 'upvote' ? 1 : -1;
      userVote = voteType;
    }

    note.voteCount += delta;
    await note.save();

    res.json({ voteCount: note.voteCount, userVote });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
