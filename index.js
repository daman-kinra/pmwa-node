const app = require("express")();
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("mongoose");
require("dotenv").config();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(require("./routes/routes"));

// DB connection
db.connect(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@db.zrgix.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
  }
)
  .then(() => {
    console.log("connected...");
  })
  .catch((err) => {
    console.log(err);
  });

//Serever start point
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Running on " + PORT);
});
