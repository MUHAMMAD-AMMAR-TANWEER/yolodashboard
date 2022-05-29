const express = require('express');
const router = express.Router();
require('../db/conn');
const User  = require('../models/userSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Post = require("../models/Feed"); 
const TimPost = require("../models/TimFeed");


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
        let token;
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({error:"Please fill the data"});
        }

        const userLogin = await User.findOne({email:email});

        if (userLogin){
            const isMatch = await bcrypt.compare(password, userLogin.password);

            token = await userLogin.generateAuthToken();
            res.cookie("jwttoken",token,{
                expires: new Date(Date.now() +25892000000),
                httpOnly:true

            });
            // console.log(token);
            if (!isMatch){
                res.status(400).json({error:"Invalid credinatials  "});
            }
            else {
                res.json({message: "User Login Successfully"});
            }
        }
        else {
            res.status(400).json({error:"Invalid credinatials"});       
        }



    }
    catch(err){
        console.log(err);

    }
});


router.post("/feed" , async (req,res)=>{


    if (!req.body.Device)   {
        res.status(400).send({ message: "Please enter Device UID" });
        return;
      }

    const postt = new Post({
        Device:req.body.Device,
        Car:req.body.Car,
        Bicycle:req.body.Bicycle,
        Person:req.body.Person,
        Bus:req.body.Bus,
        Motorcycle:req.body.Motorcycle,
        Truck:req.body.Truck,

    
    })

    await postt
    .save()
    .then((postt) => {
      res.status(200).send({ message: "Done" });
    })
    .catch((err) =>
      res.status(400).send({ message: err })
      
    );
    




});

router.get("/gfeed", async (req,res) => {
    

    // var lst = [];
    var sendat = [];
    var carlst = []; var motolst = []; var trucklist = [] ; var buslist = []; var perlst = []; var cyclst = [];
    for (let i =0 ;i<31;i++){
        let now = new Date();
        var tod = new Date(now.setDate(now.getDate() - i));
        var prv = new Date(now.setDate(now.getDate() - i-1));

        let event_query = {"$gte":prv,"$lte":tod};
        const sum = await Post.aggregate([{$match : {"createdAt":event_query}},{$group:{_id:{Device:req.body.Device},
        "Car":{$sum:"$Car"}, "Person":{$sum:"$Person"},"Bicycle":{$sum:"$Bicycle"},"Bus":{$sum:"$Bus"},
        "Motorcycle":{$sum:"$Motorcycle"},"Truck":{$sum:"$Truck"}}}
        ,{$project:{_id:0,"Cars":"$Car","Person":"$Person","Bicycles":"$Bicycle","Buses":"$Bus","Motorcycles":"$Motorcycle","Trucks":"$Truck"}}]) //suming whole
        if (sum.length>0) {
            carlst.push(sum[0]["Cars"]); buslist.push(sum[0]["Buses"]); perlst.push(sum[0]["Person"]);cyclst.push(sum[0]["Bicycles"]);motolst.push(sum[0]["Motorcycles"]);trucklist.push(sum[0]["Trucks"]);
            sendat.push(new Date(now.setDate(now.getDate() - i)).toLocaleDateString('pt-PT'));

        }
        else {
            // console.log(tod);
            continue
        }


        // lst.push(new Date(now.setDate(now.getDate() - i)));//.toISOString().slice(0, 10)
        // sendat.push(new Date(now.setDate(now.getDate() - i)).toLocaleDateString('pt-PT'));
    }
    // console.log(sendat);
    // console.log(carlst);

    var finalData = {"Cars":carlst,"Bicycles":cyclst,"Buses":buslist,"Trucks":trucklist,"Person":perlst,"Motorcycles":motolst,"Labels":sendat};

    // const data = await Post.find({createdAt:{$gt:lst[3],$lt:lst[2]}});
    // console.log(data);
    // let event_query = {"$gte":lst[1],"$lte":lst[0]};
    //const data = await Post.aggregate([{ $match: {createdAt:{$gt:lst[3],$lt:lst[0]}} },{ $group: { _id: '$Device', car: { $sum: "$Car" }, Bicycle: { $sum: "$Bicycle" },Person: { $sum: "$Person" },Bus: { $sum: "$Bus" },Motorcycle: { $sum: "$Motorcycle" },Truck: { $sum: "$Truck" }} }]);
    // const data  = await Post.aggregate([{$match : {"createdAt":event_query}}]);
    // console.log(data);

    // const sum = await Post.aggregate([{$match : {"createdAt":event_query}},{$group:{_id:{Device:"TeslaX"},"Car":{$sum:"$Car"}, "Person":{$sum:"$Person"},"Bicycle":{$sum:"$Bicycle"},"Bus":{$sum:"$Bus"},"Motorcycle":{$sum:"$Motorcycle"},"Truck":{$sum:"$Truck"}}},{$project:{_id:0,"Cars":"$Car","Person":"$Person","Bicycles":"$Bicycle","Buses":"$Bus","Motorcycles":"$Motorcycle","Trucks":"$Truck"}}]) //suming whole
    // console.log(sum);
    console.log("###############");
    res.status(200).send(finalData);
});

//Post api for the server (csv data)
router.post('/timfeed' , async (req,res) => {
    console.log(req.body.Device);
    console.log(req.body.DatTim);

    if (!req.body.Device)   {
        res.status(400).send({ message: "Please enter Device UID" });
        return;
      }
      

    const timpost = new TimPost({
        Device:req.body.Device,
        DetectionID:req.body.DetectionID,
        DatTim:req.body.DatTim,
        Detection:req.body.Detection,


    
    })
    console.log(timpost);

    await timpost
    .save()
    .then((timpost) => {
      res.status(200).send({ message: "Done" });
    })
    .catch((err) =>
      res.status(400).send({ message: err })
      
    );
    

});

router.get('/gtimfeed' , async (req, res) => {

    var Data =[];
    if (!req.body.Device)   {
        res.status(400).send({ message: "Please enter Device UID" });
        return;
      }
    if (!req.body.StartDat && !req.body.EndDat){
        res.status(400).send({message:"Please Enter both Dates"});
        return;
    }

    var prvDat = new Date(req.body.StartDat);
    var NxtDat = new Date(req.body.EndDat);
    const event_query = {"$gte": prvDat, "$lte":NxtDat};

    const docs = await TimPost.aggregate([{"$match":{"createdAt":event_query}}, {"$group" :{_id:{Device:req.body.Device}, "DetectionID":{"$push": "$DetectionID"},"DatTim":{"$push": "$DatTim"},"Detection":{"$push": "$Detection"}}},

])
for (let i = 0 ; i<docs[0].DetectionID.length; i++){
    for (let j = 0; j<docs[0].Detection[i].length;j++){
        Data.push({"DateTime":docs[0].DatTim[i][j],"Detection":docs[0].Detection[i][j],"DetectionID":docs[0].DetectionID[i][j]})
    }
}
console.log(Data);

res.status(200).send({message:"done"});

})

module.exports = router;


    // {"$project":{
    //     "DetectionID":{
    //         "$reduce":{
    //             "input":"$DetectionID",
    //             "initialValue":[],
    //             "in":{"$setUnion":["$$value","$$this"]}

    //         }
    //     },
    //     "DatTim":{
    //         "$reduce":{
    //             "input":"$DatTim",
    //             "initialValue":[],
    //             "in":{"$setUnion":["$$value","$$this"]}

    //         }
    //     },
    //     "Detection":{
    //         "$reduce":{
    //             "input":"$Detection",
    //             "initialValue":[],
    //             "in":["$$value","$$this"]

    //         }
    //     }
    // }}