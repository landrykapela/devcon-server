const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");
const config = require("./firebaseConfig.json");
const Developer = require("../models/developer");
const DEFAULTS = require("./defaults.json").defaults;

//initialize firebase application
const firebaseApp = firebase.initializeApp(config.firebaseConfig);
const firebaseAuth = firebase.auth(firebaseApp);
const firebaseFirestore = firebase.firestore(firebaseApp);
if (firebaseApp) {
  console.log("Successfully initialized Firebase App");
}
exports.firestore = firebaseFirestore;
exports.firebaseAuth = firebaseAuth;

/**
 * get list of all developers
 * method: listDevelopers
 * @returns: Promise<userInfo>
 */
exports.listDevelopers = () => {
  return new Promise((resolve, reject) => {
    let devsRef = firebaseFirestore.collection("developers");
    devsRef
      .get()
      .then(querySnapshot => {
        if (querySnapshot.empty) {
          console.log("listDev: ", "no devs");
          resolve(null);
        } else {
          let devs = [];
          querySnapshot.docs.map(dev => {
            devs.push(Object.assign({}, dev.data()));
          });
          resolve(devs);
        }
      })
      .catch(e => {
        console.log("listDevelopers: ", e);
        reject(e);
      });
  });
};
/**
 * save developer details to firestore databa
 * method: saveDeveloperDetails
 * @param: Developer Object
 * @returns: Promise<userInfo>
 */
exports.saveDeveloperDetails = developer => {
  return new Promise((resolve, reject) => {
    firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        let newDevRef = firebaseFirestore
          .collection("developers")
          .doc(developer.uid);
        let dev = JSON.parse(JSON.stringify(developer));

        newDevRef
          .set(dev)
          .then(() => {
            resolve(true);
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      } else {
        let error = {};
        error.code = "auth/not logged in";
        error.message = "You need to login";
        reject(error);
      }
    });
  });
};

/**
 * udpate developer detail item in firestore
 * method: udpateDeveloperItem
 * @param: uid (string)
 * @returns: Promise<userInfo>
 */
exports.updateDeveloperItem = data => {
  return new Promise((resolve, reject) => {
    let devRef = firebaseFirestore.collection("developers").doc(data.uid);
    switch (data.target) {
      case "skills":
        devRef
          .update({ skills: data.value })
          .then(() => resolve(true))
          .catch(e => reject(e));
        break;
      case "links":
        devRef
          .update({ links: data.value })
          .then(() => resolve(true))
          .catch(e => reject(e));
        break;
      case "languages":
        devRef
          .update({ languages: data.value })
          .then(() => resolve(true))
          .catch(e => reject(e));
        break;
      case "frameworks":
        devRef
          .update({ frameworks: data.value })
          .then(() => resolve(true))
          .catch(e => reject(e));
        break;
      case "work":
        devRef
          .update({ work: data.value })
          .then(() => resolve(true))
          .catch(e => reject(e));
        break;
      case "pic":
        devRef
          .update({ pic: data.value })
          .then(() => resolve(true))
          .catch(e => reject(e));
        break;
      case "edit":
        let obj = {};
        if (data.name) obj.name = data.name;
        if (data.experience) obj.experience = data.experience;
        if (data.profession) obj.profession = data.profession;
        devRef
          .update(obj)
          .then(() => resolve(true))
          .catch(e => reject(e));
        break;
      // case "name":
      //   devRef
      //     .update({ name: data.value })
      //     .then(() => resolve(true))
      //     .catch(e => reject(e));
      //   break;
      // case "profession":
      //   devRef
      //     .update({ profession: data.value })
      //     .then(() => resolve(true))
      //     .catch(e => reject(e));
      //   break;
    }
  });
};
/**
 * update developer info
 * method updateDeveloper
 * @param: developer (object)
 * @returns: promise<developerInfo>
 */
