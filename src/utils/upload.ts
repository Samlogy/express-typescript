const multer = require('multer');
const path = require('path');
import { Request, Response, NextFunction } from "express";

// handle storage using multer
const storage = multer.diskStorage({
    destination:  (req: Request, file: any, cb: any) => {
       cb(null, '../uploads');
    },
    filename: (req: Request, file: any, cb: any) => {
       cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});
export const upload = multer({ storage: storage });

 // Upload single file
 export const upload_single_file = (upload.single('file'), (req: any, res: Response, next: NextFunction) => {
    const file = req.file;

    if (!file) return res.status(400).send({ message: 'Please upload a file.' });
    return res.status(200).send({ message: 'File uploaded successfully.', file });
});

// Upload multiple files
export const upload_multiple_files = (upload.array('files', 10), (req: any, res: Response, next: NextFunction) => {
    const files = req.files;

    if (!files || (files && files.length === 0)) return res.status(400).send({ message: 'Please upload a file.' });
    return res.status(200).send({ message: 'Uploaded successfully.', files });
});