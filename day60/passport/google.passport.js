const GoogleStrategy = require("passport-google-oidc");

module.exports = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: ["profile", "email"],
  },
  (issuer, profile, done) => {
    return done(null, {});
  }
);
