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
    const user = new User({
      name,
      email,
      password
    });
    console.log(user);
    await user.save();
    res.send('ok');
  } catch (error) {
    console.log(error.message);
    res.status(500).send('server error');
  }
});

module.exports = router;
