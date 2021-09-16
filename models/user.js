const db = require("mongoose");
const user = db.Schema(
  {
    username: {
      type: String,
    },
    password: {
      type: String,
    },
    email: {
      type: String,
    },
    name: {
      type: String,
    },
    profileImageUrl: {
      type: String,
    },
    requests: {
      type: [
        {
          projectName: String,
          projectOwner: String,
          projectOwnerName: String,
          projectId: String,
        },
      ],
    },
    projects: {
      type: [String],
    },
  },
  { timestamps: true }
);

module.exports = db.model("user", user);
