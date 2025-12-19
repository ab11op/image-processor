// Global variables
let currentImage = null;
let processedImagePath = null;

/**
 * Upload image to server
 */
async function uploadImage() {
  const fileInput = document.getElementById('imageInput');
  const file = fileInput.files[0];
  
  if (!file) {
    showAlert('Please select an image first', 'warning');
    return;
  }

  const formData = new FormData();
  formData.append('image', file);

  showLoading(true);

  try {
    const response = await fetch('/api/images/upload', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    
    if (data.success) {
      currentImage = data.filename;
      document.getElementById('originalImage').src = data.path;
      document.getElementById('imagePreview').classList.remove('hidden');
      document.getElementById('operations').classList.remove('hidden');
      
      // Show image info
      const infoDiv = document.getElementById('imageInfo');
      infoDiv.innerHTML = `
        <strong>File:</strong> ${data.filename}<br>
        <strong>Size:</strong> ${formatFileSize(data.size)}<br>
        <strong>Type:</strong> ${data.mimetype}
      `;
      
      showAlert('Image uploaded successfully!', 'success');
    } else {
      showAlert(data.error || 'Upload failed', 'error');
    }
  } catch (error) {
    showAlert('Upload failed: ' + error.message, 'error');
  } finally {
    showLoading(false);
  }
}

/**
 * Process image with selected operation
 */
async function processImage(operation) {
  if (!currentImage) {
    showAlert('Please upload an image first', 'warning');
    return;
  }

  const fileInput = document.getElementById('imageInput');
  const formData = new FormData();
  formData.append('image', fileInput.files[0]);

  // Add operation-specific parameters
  switch(operation) {
    case 'resize':
      formData.append('width', document.getElementById('resizeWidth').value);
      formData.append('height', document.getElementById('resizeHeight').value);
      formData.append('fit', document.getElementById('resizeFit').value);
      break;
      
    case 'crop':
      formData.append('left', document.getElementById('cropLeft').value);
      formData.append('top', document.getElementById('cropTop').value);
      formData.append('width', document.getElementById('cropWidth').value);
      formData.append('height', document.getElementById('cropHeight').value);
      break;
      
    case 'rotate':
      formData.append('angle', document.getElementById('rotateAngle').value);
      break;
      
    case 'flip':
      formData.append('direction', document.getElementById('flipDirection').value);
      break;
      
    case 'blur':
      formData.append('sigma', document.getElementById('blurSigma').value);
      break;
      
    case 'sharpen':
      formData.append('sigma', document.getElementById('sharpenSigma').value);
      break;
      
    case 'effects':
      formData.append('brightness', document.getElementById('brightness').value);
      formData.append('saturation', document.getElementById('saturation').value);
      formData.append('contrast', document.getElementById('contrast').value);
      break;
      
    case 'tint':
      formData.append('color', document.getElementById('tintColor').value);
      break;
      
    case 'convert':
      formData.append('format', document.getElementById('convertFormat').value);
      formData.append('quality', document.getElementById('convertQuality').value);
      break;
  }

  showLoading(true);

  try {
    const response = await fetch(`/api/images/${operation}`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    
    if (data.success) {
      if (operation === 'metadata') {
        displayMetadata(data.metadata);
        showAlert('Metadata retrieved successfully!', 'success');
      } else {
        processedImagePath = data.processedPath;
        document.getElementById('processedImage').src = data.processedPath + '?t=' + Date.now();
        document.getElementById('result').classList.remove('hidden');
        
        if (data.stats) {
          displayMetadata(data.stats);
        } else {
          document.getElementById('metadata').innerHTML = '';
        }
        
        showAlert(data.message || 'Image processed successfully!', 'success');
        
        // Scroll to result
        document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      showAlert(data.error || 'Processing failed', 'error');
    }
  } catch (error) {
    showAlert('Processing failed: ' + error.message, 'error');
  } finally {
    showLoading(false);
  }
}

/**
 * Display metadata or stats
 */
function displayMetadata(data) {
  const metadataDiv = document.getElementById('metadata');
  metadataDiv.innerHTML = '<h3>📊 Image Information</h3><pre>' + 
    JSON.stringify(data, null, 2) + '</pre>';
  document.getElementById('result').classList.remove('hidden');
  document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Download processed image
 */
function downloadImage() {
  if (processedImagePath) {
    const link = document.createElement('a');
    link.href = processedImagePath;
    link.download = processedImagePath.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showAlert('Download started!', 'success');
  } else {
    showAlert('No processed image to download', 'warning');
  }
}

/**
 * Show/hide loading indicator
 */
function showLoading(show) {
  document.getElementById('loading').classList.toggle('hidden', !show);
}

/**
 * Show alert message
 */
function showAlert(message, type = 'info') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;
  alertDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 25px;
    background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#4299e1'};
    color: white;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    z-index: 9999;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(alertDiv);
  
  setTimeout(() => {
    alertDiv.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => alertDiv.remove(), 300);
  }, 3000);
}

/**
 * Format file size
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Helper function to set rotation angle
 */
function setRotate(angle) {
  document.getElementById('rotateAngle').value = angle;
}

/**
 * Sync color picker with text input
 */
document.addEventListener('DOMContentLoaded', () => {
  const colorInput = document.getElementById('tintColor');
  const colorText = document.getElementById('tintColorText');
  
  if (colorInput && colorText) {
    colorInput.addEventListener('input', (e) => {
      colorText.value = e.target.value;
    });
  }
  
  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
});