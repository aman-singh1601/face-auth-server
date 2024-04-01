
const { uploadLabeledImages } = require("../services/faceApiService");
const path = require('path');



async function handleRegister(req, res) {

    const label = req.body.label;

    let path1 = `/uploads/${label}1.jpg`;
    let path2 = `/uploads/${label}2.jpg`;
    let path3 = `/uploads/${label}3.jpg`;
    setTimeout(() => {
        uploadLabeledImages([
        path.join(__dirname, "../", path1),
        path.join(__dirname, "../", path2),
        path.join(__dirname, "../", path3)
        ], label).then((result) => {
            res.json({
                message: "Face data stored successfully!",
                result: result
            })
        }).catch((error) => {
            res.json({
                message: "Something went wrong, Please try again.",
                error: error
            })
        });
    }, 2000);

}

module.exports = { handleRegister };