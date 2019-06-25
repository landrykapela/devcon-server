const admin = require('firebase-admin');


let serviceAccount = require('./devpool-92d89-cfbefbb5003c.json');

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

let db = admin.firestore();
if (db) {
    console.log("Successfully connected to firestore");
}

exports.signupWithEmailAndPassword = (email, password) => {
    let userRef = db.collection('users').doc();

    let user = { id: userRef.id, email: email, password };
    userRef.set(user)
        .then(res => {

            console.log("userId: " + userRef.id);
        })
        .catch(e => {
            console.log(e)
        });
}