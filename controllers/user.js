const User = require('../models/user');
const db = require('../database/connection');
const url = require('url');
const firebase = require('../database/firebase');

exports.signup = (req, res, next) => {
    let email = "landrykapela@neelansoft.com"; //req.body.email;
    let password = "This is my password"; //req.body.password;
    let name = req.body.name;
    console.log("email: " + email);
    console.log("password: " + password);
    let user = new User(0, email, name, 0);
    req.user = user;
    console.log("user: " + JSON.stringify(user));
    firebase.signupWithEmailAndPassword(email, password);
    // user.encryptPassword(password)
    //   .then((result)=>{
    //     user.register()
    //       .then((result)=>{
    //         if(result === 0){
    //           res.redirect('http://localhost:3000/login');
    //         }
    //       })
    //       .catch((error)=>{
    //         res.redirect('http://localhost:3000/signup/?err='+error);
    //       })

    //   })
    //   .catch((err)=>{
    //     res.redirect('http://localhost:3000/signup/?err='+err);
    //   });
    res.status(200).json({ response: "success" })
}

//module to get user details
exports.getUser = (req, res, next) => {
    let id = req.params.id;
    let user = new User();
    user.setId(id);
    user.find()
        .then((result) => {

            res.status(200).send(result);
        })
        .catch((error) => {
            res.status(404).json({ user: null });
        });
}



//module to login user
exports.login = (req, res, nex) => {
    let email = req.body.email;
    let password = req.body.password;
    console.log("email: " + email);
    let user = new User(0, email);
    user.login(password)
        .then((rs) => {
            console.log(rs);

            res.redirect('http://localhost:3000/account/' + user.getId());

        })
        .catch((err) => {

            res.redirect('http://localhost:3000/login/?err=' + err.message);
        })
}