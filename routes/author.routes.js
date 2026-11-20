const express = require("express");
const router = express.Router();
const authorModels = require("../models/authors");
const { validateId, validateAuthorBody, validateAuthorPatch } = require("../errors/validators");
const { notFound } = require("../errors/errors");

router.get("/", async (req, res) => {
    const results = await authorModels.getAllAuthors(req.query);
    res.status(200).json(results);
});

router.get("/:id", validateId, async (req, res) => {
    const id = Number(req.params.id);
    const results = await authorModels.getAuthorsByID(id);
    if (!results) throw notFound('Author not found');
    res.status(200).json(results);
});

router.post("/", validateAuthorBody, async (req, res) => {
    const { name, email, bio } = req.body;
    const results = await authorModels.createAuthor(name, email, bio);
    res.status(201).json(results);
});

router.put("/:id", validateId, validateAuthorBody, async (req, res) => {
    const id = Number(req.params.id);
    const { name, email, bio } = req.body;
    const results = await authorModels.replaceAuthor(id, name, email, bio);
    if (!results) throw notFound('Author not found');
    res.status(200).json(results);
});

router.patch("/:id", validateId, validateAuthorPatch, async (req, res) => {
    const id = Number(req.params.id);
    const { name, email, bio } = req.body;
    const results = await authorModels.updateAuthor(id, name, email, bio);
    if (!results) throw notFound('Author not found');
    res.status(200).json(results);
});

router.delete("/:id", validateId, async (req, res) => {
    const id = Number(req.params.id);
    const results = await authorModels.deleteAuthor(id);
    if (!results) throw notFound('Author not found');
    res.status(200).json(results);
});

module.exports = router;
