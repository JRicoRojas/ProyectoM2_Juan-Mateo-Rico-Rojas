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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw badRequest('Invalid email format');
    }
}

function validateString(string, name) {

    if (!string || (typeof string === 'string' && !string.trim())) {
        throw badRequest(`${name} is required`);
    }
    if (typeof string !== 'string') {
        throw badRequest(`${name} should be a 'String'`);
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
        throw badRequest('Bio should be a "String"');
    }
}

function validateBoolean(boolean, name){
    
    if (boolean === undefined) return;

    if(typeof boolean !== 'boolean'){
        throw badRequest(`${name} should be a 'Boolean'`);
    }
}

function validateAuthorId(id){
    if (!id) {
        throw badRequest('Author ID is required');
    }

    if (!Number.isInteger(id) || id <= 0) {
        throw badRequest('Author ID should be a positive integer');
    }
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

module.exports = {
    validateId,
    validateEmail,
    validateString,
    validateBio,
    validateAuthorBody,
    validateAuthorPatch,
    validateBoolean,
    validatePostsBody,
    validatePostPatch
};
