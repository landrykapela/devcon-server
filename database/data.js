const firebase = require("./firebase");
const Data = require("../models/data");
const db = firebase.firestore;

//get collection
exports.getCollection = collection => {
  return new Promise((resolve, reject) => {
    let langRef = db.collection(collection);
    langRef
      .get()
      .then(querySnapshot => {
        if (querySnapshot.empty) {
          resolve(false);
        } else {
          let docs = querySnapshot.docs;
          let result = [];
          docs.map(doc => {
            let data = new Data();
            data.setId(doc.id);
            data.setName(doc.data().name);
            result.push(data);
          });
          resolve(result);
        }
      })
      .catch(e => {
        console.log("getCollection: ", e);
        reject(e);
      });
  });
};
