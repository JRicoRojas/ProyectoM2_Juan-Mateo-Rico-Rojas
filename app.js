const express = require('express');
const app = express();

const routerAuthors = require("./routes/author.routes");
const routerPosts = require("./routes/posts.routes");
const routerComments = require("./routes/comments.routes");
const {errorHandler} = require("./errors/errorHandler");
const {notFound} = require("./errors/errors");

app.use(express.json());

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load(require("path").join(__dirname, "openapi.yaml"));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/authors', routerAuthors);
app.use('/posts', routerPosts);
app.use('/comments', routerComments);

app.use((req, res, next) => {
  next(notFound(`Route not found ${req.originalUrl}`));
});
app.use(errorHandler);

module.exports = app;