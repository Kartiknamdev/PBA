// import multer from "multer";
// import fs from "fs";

// // Ensure the temp directory exists
// const tempDir = "./public/temp";
// if (!fs.existsSync(tempDir)) {
//   fs.mkdirSync(tempDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: function (req, res, cb) {
//     cb(null, tempDir); // Save files in the temp directory
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname); // Use the original file name
//   },
// });

// export const upload = multer({
//   storage,
// });
import multer from 'multer';

const storage = multer.memoryStorage();

export const upload = multer({ storage });
