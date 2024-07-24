const express = require("express"),
  config = require("./constants/config"),
  action = require("./routes/action"),
  port = 3000 || config.port;

const app = express();

app.use("/action", action);

app.listen(3000, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
