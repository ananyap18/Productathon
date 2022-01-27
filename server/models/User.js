const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
const { isEmail } = require("validator")
const { ObjectId } = mongoose.Schema.Types 

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
  followers:[{
    type: ObjectId,
    ref: "user"
  }],
  following: [{
    type: ObjectId,
    ref: "user"
  }],
  avatar: {
    type: String,
    default: "no pic"
  },
  bio: {
    type: String,
    default: "no bio"
  },
  nickname: {
    type: String,
    default: "no company name"
  },
  companyLink: {
    type: String,
    default: "no link"
  }
});

userSchema.pre('save', async function(next){
  const salt = await bcrypt.genSalt()
  this.password = await bcrypt.hash(this.password, salt) 
  console.log('presave', this)
  next()
})

userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if (user) {
    console.log(password)
    console.log(user.password)
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
};

const User = mongoose.model("user", userSchema);

module.exports = User;