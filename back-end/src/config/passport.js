const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/user')

passport.use(new GoogleStrategy({
  clientID:     process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL:  '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Find existing user by Google ID
    let user = await User.findOne({ provider: 'google', providerId: profile.id })

    if (!user) {
      // Check if an account with this email already exists (e.g. registered with password before)
      user = await User.findOne({ email: profile.emails[0].value })
      if (user) {
        // Link Google to the existing account
        user.provider = 'google'
        user.providerId = profile.id
        await user.save()
      } else {
        // Brand new user — create account from Google profile
        user = await User.create({
          name:       profile.displayName,
          email:      profile.emails[0].value,
          provider:   'google',
          providerId: profile.id
        })
      }
    }

    done(null, user)
  } catch (err) {
    done(err, null)
  }
}))

module.exports = passport
