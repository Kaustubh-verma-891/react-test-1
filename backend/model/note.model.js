const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema({
    heading: {
        type: String,
        required: true,
        trim: true
    },
    data: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;