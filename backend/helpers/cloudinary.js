const cloudinary = require('cloudinary').v2;
const multer = require("multer");

cloudinary.config({
    cloud_name : "pradeepvermacloud",
    api_key : "635298952372113",
    api_secret : "rx9BD4C0lC_tJ1CNElJu9TuRtN8"
});

const storage = new multer.memoryStorage();

async function imageUploadUtil(file) {
    const results = await cloudinary.uploader.upload(file, {
        resource_type : 'auto'
    });

    return results;
}

const upload = multer({storage});

module.exports = {upload, imageUploadUtil}