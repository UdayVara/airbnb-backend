const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors")
const app = express();
const port = 5000;

dotenv.config();
app.use(express.json());
app.use(cors())
app.get("/", (req, res) => {
  res.send("Hello World!"); 
});
app.use(express.static("public"))
app.use("/auth", require("./routes/auth"));
app.use("/listing", require("./routes/listing"));
app.use("/reservation", require("./routes/reservation"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
