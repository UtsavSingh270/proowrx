const { Readable } = require('stream');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const DEFAULT_FOLDER = process.env.CLOUDINARY_FOLDER || 'proowrx_media';

function getResourceType(mimetype) {
  if (typeof mimetype !== 'string') return 'auto';
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  return 'raw';
}

function buildAssetMetadata(result) {
  return {
    public_id: result.public_id,
    secure_url: result.secure_url,
    width: result.width || 0,
    height: result.height || 0,
    format: result.format || '',
    resource_type: result.resource_type || '',
    bytes: result.bytes || 0,
    original_filename: result.original_filename || '',
  };
}

async function uploadToCloudinary(buffer, mimetype) {
  if (!buffer || !mimetype) {
    throw new Error('Invalid upload payload');
  }

  const resource_type = getResourceType(mimetype);
  const uploadOptions = {
    folder: DEFAULT_FOLDER,
    resource_type,
    use_filename: true,
    unique_filename: true,
    overwrite: false,
  };

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) return reject(error);
      resolve(buildAssetMetadata(result));
    });

    const stream = Readable.from(buffer);
    stream.pipe(uploadStream);
  });
}

async function deleteCloudinaryAsset(publicId) {
  if (!publicId) {
    throw new Error('Cloudinary public_id is required for deletion');
  }

  return cloudinary.uploader.destroy(publicId, { resource_type: 'auto' });
}

function isCloudinaryAsset(value) {
  return value && typeof value === 'object' && typeof value.public_id === 'string' && typeof value.secure_url === 'string';
}

module.exports = {
  uploadToCloudinary,
  deleteCloudinaryAsset,
  isCloudinaryAsset,
};
