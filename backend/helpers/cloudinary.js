const cloudinary = require('cloudinary').v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

console.log(process.env.CLOUDINARY_KEY, "key cloudinary");

const storage = new multer.memoryStorage();

async function imageUploadUtil(buffer) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(buffer);
  });
}

const upload = multer({storage});

module.exports = {upload, imageUploadUtil}