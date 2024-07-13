import multer from "multer";
import path from "path";
import fs from "fs";
import { nanoid } from "nanoid";
import { appError } from "../error/classError.js";

export const validExtension = {
  image: ["image/png", "image/jpg"],
  pdf: ["application/pdf"],
};

export const multerLocal = (customerValidation, cutsomPath = "uploads") => {
  const allPath = path.resolve(`uploads/${cutsomPath}`);
  if (!fs.existsSync(allPath)) {
    fs.mkdirSync(allPath, {recursive: true});
  }
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, allPath);
    },
    filename: (req, file, cb) => {
      cb(null, nanoid(5) + "_" + file.originalname);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (customerValidation.includes(file.mimetype)) {
      return cb(null, true);
    }
    cb(new appError("file not supported"), false);
  };

  const upload = multer({ storage, fileFilter });
  return upload;
};
