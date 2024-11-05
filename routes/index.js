const express = require('express');
const router = express.Router();
const { requiresAuth } = require('express-openid-connect');

// middleware to validate the logout token
const requiresValidLogoutToken = require('../middlewares/validateLogoutToken');

// helper function to delete user sessions


// new route to receive backchannel logout tokens
// must be configured in the Application -> Sessions tab 
// in the Auth0 Management Dashboard
router.post(
  '/backchannel-logout',
  requiresValidLogoutToken,
  function (req, res, next) {
    // at this point the logout token is valid, checked by requiresValidLogoutToken middleware
    // you can access it from the request object: req.logoutToken

    const logoutToken = req.body.logout_token;

    // delete user session so the user gets logged out
    console.log('Logout token received:', logoutToken);

    res.sendStatus(200);
  }
);

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Auth0 Webapp sample Nodejs',
    isAuthenticated: req.oidc.isAuthenticated(),
    headline: process.env.APP_NAME,
    backgroundColor: process.env.BACKGROUND_COLOR,
    baseURL: process.env.BASE_URL,
  });
});

router.get('/profile', requiresAuth(), function (req, res, next) {
  res.render('profile', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Profile page',
    headline: process.env.APP_NAME,
    backgroundColor: process.env.BACKGROUND_COLOR,
    baseURL: process.env.BASE_URL,
  });
});

module.exports = router;