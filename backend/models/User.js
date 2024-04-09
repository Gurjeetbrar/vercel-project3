const mongoose = require('mongoose');
const {Schema}= mongoose;
const UserSchema = new Schema({
    membershipStatus: {
        type: String,
        required: true,
        default: 'none' // Set the default value to 'none'
      },
      membershipDate: {
        type: Date,
        required: true,
        default: Date.now, // Set the default value to null or remove the default field if appropriate
      },
    name:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true,
        unique: true
    },
    password:{
        type: String,
        require: true,
    },
    role:{
        type: String,
        require: true
    },
    phone:{
        type: Number,
        require: true,
        unique: true
    },
    birthDate:{
        type: Date,
        required: true
    },

  });
  const User =  mongoose.model('user', UserSchema)
User.createIndexes();
module.exports = User