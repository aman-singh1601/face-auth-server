const mongoose = require('mongoose');

const faceSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
        unique: true
    },
    descriptions: {
        type: Array,
        required: true
    }
})

const FaceModal = mongoose.model('Face', faceSchema);

module.exports = FaceModal;

