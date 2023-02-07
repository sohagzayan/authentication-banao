const express = require("express");
const { facebookPost } = require("../controllers/postController");

const router = express.Router();

router.route("/post").post(facebookPost);

module.exports = router;
