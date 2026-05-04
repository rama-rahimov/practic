import express from 'express';
import {saveFile} from "../services/service.fs.js";
const router = express.Router();

router.post('/upload', (req,res)=> {
    const { file_data, path } = req.body;
    saveFile(file_data, path, '12RR43', (filename) => {
        res.json(filename);
    });

})

export default router;