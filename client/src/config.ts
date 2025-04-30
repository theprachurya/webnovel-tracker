export const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'https://your-project-name.up.railway.app',
  cloudinaryCloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'your_cloudinary_cloud_name',
  cloudinaryUploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'your_upload_preset'
}; 