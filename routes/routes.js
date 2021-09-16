const route = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { requresLogin } = require("../middlewares/loggedIn");
const user = require("../models/user");
const project = require("../models/project");
route.get("/", async (req, res) => {
  res.send("p-m-w-a server v1.0");
});

// Register Route
route.post("/register", async (req, res) => {
  try {
    const {
      email,
      name,
      username,
      password,
      profileImageUrl,
      projects,
      requests,
    } = req.body;
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
      projects,
      requests,
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

// Login Route
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

// User Details Route
route.get("/user", requresLogin, async (req, res) => {
  try {
    const singleUser = await user.findById(req.user._id).select("-password");
    return res.json({ user: singleUser });
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
});

// Projects according to users Route
route.get("/projects/:member", requresLogin, async (req, res) => {
  try {
    const userprojects = await project.find({
      team: { $in: [`${req.params.member}`] },
    });
    return res.json(userprojects);
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
});

// Get Single Project
route.get("/singleProject/:id", requresLogin, async (req, res) => {
  try {
    const singleProject = await project.findById(req.params.id);
    return res.json(singleProject);
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
});

// Create new Project Route
route.post("/newProject", requresLogin, async (req, res) => {
  try {
    const singleProject = new project({
      ...req.body,
    });
    await singleProject.save();
    return res.json({ project: singleProject });
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
});

//Invite Team member Route
route.post("/addMember/:member", requresLogin, async (req, res) => {
  try {
    console.log(req.body);
    const resultUser = await user.findOneAndUpdate(
      {
        email: req.params.member,
      },
      {
        $push: {
          requests: {
            projectName: req.body.projectName,
            projectOwner: req.body.projectOwner,
            projectOwnerName: req.body.projectOwnerName,
            projectId: req.body.projectId,
          },
        },
      }
    );
    const resultProject = await project.findByIdAndUpdate(req.body.projectId, {
      $push: { requestedUser: req.params.member },
    });
    res.json({ resultProject, resultUser });
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
});
module.exports = route;
