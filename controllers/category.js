const Category = require('../models/category');

exports.getAll = (req,res,next)=>{
  console.log("bla bla blah");
  new Category().all()
    .then((result)=>{
      console.log(result);
      res.status(200).json({result});
    })
    .catch((error)=>{
      res.status(200).json({result:"No data available"});
    });
}
