const { Router } = require('express')
const Post = require("../models/Post")
const User = require("../models/User")
const jwt = require("jsonwebtoken")
const { requireAuth, checkUser } = require("../middleware/authMiddleware")

const router = Router();

const maxAge = 3 * 60 * 60 * 24;
const createToken = (id) => {
  return jwt.sign({ id }, "ananya sh secret", {
    expiresIn: maxAge,
  });
};

// handle errors
const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  // incorrect email
  if (err.message === "incorrect email") {
    errors.email = "That email is not registered";
  }

  // incorrect password
  if (err.message === "incorrect password") {
    errors.password = "That password is incorrect";
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = "That email is already registered";
    return errors;
  }

  // validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};


router.post('/signup', async (req, res) => {
  const { email, password, nickname, companyLink, bio } = req.body;

  try {
    const user = await User.create({ email, password, nickname, companyLink, bio });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
})

router.get('/logout', (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  // res.redirect("/");
})


router.get("/profile/:user_id", requireAuth, async (req, res) => {
  const userId = req.params["user_id"].trim();
  try {
    // get user (without password)
    const user = await User.findOne({ _id: userId }).select("-password");
    // get all the post by that user
    const posts = await Post.find({ postedBy: user._id }).populate(
      "postedBy",
      "_id email nickname"
    );
    res.status(200).json({ user, posts });
    console.log("other users's feed", user, posts);
  } catch (e) {
    res.status(500).send(e.message);
    console.log(e);
  }
});

router.patch("/follow", requireAuth, checkUser, async (req, res) => {
  try {
    const userToFollowId = req.body.followId.trim();
    const userLoggedInId = req.user._id;
    // update user to be followed
    const userToFollow = await User.findByIdAndUpdate(
      { _id: userToFollowId },
      {
        $push: { followers: userLoggedInId },
      },
      {
        new: true,
      }
    ).select("-password");

    const userLoggedIn = await User.findByIdAndUpdate(
      { _id: userLoggedInId },
      {
        $push: { following: userToFollowId },
      },
      {
        new: true,
      }
    ).select("-password");
    res.status(200).json({ userToFollow, userLoggedIn });
  } catch (e) {
    res.status(500).send(e.message);
    console.log(e);
  }
});

router.patch("/unfollow", requireAuth, checkUser, async (req, res) => {
  try {
    const userToUnfollowId = req.body.followId.trim();
    const userLoggedInId = req.user._id;
    // update user to be followed
    const userToUnfollow = await User.findByIdAndUpdate(
      { _id: userToUnfollowId },
      {
        $pull: { followers: userLoggedInId },
      },
      {
        new: true,
      }
    ).select("-password");

    const userLoggedIn = await User.findByIdAndUpdate(
      { _id: userLoggedInId },
      {
        $pull: { following: userToUnfollowId },
      },
      {
        new: true,
      }
    ).select("-password");
    res.status(200).json({ userToUnfollow, userLoggedIn });
  } catch (e) {
    res.status(500).send(e.message);
    console.log(e);
  }
});

router.put("/updateAvatar", requireAuth, checkUser, async (req, res) => {
  const avatarURL = req.body.avatarURL;
  const userLoggedInId = req.user._id;
  try {
    const user = await User.findByIdAndUpdate(
      { _id: userLoggedInId },
      {
        $set: { avatar: avatarURL },
      },
      { new: true }
    );
    res.status(200).json({ updatedUser: user });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.put("/updateBio", requireAuth, checkUser, async (req, res) => {
  const bio = req.body.bio;
  const companyLink = req.body.companyLink;
  const nickname = req.body.nickname;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: { bio, nickname, companyLink },
      },
      { new: true }
    );
    res.status(200).json({ updatedUser: user });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.post("/search-user", requireAuth, checkUser, async (req, res) => {
  let userPattern = new RegExp("^" + req.body.query);
  try {
    const user = await User.find({ email: { $regex: userPattern }});
    res.status(200).json({ user });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;