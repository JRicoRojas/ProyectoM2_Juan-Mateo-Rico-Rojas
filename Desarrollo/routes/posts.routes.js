const express = require("express");
const router = express.Router();
const authorModels = require("../models/authors");
const postsModels = require("../models/posts");
const { validateId, validatePostsBody, validatePostPatch, validatePostsQuery } = require("../errors/validators");
const { notFound } = require("../errors/errors");

router.get("/", validatePostsQuery, async (req, res) => {
    const results = await postsModels.getAllPosts(req.query);
    res.status(200).json(results);
});

router.get("/:id",validateId, async (req, res) => {
    const id = Number(req.params.id);
    const results = await postsModels.getPostsByID(id);
    if (!results) throw notFound('Post not found');
    res.status(200).json(results);
});

router.get("/:id/author", validateId, async (req, res) => {
    const id = Number(req.params.id);
    const results = await postsModels.getPostsAuthor(id);
    if (!results) throw notFound('Post not found');
    res.status(200).json(results);
});

router.get("/author/:id", validateId, async (req, res) => {
    const id = Number(req.params.id);
    const results = await authorModels.getAuthorPosts(id);
    if (!results) throw notFound('Author not found');
    res.status(200).json(results);
});


router.post("/", validatePostsBody, async (req, res) => {
    const { title, content, published, author_id } = req.body;
    const results = await postsModels.createPost(title, content, published, author_id);
    res.status(201).json(results);
});

router.put("/:id", validateId, validatePostsBody, async (req, res) => {
    const id = Number(req.params.id);
    const { title, content, published, author_id } = req.body;
    const results = await postsModels.replacePost(id, title, content, published, author_id);
    if (!results) throw notFound('Post not found');
    res.status(200).json(results);
});

router.patch("/:id", validateId, validatePostPatch, async (req, res) => {
    const id = Number(req.params.id);
    const { title, content, published, author_id } = req.body;
    const results = await postsModels.updatePost(id, title, content, published, author_id);
    if (!results) throw notFound('Post not found');
    res.status(200).json(results);
});

router.delete("/:id", validateId, async (req, res) => {
    const id = Number(req.params.id);
    const results = await postsModels.deletePosts(id);
    if (!results) throw notFound('Post not found');
    res.status(200).json(results);
});

module.exports = router;