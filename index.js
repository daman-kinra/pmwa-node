const app = require("express")();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.get("/", async (req, res) => {
  res.json({ message: "hello" });
});
app.listen(5000, () => {
  console.log("Running on 5000");
});
