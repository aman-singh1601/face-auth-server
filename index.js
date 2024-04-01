const express = require('express');
const path = require('path');
require("dotenv").config();
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const base64Img = require('base64-img');

const {MongoDbConnect} = require('./connection.js');
const {LoadModals} = require('./services/faceApiService.js');

const loginRouter = require('./router/loginRouter.js');
const registerRouter = require('./router/registerRouter.js');


const app = express();

app.use(cors({
    origin: '*'
}));


app.use(bodyParser.urlencoded({limit:'300mb', extended: true }));


app.use(fileUpload({
    useTempFiles:true,
}))


const middleee = (req, res, next) => {
        req.files = {};

        if(req.body.checkImg) {
            //for handling login user
            base64Img.img(req.body.checkImg, './uploads', "checkimg",  (err, filePath) => {
                req.files.checkImg =  path.join( __dirname, filePath);
            });
        } else {
            //for handling register user
            let file1 = `${req.body.label}1`;
            let file2 = `${req.body.label}2`;
            let file3 = `${req.body.label}3`;
            base64Img.img(req.body.File1, './uploads', file1,  (err, filePath) => {
                req.files.File1 =  path.join( __dirname, filePath);
                
            });
        
            base64Img.img(req.body.File2, './uploads', file2,  (err, filePath) => {
                // tmp = {...tmp, File2: path.join( __dirname, filePath)};
                req.files.File2 =  path.join( __dirname, filePath);
        
            });
        
            base64Img.img(req.body.File3, './uploads', file3,  (err, filePath) => {
                // tmp = {...tmp, File3: path.join( __dirname, filePath)};
                req.files.File3 =  path.join( __dirname, filePath);
                // console.log("object inside ::",req.files);
            });
    }

    next();
}

app.use(middleee)

app.use('/api/create-face', registerRouter);
app.use("/api/fetch-face", loginRouter);



const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;

LoadModals();

MongoDbConnect(DB_URL);


app.listen(PORT, function() {
    console.log("Server listening on port " + PORT);
})