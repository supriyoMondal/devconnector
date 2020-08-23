const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");
const Post = require("../../models/Post");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const { check, validationResult } = require("express-validator");

// @route  POST api/post
// @desc   Create a post
// @access Private
router.post(
  "/",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });

      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      console.error(err);
      return res.status(500).send("Server errpr");
    }
  }
);
// @route  GET api/post
// @desc   Get all post
// @access Private

router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });

    res.json(posts);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server errpr");
  }
});
// @route  GET api/post/:id
// @desc  grt post by id
// @access Private
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    console.error(err);
    if (err.kind !== "ObjectId") {
      return res.status(404).json({ msg: "Post Not found" });
    }

    return res.status(500).send("Server error");
  }
});
// @route  DELETE api/post
// @desc   Delete a post
// @access Private

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    //check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await post.remove();

    return res.json({ msg: "Post deleted" });
  } catch (err) {
    console.error(err);
    if (err.kind !== "ObjectId") {
      return res.status(404).json({ msg: "Post Not found" });
    }
    return res.status(500).send("Server errpr");
  }
});

// @route  PUT api/post/like/:id
// @desc   Like a post
// @access Private

router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // if the post already been liked

    if (
      post.like.filter(elm => elm.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: "post alreday liked" });
    }

    post.like.unshift({ user: req.user.id });

    await post.save();

    res.json(post.like);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server errpr");
  }
});
// @route  PUT api/post/unlike/:id
// @desc   Like a post
// @access Private

router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // if the post already been unliked

    if (
      post.like.filter(elm => elm.user.toString() === req.user.id).length === 0
    ) {
      return res.status(400).json({ msg: "has not yet been liked" });
    }
    //get remove index
    const removeIndex = post.like
      .map(l => l.user.toString())
      .indexOf(req.user.id);

    post.like.splice(removeIndex, 1);
    await post.save();

    res.json(post.like);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});

// @route  POST api/post/comment/:id
// @desc    Comment on s post
// @access Private
router.post(
  "/comment/:id",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };
      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.error(err);
      return res.status(500).send("Server error");
    }
  }
);
// @route  POST api/post/comment/:id/:comment_id
// @desc   Delete comment
// @access Private

router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //pull out commnet
    const comment = post.comments.find(
      cmnt => cmnt.id === req.params.comment_id
    );
    //Mae sure commnet exists
    if (!comment) {
      return res.status(404).json({ msg: "Comment Does not exists" });
    }
    //chech user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "user not authorized" });
    }
    const removeIndex = post.comments
      .map(elm => elm.user.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);

    await post.save();

    return res.json(post.comments);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
