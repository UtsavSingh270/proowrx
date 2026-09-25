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

async function uploadToCloudinary(buffer, mimetype, filename = '') {
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
  if (resource_type === 'raw') {
    const extension = require('path').extname(filename).toLowerCase().replace(/[^.a-z0-9]/g, '');
    uploadOptions.public_id = `${require('crypto').randomUUID()}${extension}`;
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) return reject(error);
      resolve(buildAssetMetadata(result));
    });

    const stream = Readable.from(buffer);
    stream.pipe(uploadStream);
  });
}

async function deleteCloudinaryAsset(publicId, resourceType = 'image') {
  if (!publicId) {
    throw new Error('Cloudinary public_id is required for deletion');
  }

  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType, invalidate: true });
}

function isCloudinaryAsset(value) {
  return value && typeof value === 'object' && typeof value.public_id === 'string' && typeof value.secure_url === 'string';
}

function cloudinaryAssetDetails(value) {
  if (isCloudinaryAsset(value)) {
    return {
      publicId: value.public_id,
      resourceType: value.resource_type || 'image',
      url: value.secure_url,
    };
  }

  if (typeof value !== 'string' || !value.includes('res.cloudinary.com/')) return null;
  try {
    const url = new URL(value);
    if (url.hostname !== 'res.cloudinary.com') return null;
    const parts = url.pathname.split('/').filter(Boolean);
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex < 1) return null;
    const resourceType = parts[uploadIndex - 1];
    if (!['image', 'video', 'raw'].includes(resourceType)) return null;
    const versionIndex = parts.findIndex((part, index) => index > uploadIndex && /^v\d+$/.test(part));
    if (versionIndex === -1 || versionIndex === parts.length - 1) return null;
    const publicIdParts = parts.slice(versionIndex + 1).map(decodeURIComponent);
    if (resourceType !== 'raw') {
      publicIdParts[publicIdParts.length - 1] = publicIdParts.at(-1).replace(/\.[a-z0-9]+$/i, '');
    }
    return { publicId: publicIdParts.join('/'), resourceType, url: value };
  } catch {
    return null;
  }
}

async function deleteCloudinaryValue(value) {
  const asset = cloudinaryAssetDetails(value);
  if (!asset) return false;
  await deleteCloudinaryAsset(asset.publicId, asset.resourceType);
  return true;
}

async function deleteReplacedCloudinaryValue(previous, next, label = 'media') {
  const oldAsset = cloudinaryAssetDetails(previous);
  if (!oldAsset) return false;
  const newAsset = cloudinaryAssetDetails(next);
  if (newAsset?.publicId === oldAsset.publicId && newAsset.resourceType === oldAsset.resourceType) return false;
  try {
    await deleteCloudinaryAsset(oldAsset.publicId, oldAsset.resourceType);
    return true;
  } catch (error) {
    console.warn(`Failed to delete replaced ${label}`, error.message);
    return false;
  }
}

module.exports = {
  uploadToCloudinary,
  deleteCloudinaryAsset,
  deleteCloudinaryValue,
  deleteReplacedCloudinaryValue,
  cloudinaryAssetDetails,
  isCloudinaryAsset,
};
