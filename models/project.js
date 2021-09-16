const db = require("mongoose");
const project = db.Schema({
  title: {
    type: String,
  },
  team: {
    type: [String],
  },
  owner: {
    type: String,
  },
  totalTasks: {
    type: Number,
  },
  completedTasks: {
    type: Number,
  },
  id: {
    type: String,
  },
  requestedUser: {
    type: [String],
  },
  tasks: {
    type: [String],
  },
});

module.exports = db.model("project", project);
