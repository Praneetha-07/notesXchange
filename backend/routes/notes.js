const express = require('express');
const Note = require('../models/Note');
const Vote = require('../models/Vote');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// GET /api/notes — browse with filters
router.get('/', async (req, res) => {
  try {
    const { search, semester, branch, sort = 'votes', page = 1, limit = 20 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subjectCode: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
      ];
    }
    if (semester) query.semester = semester;
    if (branch) query.branch = branch;

    const sortOption = sort === 'votes' ? { voteCount: -1 } : { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [notes, total] = await Promise.all([
      Note.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit))
        .populate('uploadedBy', 'name branch'),
      Note.countDocuments(query),
    ]);

    // If user is authenticated, attach their vote for each note
    let userVotes = {};
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
        const votes = await Vote.find({ userId: decoded.id, noteId: { $in: notes.map(n => n._id) } });
        votes.forEach(v => { userVotes[v.noteId.toString()] = v.voteType; });
      } catch {}
    }

    const notesWithVote = notes.map(n => ({
      ...n.toObject(),
      userVote: userVotes[n._id.toString()] || null,
    }));

    res.json({ notes: notesWithVote, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/notes/:id — single note
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate('uploadedBy', 'name branch');
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/notes — upload new note (protected)
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'File is required' });

    const { title, subject, subjectCode, semester, branch } = req.body;

    if (!title || !subject || !subjectCode || !semester || !branch) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const fileType = req.file.mimetype === 'application/pdf' ? 'pdf' : 'image';
    const fileUrl = `/uploads/${req.file.filename}`;

    const note = await Note.create({
      title,
      subject,
      subjectCode,
      semester,
      branch,
      fileUrl,
      fileType,
      uploadedBy: req.user._id,
    });

    await note.populate('uploadedBy', 'name branch');
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/notes/:id — delete own note (protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    if (note.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this note' });
    }

    await note.deleteOne();
    await Vote.deleteMany({ noteId: req.params.id });
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
