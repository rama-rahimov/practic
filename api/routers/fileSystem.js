import express from 'express';
import fs from 'fs';
import {FileModel} from "../database/models.js";
const router = express.Router();

router.get('/', async (req, res) => {
    res.send('Hellooo');
})

router.post('/upload', (req,res)=>{
    const { file_data, path } = req.body;
    saveFile(file_data, path, '12RR43', (filename) => {
        res.json(filename);
    });

})

const saveFile = (data, _path, fin, callback) => {
    const exts = ['jpg', 'jpeg', 'png', 'pdf', 'mp4', 'docx', 'doc', 'wsdl'];
    const path = _path.replace(/\.\./g, '');
    const extraPath = Math.floor(Math.random() * (99 - 10) + 10);
    if (!fs.existsSync(`./uploads`)) { fs.mkdirSync(`./uploads`); }
    if (!fs.existsSync(`./uploads/${path}`)) { fs.mkdirSync(`./uploads/${path}`); }
    if (!fs.existsSync(`./uploads/${path}/${extraPath}`)) { fs.mkdirSync(`./uploads/${path}/${extraPath}`); }
    if (!exts.includes(data.ext)) {
        callback('');
    } else if (data.filedata) {
        var name = makeid() + `.${data.ext}`;
        while (fs.existsSync(`./uploads/${path}/${extraPath}/${name}`)) {
            name = makeid() + `.${data.ext}`;
        }
        let base64Data = Buffer.from(data.filedata.split(',')[1], 'base64');
            fs.writeFileSync(`./uploads/${path}/${extraPath}/${name}`, base64Data);
            (async () => {
               await generateFileToken({ path: `./uploads/${path}/${extraPath}/${name}`, fin, name: data.fname + `.${data.ext}` }, (token) => {
                    callback('/file/' + token);
                });
            })()
    } else {
        callback('');
    }
}

const generateFileToken = async (data, callback) => {
    if (data.path) {
        const token = makeid();
        const check = await FileModel.findOne({where:{ token }});
        if (check) {
           await generateFileToken(data, check);
        }else {
            await FileModel.create({ ...data, token });
            callback(token);
        }
    } else {
        callback('');
    }
}

const makeid = (length) => {
    if (!length) {
        length = Math.floor(Math.random() * (45 - 10) + 10);
    }
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    console.log({ result, length });
    return result;
}

export default router;