var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MessageSchema = new Schema(
  {
    user: String,
    title: String,
    message: String,
    timestamp: Date,
    timestampFormatted: String
  }
)

module.exports = mongoose.model('Message', MessageSchema)