const { badRequest } = require("./errors");

function validateId(req, res, next) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        throw badRequest('ID should be a positive integer');
    }
    next();
}

function validateEmail(email) {
    if (!email) {
        throw badRequest('Email is required');
    }

    if(typeof email !== 'string'){
        throw badRequest('Invalid email format');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw badRequest('Invalid email format');
    }
}

function validateString(string, name) {
    if (string === undefined || string === null || (typeof string === 'string' && !string.trim())) {
        throw badRequest(`${name} is required`);
    }
    if (typeof string !== 'string') {
        throw badRequest(`${name} should be a 'String'`);
    }
}

function validateBio(bio) {
    if (bio === undefined) return;
    
    if (typeof bio === 'string' && !bio.trim()) {
        throw badRequest('Bio is required');
    }

    if (typeof bio !== 'string') {
        throw badRequest("Bio should be a 'String'");
    }
}

function validateBoolean(boolean, name){
    
    if (boolean === undefined) return;

    if(typeof boolean !== 'boolean'){
        throw badRequest(`${name} should be a 'Boolean'`);
    }
}

function validatePositiveInt(value, label){
    if (value === undefined || value === null) {
        throw badRequest(`${label} is required`);
    }

    if (!Number.isInteger(value) || value <= 0) {
        throw badRequest(`${label} should be a positive integer`);
    }
}

function validateAuthorId(id){
    validatePositiveInt(id, 'Author ID');
}

function validatePostId(id){
    validatePositiveInt(id, 'Post ID');
}

function validateQueryId(value, label){
    if (value === undefined) return;

    const number = Number(value);
    if (typeof value !== 'string' || value.trim() === '' || !Number.isInteger(number) || number <= 0) {
        throw badRequest(`${label} should be a positive integer`);
    }
}

function validateAuthorsQuery(req, res, next){
    const { name, email } = req.query;
    if(name !== undefined) validateString(name, 'Name');
    if (email !== undefined) validateEmail(email);
    next();
}

function validatePostsQuery(req, res, next){
    const { author_id, published } = req.query;
    validateQueryId(author_id, 'Author ID');
    if (published !== undefined && published !== 'true' && published !== 'false') {
        throw badRequest("Published should be 'true' or 'false'");
    }
    next();
}

function validateCommentsQuery(req, res, next){
    const { author_id, post_id } = req.query;
    validateQueryId(author_id, 'Author ID');
    validateQueryId(post_id, 'Post ID');
    next();
}

function validateAuthorBody(req, res, next) {
    const { name, email, bio } = req.body ?? {};
    validateString(name, 'Name');
    validateEmail(email);
    validateBio(bio);
    next();
}

function validateAuthorPatch(req, res, next) {
    const { name, email, bio } = req.body ?? {};
    if (name === undefined && email === undefined && bio === undefined) {
        throw badRequest('At least one field is required');
    }
    if (name !== undefined) validateString(name, 'Name');
    if (email !== undefined) validateEmail(email);
    validateBio(bio);
    next();
}

function validatePostsBody (req, res, next){
    const {title, content, published, author_id} = req.body ?? {};
    validateString(title, 'Title');
    validateString(content, 'Content');
    validateBoolean(published, 'Published');
    validateAuthorId(author_id);
    next();
}

function validatePostPatch(req, res, next) {
    const { title, content, published, author_id } = req.body ?? {};
    if (title === undefined && content === undefined && published === undefined &&  author_id === undefined) {
        throw badRequest('At least one field is required');
    }
    if (title !== undefined) validateString(title, 'Title');
    if (content !== undefined) validateString(content, 'Content');
    validateBoolean(published, 'Published');
    if (author_id !== undefined ) validateAuthorId(author_id);
    next();
}

function validateCommentsBody (req, res, next){
    const {content, author_id, post_id} = req.body ?? {};
    validateString(content, 'Content');
    validateAuthorId(author_id);
    validatePostId(post_id);
    next();
}

function validateCommentPatch(req, res, next) {
    const { content, author_id, post_id } = req.body ?? {};
    if (content === undefined && author_id === undefined && post_id === undefined) {
        throw badRequest('At least one field is required');
    }
    if (content !== undefined) validateString(content, 'Content');
    if (author_id !== undefined ) validateAuthorId(author_id);
    if (post_id !== undefined ) validatePostId(post_id);
    next();
}

module.exports = {
    validateId,
    validateEmail,
    validateString,
    validateBio,
    validateAuthorBody,
    validateAuthorPatch,
    validateBoolean,
    validatePostsBody,
    validatePostPatch,
    validateCommentsBody,
    validateCommentPatch,
    validateAuthorId,
    validatePostId,
    validateAuthorsQuery,
    validatePostsQuery,
    validateCommentsQuery
};
