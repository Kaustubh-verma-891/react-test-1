const User = require('../model/user.model');
const Notes = require('../model/note.model');

exports.getNote = async (req, res) => {
    try {
        const loggedUser = req.user._id;
        const user = await User.findById(loggedUser).populate('notes');
        res.status(200).json(user.notes);
    } catch (error) {
        console.error(error);
    }
};

exports.saveNote = async (req, res) => {
    try {
        const loggedUser = req.user._id;
        const { note } = req.body;

        const newNote = await Notes.create({ note, user: loggedUser });
        await User.findByIdAndUpdate(loggedUser, { $push: { notes: newNote._id } });

        res.status(201).json(newNote);
    } catch (error) {
        console.error(error);
    }
};

exports.deleteNote = async (req, res) => {
    try {
        const loggedUser = req.user._id;
        const { noteId } = req.params;

        await Notes.findByIdAndDelete(noteId);
        await User.findByIdAndUpdate(loggedUser, { $pull: { notes: noteId } });

        res.status(204).json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error(error);
    }
};