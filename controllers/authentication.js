const User = require("../models/user");
const config = require("../config");
const jwt = require("jwt-simple");

const tokenForUser = (user) => {
  const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret)
}

exports.signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if(!email || !password){
        return res.status(422).send({ error: "You must provide email and password" });
    }

    if (existingUser) {
      return res.status(422).send({ error: "Email already exists" });
    }

    const user = new User({ email, password });
    await user.save();
    res.json({ token: tokenForUser(user) });

  } catch (error) {
    next(err);
  }
};

exports.signin = (req, res, next) => {
  res.send({ token: tokenForUser(req.user) });
};
