const router = require('express').Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth.js');
const { check, validationResult } = require('express-validator');

const User = require('../../model/User');

// @ GET api/auth
// @ desc  user login
// @ access Public
router.get('/', auth, async (req, res) => {
  console.log(req.user);
  try {
    const user = await User.findById(req.user.id).select('-password');
    console.log(user);
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
  //res.send('Auth route');
});

// @ POST api/auth
// @ desc  authenticate user and get token
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
    const { email, password } = req.body;

    try {
      // Check if user already exists
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }
      //console.log(user);

      // Encrypt and check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      const payload = {
        user: {
          id: user._id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtsecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
