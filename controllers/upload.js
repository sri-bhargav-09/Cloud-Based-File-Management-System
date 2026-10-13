
const FILEUPLOAD = require("../models/upload");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const fs = require("fs/promises");

// Check whether a file extension is supported
function isFileTypeSupported(type, supportedTypes) {
  return supportedTypes.includes(type);
}

// Upload a file to Cloudinary
async function uploadFileToCloudinary(file, folder, quality) {
  const options = { folder };

  if (quality) {
    options.quality = quality;
  }

  options.resource_type = "auto";

  return await cloudinary.uploader.upload(
    file.tempFilePath,
    options
  );
}

// Handle Mongoose validation errors separately
function handleUploadError(error, res, operation) {
  console.error(`${operation} failed:`, error);

  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: `Unable to ${operation.toLowerCase()}`,
  });
}

// Upload a file to the local server
const localUpload = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a file",
      });
    }

    const file = req.files.file;
    const uploadDir = path.join(__dirname, "files");

    await fs.mkdir(uploadDir, { recursive: true });

    const extension = path.extname(file.name);
    const filename = `${Date.now()}${extension}`;
    const uploadPath = path.join(uploadDir, filename);

    await file.mv(uploadPath);

    return res.status(200).json({
      success: true,
      message: "Local file uploaded successfully",
      filename,
    });
  } catch (error) {
    return handleUploadError(error, res, "upload file to the server");
  }
};

// Upload an image to Cloudinary and save its details in MongoDB
const imageUpload = async (req, res) => {
  try {
    const { name, tags, email } = req.body;

    if (!req.files || !req.files.imageFile) {
      return res.status(400).json({
        success: false,
        message: "Please provide an image file",
      });
    }

    const file = req.files.imageFile;
    const supportedTypes = ["jpg", "jpeg", "png"];
    const fileType = path.extname(file.name).slice(1).toLowerCase();

    if (!isFileTypeSupported(fileType, supportedTypes)) {
      return res.status(400).json({
        success: false,
        message: "File type not supported",
      });
    }

    const response = await uploadFileToCloudinary(file, "fileUpload");

    await FILEUPLOAD.create({
      name,
      tags,
      email,
      imageUrl: response.secure_url,
    });

    return res.status(200).json({
      success: true,
      imageUrl: response.secure_url,
      message: "Image uploaded to Cloudinary successfully",
    });
  } catch (error) {
    return handleUploadError(error, res, "upload image");
  }
};

// Upload a video to Cloudinary and save its details in MongoDB
const videoUpload = async (req, res) => {
  try {
    const { name, email, tags } = req.body;

    if (!req.files || !req.files.videoFile) {
      return res.status(400).json({
        success: false,
        message: "Please provide a video file",
      });
    }

    const file = req.files.videoFile;
    const supportedTypes = ["mp4", "mov"];
    const fileType = path.extname(file.name).slice(1).toLowerCase();

    if (!isFileTypeSupported(fileType, supportedTypes)) {
      return res.status(400).json({
        success: false,
        message: "File type not supported",
      });
    }

    // Video uploads are limited to 10 MB
    if (file.size > 10 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: "Video size must not exceed 10 MB",
      });
    }

    const response = await uploadFileToCloudinary(file, "fileUpload");

    await FILEUPLOAD.create({
      name,
      tags,
      email,
      imageUrl: response.secure_url,
    });

    return res.status(200).json({
      success: true,
      imageUrl: response.secure_url,
      message: "Video uploaded to Cloudinary successfully",
    });
  } catch (error) {
    return handleUploadError(error, res, "upload video");
  }
};

// Upload an image to Cloudinary with reduced quality
const imageReducer = async (req, res) => {
  try {
    const { name, tags, email } = req.body;

    if (!req.files || !req.files.imageReducer) {
      return res.status(400).json({
        success: false,
        message: "Please provide an image file",
      });
    }

    const file = req.files.imageReducer;
    const supportedTypes = ["jpg", "jpeg", "png"];
    const fileType = path.extname(file.name).slice(1).toLowerCase();

    if (!isFileTypeSupported(fileType, supportedTypes)) {
      return res.status(400).json({
        success: false,
        message: "File type not supported",
      });
    }

    const response = await uploadFileToCloudinary(
      file,
      "fileUpload",
      30
    );

    await FILEUPLOAD.create({
      name,
      tags,
      email,
      imageUrl: response.secure_url,
    });

    return res.status(200).json({
      success: true,
      imageUrl: response.secure_url,
      message: "Image uploaded with reduced quality successfully",
    });
  } catch (error) {
    return handleUploadError(error, res, "process image");
  }
};

module.exports = {
  localUpload,
  imageUpload,
  videoUpload,
  imageReducer,
};
