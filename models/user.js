const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

const Schema = mongoose.Schema;
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: { type: String },
});

userSchema.pre("save", function(next){
  const user = this;
  
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) {
        return next(err);
      }

      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(receivedPassword, callback){
  const user = this;

  bcrypt.compare(receivedPassword, user.password, (err, isMatch) => {
    if(err){
      return callback(err);
    }

    callback(null, isMatch);
  });
}

const ModelClass = mongoose.model("user", userSchema);
module.exports = ModelClass;
