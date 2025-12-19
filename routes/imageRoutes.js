const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const imageController = require('../controllers/imageController');

// Upload image
router.post('/upload', upload.single('image'), imageController.uploadImage);

// Basic operations
router.post('/resize', upload.single('image'), imageController.resize);
router.post('/crop', upload.single('image'), imageController.crop);
router.post('/rotate', upload.single('image'), imageController.rotate);
router.post('/flip', upload.single('image'), imageController.flip);

// Effects
router.post('/blur', upload.single('image'), imageController.blur);
router.post('/sharpen', upload.single('image'), imageController.sharpen);
router.post('/grayscale', upload.single('image'), imageController.grayscale);
router.post('/tint', upload.single('image'), imageController.tint);

// Advanced operations
router.post('/convert', upload.single('image'), imageController.convert);
router.post('/metadata', upload.single('image'), imageController.getMetadata);
router.post('/optimize', upload.single('image'), imageController.optimize);
router.post('/effects', upload.single('image'), imageController.applyEffects);

// Composition
router.post('/watermark', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'watermark', maxCount: 1 }
]), imageController.watermark);

router.post('/composite', upload.array('images', 10), imageController.composite);

module.exports = router;