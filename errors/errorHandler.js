const pgErrors = require("../utils/pgErrors");
function errorHandler(err, req, res, next) {
    const errorD = (pgErrors[err.constraint]);
    if(errorD){
        console.error(err.message);
        return res.status(errorD.status).json({error: errorD.message});
    }
    console.error(err.constraint);
    const status = Number.isInteger(err.code) ? err.code : 500;
    res.status(status).json({
        error: err.message || "Internal server error"
    });
}

module.exports = { errorHandler };
