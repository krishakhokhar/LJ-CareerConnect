const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');
const env = require('../config/env');

const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

/**
 * Uploads a file buffer to Cloudinary when configured, otherwise falls back
 * to local disk storage under /uploads and returns a URL served by Express.
 * @param {Buffer} buffer
 * @param {Object} options { folder, resourceType, filename }
 */
const uploadBuffer = async (buffer, { folder = 'misc', resourceType = 'auto', filename = 'file' } = {}) => {
  if (isCloudinaryConfigured) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: `lj-careerconnect/${folder}`, resource_type: resourceType },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            provider: 'cloudinary',
          });
        }
      );
      stream.end(buffer);
    });
  }

  // Local fallback
  const ext = path.extname(filename) || '';
  const safeName = `${folder}-${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
  const folderPath = path.join(UPLOADS_DIR, folder);
  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
  const filePath = path.join(folderPath, safeName);
  fs.writeFileSync(filePath, buffer);

  return {
    url: `${env.SERVER_BASE_URL || `http://localhost:${env.PORT}`}/uploads/${folder}/${safeName}`,
    publicId: `local:${folder}/${safeName}`,
    provider: 'local',
  };
};

const deleteFile = async (publicId) => {
  if (!publicId) return;
  if (publicId.startsWith('local:')) {
    const relative = publicId.replace('local:', '');
    const filePath = path.join(UPLOADS_DIR, relative);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return;
  }
  if (isCloudinaryConfigured) {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'auto' });
  }
};

module.exports = { uploadBuffer, deleteFile };
