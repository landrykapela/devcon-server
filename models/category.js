const db = require('../database/connection');


class Category{
  constructor(id,name){
    this.id = id;
    this.name = name;
  }

  create(){
    return new Promise((resolve,reject)=>{
      let con = db.connect();
      db.insertSingleRecord(con,"category",{name:this.name})
        .then((result)=>{
          console.log("Successfully added category "+this.name);
          resolve(result);
        })
        .catch((error)=>{
          reject(error);
        });
    });

  }

  //retrieves all categories
  all(){
    return new Promise((resolve,reject)=>{
      let con = db.connect();
      db.findAllRecords(con,"category",[],{order_by:"name",order:"ASC"})
        .then((result)=>{
          if(result.length === 1) resolve(result[0]);
          else resolve(result);
        })
        .catch((error)=>{
          console.error(error);
          reject(error);
        })
    })
  }
}
module.exports = Category;
