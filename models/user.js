var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    full_name: [{
      first_name: String,
      last_name: String
    }],
    username: {type: String, required: true, maxlength: 20},
    password: {type: String, required: true},
    membership: Boolean,
    admin: Boolean
  }
)

module.exports = mongoose.model('User', UserSchema)