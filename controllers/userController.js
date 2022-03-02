require('dotenv').config();

const bcrypt = require('bcryptjs/dist/bcrypt');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
var session = require('express-session');

var User = require('../models/user.js');

exports.user_signup_get = (req, res) => {
  res.render('sign-up');
};

exports.user_signup_post = [
  body('first_name')
    .optional({ checkFalsy: true })
    .trim()
    .escape()
    .isAlphanumeric()
    .withMessage('First Name has non-alphanumeric characters'),
  body('last_name')
    .optional({ checkFalsy: true })
    .trim()
    .escape()
    .isAlphanumeric()
    .withMessage('Last Name has non-alphanumeric characters'),
  body('username')
    .exists()
    .trim()
    .escape()
    .isLength({ min: 4 })
    .withMessage('Username must be at least 4 characters')
    .isAlphanumeric()
    .withMessage('Username has non-alphanumeric characters'),
  body('password')
    .exists()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('password-confirm')
    .exists()
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),

  (req, res, next) => {
    User.findOne({ username: req.body.username }, (err, results) => {
      if (results) {
        res.render('sign-up', {
          user: req.body,
          errors: [{ msg: 'Username is taken' }],
        });
        return;
      } else {
        next();
      }
    });
  },

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('sign-up', { user: req.body, errors: errors.array() });
      return;
    } else {
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        var user = new User({
          full_name: [
            {
              first_name: req.body.first_name,
              last_name: req.body.last_name,
            },
          ],
          username: req.body.username,
          password: hashedPassword,
          membership: false,
          admin: false,
        });
        user.save(function (err) {
          if (err) {
            return next(err);
          }

          res.redirect('/');
        });
      });
    }
  },
];

exports.user_signin_get = (req, res) => {
  res.render('login', {
    user: res.locals.currentUser,
    messages: req.session.messages,
  });
};

exports.user_signin_post = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/log-in',
  failureMessage: true,
});

exports.user_logout = (req, res) => {
  req.logout();
  res.redirect('/');
}

exports.user_profile = (req, res) => {
  if (res.locals.currentUser) {
    res.render('profile', { user: res.locals.currentUser });
  } else {
    res.redirect('/log-in');
  }
};

exports.user_membership_get = (req, res) => {
  if (res.locals.currentUser) {
    res.render('membership');
  } else {
    res.redirect('/log-in');
  }
};

exports.user_membership_post = (req, res) => {
  if (res.locals.currentUser) {
    if (req.body.passcode === process.env.secretPasscode) {
      User.findOneAndUpdate(
        { _id: res.locals.currentUser._id },
        { membership: true },
        () => {
          res.redirect('/profile');
        }
      );
    } else {
      res.render('membership', { error: 'That was not the secret passcode!' });
    }
  } else {
    res.redirect('/log-in');
  }
};
