const route = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { requresLogin } = require("../middlewares/loggedIn");
const user = require("../models/user");
route.get("/", async (req, res) => {
  res.send("p-m-w-a server v1.0");
});

route.post("/register", async (req, res) => {
  try {
    const { email, name, username, password, profileImageUrl } = req.body;
    let singleUser = await user.findOne({ email });
    if (singleUser) {
      return res.json({ error: { code: "user already exists" } });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    singleUser = new user({
      name,
      email,
      password: hashedPassword,
      profileImageUrl,
      username,
    });
    await singleUser.save();
    const token = jwt.sign({ _id: singleUser._id }, "secret", {
      expiresIn: "1h",
    });
    return res.json({ user: singleUser, token });
  } catch (error) {
    console.log(err);
    return res.json(error);
  }
});

route.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let singleUser = await user.findOne({ email });
    if (!singleUser) {
      return res.json({ error: { code: "no such user" } });
    }
    const isPasswordMatched = await bcrypt.compare(
      password,
      singleUser.password
    );
    if (!isPasswordMatched) {
      return res.json({ error: { code: "wrong password" } });
    }
    const token = jwt.sign({ _id: singleUser._id }, "secret", {
      expiresIn: "1h",
    });
    return res.json({ user: singleUser, token });
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
});

route.get("/user", requresLogin, async (req, res) => {
  try {
    const singleUser = await user.findById(req.user._id).select("-password");
    return res.json({ user: singleUser });
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
});
module.exports = route;
