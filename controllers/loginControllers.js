const { getDescriptorsFromDB } = require("../services/faceApiService");
const path = require("path");


async function handleLogin(req, res) {
    setTimeout(() => {
        let File1 = path.join(__dirname, "../", "/uploads/checkimg.jpg");
        getDescriptorsFromDB(File1).then((result) => {
            res.json({
                message: "face fetch succesfully!",
                result: result
            })
        }).catch(error => {
            res.json({
                message: "Something went wrong, Please try again.",
                error: error
            })
        });
    }, 2000);
}

module.exports = {handleLogin};