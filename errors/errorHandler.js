const pgErrors = require("../utils/pgErrors");
function errorHandler(err, req, res, next) {
    const errorD = (pgErrors[err.constraint]);
    if(errorD){
        console.error(err);
        return res.status(errorD.status).json({error: errorD.message});
    }
    const status = Number.isInteger(err.code)
        ? err.code
        : (Number.isInteger(err.status) && err.status >= 400 && err.status < 600 ? err.status : 500);

    // Los errores del servidor (5xx) se registran en el log pero nunca se muestran al cliente,
    // porque su mensaje puede revelar detalles internos (por ejemplo, textos de PostgreSQL).
    if (status >= 500) {
        console.error(err.stack ?? err);
        return res.status(status).json({ error: "Internal server error" });
    }

    res.status(status).json({
        error: err.message || "Internal server error"
    });
}

module.exports = { errorHandler };
