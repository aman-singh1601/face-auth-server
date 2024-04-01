const mongoose = require('mongoose');

function MongoDbConnect(URL) {
    return mongoose.connect(URL);
}

module.exports = {MongoDbConnect};