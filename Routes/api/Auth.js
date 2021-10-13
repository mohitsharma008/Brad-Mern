const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../../middlewares/Auth");
const User = require("../../Models/Users");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

//@route  GET api/auth
//@desc  Test route
//@access   Public
//protected router access only if token availavel
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route  POST api/auth
//@desc  authenticate user & get token
//@access   Public
router.post(
  "/",
  check("email", "Please include a valid email").isEmail(),
  check("password", "pasword is required").exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }
      //see if user exists

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          errors: [
            {
              errors: [{ msg: "Invalid Credentials" }],
            },
          ],
        });
      }
      //encrypt password

      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );

      //return jsonwebtoken
    } catch (err) {
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
