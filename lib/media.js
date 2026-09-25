import { upload } from '@/services/api';

export function assetUrl(value) { return typeof value === 'string' ? value : value?.secure_url || ''; }

export async function uploadImageValue(value) {
  if (typeof File !== 'undefined' && value instanceof File) {
    if (!value.type.startsWith('image/')) throw new Error('Choose an image file');
    const result = await upload.uploadImage(value);
    return assetUrl(result.asset || result);
  }
  return assetUrl(value);
}
