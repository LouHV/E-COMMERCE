const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title_blog: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    description_blog: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    numberViews: {
        type: Number,
        default: 0,
    },
    likes: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],
    dislikes: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],
    image_blog: {
        type: String,
        default: 'https://img.freepik.com/free-photo/flat-lay-workstation-with-copy-space-laptop_23-2148430879.jpg'
    },
    author_blog: {
        type: String,
        default: 'Admin'
    }
}, {
    timestamps: true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);