var express = require("express");
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const localStrategy = require("passport-local");
const passport = require("passport");

//user authenticate
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});
router.get("/login", function (req, res, next) {
  res.render("loginPage");
});

router.get("/profile",isLoggedIn , function (req, res, next) {
  res.render("profile");
});

router.post("/register", (req, res) => {
  const { email, username, fullname } = req.body;
  const userData = new userModel({
    username,
    email,
    fullname,
  });

  userModel.register(userData, req.body.password).then(function () {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  });
});

router.post("/login",passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/",
  }),
  function () {}
);
router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.get("/feeds", (req, res) => {
  res.render("feeds")
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
}




// router.get('/createUser', async function(req, res, next) {

//   const user = await userModel.create({
//     username: "harry",
//     password: "abcd",
//     posts: [],
//     dp: 'dp.png',
//     email: "harry@male.com",
//     fullname: "hary abcd"
//   });

//   res.send(user);
// });

// router.get('/createPost', async function(req, res, next) {

//   const createdPost = await postModel.create({
//     postText: "second post",
//     user: "6573fc2bf03dbc9cf3c87442",
//   });
//   const user = await userModel.findOne({ _id: "6573fc2bf03dbc9cf3c87442" });
//   user.posts.push(createdPost._id);
//   await user.save();

//   res.send("post created and also saved in users Post Section");
// });

// router.get("/getAllPosts", async (req, res) => {
//   const thisUser = await userModel.findOne({ _id: "6573fc2bf03dbc9cf3c87442" })
//     .populate("posts");
//   res.send(thisUser);
// })

module.exports = router;
