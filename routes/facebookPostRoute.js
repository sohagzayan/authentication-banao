const express = require("express");
const {
  facebookPost,
  facebookPostEdit,
  facebookPostDelete,
  facebookPostAll,
  facebookPostDetails,
  facebookPostLike,
  facebookPostComment,
} = require("../controllers/postController");
const { isAuthenticatedUser } = require("../middleware/authGard");

const router = express.Router();

router.route("/post").get(isAuthenticatedUser, facebookPostAll);
router.route("/post/:id").get(isAuthenticatedUser, facebookPostDetails);
router.route("/post").post(isAuthenticatedUser, facebookPost);
router.route("/post/:id").put(isAuthenticatedUser, facebookPostEdit);
router.route("/post/:id").delete(isAuthenticatedUser, facebookPostDelete);
router.route("/post/like/:id").put(isAuthenticatedUser, facebookPostLike);
router
  .route("/post/comment/:id")
  .post(isAuthenticatedUser, facebookPostComment);

module.exports = router;
