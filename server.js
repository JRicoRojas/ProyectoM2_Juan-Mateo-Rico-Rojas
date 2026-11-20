const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const routerAuthors = require("./routes/author.routes");


app.use(express.json());
app.use('/authors', routerAuthors);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Error interno del servidor"
  });
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});