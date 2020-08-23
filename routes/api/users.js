const express = require("express");
const User = require("../../models/User");
const gravatar = require("gravatar");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

// @route  GET api/users
// @desc   Register user
// @access Public
router.post(
  "/",
  [
    check("name", "name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valied email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more character"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      //get users gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm"
      });

      user = new User({
        name,
        email,
        password,
        avatar
      });
      //encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();
      //return jsonwebtoken

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(payload, config.get("jwtSecret"), (err, token) => {
        if (err) throw err;
        return res.json({ token });
      });
    } catch (e) {
      console.error(e.message);
      return res.status(500).send("Server errors");
    }
  }
);

module.exports = router;
