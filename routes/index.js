var express = require("express");
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const localStrategy = require("passport-local");
const passport = require("passport");
const upload = require("./multer");

//user authenticate
passport.use(new localStrategy(userModel.authenticate()));

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

router.post("/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) {}
);

router.post("/upload", isLoggedIn, upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(404).send("no file were given");
  }

  const user = await userModel.findOne({
    username:req.session.passport.user
  })

 const post = await postModel.create({
   image: req.file.filename, // this is for getting uploaded fileName
   imageText: req.body.filecaption,
   user: user._id,
 });
  
  user.posts.push(post._id);
  await user.save();


  res.redirect("/profile");
});




/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});
router.get("/login", function (req, res, next) {
  // console.log(">>>>>>>>", req.flash("error"));

  res.render("loginPage", { error: req.flash("error") });
});

router.get("/profile", isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user,
  }).populate("posts");
  console.log(user);
  res.render("profile", { user });
});

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.get("/feeds", isLoggedIn, (req, res) => {
  res.render("feeds");
});

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
