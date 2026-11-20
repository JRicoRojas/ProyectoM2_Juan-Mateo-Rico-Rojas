const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const routerAuthors = require("./routes/author.routes");
const {errorHandler} = require("./errors/errorHandler");


app.use(express.json());
app.use('/authors', routerAuthors);
app.use(errorHandler);



app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});