const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

//@route    POST api/users
//@desc     User Registration
//@access   Public
router.post(
  '/',
  [
    check('name')
      .not()
      .isEmpty()
      .withMessage('Name is required'),
    check('email')
      .isEmail()
      .withMessage('Please enter valid email'),
    check('password')
      .isLength({ min: 6 })
      .withMessage('Please enter a password with 6 or more characters')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      //check if user exists
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }
      //Get user gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      user = new User({ name, email, avatar, password });
      //Encrypt Password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      //save in db
      await user.save();

      //Return jsonwebtoken - used for after registering user directly logged in
      res.send('User Registered!!!');
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
