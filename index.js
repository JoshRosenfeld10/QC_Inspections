const express = require("express"),
  config = require("./constants/config"),
  action = require("./routes/action"),
  constants = require("./constants/constants"),
  sheets = require("./routes/sheets"),
  upload = require("./routes/upload"),
  port = 3000 || config.port;

const app = express();

if (constants.local) {
  app.use("/sheets", sheets);
}

app.use("/action", action);
app.use("/upload", upload);

app.listen(3000, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
