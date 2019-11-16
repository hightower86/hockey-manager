const route = require('express').Router();
const Profile = require('../../model/Profile');
const auth = require('../../middleware/auth.js');
const { check, validationResult } = require('express-validator');

// @ GET  /api/profiles
// @ desc Get users profiles
// @ Private
route.get('/', (req, res) => {
  res.send('Hello profiles');
});

// @ POST  /api/profiles
// @ desc Create / update profile
// @ Private
route.post(
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

module.exports = route;
