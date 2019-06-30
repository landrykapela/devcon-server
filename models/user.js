const db = require("../database/connection");
const bcrypt = require("bcrypt-nodejs");
const TYPE_DEV = 0;
const TYPE_CLIENT = 1;
const PASSWORD_SALT = 10;

class User {
  //class constructor with optional params
  constructor(id = null, email = null, name = null, type = TYPE_DEV) {
    this.uid = id;
    this.email = email;
    this.name = name;
    this.type = type;
    this.password = null;
  }

  //getter methods
  getId() {
    return this.id;
  }
  getEmail() {
    return this.email;
  }
  getName() {
    return this.name;
  }
  getPassword() {
    return this.password;
  }
  getType() {
    return this.type;
  }
  isDeveloper() {
    return this.type === TYPE_DEV;
  }
  isClient() {
    return this.type === TYPE_CLIENT;
  }

  //setter Methods
  setId(id) {
    this.uid = id;
  }
  setEmail(email) {
    this.email = email;
  }
  setName(name) {
    this.name = name;
  }
  setType(type) {
    this.type = type;
  }
  encryptPassword(password) {
    return new Promise((resolve, reject) => {
      bcrypt
        .hash(password, PASSWORD_SALT)
        .then(hashedPassword => {
          this.password = hashedPassword;
          resolve(true);
        })
        .catch(error => {
          console.log(error);
          reject(false);
        });
    });
  }

  //password verify
  verifyPassword(password) {
    return new Promise((resolve, reject) => {
      bcrypt
        .compare(password, this.password)
        .then(verify => {
          resolve(verify);
        })
        .catch(error => {
          reject(false);
        });
    });
  }

  //login user
  login(password) {
    return new Promise((resolve, reject) => {
      let con = db.connect();
      db.findSingleRecord(con, "user", [
        { variable: "email", operation: "=", value: this.email }
      ])
        .then(result => {
          console.log("p: " + password);
          console.log("ep: " + result[0].password);
          bcrypt
            .compare(password, result[0].password)
            .then(verify => {
              if (verify) {
                console.log("successful login");
                this.setId(result[0].id);
                this.setType(result[0].user_type);
                this.setName(result[0].name);
                this.setEmail(result[0].email);
                resolve(this);
              } else {
                let err = { code: 0, message: "Incorrect Password" };
                console.log({ error: err });
                reject(err);
              }
            })
            .catch(er => {
              let err = { code: 1, message: "Error in decrypting Password" };
              console.log(er);
              reject(err);
            });
        })
        .catch(er => {
          let err = { code: 2, message: "User not found" };
          console.log("User not found");
          reject(err);
        });
    });
  }

  //find user
  find() {
    return new Promise((resolve, reject) => {
      let con = db.connect();
      db.findSingleRecord(con, "user", [
        { variable: "id", operation: "=", value: this.id }
      ])
        .then(result => {
          this.email = result[0].email;
          this.user_type = result[0].user_type;
          this.name = result[0].name;
          console.log("find...");
          console.log(result[0]);
          resolve(result[0]);
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    });
  }

  //register user into db
  register() {
    return new Promise((resolve, reject) => {
      let con = db.connect();
      let tableName = "user";
      let data = {
        email: this.email,
        name: this.name,
        user_type: this.user_type,
        password: this.password
      };
      console.log("user register(): " + JSON.stringify(data));
      let fields = [
        { name: "email", type: "varchar", field_size: 255, required: true },
        { name: "name", type: "varchar", field_size: 255, required: true },
        { name: "user_type", type: "int", field_size: 1, required: true },
        { name: "password", type: "varchar", field_size: 255, required: true }
      ];
      db.tableExists(con, tableName)
        .then(result => {
          console.log("table exists...");
          console.log("inserting into " + tableName);

          db.insertSingleRecord(con, tableName, data)
            .then(result => {
              console.log("successful");
              resolve(0);
            })
            .catch(error => {
              console.log("User registration...insert");
              console.log(error);
              reject(error);
            });
        })
        .catch(error => {
          console.log(error);
          if (error === "Table not found") {
            console.log("creating table " + tableName);
            let td = { tableName: tableName, fields: fields };
            console.log(td);
            console.log(data);
            db.createTable(con, td)
              .then(result => {
                console.log("Successfully created table " + tableName);
                console.log("inserting data into " + tableName + "...");
                db.insertSingleRecord(con, tableName, data)
                  .then(result => {
                    console.log("successful");
                    resolve(0);
                  })
                  .catch(error => {
                    console.log("User registration...create insert");
                    console.log(error);
                    reject(error);
                  });
              })
              .catch(error => {
                console.log("User registration... create");
                console.log(error);
                reject(-1);
              });
          }
        });
    });
  }
}
module.exports = User;
