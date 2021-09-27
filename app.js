const express = require("express");
const path = require('path');
const mysql = require("mysql");
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
const fileUpload = require('express-fileupload');

dotenv.config({ path: './.env' });

const app = express();

app.use(fileUpload());

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'hbs');

db.connect((error) => {
    if (error) {
        console.log(error)
    } else {
        console.log("MYSQL Connected...")
    }
})

//Define Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

app.listen(5001, () => {
    console.log("Server started on Port 5001");
})

app.post('', (req, res) => {
    let sampleFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    //name of the input is sampleFile
    sampleFile = req.files.sampleFile;
    uploadPath = __dirname + '/upload/' + sampleFile.name;

    console.log(sampleFile);

    //Use mv() to place file on the server
    sampleFile.mv(uploadPath, function(err) {
        if (err) return res.status(500).send(err);

        res.send('File uploaded!');

    });



});