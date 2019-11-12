const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('../../model/User');

router.get('/', (req, res) => res.send('user route'));

// @route    POST api/users
// @descr    Register user
// @access   Public
router.post(
  '/',
  [
    check('name', 'name is required')
      .not()
      .isEmpty(),
    check('email', 'need correct email').isEmail(),
    check(
      'password',
      'password length should be an list 6 characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    //console.log(name, email, password);
    try {
      // Check if user already exists in db
      let user = await User.findOne({ email });
      console.log(user);
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'user  already exists' }] });
      }
      user = new User({
        name,
        email,
        password
      });

      // hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);

      //console.log(user);
      await user.save();

      // Return fson webtoken
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

      //res.send('ok');
    } catch (error) {
      console.log(error.message);
      res.status(500).send('server error');
    }
  }
);

module.exports = router;
