const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
  createPost,
  getAllPosts,
  getMyPosts,
  updatePost,
  deletePost,
} = require("../controllers/postController");

//public
router.get("/", getAllPosts);

//protected
router.get("/me", auth, getMyPosts);
router.post("/", auth, createPost);
router.patch("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);

router.get("/:id", async (req, res) => {
  const Post = require("../models/Post");
  const { StatusCodes } = require("http-status-codes");

  const post = await Post.findById(req.params.id).populate(
    "author",
    "name profileImage"
  );
  if (!post)
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "Post bulunamadı" });

  res.status(StatusCodes.OK).json({ post });
});
module.exports = router;
