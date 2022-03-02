var express = require('express');
var router = express.Router();

var user_controller = require('../controllers/userController.js');
var message_controller = require('../controllers/messageController.js');

/* GET home page. */
router.get('/', message_controller.message_list);

router.get('/sign-up', user_controller.user_signup_get);

router.post('/sign-up', user_controller.user_signup_post);

router.get('/log-in', user_controller.user_signin_get);

router.post('/log-in', user_controller.user_signin_post);

router.get('/log-out', user_controller.user_logout)

router.get('/profile', user_controller.user_profile);

router.get('/profile/membership', user_controller.user_membership_get)

router.post('/profile/membership', user_controller.user_membership_post)

router.get('/create-new-message', message_controller.message_create_get);

router.post('/create-new-message', message_controller.message_create_post)

router.post('/message-delete', message_controller.message_delete);

module.exports = router;
