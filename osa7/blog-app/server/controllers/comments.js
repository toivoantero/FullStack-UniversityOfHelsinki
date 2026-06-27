const Comment = require("../models/comment");
const Blog = require("../models/blog");
const commentsRouter = require("express").Router();
const { userExtractor } = require("../utils/middleware");

commentsRouter.get("/", (request, response) => {
  Comment.find({})
    .populate("blog", { title: 1, author: 1, url: 1, comments: 1, id: 1 })
    .then((comments) => {
      response.json(comments);
    });
});

commentsRouter.post("/", async (request, response) => {
  const body = request.body;
  const blog = await Blog.findById(body.blog.id);
  const comment = new Comment(request.body);

  comment.blog = blog;

  if (!comment.content) {
    return response.status(400).send({ error: "content missing" });
  }

  blog.comments = blog.comments.concat(comment._id);
  await blog.save();

  const savedComment = await comment.save();

  const populatedComment = await savedComment.populate("blog", {
    title: 1,
    author: 1,
    url: 1,
    id: 1,
  });

  response.status(201).json(populatedComment);
});

module.exports = commentsRouter;
