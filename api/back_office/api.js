var express = require('express');
var passport = require('passport');

var router = express.Router();

require('./categories')(router);
require('./subsCategories')(router);
require('./products')(router);
require('./auth/auth')(router,passport);
console.log(router);
module.exports = router;




