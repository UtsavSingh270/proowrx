const express = require('express');
const { requireAdmin } = require('../middleware/auth');
const upload = require('../utils/upload');
const { uploadToCloudinary, deleteCloudinaryAsset } = require('../utils/cloudinary');

const router = express.Router();

router.post('/', requireAdmin, (req, res) => {
  upload.single('file')(req, res, async (err) => {
    try {
      // Handle Multer errors
      if (err) {
        if (err.message?.includes('Only image, PDF, and video files are allowed')) {
          return res.status(400).json({
            success: false,
            error: 'Only image, PDF, and video files are allowed',
          });
        }

        if (err.message?.includes('File too large')) {
          return res.status(400).json({
            success: false,
            error: 'File size exceeds 50MB limit',
          });
        }

        return res.status(400).json({
          success: false,
          error: err.message || 'Upload failed',
        });
      }

      if (!req.file || !req.file.buffer) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded',
        });
      }

      const asset = await uploadToCloudinary(
        req.file.buffer,
        req.file.mimetype,
        req.file.originalname
      );

      return res.json({
        success: true,
        asset,
        filename: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      });
    } catch (error) {
      console.error('Cloudinary Upload Error:', error);

      return res.status(500).json({
        success: false,
        error: error.message || 'Upload failed',
      });
    }
  });
});

router.delete('/:publicId', requireAdmin, async (req, res) => {
  try {
    const publicId = decodeURIComponent(req.params.publicId);
    if (!publicId) {
      return res.status(400).json({ error: 'Invalid public ID' });
    }

    const resourceType = ['image', 'video', 'raw'].includes(req.query.resourceType)
      ? req.query.resourceType
      : 'image';
    await deleteCloudinaryAsset(publicId, resourceType);
    res.json({ success: true, message: 'Asset deleted' });
  } catch (err) {
    if (err.http_code === 404) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    res.status(500).json({ error: 'Deletion failed' });
  }
});

module.exports = router;
