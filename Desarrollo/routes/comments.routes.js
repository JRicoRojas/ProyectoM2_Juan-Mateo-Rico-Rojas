const express = require("express");
const router = express.Router();
const commentsModels = require("../models/comments");
const { validateId, validateCommentsBody, validateCommentPatch, validateCommentsQuery } = require("../errors/validators");
const { notFound } = require("../errors/errors");

router.get("/", validateCommentsQuery, async (req, res) => {
    const results = await commentsModels.getAllComments(req.query);
    res.status(200).json(results);
});

router.get("/:id", validateId, async (req, res) => {
    const id = Number(req.params.id);
    const results = await commentsModels.getCommentByID(id);
    if (!results) throw notFound('Comment not found');
    res.status(200).json(results);
});

router.get("/:id/author", validateId, async (req, res) => {
    const id = Number(req.params.id);
    const results = await commentsModels.getCommentsAuthor(id);
    if (!results) throw notFound('Comment not found');
    res.status(200).json(results);
});

router.get("/:id/post", validateId, async (req, res) => {
    const id = Number(req.params.id);
    const results = await commentsModels.getCommentsPost(id);
    if (!results) throw notFound('Comment not found');
    res.status(200).json(results);
});

router.post("/", validateCommentsBody, async (req, res) => {
    const { content, author_id, post_id } = req.body;
    const results = await commentsModels.createComment(content, author_id, post_id);
    res.status(201).json(results);
});

router.put("/:id", validateId, validateCommentsBody, async (req, res) => {
    const id = Number(req.params.id);
    const { content, author_id, post_id } = req.body;
    const results = await commentsModels.replaceComment(id, content, author_id, post_id);
    if (!results) throw notFound('Comment not found');
    res.status(200).json(results);
});

router.patch("/:id", validateId, validateCommentPatch, async (req, res) => {
    const id = Number(req.params.id);
    const {content, author_id, post_id } = req.body;
    const results = await commentsModels.updateComment(id, content, author_id, post_id);
    if (!results) throw notFound('Comment not found');
    res.status(200).json(results);
});

router.delete("/:id", validateId, async (req, res) => {
    const id = Number(req.params.id);
    const results = await commentsModels.deleteComment(id);
    if (!results) throw notFound('Comment not found');
    res.status(200).json(results);
});

module.exports = router;