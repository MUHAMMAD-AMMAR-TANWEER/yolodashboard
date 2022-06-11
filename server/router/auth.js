const express = require("express");
const router = express.Router();
require("../db/conn");
const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Post = require("../models/Feed");
const TimPost = require("../models/TimFeed");
const imgPost = require("../models/imgFeed");
const imgFeed = require("../models/imgFeed");

//posting the image upload time
router.post("/imgupload", async (req, res) => {
  const { Device, Tim } = req.body;
  if (!Device && !Tim) {
    return res.status(422).json({ message: "Please send data Properly" });
  }
  try {
    const imgfeed = await imgFeed.findOne({ Device: Device });
    if (!imgfeed) {
      const imfeed = new imgPost({ Device, Tim });
      await imfeed.save();
      res
        .status(200)
        .send({ message: " The image has been uploaded on server" });
    } else {
      imgFeed
        .findOneAndUpdate({ Device: Device }, { Tim: Tim }, { new: true })
        .then((updateduser) => {
          res
            .status(200)
            .send({ message: " Image Device data has been Updated" });
        })
        .catch((err) => {
          console.log("Error in else");
        });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/imgfeed/:Device", async (req, res) => {
  const { Device } = req.params;
  try {
    const imgTim = await imgFeed.findOne(
      { Device: Device },
      { _id: 0, __v: 0, createdAt: 0 }
    );
    if (!imgTim) {
      res
        .status(200)
        .send({ message: "Device is not available please first register" });
    } else {
      res.status(200).send({ message: imgTim });
    }
  } catch (err) {
    res.send({ message: "Device is not available please first register" });
  }
});

router.post("/registers", async (req, res) => {
  const { name, email, device, password, cpassword } = req.body;
  if (!name || !email || !device || !password || !cpassword) {
    return res.status(422).json({ message: "Please fill the form properly" });
  }
  try {
    const userExist = await User.findOne({ email: email });
    const deviceExist = await User.findOne({ device: device });
    if (userExist) {
      return res.status(422).json({ error: "Email Already registered" });
    } else if (deviceExist) {
      return res.status(422).json({ error: "Device is Already registered" });
    } else if (password != cpassword) {
      return res.status(422).json({ error: "Password is not matching" });
    } else {
      const user = new User({ name, email, device, password, cpassword });
      await user.save();
      res.status(201).json({ message: "User successfully registered" });
    }
    //yaha hash karna hai
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please fill the data" });
    }

    const userLogin = await User.findOne({ email: email });

    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      const token = await userLogin.generateAuthToken();
      // res.cookie("jwtoken", token, {
      //   expires: new Date(Date.now() + 25892000000),
      //   httpOnly: false,
      //   secure: true,
      // });
      // console.log(token);

      if (!isMatch) {
        res.status(400).json({ error: "Invalid credinatials  " });
      } else {
        res.status(200).json({
          message: "User Login Successfully",
          Device: userLogin.device,
          token: token,
        });
      }
    } else {
      res.status(400).json({ error: "Invalid credinatials" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/feed", async (req, res) => {
  if (!req.body.Device) {
    res.status(400).send({ message: "Please enter Device UID" });
    return;
  }

  const postt = new Post({
    Device: req.body.Device,
    Car: req.body.Car,
    Bicycle: req.body.Bicycle,
    Person: req.body.Person,
    Bus: req.body.Bus,
    Motorcycle: req.body.Motorcycle,
    Truck: req.body.Truck,
  });

  await postt
    .save()
    .then((postt) => {
      res.status(200).send({ message: "Done" });
    })
    .catch((err) => res.status(400).send({ message: err }));
});

router.get("/gfeed", async (req, res) => {
  var sendat = [];
  var carlst = [];
  var motolst = [];
  var trucklist = [];
  var buslist = [];
  var perlst = [];
  var cyclst = [];
  for (let i = 0; i < 31; i++) {
    let now = new Date();
    var tod = new Date(now.setDate(now.getDate() - i));
    var prv = new Date(now.setDate(now.getDate() - i - 1));

    let event_query = { $gte: prv, $lte: tod };
    const sum = await Post.aggregate([
      { $match: { createdAt: event_query } },
      {
        $group: {
          _id: { Device: req.params.Device },
          Car: { $sum: "$Car" },
          Person: { $sum: "$Person" },
          Bicycle: { $sum: "$Bicycle" },
          Bus: { $sum: "$Bus" },
          Motorcycle: { $sum: "$Motorcycle" },
          Truck: { $sum: "$Truck" },
        },
      },
      {
        $project: {
          _id: 0,
          Cars: "$Car",
          Person: "$Person",
          Bicycles: "$Bicycle",
          Buses: "$Bus",
          Motorcycles: "$Motorcycle",
          Trucks: "$Truck",
        },
      },
    ]); //suming whole
    if (sum.length > 0) {
      carlst.push(sum[0]["Cars"]);
      buslist.push(sum[0]["Buses"]);
      perlst.push(sum[0]["Person"]);
      cyclst.push(sum[0]["Bicycles"]);
      motolst.push(sum[0]["Motorcycles"]);
      trucklist.push(sum[0]["Trucks"]);
      sendat.push(
        new Date(now.setDate(now.getDate() - i)).toLocaleDateString("en-US")
      );
    } else {
      continue;
    }
  }
  var finalData = {
    Cars: carlst,
    Bicycles: cyclst,
    Buses: buslist,
    Trucks: trucklist,
    Person: perlst,
    Motorcycles: motolst,
    Labels: sendat,
  };

  res.status(200).send(finalData);
});

//Post api for the server (csv data)
router.post("/timfeed", async (req, res) => {
  console.log(req.body.Device);
  console.log(req.body.DatTim);
  if (!req.body.Device) {
    res.status(400).send({ message: "Please enter Device UID" });
    return;
  }

  const timpost = new TimPost({
    Device: req.body.Device,
    DetectionID: req.body.DetectionID,
    DatTim: req.body.DatTim,
    Detection: req.body.Detection,
  });
  console.log(timpost);

  await timpost
    .save()
    .then((timpost) => {
      res.status(200).send({ message: "Done" });
    })
    .catch((err) => res.status(400).send({ message: err }));
});

router.get("/gtimfeed/:Device/:StartDat/:EndDat", async (req, res) => {
  console.log(req.params);
  var Data = [];
  if (!req.params.Device) {
    res.status(400).send({ message: "Please enter Device UID" });
    return;
  }
  if (!req.params.StartDat && !req.params.EndDat) {
    res.status(400).send({ message: "Please Enter both Dates" });
    return;
  }
  var prvDat = new Date(req.params.StartDat);
  var NxtDat = new Date(req.params.EndDat);
  const event_query = { $gte: prvDat, $lte: NxtDat };
  const docs = await TimPost.aggregate([
    { $match: { createdAt: event_query, Device: req.params.Device } },
    {
      $group: {
        _id: { Device: req.params.Device },
        DetectionID: { $push: "$DetectionID" },
        DatTim: { $push: "$DatTim" },
        Detection: { $push: "$Detection" },
      },
    },
  ]);
  console.log(docs);
  if (docs.length > 0) {
    for (let i = 0; i < docs[0].DetectionID.length; i++) {
      for (let j = 0; j < docs[0].Detection[i].length; j++) {
        Data.push({
          DateTime: docs[0].DatTim[i][j],
          Detection: docs[0].Detection[i][j],
          DetectionID: docs[0].DetectionID[i][j],
        });
      }
    }

    res.status(200).send({ message: Data });
  } else {
    res.status(200).send({
      message: [
        {
          LOG: `Your data at  interval from ${req.params.StartDat} to ${req.params.EndDat} is not present`,
        },
      ],
    });
  }
});
module.exports = router;
