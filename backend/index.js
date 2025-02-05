const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth.route')
const noteRoutes = require('./routes/note.route')
const PORT = 8080;

const app = express();
// db connection
mongoose.connect('mongodb://localhost:27017/react-test')
    .then(() => {
        console.log('DB connected');
    }).catch((err) => {
        console.log(err);
    })

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', authRoutes)
app.use('/api/notes', noteRoutes)


app.listen(PORT, () => {
    console.log('Server start at', PORT);
})