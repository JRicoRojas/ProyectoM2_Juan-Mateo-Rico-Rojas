TRUNCATE TABLE authors, posts, comments RESTART IDENTITY CASCADE;

INSERT INTO authors (name, email, bio) VALUES
('Laura Gómez','laura.gomez@devspark.io','Escribe sobre desarrollo web y carreras en tecnología'),
('Andrés Pardo','andres.pardo@devspark.io','Backend developer, fan de las bases de datos'),
('Camila Rojas','camila.rojas@devspark.io',''),
('Sebastian Ruiz','sebastian.ruiz@devspark.io','Diseñador UX que aprendió a programar'),
('Valentina Torres','valentina.torres@devspark.io','Escribe reseñas de libros tecnicos');

INSERT INTO posts (title, content, author_id) VALUES
('Cómo empecé en el desarrollo web','Mi ruta de aprendizaje en el primer año...','1'),
('Errores comunes con Git','Los tres tropiezos que más veo en principiantes...','1'),
('Indices en PostgreSQL sin miedo','Qué es un índice y cuándo vale la pena crearlo...','2'),
('Borrador: transacciones','Notas sueltas sobre COMMIT y ROLLBACK...','2'),
('Diseñar pensando en el desarrollador','Cómo un buen diseño reduce el trabajo del frontend...','4');

INSERT INTO comments (content, author_id, post_id) VALUES
('Muy buen resumen, me sentí identificado','2','1'),
('¿Qué recursos usaste al inicio?','5','1'),
('El punto sobre los commits grandes es clave','4','2'),
('Ahora sí entendí la diferencia con un índice único','1','3'),
('¿Aplica igual en tablas pequeñas?','3','3');