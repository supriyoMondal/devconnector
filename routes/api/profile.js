const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Post");
const { check, validationResult } = require("express-validator");
const request = require("request");
const config = require("config");

// @route  GET api/profile/me
// @desc   Get current user profile
// @access Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );
    if (!profile) {
      return res.status(400).json({ msg: "no profile for this user" });
    } else {
      res.json(profile);
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "Server error" });
  }
});
// @route  POST api/profile/
// @desc   Create or update a user profile
// @access Private

router.post(
  "/",
  [
    auth,
    [
      check("status", "status is required")
        .not()
        .isEmpty(),
      check("skills", "skills is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    //build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;

    //build social object
    profileFields.social = {};
    if (facebook) profileFields.social.facebook = facebook;
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    if (skills) {
      profileFields.skills = skills.split(",").map(skill => skill.trim());
    }
    //console.log(profileFields.skills);

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        //uopdate
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error);
      return res.status(500).send("serevr error");
    }
  }
);
// @route  GET api/profile/
// @desc   get all profile
// @access public
router.get("/", async (req, res) => {
  try {
    const profile = await Profile.find().populate("user", ["name", "avatar"]);
    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("server Error");
  }
});
// @route  GET api/profile/user/:user_id
// @desc   get  profile by User ID
// @access public
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "Profile not found" });
    }

    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }
    return res.status(500).send("server Error");
  }
});

// @route  DELETE api/profile/
// @desc   delete profile user & post
// @access Private
router.delete("/", auth, async (req, res) => {
  try {
    //remove users post
    await Post.deleteMany({ user: req.user.id });

    //remove user profile
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });

    return res.json({ msg: "User Deleted" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("server Error");
  }
});
// @route  PUT api/profile/experience done
// @desc   Add profile experience
// @access Private

router.put(
  "/experience",
  [
    auth,
    check("title", "Title is requires")
      .not()
      .isEmpty(),
    check("company", "Company is requires")
      .not()
      .isEmpty(),
    check("from", "From date is requires")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExpt = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExpt);
      await profile.save();
      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server error");
    }
  }
);
// @route  Delete api/profile/experience/:exp_id
// @desc   Delete  experience
// @access Private
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    //get the remove index
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);
    await profile.save();

    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
});
// @route  PUT api/profile/education
// @desc   Add profile education
// @access Private

router.put(
  "/education",
  [
    auth,
    check("school", "School is requires")
      .not()
      .isEmpty(),
    check("degree", "Degree is requires")
      .not()
      .isEmpty(),
    check("fieldofstudy", "fieldofstudy is requires")
      .not()
      .isEmpty(),
    check("from", "From date is requires")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);
      await profile.save();
      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server error");
    }
  }
);
// @route  Delete api/profile/experience/:edu_id
// @desc   Delete  education
// @access Private
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    //get the remove index
    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);
    profile.education.splice(removeIndex, 1);
    await profile.save();

    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
});

// @route  get api/profile/github/:username
// @desc   Get user repos from github
// @access Public
router.get("/github/:username", async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}&client_secret=${config.get("githubSecret")}`,
      mathod: "GET",
      headers: { "user-agent": "node.js" }
    };

    request(options, (err, response, body) => {
      if (err) {
        console.err(err);
      }
      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: "No github profile found" });
      }

      return res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
