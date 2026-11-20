const express = require("express");
const router = express.Router()
const authorModels = require ("../models/authors");

router.get("/", async (req, res) =>{
    const results = await authorModels.getAllAuthors(req.query);
    res.status(200).json(results);
});

router.get ("/:id", async (req, res)=>{
    const id = Number(req.params.id);
    const results = await authorModels.getAuthorsByID(id);
    res.status(200).json(results);
});

router.post("/", async (req, res)=>{
    const {name, email, bio} = req.body;
    const results = await authorModels.createAuthor(name, email, bio);
    res.status(201).json(results);
});

router.put("/:id", async (req, res) =>{
    const id = Number(req.params.id);
    const {name, email, bio} = req.body;
    const results = await authorModels.replaceAuthor(id, name, email, bio);
    res.status(200).json(results);
});

router.patch("/:id", async (req, res)=>{
    const id = Number(req.params.id);
    const {name, email, bio} = req.body;
    const results = await authorModels.updateAuthor(id, name, email, bio);
    res.status(200).json(results);
});

router.delete("/:id", async (req, res)=>{
    const id = Number(req.params.id);
    const results = await authorModels.deleteAuthor(id);
    res.status(200).json(results);
});

module.exports = router;