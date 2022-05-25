const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
require('./db/conn');
app.use(express.json());

// const User = require('./models/userSchema');

app.use(require('./router/auth'));
//Middleware
dotenv.config({path:'./config.env'})
const DB = process.env.DB;
const PORT = process.env.PORT;
console.log(DB);


const middleware = (req, res,next) =>{
    console.log(`Hello My middleware`);
    next();
}




app.get('/', (req,res) =>{
    res.send('Hello from the server ');

});

app.get('/login', (req,res) =>{
    res.send('Hello from login the server ');

});

app.get('/signup', (req,res) =>{
    res.send('Hello from signup the server ');

});

app.get('/aboutme',middleware ,(req,res) =>{
    res.send('Hello from aboutme the server ');

});

app.get('/contact', (req,res) =>{
    res.send('Hello from contact the server ');

});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})