const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'mhvjskc1',
  api_key: '595351264782185',
  api_secret: 'gW93DYadAbKgu9OSIJKodjbugKg',
});

async function main() {
  const sampleImageUrl = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';

  console.log('Uploading sample image from Cloudinary demo domain...');
  const uploadResult = await cloudinary.uploader.upload(sampleImageUrl, {
    folder: 'cloudinary_onboarding_demo',
    use_filename: true,
    unique_filename: false,
  });

  console.log('Upload complete.');
  console.log('Secure URL:', uploadResult.secure_url);
  console.log('Public ID:', uploadResult.public_id);

  console.log('\nFetching image metadata...');
  const resource = await cloudinary.api.resource(uploadResult.public_id);
  console.log('Width:', resource.width);
  console.log('Height:', resource.height);
  console.log('Format:', resource.format);
  console.log('File size (bytes):', resource.bytes);

  // f_auto selects the best format automatically for the delivery request.
  // q_auto selects the optimal quality level automatically.
  const transformedUrl = cloudinary.url(uploadResult.public_id, {
    fetch_format: 'auto',
    quality: 'auto',
  });

  console.log('\nDone! Click link below to see optimized version of the image. Check the size and the format.');
  console.log('Transformed URL:', transformedUrl);
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
