const express = require('express')
const { getNote, deleteNote, saveNote } = require('../controller/note.controller')
const router = express.Router()


router.route('/')
    .get(getNote)

router.route('/note')
    .post(saveNote)

router.route('/note/:id')
    .delete(deleteNote)


module.exports = router