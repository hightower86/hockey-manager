const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../../model/User');

router.get('/', (req, res) => res.send('user route'));

// @route    POST api/users
// @descr    Register user
// @access   Public
router.post('/', async (req, res) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);
  try {
    // Check if user already exists in db
    let user = User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'user already exists' }] });
    }
    user = new User({
      name,
      email,
      password
    });

    // hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    console.log(user);
    await user.save();
    res.send('ok');
  } catch (error) {
    console.log(error.message);
    res.status(500).send('server error');
  }
});

module.exports = router;
