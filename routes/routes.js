const route = require("express").Router();

route.get("/", async (req, res) => {
  res.send("p-m-w-a server v1.0");
});

module.exports = route;
