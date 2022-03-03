const { body, validationResult } = require('express-validator');

const {format} = require('date-fns');

var Message = require('../models/message.js');

exports.message_list = function (req, res) {
  Message.find({}).sort({timestamp: 'desc'}).exec((err, results) => {
    if (err) return next(err);
    res.render('index', {
      user: req.user,
      messages: results,
      // timestap: results.timestamp,
      // timestamp: format(new Date(results.timestamp), 'PPpp')
    });
  });
};

exports.message_create_get = function (req, res) {
  res.render('create-message', { user: res.locals.currentUser });
};

exports.message_create_post = [
  body('title').trim(),
  body('message').trim(),
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
        timestampFormatted: format(new Date(), 'PPpp'),
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