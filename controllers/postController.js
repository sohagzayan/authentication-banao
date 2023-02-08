const tryCatch = require("../middleware/tryCatch");
const User = require("../models/userModel");
const Post = require("../models/facebookPostModal");
const Like = require("../models/likeModal");
const ErrorHandler = require("../utils/errorHandler");
const mongoose = require("mongoose");
const Comment = require("../models/commentModal");

/** Post like Facebook  ⩢ */
exports.facebookPost = tryCatch(async (req, res, next) => {
  const { message } = req.body;
  const newPost = await Post.create({
    user: req.user._id,
    message,
  });
  res.status(200).json({
    success: true,
    message: "successfully add your post",
    newPost,
  });
});

/** Edit Post Facebook  ⩢ */
exports.facebookPostEdit = tryCatch(async (req, res, next) => {
  const { message } = req.body;
  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(
      new ErrorHandler(`Post does not exist with id: ${req.params.id}`)
    );
  }
  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    { message },
    {
      new: true,
      runValidators: true,
      useFindModify: false,
    }
  );
  res.status(200).json({
    success: true,
    message: "successfully update your post",
    updatedPost,
  });
});

/** delete Post Facebook  ⩢ */
exports.facebookPostDelete = tryCatch(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(
      new ErrorHandler(`Post does not exist with id: ${req.params.id}`)
    );
  }
  await post.remove();
  res.status(200).json({
    success: true,
    message: "Delete User successfully",
  });
});

/** get all Post   ⩢ */
exports.facebookPostAll = tryCatch(async (req, res, next) => {
  const allPost = await Post.find();
  res.status(200).json({
    success: true,
    allPost,
  });
});

/** get single post or get post details ⩢ */
exports.facebookPostDetails = tryCatch(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(
      new ErrorHandler(`Post does not exist with id: ${req.params.id}`)
    );
  }
  const postDetails = await Post.findOne({ _id: req.params.id });
  res.status(200).json({
    success: true,
    postDetails,
  });
});

/** add post like ⩢ */
exports.facebookPostLike = tryCatch(async (req, res, next) => {
  const post = await Post.find({
    _id: req.params.id,
    likes: { $in: [mongoose.Types.ObjectId(req.user._id)] },
  });
  console.log("post", post);
  if (post.length) {
    return next(new ErrorHandler(`You Already liked this post`));
  }
  const postNew = await Post.findOne({ _id: req.params.id });
  postNew.likes.push(req.user._id);
  await postNew.save();
  res.status(200).json({
    success: true,
    message: "Successfully Added Your liked",
  });
});

/** add comment on post  ⩢ */
exports.facebookPostComment = tryCatch(async (req, res, next) => {
  const { text } = req.body;
  const post = await Post.findOne({ post: req.params.id });
  console.log(post, "post");
  if (!post) {
    return next(
      new ErrorHandler(`Post does not exist with id: ${req.params.id}`)
    );
  }
  post.comments.push({ user: req.user._id, text });
  await post.save();
  res.status(200).json({
    success: true,
    message: "Successfully Added Your liked",
  });
});
