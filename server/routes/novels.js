const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const Novel = require('../models/Novel');
const auth = require('../middleware/auth');
const fs = require('fs').promises;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Helper function to check if a URL is a Cloudinary URL
const isCloudinaryUrl = (url) => {
  return url && url.includes('cloudinary.com');
};

// Helper function to upload local image to Cloudinary
const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'webnovel-tracker'
    });
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return null;
  }
};

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for memory storage (since we're using Cloudinary)
const storage = multer.memoryStorage();
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
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new novel (protected route)
router.post('/', auth, upload.single('coverImage'), async (req, res) => {
  try {
    let coverImageUrl = undefined;
    
    if (req.file) {
      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'webnovel-tracker' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });
      coverImageUrl = result.secure_url;
    }

    const novelData = {
      ...req.body,
      coverImage: coverImageUrl
    };

    const novel = new Novel(novelData);
    await novel.save();
    res.status(201).json(novel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a novel (protected route)
router.put('/:id', auth, upload.single('coverImage'), async (req, res) => {
  try {
    let updates = { ...req.body };
    
    if (req.file) {
      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'webnovel-tracker' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });
      updates.coverImage = result.secure_url;
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
    res.status(500).json({ message: error.message });
  }
});

// Update all existing images to use Cloudinary (one-time migration)
router.post('/migrate-images', auth, async (req, res) => {
  try {
    const novels = await Novel.find();
    let updatedCount = 0;

    for (const novel of novels) {
      if (novel.coverImage && !isCloudinaryUrl(novel.coverImage)) {
        // If the image is not a Cloudinary URL, try to upload it
        const localPath = path.join(__dirname, '..', novel.coverImage);
        try {
          const cloudinaryUrl = await uploadToCloudinary(localPath);
          if (cloudinaryUrl) {
            novel.coverImage = cloudinaryUrl;
            await novel.save();
            updatedCount++;
          }
        } catch (error) {
          console.error(`Error migrating image for novel ${novel._id}:`, error);
        }
      }
    }

    res.json({ 
      message: `Successfully migrated ${updatedCount} images to Cloudinary`,
      total: novels.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 