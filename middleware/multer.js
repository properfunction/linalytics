const multer = require("multer"); // Handles file uploads
const path = require("path"); // Works with file paths, specifically the file extension

module.exports = multer({
  storage: multer.diskStorage({}), // Used to configure where and how files are stored, an empty object means files will be stored with default settings
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname); // Extracts the file extension where originalname is the name of uploaded file
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("File type is not supported"), false); // The false argument tells Multer to reject the file
      return;
    }
    cb(null, true); // If file extension is valid, it accepts the upload
  },
});
