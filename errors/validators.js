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

function validateName(name) {
    if (!name) {
        throw badRequest('Name is required');
    }
    if (typeof name !== 'string') {
        throw badRequest('Name should be a "String"');
    }
}

function validateBio(bio) {
    if (bio === undefined) return;

    if (typeof bio !== 'string') {
        throw badRequest('Bio should be a "String"');
    }
}

function validateAuthorBody(req, res, next) {
    const { name, email, bio } = req.body ?? {};
    validateName(name);
    validateEmail(email);
    validateBio(bio);
    next();
}

function validateAuthorPatch(req, res, next) {
    const { name, email, bio } = req.body ?? {};
    if (name === undefined && email === undefined && bio === undefined) {
        throw badRequest('At least one field is required');
    }
    if (name !== undefined) validateName(name);
    if (email !== undefined) validateEmail(email);
    validateBio(bio);
    next();
}

module.exports = {
    validateId,
    validateEmail,
    validateName,
    validateBio,
    validateAuthorBody,
    validateAuthorPatch,
};
