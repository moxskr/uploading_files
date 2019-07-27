const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const hbs = require('hbs');

const PORT = 5000;
const app = express();
const dbUrl = "mongodb://localhost:27017/upload_files";
const File = require('./model/File');

mongoose.connect(dbUrl, {useNewUrlParser : true})
    .then(() => console.log('Database connected'))
    .catch(err => console.log(err));

app.use(cors());
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(multer({dest : 'uploads'}).single("filedata"));

app.get("/", (req, res) => {

    File.find({}, (err, files) => {
        if(err) console.error(err);
        else{
            res.render("index.hbs", {
                files : files
            })
        }
    });


});

app.post("/upload", (req, res) => {
    let filedata = req.file;
    let filename = filedata.originalname;

    if(filedata){
        File.findOne({filename})
            .then(file => {
                if(file){
                    res.status(400).json({
                        success : false,
                        error : 'Such file is already exists'
                    })
                }
                else{
                    const newFile = new File({
                        filename,
                        filepath: `/uploads/${filedata.filename}`
                    });
                    newFile.save();
                    res.redirect("/");
                }
            })
    }
});

hbs.registerHelper('createFileList', (arr) => {
    let result = "";
    for(let i = 0; i < arr.length; i++){
        result += "<li>" + arr[i].filename + "</li>";
    }
    return new hbs.SafeString("<ul>" + result + "</ul>")
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));