const mongoose = require('mongoose');

const DB = process.env.DB;


mongoose.connect('mongodb://localhost/Yolo', {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
    // useFindAndModify: false
}).then(()=>{
    console.log(`connection successfull`);
}).catch((err) => console.log(err));