const router = require('express').Router();
const routerTest = require('./routes');

router.use('/test', routerTest);

module.exports = {  router };
