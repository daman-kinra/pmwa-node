const jwt = require("jsonwebtoken");

exports.requresLogin = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const decode = jwt.verify(token, "secret");
      req.user = decode;
      next();
    } else {
      return res.status(400).json({ error: { code: "unauthorized" } });
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};
