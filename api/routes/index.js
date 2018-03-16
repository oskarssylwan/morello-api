const router = require('express').Router();

router.get('/', (req, res, next) => {
  res.json({ works: true});
});

 module.exports = router;
