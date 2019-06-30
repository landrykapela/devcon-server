const User = require("../models/user");
const firebase = require("../database/firebase");

exports.signup = (req, res, next) => {
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
  console.log("email: " + email);
  let user = new User();
  // user.setEmail(email);

  let response = {};
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
          res.status(200).json({ userInfo });
        })
        .catch(e => {
          res.status(404).json({ e });
        });
      // res.redirect("http://localhost:3000/dashboard/" + user.getId());
    })
    .catch(e => {
      // console.log(e);

      res.redirect("http://localhost:3000/login?err=" + e.message);
    });
};

//module to login user with google account
exports.googleLogin = (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  let user = new User();
  // user.setEmail(email);

  let response = {};
  firebase
    .signinWithEmailAndPassword(email, password)
    .then(u => {
      user.setId(u.uid);
      user.setEmail(u.email);
      user.emailVerified = u.emailVerified;
      res.redirect("http://localhost:3000/dashboard/" + user.getId());
    })
    .catch(e => {
      // console.log(e);

      res.redirect("http://localhost:3000/login?err=" + e.message);
    });
};
