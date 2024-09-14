const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var chatSchema = new mongoose.Schema({
    members: Array,
}, {
    timestamps: true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

//Export the model
module.exports = mongoose.model('Chat', chatSchema);