exports.updateDeveloper = data => {
  return new Promise((resolve, reject) => {
    // firebaseAuth.onAuthStateChanged(user => {
    //   if (user) {
    let devRef = firebaseFirestore.collection("developers").doc(data.uid);
    // let dev = JSON.parse(JSON.stringify(data));
    console.log("data: ", data);
    let batch = firebaseFirestore.batch();
    batch.update(devRef, data);
    // Object.keys(data).map(key => {
    //   let x =
    //   console.log(key + ": ", data[key]);
    //   let d = JSON.stringify("{ ${key} + ":" + data[key] + "}");
    //   // let obj = Object.assign({}, d);
    //   console.log("d: ", d);
    //   // batch.update(devRef, d);
    // });
    return batch
      .commit()
      .then(() => {
        devRef
          .get()
          .then(doc => {
            resolve(Object.assign({}, doc.data()));
          })
          .catch(e => {
            console.log("updateDeveloper: ", e);
            reject(e);
          });
      })
      .catch(e => {
        console.log("updateDeveloper batch: ", e);
        reject(e);
      });
  });
  // } else {
  //   let error = {};
  //   error.code = "auth/not logged in";
  //   error.message = "You need to login";
  //   reject(error);
  // }
};
exports.getDeveloperDetails = uid => {
  return new Promise((resolve, reject) => {
    // if (firebaseAuth.currentUser.uid === uid) {
    let devRef = firebaseFirestore.collection("developers").doc(uid);
    let dev = devRef
      .get()
      .then(doc => {
        if (!doc.exists) {
          const e = {
            code: "doc not found",
            message: "Developer document not found"
          };
          console.log(e);
          reject(e);
        } else {
          const data = doc.data();

          let dev = Object.assign({}, data);
          resolve(dev);
        }
      })
      .catch(e => {
        if (e.code === "unavailable")
          e.message = "Failed to connect. Please check your internet";
        console.log(e);
        reject(e);
      });
    // }
  });
};
/**
 * add user to firestore database
 * method: saveUserInfo
 * @param: uid (string)
 * @param: type (int) default 0;
 * @returns: Promise<true>
 */
exports.saveUserInfo = (uid, type = 0) => {
  return new Promise((resolve, reject) => {
    firebaseAuth.onAuthStateChanged(uInfo => {
      console.log("x: ", uInfo.uid + "******" + uid);
      if (uInfo.uid === uid) {
        let userInfo = uInfo.toJSON();
        console.log("userinfo: ", userInfo);
        let userRef = firebaseFirestore.collection("users").doc(uid);
        let user = {
          uid: userInfo.uid,
          displayName: userInfo.displayName,
          email: userInfo.email,
          type: type,
          lastLogin: userInfo.lastLoginAt,
          accessToken: userInfo.stsTokenManager.accessToken
        };
        userRef
          .set(user)
          .then(() => {
            userRef
              .get()
              .then(doc => {
                let userData = Object.assign({}, doc.data());
                console.log("userData: ", userData);
                if (type === 0) {
                  let dev = JSON.stringify(
                    new Developer(
                      userData.uid,
                      userData.displayName,
                      userData.email,
                      DEFAULTS.profession,
                      DEFAULTS.experience,
                      uInfo.photoUrl || DEFAULTS.avatar,
                      [],
                      [],
                      [],
                      [],
                      []
                    )
                  );
                  let devRef = firebaseFirestore
                    .collection("developers")
                    .doc(userData.uid);
                  devRef
                    .set(JSON.parse(dev))
                    .then(() => {
                      devRef
                        .get()
                        .then(doc => {
                          let devinfo = Object.assign({}, doc.data());
                          resolve(devinfo);
                        })
                        .catch(e => {
                          console.log(e);
                          reject(e);
                        });
                    })
                    .catch(e => {
                      console.log(e);
                      reject(e);
                    });
                } else {
                  let client = JSON.stringify({
                    uid: userData.uid,
                    name: userData.name
                  });
                  let clientRef = firebaseFirestore
                    .collection("clients")
                    .doc(client.uid);
                  clientRef
                    .set(JSON.parse(client))
                    .then(() => {
                      clientRef
                        .get()
                        .then(doc => {
                          let clientinfo = Object.assign({}, doc.data());
                          resolve(clientinfo);
                        })
                        .catch(e => {
                          console.log(e);
                          reject(e);
                        });
                    })
                    .catch(e => {
                      console.log(e);
                      reject(e);
                    });
                }
              })
              .catch(e => {
                console.log(e);
                reject(e);
              });
          })
          .catch(e => {
            reject(e);
          });
      } else {
        console.log("saveUserInfo: ", "nothing");
      }
    });
  });
};

