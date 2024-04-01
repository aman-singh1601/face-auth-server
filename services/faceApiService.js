const faceapi = require('face-api.js');
const {Canvas, Image} = require('canvas');
const FaceModal = require('../schema/faceSchema');
const canvas = require('canvas');
faceapi.env.monkeyPatch({Canvas, Image});

const { io} = require('../index');

let userId = null;
io.on("connection",(socket) => {
    console.log("socket connected");
    socket.on("subscribe" , (uuid)=> {
        console.log(uuid);
        userId = uuid;
        socket.join(uuid);
    })
})

async function LoadModals() {
    await faceapi.nets.faceRecognitionNet.loadFromDisk("./models");
    await faceapi.nets.faceLandmark68Net.loadFromDisk("./models");
    await faceapi.nets.ssdMobilenetv1.loadFromDisk("./models");

    console.log("face recognition models loaded successfully");
}

async function uploadLabeledImages(images, label) {

    try {
        let counter = 0;
        const descriptions = [];
        let img;
        let detections;


        //handling face 1
        img = await canvas.loadImage(images[0]);
        counter = (0 / images.length) * 100;

        detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
        descriptions.push(detections.descriptor);


        io.to(userId).emit("loader:data", {counter: 25});
        console.log(`Progress ${counter.toPrecision(2)}`);

        //handling face 2
        img = await canvas.loadImage(images[0]);
        counter = (1 / images.length) * 100;

        detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
        descriptions.push(detections.descriptor);


        io.to(userId).emit("loader:data", {counter: counter.toPrecision(2)});
        console.log(`Progress ${counter.toPrecision(2)}`);

        //handling face 3
        img = await canvas.loadImage(images[0]);
        counter = (2 / images.length) * 100;

        detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
        descriptions.push(detections.descriptor);


        io.to(userId).emit("loader:data", {counter: counter.toPrecision(2)});
        console.log(`Progress ${counter.toPrecision(2)}`);


        const createFace = new FaceModal({
            label: label,
            descriptions: descriptions
        });
        console.log("progress 100");
        await createFace.save();
        io.to(userId).emit("loader:data", {counter: "100"});
        return true;
        
    } catch (error) {
        console.log("error: uploadLabeledImages ", error);
        return error;
    }
}


async function getDescriptorsFromDB(image) {
    try {
        //Get all the face data from the mongodb and loop through each of them to read the data
        let faces = await FaceModal.find();
        let counter = 0;
        io.to(userId).emit("loader:data", {counter: 20});
        for(let i = 0; i < faces.length; i++) {
            //Change the face data descriptors from Objects to float32Array type
            for(let j = 0; j < faces[i].descriptions.length; j++) {
                faces[i].descriptions[j] = new Float32Array(Object.values(faces[i].descriptions[j]));
            }
            //turn the DB face docs to 
            faces[i] = new faceapi.LabeledFaceDescriptors(faces[i].label, faces[i].descriptions);
            counter = (i / faces.length) * 100;
            io.to(userId).emit("loader:data", {counter: counter.toPrecision(2)});
            console.log(`Progress ${counter.toPrecision(2)}`);
        }
        //load face mathcer to find the matching face
        const faceMatcher = new faceapi.FaceMatcher(faces, 0.6);

        //Read the image using canvas or other method
        const img = await canvas.loadImage(image);
        let temp = faceapi.createCanvasFromMedia(img);

        //Process the image for the model
        const displaySize = { width: img.width, height: img.height};
        faceapi.matchDimensions(temp, displaySize);

        //find the matching faces
        const detections = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));
        io.to(userId).emit("loader:data", {counter: "100"});
        return results;
    } catch (error) {

        console.log("error: getDescriptorsFromDB ", error);
        return error;
        
    }
    


}
module.exports = {LoadModals, uploadLabeledImages, getDescriptorsFromDB};