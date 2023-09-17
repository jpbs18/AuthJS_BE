const passport = require("passport");
const User = require("../models/user");
const config = require("../config");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");


const localOptions = {
  usernameField: "email",
};

const localLogin = new LocalStrategy(localOptions, async (email, password, done) => {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return done(null, false);
      }

      user.comparePassword(password, (error, isMatch) => {
        if(error){
          return done(error);
        }

        if(!isMatch){
          return done(null, false);
        }

        return done(null, user);
      });

    } catch (error) {
      done(error);
    }
  }
);


const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: config.secret,
};

const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findOne({ _id: payload.sub });

    if (user) {
      return done(null, user);
    } 
      
    return done(null, false);
    
  } catch (error) {
    return done(error, false);
  }
});

passport.use(localLogin);
passport.use(jwtLogin);

