const User = require("../models/user");
const firebase = require("../database/firebase");

exports.signup = (req, res, next) => {
  console.log("signup: ", req.body);
  let email = req.body.email;
  let password = req.body.password;
  let name = req.body.name;
  let type = req.body.type;
  console.log("email: " + email);
  console.log("password: " + password);
  let user = new User();

  let response = {};
  firebase
    .signupWithEmailAndPassword(email, password, name)
    .then(u => {
      user.setId(u.uid);
      user.setEmail(u.email);
      user.setType(type);
      u.emailSent
        ? (response.verification =
            "An e-mail verification message was sent to your e-mail address")
        : "E-mail not sent";
      response.user = user;
      console.log("user.signupweap: ", user);
      // res.status(201).json({ response: response });
      firebase
        .saveUserInfo(user.getId(), user.getType())
        .then(userData => {
          response.user = userData;
          res.status(201).json({ response });
          // res.redirect("http://localhost:3000/dashboard/" + userData.uid);
        })
        .catch(e => {
          console.log(e);
          res.status(400).json({ e });
          // res.redirect("http://localhost:3000/signup?err=" + e.message);
        });
    })
    .catch(e => {
      console.log(e);
      response.errorCode = e.code;
      response.errorMessage = e.message;
      res.status(400).json({ response: response });
      // res.redirect("http://localhost:3000/signup?err=" + e.message);
    });
};

//get user info
exports.getUser = (req, res) => {
  let uid = req.params.id;
  firebase
    .getUserInfo(uid)
    .then(userData => {
      res.status(200).json({ user: userData });
    })
    .catch(e => {
      res.status(404).json({ e });
    });
};

//module to login user
exports.login = (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;

  console.log("backend: ", email);
  let response = {};
  let user = new User();
  firebase
    .signinWithEmailAndPassword(email, password)
    .then(u => {
      user.setId(u.uid);
      user.setEmail(u.email);
      user.emailVerified = u.emailVerified;
      user.setName(u.displayName);
      response.user = user;
      firebase
        .getUserInfo(u.uid)
        .then(userInfo => {
          user.setType(userInfo.type);
          userInfo.user = user;
          console.log("getuserinfo: ", userInfo);
          res.status(200).json({ userInfo });
        })
        .catch(e => {
          console.log(e);
          res.status(404).json({ e });
        });
      // res.redirect("http://localhost:3000/dashboard/" + user.getId());
    })
    .catch(e => {
      console.log(e);
      res.status(404).json({ e });
    });
};

//module to login user with google account
exports.googleLogin = (req, res, next) => {
  let response = {};
  let user = new User();
  firebase
    .signinWithGoogle(req.body.token)
    .then(u => {
      user.setId(u.uid);
      user.setEmail(u.email);
      user.emailVerified = u.emailVerified;
      firebase
        .getUserInfo(u.uid)
        .then(userdata => {
          console.log("get: ", userdata);
          // res.header("Origin", "http://localhost:3000");
          // res.redirect("http://localhost:3000/dashboard/" + userdata.uid);
          res.status(200).json({ userdata });
        })
        .catch(e => {
          if (e.code === "doc not found") {
            firebase.saveUserInfo(u.uid, 0).then(userinfo => {
              console.log("successfully saved", userinfo);
              // res.redirect("http://localhost:3000/dashboard/" + userinfo.uid);
              res.status(201).json({ userinfo });
            });
          } else {
            res.redirect("http://localhost:3000/login?err=" + e.message);
          }
        });
    })
    .catch(e => {
      console.log(e);

      res.redirect("http://localhost:3000/login?err=" + e.message);
    });
};
