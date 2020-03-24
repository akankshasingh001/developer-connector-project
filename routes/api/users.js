const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

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
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.send('User Route');
  }
);

module.exports = router;