exports.getUserInfo = uid => {
  return new Promise((resolve, reject) => {
    firebaseAuth.onAuthStateChanged(user => {
      console.log("user.uid: ", user.uid);
      console.log("uid: ", uid);
      if (user && user.uid === uid) {
        let userRef = firebaseFirestore.collection("users").doc(uid);
        userRef
          .get()
          .then(userDoc => {
            if (!userDoc.exists) {
              let msg = "Document doesn't exist";
              console.log("getUserInfo: ", userDoc.data());
              let error = { code: "doc not found", message: msg };
              reject(error);
            } else {
              resolve(Object.assign({}, userDoc.data()));
            }
          })
          .catch(e => {
            if (e.code === "unavailable")
              e.message = "Failed to connect. Please check your internet";
            console.log("getUserInfo: ", e);
            reject(e);
          });
      }
    });
  });
};
/**
 * signup to firebase with email and password
 * method: signup
 * @param: email (string)
 * @param: password (string)
 * @param: name (string) optional
 * @returns: Promise<user>
 */

exports.signupWithEmailAndPassword = (email, password, name = undefined) => {
  return new Promise((resolve, reject) => {
    firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then(credentials => {
        let user = credentials.user;
        user = credentials.user;
        if (name) {
          firebaseAuth.currentUser
            .updateProfile({
              displayName: name
            })
            .then(() => {
              user.displayName = name;
              console.log(
                "display name: " + firebaseAuth.currentUser.displayName
              );
              firebaseAuth.currentUser
                .sendEmailVerification()
                .then(() => {
                  console.log("Verification email was sent to " + email);

                  user.emailSent = true;
                  resolve(user);
                })
                .catch(e => {
                  console.log(e);
                  user.emailSent = false;
                  resolve(user);
                });
            })
            .catch(e => {
              console.log(e);
              user.displayName = "Not available";
              resolve(user);
            });
        } else resolve(user);
      })
      .catch(error => {
        console.log(error.message);
        reject(error);
      });
  });
};
/**
 * signin to firebase with email and password
 * method: signinWithEmailAndPassword
 * @param: email (string)
 * @param: password (string)
 * @returns: Promise<user>
 */

exports.signinWithEmailAndPassword = (email, password) => {
  return new Promise((resolve, reject) => {
    let user = {};
    firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then(credentials => {
        user = credentials.user;
        resolve(user);
      })
      .catch(e => {
        if (e.code === "unavailable")
          e.message = "Failed to connect. Please check your internet";
        console.log(e);
        reject(e);
      });
  });
};

/**
 * signin to firebase with google account
 * method: signinWithGoogle
 * @param: id_token
 * @returns: Promise<user>
 */
exports.signinWithGoogle = id_token => {
  return new Promise((resolve, reject) => {
    const credential = new firebase.auth.GoogleAuthProvider().credential(
      id_token
    );
    firebaseAuth
      .signInWithCredential(credential)
      .then(credentials => {
        let user = credentials.user;
        resolve(user);
      })
      .catch(e => {
        console.log("signinWithGoogle: ", e);
      });
  });
};
