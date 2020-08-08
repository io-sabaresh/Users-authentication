const mongoose = require('mongoose');
const { MONGO_CONNECTION_STRING } = require('../../constants');

module.exports = mongoose.connect(MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, (err, data) => {
    if (err) console.log("Error while connecting to mongo db ! \n", err);
    else console.log("Mongo DB connected!");
});