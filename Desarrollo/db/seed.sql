TRUNCATE TABLE authors, posts, comments RESTART IDENTITY CASCADE;

INSERT INTO authors (name, email, bio) VALUES
('Laura Gomez','laura.gomez@devspark.io','Escribe sobre desarrollo web y carreras en tecnologia'),
('Andres Pardo','andres.pardo@devspark.io','Backend developer, fan de las bases de datos'),
('Camila Rojas','camila.rojas@devspark.io',''),
('Sebastian Ruiz','sebastian.ruiz@devspark.io','Disenador UX que aprendio a programar'),
('Valentina Torres','valentina.torres@devspark.io','Escribe resenas de libros tecnicos');

INSERT INTO posts (title, content, author_id) VALUES
('Como empece en el desarrollo web','Mi ruta de aprendizaje en el primer ano...','1'),
('Errores comunes con Git','Los tres tropiezos que mas veo en principiantes...','1'),
('Indices en PostgreSQL sin miedo','Que es un indice y cuando vale la pena crearlo...','2'),
('Borrador: transacciones','Notas sueltas sobre COMMIT y ROLLBACK...','2'),
('Disenar pensando en el desarrollador','Como un buen diseno reduce el trabajo del frontend...','4');

INSERT INTO comments (content, author_id, post_id) VALUES
('Muy buen resumen, me senti identificado','2','1'),
('¿Que recursos usaste al inicio?','5','1'),
('El punto sobre los commits grandes es clave','4','2'),
('Ahora si entendi la diferencia con un indice unico','1','3'),
('¿Aplica igual en tablas pequenas?','3','3');