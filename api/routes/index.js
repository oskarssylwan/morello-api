const router = require('express').Router();

router.get('/', (req, res, next) => {
  res.json({
    success: true,
    message: 'Welcome to the morello API, for documentation see https://github.com/oskarssylwan/morello-api'
  });
});

router.use('/items', require('./items'));
router.use('/user', require('./users'));
router.use('/store', require('./store'));

module.exports = router;
