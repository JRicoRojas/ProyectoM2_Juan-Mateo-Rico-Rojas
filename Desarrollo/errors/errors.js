function createError(msg, code){
    const error= new Error(msg);
    error.code = code;
    return error;
}

function badRequest(message) {
  return createError(message, 400);
}

function notFound(message) {
  return createError(message, 404);
}

function unauthorized(message) {
  return createError(message, 401);
}

function forbidden(message) {
  return createError(message, 403);
}

function internalError(message = 'Internal server error') {
  return createError(message, 500);
}
module.exports = {
    createError,
    badRequest,
    notFound,
    unauthorized,
    forbidden,
    internalError
};