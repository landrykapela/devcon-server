const db = require('../database/connection');

class Language{
  constructor(name){
    this.name = name;
    this.level = level;
  }

  setName(name){
    this.name = name;
  }

  getName(){
    return this.name;
  }

  create(){
    return new Promise((resolve,reject)=>{
      let con = db.connect();
      db.insertSingleRecord(con,"language",{name:this.name})
        .then((result)=>{
          console.log("Successfully added language "+this.name);
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
      db.findAllRecords(con,"language",[],{order_by:"name",order:"ASC"})
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
module.exports = Skill;
