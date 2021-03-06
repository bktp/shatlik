const express = require("express");
const router = express.Router();
const auth = require("../auth");

router.get("/", (req, res) => {
  if (req.cookies.password)
    res.json({ auth: auth.isAuth(req.cookies.password) });
  else res.json({ auth: false });
});

router.post("/", (req, res) => {
  if (auth.isAuth(req.body.password)) {
    res.cookie("password", req.body.password, {
      maxAge: 10000000,
      sameSite: "none",
      secure: true,
    });
    res.send();
  } else {
    res.json({ error: "Something went wrong" });
  }
});

module.exports = router;
