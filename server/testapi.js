const Post = require("./models/Feed"); 

// let now = new Date();
// const backdate = new Date(now.setDate(now.getDate() - 3));
// console.log(backdate.toISOString().slice(0, 10));

var lst = [];
for (let i =0 ;i<31;i++){
    let now = new Date();
    const backdate = new Date(now.setDate(now.getDate() - i));
    lst.push(backdate);
}
console.log(lst);

const dateString = "2022-05-26"
var mydate = new Date(dateString);
console.log(mydate);

// const ace = Post.findOne({createdAt:{$gt:lst[1],$lt:lst[0]}});
// console.log(ace);

[
    [
      [ [Array], [Array] ],
      [
        'bicycle', 'truck',
        'bus',     'truck',
        'bus',     'bicycle',
        'person',  'bicycle',
        'person',  'truck'
      ]
    ],
    [
      'car',       'bus',
      'person',    'motorbike',
      'motorbike', 'car',
      'motorbike', 'bicycle',
      'motorbike', 'bicycle'
    ]
  ]