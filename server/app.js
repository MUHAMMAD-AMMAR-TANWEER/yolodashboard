const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();

//Middleware
dotenv.config({path:'./config.env'})
const DB = process.env.DB;

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(()=>{
    console.log(`connection successfull`);
}).catch((err) => console.log(`no connection`));

mongoose.Promise = global.Promise

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


app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
})