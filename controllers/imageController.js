const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

class ImageController {
  /**
   * Upload image and return file info
   */
  async uploadImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      res.json({
        success: true,
        message: 'Image uploaded successfully',
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
        size: req.file.size,
        mimetype: req.file.mimetype
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Resize image
   */
  async resize(req, res) {
    try {
      const { width, height, fit = 'cover' } = req.body;
      const outputPath = `processed/resized-${Date.now()}.png`;

      await sharp(req.file.path)
        .resize(parseInt(width), parseInt(height), { 
          fit: fit,
          position: 'center'
        })
        .toFile(outputPath);

      res.json({
        success: true,
        message: 'Image resized successfully',
        originalPath: `/uploads/${req.file.filename}`,
        processedPath: `/${outputPath}`,
        operation: 'resize',
        params: { width, height, fit }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Crop image
   */
  async crop(req, res) {
    try {
      const { left, top, width, height } = req.body;
      const outputPath = `processed/cropped-${Date.now()}.png`;

      await sharp(req.file.path)
        .extract({
          left: parseInt(left) || 0,
          top: parseInt(top) || 0,
          width: parseInt(width),
          height: parseInt(height)
        })
        .toFile(outputPath);

      res.json({
        success: true,
        message: 'Image cropped successfully',
        originalPath: `/uploads/${req.file.filename}`,
        processedPath: `/${outputPath}`,
        operation: 'crop',
        params: { left, top, width, height }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Rotate image
   */
  async rotate(req, res) {
    try {
      const { angle = 90 } = req.body;
      const outputPath = `processed/rotated-${Date.now()}.png`;

      await sharp(req.file.path)
        .rotate(parseInt(angle))
        .toFile(outputPath);

      res.json({
        success: true,
        message: 'Image rotated successfully',
        originalPath: `/uploads/${req.file.filename}`,
        processedPath: `/${outputPath}`,
        operation: 'rotate',
        params: { angle }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Flip image
   */
  async flip(req, res) {
    try {
      const { direction = 'horizontal' } = req.body;
      const outputPath = `processed/flipped-${Date.now()}.png`;
      
      let image = sharp(req.file.path);
      
      if (direction === 'horizontal') {
        image = image.flop();
      } else if (direction === 'vertical') {
        image = image.flip();
      } else {
        image = image.flip().flop();
      }

      await image.toFile(outputPath);

      res.json({
        success: true,
        message: 'Image flipped successfully',
        originalPath: `/uploads/${req.file.filename}`,
        processedPath: `/${outputPath}`,
        operation: 'flip',
        params: { direction }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Apply blur effect
   */
  async blur(req, res) {
    try {
      const { sigma = 5 } = req.body;
      const outputPath = `processed/blurred-${Date.now()}.png`;

      await sharp(req.file.path)
        .blur(parseFloat(sigma))
        .toFile(outputPath);

      res.json({
        success: true,
        message: 'Blur effect applied successfully',
        originalPath: `/uploads/${req.file.filename}`,
        processedPath: `/${outputPath}`,
        operation: 'blur',
        params: { sigma }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Sharpen image
   */
  async sharpen(req, res) {
    try {
      const { sigma = 1, flat = 1, jagged = 2 } = req.body;
      const outputPath = `processed/sharpened-${Date.now()}.png`;

      await sharp(req.file.path)
        .sharpen({
          sigma: parseFloat(sigma),
          flat: parseFloat(flat),
          jagged: parseFloat(jagged)
        })
        .toFile(outputPath);

      res.json({
        success: true,
        message: 'Image sharpened successfully',
        originalPath: `/uploads/${req.file.filename}`,
        processedPath: `/${outputPath}`,
        operation: 'sharpen',
        params: { sigma, flat, jagged }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Convert to grayscale
   */
  async grayscale(req, res) {
    try {
      const outputPath = `processed/grayscale-${Date.now()}.png`;

      await sharp(req.file.path)
        .grayscale()
        .toFile(outputPath);

      res.json({
        success: true,
        message: 'Image converted to grayscale',
        originalPath: `/uploads/${req.file.filename}`,
        processedPath: `/${outputPath}`,
        operation: 'grayscale'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Apply tint color
   */
  async tint(req, res) {
    try {
      const { color = '#0000FF' } = req.body;
      const outputPath = `processed/tinted-${Date.now()}.png`;

      await sharp(req.file.path)
        .tint(color)
        .toFile(outputPath);

      res.json({
        success: true,
        message: 'Tint color applied successfully',
        originalPath: `/uploads/${req.file.filename}`,
        processedPath: `/${outputPath}`,
        operation: 'tint',
        params: { color }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Convert image format
   */
  async convert(req, res) {
    try {
      const { format = 'jpeg', quality = 80 } = req.body;
      const outputPath = `processed/converted-${Date.now()}.${format}`;

      await sharp(req.file.path)
        .toFormat(format, { quality: parseInt(quality) })
        .toFile(outputPath);

      res.json({
        success: true,
        message: `Image converted to ${format}`,
        originalPath: `/uploads/${req.file.filename}`,
        processedPath: `/${outputPath}`,
        operation: 'convert',
        params: { format, quality }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get image metadata
   */
  async getMetadata(req, res) {
    try {
      const metadata = await sharp(req.file.path).metadata();
      const stats = await fs.stat(req.file.path);
      
      res.json({
        success: true,
        message: 'Metadata retrieved successfully',
        metadata: {
          format: metadata.format,
          width: metadata.width,
          height: metadata.height,
          space: metadata.space,
          channels: metadata.channels,
          depth: metadata.depth,
          density: metadata.density,
          hasAlpha: metadata.hasAlpha,
          orientation: metadata.orientation,
          size: stats.size,
          sizeInKB: (stats.size / 1024).toFixed(2),
          sizeInMB: (stats.size / (1024 * 1024)).toFixed(2)
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Optimize image
   */
  async optimize(req, res) {
    try {
      const outputPath = `processed/optimized-${Date.now()}.jpg`;

      await sharp(req.file.path)
        .jpeg({ 
          quality: 80, 
          progressive: true, 
          mozjpeg: true 
        })
        .toFile(outputPath);

      const originalSize = req.file.size;
      const optimizedStats = await fs.stat(outputPath);
      const optimizedSize = optimizedStats.size;
      const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(2);

      res.json({
        success: true,
        message: 'Image optimized successfully',
        originalPath: `/uploads/${req.file.filename}`,
        processedPath: `/${outputPath}`,
        operation: 'optimize',
        stats: {
          originalSize: originalSize,
          originalSizeKB: (originalSize / 1024).toFixed(2),
          optimizedSize: optimizedSize,
          optimizedSizeKB: (optimizedSize / 1024).toFixed(2),
          savings: `${savings}%`,
          reduction: originalSize - optimizedSize
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Apply multiple effects
   */
  async applyEffects(req, res) {
    try {
      const { 
        brightness = 1, 
        saturation = 1, 
        hue = 0,
        contrast = 1 
      } = req.body;
      
      const outputPath = `processed/effects-${Date.now()}.png`;

      await sharp(req.file.path)
        .modulate({
          brightness: parseFloat(brightness),
          saturation: parseFloat(saturation),
          hue: parseInt(hue)
        })
        .linear(parseFloat(contrast), -(128 * parseFloat(contrast)) + 128)
        .toFile(outputPath);

      res.json({
        success: true,
        message: 'Effects applied successfully',
        originalPath: `/uploads/${req.file.filename}`,
        processedPath: `/${outputPath}`,
        operation: 'effects',
        params: { brightness, saturation, hue, contrast }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Add watermark to image
   */
  async watermark(req, res) {
    try {
      const { position = 'southeast', opacity = 0.5 } = req.body;
      const outputPath = `processed/watermarked-${Date.now()}.png`;

      const image = sharp(req.files.image[0].path);
      const metadata = await image.metadata();

      // Resize watermark to 20% of image width
      const watermark = await sharp(req.files.watermark[0].path)
        .resize({ width: Math.floor(metadata.width * 0.2) })
        .composite([{
          input: Buffer.from([255, 255, 255, Math.floor(parseFloat(opacity) * 255)]),
          raw: { width: 1, height: 1, channels: 4 },
          tile: true,
          blend: 'dest-in'
        }])
        .toBuffer();

      await image
        .composite([{ input: watermark, gravity: position }])
        .toFile(outputPath);

      res.json({
        success: true,
        message: 'Watermark applied successfully',
        originalPath: `/uploads/${req.files.image[0].filename}`,
        processedPath: `/${outputPath}`,
        operation: 'watermark',
        params: { position, opacity }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Composite multiple images
   */
  async composite(req, res) {
    try {
      if (!req.files || req.files.length < 2) {
        return res.status(400).json({ error: 'At least 2 images required' });
      }

      const outputPath = `processed/composite-${Date.now()}.png`;
      const baseImage = sharp(req.files[0].path);

      const composites = [];
      for (let i = 1; i < req.files.length; i++) {
        composites.push({
          input: req.files[i].path,
          gravity: 'center'
        });
      }

      await baseImage
        .composite(composites)
        .toFile(outputPath);

      res.json({
        success: true,
        message: 'Images composited successfully',
        processedPath: `/${outputPath}`,
        operation: 'composite',
        params: { imageCount: req.files.length }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ImageController();