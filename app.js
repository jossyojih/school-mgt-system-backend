const express = require('express');
const mongoose = require('mongoose')
const connectDB = require('./config/db');
const auth = require('./routes/Auth')
const post = require('./routes/post')
const user = require('./routes/student')
const bookList = require('./routes/books')
const subjects = require('./routes/subjects')
const admin = require('./routes/admin')
require('dotenv').config();
const Student = require('./models/student')
const Staff = require('./models/staff')
const Post = require('./models/post')
const BookList = require('./models/bookList')
const Subject = require('./models/subjects')
const cors = require('cors')
const schoolCalendar = require('./config/schoolCalendar')


const PORT = process.env.PORT || 5000;
connectDB();
//schoolCalendar();
const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(auth)
app.use(post)
app.use(user)
app.use(bookList)
app.use(subjects)
app.use(admin)

app.get('/', (req,res)=> {
    res.send('welcome to myschool App')
})

app.listen(PORT, ()=>console.log(`server has started on port ${PORT}`));
