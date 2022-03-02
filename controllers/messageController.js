const { response, request } = require('express');
const { body, validationResult } = require('express-validator');
const message = require('../models/message.js');

var Message = require('../models/message.js');

exports.message_list = function (req, res) {
  Message.find({}, (err, results) => {
    if (err) return next(err);
    res.render('index', {
      user: req.user,
      messages: results,
    });
  });
};

exports.message_create_get = function (req, res) {
  res.render('create-message', { user: res.locals.currentUser });
};

exports.message_create_post = [
  body('title').trim().escape(),
  body('message').trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('create-message', {
        user: res.local.currentUser,
        errors: errors.array(),
      });
      return;
    } else {
      var message = new Message({
        title: req.body.title,
        message: req.body.message,
        user: res.locals.currentUser.username,
        timestamp: new Date(),
      });
      message.save(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    }
  },
];

exports.message_delete = (req, res) => {
  Message.findByIdAndDelete(req.body.messageID, () => {
    res.redirect('/');
  })
}