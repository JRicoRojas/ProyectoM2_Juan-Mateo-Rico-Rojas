function errorHandler(err, req, res, next) {
    console.error(err.stack);
    const status = Number.isInteger(err.code) ? err.code : 500;
    res.status(status).json({
        error: err.message || "Internal server error"
    });
}

module.exports = { errorHandler };
