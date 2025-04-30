const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Novel = require('../models/Novel');
const auth = require('../middleware/auth');

// Configure multer for local storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images are allowed!'));
  }
});

// Get all novels
router.get('/', async (req, res) => {
  try {
    const novels = await Novel.find().sort({ dateAdded: -1 });
    res.json(novels);
  } catch (error) {
    console.error('Error fetching novels:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single novel (public route)
router.get('/:id', async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.id);
    if (!novel) {
      return res.status(404).json({ message: 'Novel not found' });
    }
    res.json(novel);
  } catch (error) {
    console.error('Error fetching novel:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new novel (protected route)
router.post('/', auth, upload.single('coverImage'), async (req, res) => {
  try {
    let coverImageUrl = undefined;
    
    if (req.file) {
      coverImageUrl = `/uploads/${req.file.filename}`;
    }

    const novelData = {
      ...req.body,
      coverImage: coverImageUrl
    };

    const novel = new Novel(novelData);
    await novel.save();
    res.status(201).json(novel);
  } catch (error) {
    console.error('Error creating novel:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update a novel (protected route)
router.put('/:id', auth, upload.single('coverImage'), async (req, res) => {
  try {
    let updates = { ...req.body };
    
    if (req.file) {
      updates.coverImage = `/uploads/${req.file.filename}`;
    }

    const novel = await Novel.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!novel) {
      return res.status(404).json({ message: 'Novel not found' });
    }

    res.json(novel);
  } catch (error) {
    console.error('Error updating novel:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete a novel (protected route)
router.delete('/:id', auth, async (req, res) => {
  try {
    const novel = await Novel.findByIdAndDelete(req.params.id);
    
    if (!novel) {
      return res.status(404).json({ message: 'Novel not found' });
    }

    res.json({ message: 'Novel deleted successfully' });
  } catch (error) {
    console.error('Error deleting novel:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 