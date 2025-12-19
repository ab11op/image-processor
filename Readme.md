# Sharp.js Image Processing Project

A professional image processing web application built with Node.js, Express, Sharp.js, and EJS templates.

## Features

- 🖼️ Upload and process images
- 📏 Resize with multiple fit options
- ✂️ Crop images
- 🔄 Rotate and flip
- 🌫️ Blur and sharpen effects
- 🎨 Color adjustments (brightness, saturation, contrast)
- 💾 Format conversion (JPEG, PNG, WebP, TIFF, GIF)
- 🚀 Image optimization
- ℹ️ Metadata extraction
- 📊 File size comparison

## Installation

1. Clone or download this project 
```bash
git clone https://github.com/ab11op/image-processor.git
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:

http://localhost:3000


## API Endpoints

- `POST /api/images/upload` - Upload image
- `POST /api/images/resize` - Resize image
- `POST /api/images/crop` - Crop image
- `POST /api/images/rotate` - Rotate image
- `POST /api/images/flip` - Flip image
- `POST /api/images/blur` - Apply blur
- `POST /api/images/sharpen` - Sharpen image
- `POST /api/images/grayscale` - Convert to grayscale
- `POST /api/images/tint` - Apply color tint
- `POST /api/images/convert` - Convert format
- `POST /api/images/metadata` - Get metadata
- `POST /api/images/optimize` - Optimize image
- `POST /api/images/effects` - Apply color effects

## Technologies Used

- **Backend**: Node.js, Express.js
- **Image Processing**: Sharp.js
- **File Upload**: Multer
- **Template Engine**: EJS
- **Frontend**: Vanilla JavaScript, CSS3

## Project Structure

image-processor/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── routes/          # API routes
├── middleware/      # Custom middleware
├── views/           # EJS templates
├── public/          # Static files
├── uploads/         # Uploaded images
└── processed/       # Processed images


## License

MIT

## Author

Akash