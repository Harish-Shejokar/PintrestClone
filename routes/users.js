const mongoose = require('mongoose');
const plm = require("passport-local-mongoose");

// Vf12kShHpUeZfj5v;
mongoose.connect(
  `mongodb+srv://pintrest:Vf12kShHpUeZfj5v@cluster0.q3gng0d.mongodb.net/`, {
  dbName: "pintrest"
})
  .then((c) => console.log("db connected", c.connection.host))
  .catch(e => console.log(e));


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  dp: {
    type: String, // Assuming dp is a URL to the user's profile picture
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
});

userSchema.plugin(plm);

const User = mongoose.model('User', userSchema);

module.exports = User;

