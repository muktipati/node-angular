const express = require("express");

const PostController = require("../controllers/post")
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file")
const router = express.Router();


router.post("", checkAuth, extractFile, PostController.createPosts);

router.put("/:id", checkAuth, extractFile, PostController.updatePosts);
router.get("", PostController.getPosts);
router.delete("/:id", checkAuth, PostController.deletePost);
router.get("/:id", PostController.getPost);

module.exports = router;
