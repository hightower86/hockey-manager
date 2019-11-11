const router = require('express').Router();

router.get('/', (req, res) => res.send('user route'));

router.post('/', (req, res) => {
  res.json(req.body);
});

module.exports = router;
