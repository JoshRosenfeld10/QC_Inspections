const express = require("express"),
  router = express.Router();

router.use(express.json());

router.post("/", (req, res) => {
  res.send({
    status: "success",
    body: req.body,
  });
});

module.exports = router;
