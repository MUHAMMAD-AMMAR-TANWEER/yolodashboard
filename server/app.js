const express = require('express');
const app = express();

//Middleware

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