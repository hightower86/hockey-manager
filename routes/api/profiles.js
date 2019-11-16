const router = require('express').Router();
const Profile = require('../../model/Profile');
const User = require('../../model/User');
const auth = require('../../middleware/auth.js');
const { check, validationResult } = require('express-validator');

// @ GET  /api/profiles
// @ desc Get users profiles
// @ Private
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.status(200).json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
  res.send('Hello profiles');
});

// @ POST  /api/profiles
// @ desc Create / update profile
// @ Private
router.post(
  '/',
  [
    auth,
    [
      check('firstName', 'Пожалуйста, введите Ваше имя')
        .not()
        .isEmpty(),
      check('lastName', 'Пожалуйста, введите Вашy фамилию')
        .not()
        .isEmpty(),
      check('amplua', 'Пожалуйста, введите Ваше амплуа')
        .not()
        .isEmpty(),
      check('phoneNumber', 'Пожалуйста, введите номер телефона')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    const { firstName, lastName, amplua, phoneNumber, team } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (firstName) profileFields.firstName = firstName;
    if (lastName) profileFields.lastName = lastName;
    if (phoneNumber) profileFields.phoneNumber = phoneNumber;
    if (amplua) profileFields.amplua = amplua;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      // Update
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.status(200).json(profile);
      }
      // Create
      profile = new Profile(profileFields);
      await profile.save();
      res.status(200).json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
    //res.send('Add / edit profile');
  }
);

// @ DELETE /api/profiles
// @ delete profile and user
// @ Private
router.delete('/', auth, async (req, res) => {
  try {
    // Remove Profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove User
    await User.findByIdAndRemove({ _id: req.user.id });

    res.status(200).send('User and profile deleted');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
