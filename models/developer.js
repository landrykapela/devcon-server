const db = require('../database/connection');

class Developer{
  constructor(email, name, category, languages=[],skills=[],frameworks=[],work=[]){
    this.email = email;
    this.name = name;
    this.category = category;
    this.languages = languages;
    this.skills = skills;
    this.frameworks = frameworks;
    this.work = work;
  }

  create(){
    return new Promise((resolve,reject)=>{
      let con = db.connect();
      db.insertSingleRecord(con,"skill",{name:this.name})
        .then((result)=>{
          console.log("Successfully added skill "+this.name);
          resolve(result);
        })
        .catch((error)=>{
          reject(error);
        });
    });

  }

  //retrieve single developer data
  find(){
    return new Promise((resolve,reject)=>{
      let con = db.connect();
        db.findSingleRecord(con,"developer",[{variable:"id",operation:"=",value:this.id}])
          .then((result)=>{
            this.email = result[0].email;
            this.category = result[0].category;
            this.name = result[0].name;
            this.languages = result[0].languages;
            this.frameworks = result[0].frameworks;
            this.skills = result[0].skills;
            this.work = result[0].work;
            console.log("find...");
            console.log(result[0]);
            resolve(result[0]);
          })
          .catch((error)=>{
            console.log(error);
            reject(error);
          });
    });
  }

  //retrieves all categories
  all(){
    return new Promise((resolve,reject)=>{
      let con = db.connect();
      db.findAllRecords(con,"developer",[],{order_by:"name",order:"ASC"})
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
