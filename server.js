const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const routerAuthors = require("./routes/author.routes");
const {errorHandler} = require("./errors/errorHandler");
const {notFound} = require("./errors/errors");


app.use(express.json());
app.use('/authors', routerAuthors);

app.use((req, res, next) => {
  next(notFound(`Route not found ${req.originalUrl}`));
});

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});