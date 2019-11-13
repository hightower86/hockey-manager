const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../../model/User');

// @ POST api/auth
// @ desc  user login
// @ access Public
router.post(
  '/',
  [
    check('email', 'need correct email').isEmail(),
    check(
      'password',
      'password length should be an list 6 characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // Check if user already exists
    const user = User.findOne({ email });

    // Encrypt and check password

    res.json(req.body);
  }
);

module.exports = router;
