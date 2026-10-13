
const { Schema, model } = require("mongoose");
const transporter = require("../config/mail");

const fileUploadSchema = new Schema({
  name: {
    type: String,
    required: [true, "File name is required"],
    trim: true,
  },
  imageUrl: {
    type: String,
    required: [true, "File URL is required"],
  },
  tags: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Recipient email is required"],
    trim: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Please provide a valid email address",
    ],
  },
});

// Send a notification after the document is saved
fileUploadSchema.post("save", async function (doc) {
  try {
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: doc.email,
      subject: "Your file has been uploaded successfully!",
      text: `Hello! Your file "${doc.name}" has been uploaded successfully. View it here: ${doc.imageUrl}`,
      html: `
        <h2>File uploaded successfully!</h2>
        <p>Hello,</p>
        <p>Your file <strong>${doc.name}</strong> has been uploaded successfully.</p>
        <p>
          <a href="${doc.imageUrl}">View your uploaded file</a>
        </p>
      `,
    });

    console.log(`Email notification sent to ${doc.email}`);
  } catch (error) {
    console.error("Email notification failed:", error.message);
  }
});

const FILEUPLOAD = model("fileUpload", fileUploadSchema);

module.exports = FILEUPLOAD;
