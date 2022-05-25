const express = require('express');
const router = express.Router();
require('../db/conn');
const User  = require('../models/userSchema');

router.get('/', (req,res) =>{
    res.send('Hello from the server routers');

});

//Done with promises
// router.post('/register', (req,res) => {

//     const {name , email, device, password, cpassword} = req.body;
//     if (!name  || !email || !device || !password || !cpassword) {
//         return res.status(422).json({message: "Please fill the form properly"});
//     }

//     User.findOne({email:email})
//     .then((userExist) => {
//         if (userExist){
//             return res.status(422).json({error:"User email already registered"});
//         }

//         const user = new User({name , email, device, password, cpassword});

//         user.save().then(() => {
//             res.status(201).json({message : "user has been registered successfully"});
//         }).catch((err) => res.status(500).json({error:"Failed to registerd"}));
//     }).catch(err => {console.log(err);});

//     // res.json({message:req.body});
// });

router.post('/register',async (req,res) => {
    const {name , email, device, password, cpassword} = req.body;

    if (!name  || !email || !device || !password || !cpassword) {
        return res.status(422).json({message: "Please fill the form properly"});
    }

    try{

        const userExist = await User.findOne({email:email});

        if (userExist) {
            return res.status(422).json({error: "Email Already registered"});
        }

        const user = new User({name , email, device, password, cpassword});

        await user.save();

        res.status(201).json({message:"User successfully registered"});

    }

    catch {

        console.log(err);

    }

})

module.exports = router;