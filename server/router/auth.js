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
        else if (password != cpassword){
            return res.status(422).json({error:"Password is not matching"});
        }
        else {
            const user = new User({name , email, device, password, cpassword});
            await user.save();
            res.status(201).json({message:"User successfully registered"});

        }



        //yaha hash karna hai 






    }

    catch (err) {

        console.log(err);

    }

});

router.post('/login', async (req,res) =>{
    try{
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({error:"Please fill the data"});
        }

        const userLogin = await User.findOne({email:email});

        if (!userLogin){
            res.status(400).json({error:"Email not exist"});
        }
        else {
            res.status(200).json({message:"user Signin SUccessfully"});
        }


    }
    catch(err){
        console.log(err);

    }
});

module.exports = router;