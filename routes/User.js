const express = require("express");
const router = express.Router();
const {
  GetAllSpecialities,
} = require("../Controller/User/User");

router.route("/user/login").get(GetAllSpecialities);

module.exports = router;