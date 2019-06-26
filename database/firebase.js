const firebase = require('firebase/app');
require('firebase/auth');
const config = require('./firebaseConfig.json');
// let serviceAccount = require('./devpool-92d89-cfbefbb5003c.json');

// const firebaseApp = admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

// let db = admin.firestore(firebaseApp);
// if (db) {firebaseAuth = firebase.auth();
//     console.log("Successfully connected to firestore");
// }

//initialize firebase application
const firebaseApp = firebase.initializeApp(config.firebaseConfig);
const firebaseAuth = firebase.auth(firebaseApp);

/**
 * signup to firebase with email and password
 * method: signupWithEmailAndPassword
 * @param: email (string)
 * @param: password (string)
 * @returns: Promise<user>
 */

exports.signupWithEmailAndPassword = (email, password) => {

    return new Promise((resolve, reject) => {
        firebaseAuth.createUserWithEmailAndPassword(email, password)
            .then((credentials) => {
                let user = credentials.user;
                firebaseAuth.currentUser.sendEmailVerification()
                    .then(() => {
                        console.log("Verification email was sent to " + email);

                        user.emailSent = true;
                        resolve(user);
                    })
                    .catch(e => {
                        console.log(e);
                        user.emailSent = false;
                        resolve(user);
                    })

            })
            .catch(error => {
                console.log(error.message);
                reject(error);

            })
    })

    // let userRef = db.collection('users').doc();

    // let user = { id: userRef.id, email: email, password };
    // userRef.set(user)
    //     .then(res => {

    //         console.log("userId: " + userRef.id);
    //     })
    //     .catch(e => {
    //         console.log(e)
    //     });
}