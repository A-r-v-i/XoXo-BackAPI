const User = require("../models/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
// const {hashPassword} = require('../util/bcrypt');

async function hashPwd(pwd) {
  return await bcrypt.hash(pwd, 12);
}

async function checkPwd(pwd, hPwd) {
  return await bcrypt.compare(pwd, hPwd);
}

exports.postSignUp = (req, res, next) => {
  console.log(req.body);
  const errors = validationResult(req);

  if (!errors.isEmpty) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    throw error;
  }
  const email = req.body.email,
    password = req.body.password,
    name = req.body.name;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return hashPwd(password);
      }
    })
    .then((hashedPwd) => {
      const user = new User({
        name: name,
        email: email,
        password: hashedPwd,
      });
      user.save();
    })
    .then((response) => {
      console.log("user created");
      res.status(200).json({
        message: "User created",
        data: response,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email,
    password = req.body.password;

  User.findOne({email:email})
    .then((user) => {
      if(!user) {
        return res.status(500).json({
          message: 'User not found'
        })
      }
      return checkPwd(password, user.password);
    })
    .then(user => {
      console.log(user);
      return res.status(200).json({
        message: 'Successfully logged in',
        data: user
      })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
