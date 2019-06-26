const User = require('../models/user');
const db = require('../database/connection');
const url = require('url');
const firebase = require('../database/firebase');

exports.signup = (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    let name = req.body.name;
    console.log("email: " + email);
    console.log("password: " + password);
    let user = new User();

    let response = {};
    firebase.signupWithEmailAndPassword(email, password)
        .then(u => {
            user.setId(u.uid);
            user.setEmail(u.email);
            u.emailSent ? response.verification = "E-mail verification message was sent to your e-mail address" : "E-mail not sent";
            response.user = user;
            res.status(201).json({ response: response })
        })
        .catch(e => {
            console.log(e)
            response.errorCode = e.code;
            response.errorMessage = e.message;
            res.status(400).json({ response: response })
        })
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