import { describe, test, expect, beforeAll, beforeEach, afterAll } from "vitest";
import pool from '../db/config.js';
import request from 'supertest';
import app from '../app.js';
import runSeed from "../db/runSeed.js";

describe('GET /posts', () => {
    beforeAll(async () => {
        await runSeed();
    });

    test('Obtener todos los posts', async () => {
        const res = await request(app).get('/posts');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toHaveLength(5);

        for (const post of res.body) {
            expect(post).toEqual({
                id: expect.any(Number),
                title: expect.any(String),
                content: expect.any(String),
                author_id: expect.any(Number),
                published: expect.any(Boolean),
                created_at: expect.any(String),
            });
        }
    });

    test('los posts vienen ordenados por id', async () => {
        const res = await request(app).get('/posts');
        expect(res.body.map(post => post.id)).toEqual([1, 2, 3, 4, 5]);
    });

    test('query por title', async () => {
        const res = await request(app).get('/posts').query({title: 'git'});
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].id).toBe(2);
        expect(res.body[0].title).toBe('Errores comunes con Git');
    });

    test('query por title ignora mayusculas', async () => {
        const res = await request(app).get('/posts').query({title: 'GIT'});
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].id).toBe(2);
    });

    test('query title sin valores', async () => {
        const res = await request(app).get('/posts').query({title: 'zzzz'});
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });

    test('query por author_id', async () => {
        const res = await request(app).get('/posts').query({author_id: 1});
        expect(res.statusCode).toBe(200);
        expect(res.body.map(post => post.id)).toEqual([1, 2]);
    });

    test('query author_id sin posts', async () => {
        const res = await request(app).get('/posts').query({author_id: 3});
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });

    test('query published true', async () => {
        const res = await request(app).get('/posts').query({published: 'true'});
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(5);
    });

    test('query published false sin valores', async () => {
        const res = await request(app).get('/posts').query({published: 'false'});
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });

    test('query con title y author_id que coinciden', async () => {
        const res = await request(app).get('/posts').query({title: 'indices', author_id: 2});
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].id).toBe(3);
    });

    test('query con title y author_id que no coinciden', async () => {
        const res = await request(app).get('/posts').query({title: 'indices', author_id: 1});
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });

    test('query author_id no es un numero', async () => {
        const res = await request(app).get('/posts').query({author_id: 'abc'});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('positive integer');
    });

    test('query author_id repetido', async () => {
        const res = await request(app).get('/posts?author_id=1&author_id=2');
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('positive integer');
    });

    test('query published invalido', async () => {
        const res = await request(app).get('/posts').query({published: 'maybe'});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('Published');
    });

    test('Obtener post por ID', async () => {
        const res = await request(app).get('/posts/1');
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(1);
        expect(res.body.title).toBe('Como empece en el desarrollo web');
        expect(res.body.content).toBe('Mi ruta de aprendizaje en el primer ano...');
        expect(res.body.author_id).toBe(1);
        expect(res.body.published).toBe(true);
    });

    test('error al no encontrar ID', async () => {
        const res = await request(app).get('/posts/999');
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toContain('not found');
    });

    test('error ID no es un numero', async () => {
        const res = await request(app).get('/posts/abc');
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('integer');
    });

    test('error ID es cero', async () => {
        const res = await request(app).get('/posts/0');
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('integer');
    });

    test('Obtener el autor de un post', async () => {
        const res = await request(app).get('/posts/1/author');
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(1);
        expect(res.body.title).toBe('Como empece en el desarrollo web');
        expect(res.body.author_id).toBe(1);
        expect(res.body.author_name).toBe('Laura Gomez');
        expect(res.body.author_email).toBe('laura.gomez@devspark.io');
    });

    test('autor de un post que no existe', async () => {
        const res = await request(app).get('/posts/999/author');
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toContain('not found');
    });

    test('autor de un post con ID invalido', async () => {
        const res = await request(app).get('/posts/abc/author');
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('integer');
    });

    test('Obtener los posts de un autor', async () => {
        const res = await request(app).get('/posts/author/1');
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(1);
        expect(res.body.name).toBe('Laura Gomez');
        expect(res.body.email).toBe('laura.gomez@devspark.io');
        expect(res.body.posts).toHaveLength(2);
        expect(res.body.posts).toEqual([
            {id: 1, title: 'Como empece en el desarrollo web', content: 'Mi ruta de aprendizaje en el primer ano...'},
            {id: 2, title: 'Errores comunes con Git', content: 'Los tres tropiezos que mas veo en principiantes...'},
        ]);
    });

    test('autor con posts de otro autor no se mezclan', async () => {
        const res = await request(app).get('/posts/author/2');
        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe('Andres Pardo');
        expect(res.body.posts.map(post => post.id)).toEqual([3, 4]);
    });

    test('autor sin posts devuelve la lista vacia', async () => {
        const res = await request(app).get('/posts/author/3');
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(3);
        expect(res.body.name).toBe('Camila Rojas');
        expect(res.body.posts).toEqual([]);
    });

    test('posts de un autor que no existe', async () => {
        const res = await request(app).get('/posts/author/999');
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Author not found');
    });

    test('posts de un autor con ID no numerico', async () => {
        const res = await request(app).get('/posts/author/abc');
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('integer');
    });

    test('posts de un autor con ID cero', async () => {
        const res = await request(app).get('/posts/author/0');
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('integer');
    });

    test('/posts/author/:id no se confunde con /posts/:id/author', async () => {
        const porAutor = await request(app).get('/posts/author/1');
        const porPost = await request(app).get('/posts/1/author');
        expect(porAutor.body.posts).toBeDefined();
        expect(porPost.body.posts).toBeUndefined();
        expect(porPost.body.author_name).toBe('Laura Gomez');
    });
});

describe('POST /posts', () => {
    beforeEach(async () => {
        await runSeed();
    });

    const validBody = () => ({title: 'Nuevo post', content: 'Contenido del nuevo post', published: false, author_id: 1});

    test('crear post con datos validos', async () => {
        const res = await request(app).post('/posts').send(validBody());
        expect(res.statusCode).toBe(201);
        expect(res.body.id).toBe(6);
        expect(res.body.title).toBe('Nuevo post');
        expect(res.body.content).toBe('Contenido del nuevo post');
        expect(res.body.published).toBe(false);
        expect(res.body.author_id).toBe(1);
    });

    test('el post creado se puede consultar', async () => {
        const created = await request(app).post('/posts').send(validBody());
        const res = await request(app).get(`/posts/${created.body.id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe('Nuevo post');
    });

    test('sin published queda en true', async () => {
        const body = validBody();
        delete body.published;
        const res = await request(app).post('/posts').send(body);
        expect(res.statusCode).toBe(201);
        expect(res.body.published).toBe(true);
    });

    test('sin title', async () => {
        const body = validBody();
        delete body.title;
        const res = await request(app).post('/posts').send(body);
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Title is required');
    });

    test('title solo espacios', async () => {
        const res = await request(app).post('/posts').send({...validBody(), title: '     '});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Title is required');
    });

    test('title que no es string', async () => {
        const res = await request(app).post('/posts').send({...validBody(), title: 123});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('String');
    });

    test('sin content', async () => {
        const body = validBody();
        delete body.content;
        const res = await request(app).post('/posts').send(body);
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Content is required');
    });

    test('sin author_id', async () => {
        const body = validBody();
        delete body.author_id;
        const res = await request(app).post('/posts').send(body);
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Author ID is required');
    });

    test('author_id no es un numero', async () => {
        const res = await request(app).post('/posts').send({...validBody(), author_id: 'abc'});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Author ID should be a positive integer');
    });

    test('author_id cero', async () => {
        const res = await request(app).post('/posts').send({...validBody(), author_id: 0});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Author ID should be a positive integer');
    });

    test('author_id que no existe', async () => {
        const res = await request(app).post('/posts').send({...validBody(), author_id: 999});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Author does not exist');
    });

    test('published que no es boolean', async () => {
        const res = await request(app).post('/posts').send({...validBody(), published: 'true'});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('Boolean');
    });

    test('sin body', async () => {
        const res = await request(app).post('/posts').send({});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('is required');
    });
});

describe('PUT /posts', () => {
    beforeEach(async () => {
        await runSeed();
    });

    const validBody = () => ({title: 'Titulo reemplazado', content: 'Contenido reemplazado', published: false, author_id: 1});

    test('replace post con datos validos', async () => {
        const res = await request(app).put('/posts/5').send(validBody());
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(5);
        expect(res.body.title).toBe('Titulo reemplazado');
        expect(res.body.content).toBe('Contenido reemplazado');
        expect(res.body.published).toBe(false);
        expect(res.body.author_id).toBe(1);
    });

    test('replace post sin published queda en true', async () => {
        const body = validBody();
        delete body.published;
        const res = await request(app).put('/posts/5').send(body);
        expect(res.statusCode).toBe(200);
        expect(res.body.published).toBe(true);
    });

    test('replace post sin title', async () => {
        const body = validBody();
        delete body.title;
        const res = await request(app).put('/posts/5').send(body);
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Title is required');
    });

    test('replace post sin content', async () => {
        const body = validBody();
        delete body.content;
        const res = await request(app).put('/posts/5').send(body);
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Content is required');
    });

    test('replace post sin author_id', async () => {
        const body = validBody();
        delete body.author_id;
        const res = await request(app).put('/posts/5').send(body);
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Author ID is required');
    });

    test('replace post sin body', async () => {
        const res = await request(app).put('/posts/5');
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('is required');
    });

    test('replace post con author_id que no existe', async () => {
        const res = await request(app).put('/posts/5').send({...validBody(), author_id: 999});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Author does not exist');
    });

    test('error ID no es un numero', async () => {
        const res = await request(app).put('/posts/abc').send(validBody());
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('integer');
    });

    test('PUT error al no encontrar ID', async () => {
        const res = await request(app).put('/posts/999').send(validBody());
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toContain('not found');
    });
});

describe('PATCH /posts', () => {
    beforeEach(async () => {
        await runSeed();
    });

    test('update post con todos los datos', async () => {
        const res = await request(app).patch('/posts/5').send({title: 'Nuevo titulo', content: 'Nuevo contenido', published: false, author_id: 1});
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(5);
        expect(res.body.title).toBe('Nuevo titulo');
        expect(res.body.content).toBe('Nuevo contenido');
        expect(res.body.published).toBe(false);
        expect(res.body.author_id).toBe(1);
    });

    test('update post solo title', async () => {
        const res = await request(app).patch('/posts/5').send({title: 'Solo titulo'});
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe('Solo titulo');
        expect(res.body.content).toBe('Como un buen diseno reduce el trabajo del frontend...');
        expect(res.body.published).toBe(true);
        expect(res.body.author_id).toBe(4);
    });

    test('update post solo content', async () => {
        const res = await request(app).patch('/posts/5').send({content: 'Solo contenido'});
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe('Disenar pensando en el desarrollador');
        expect(res.body.content).toBe('Solo contenido');
        expect(res.body.published).toBe(true);
        expect(res.body.author_id).toBe(4);
    });

    test('update post solo author_id', async () => {
        const res = await request(app).patch('/posts/5').send({author_id: 1});
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe('Disenar pensando en el desarrollador');
        expect(res.body.published).toBe(true);
        expect(res.body.author_id).toBe(1);
    });

    test('update post solo published false', async () => {
        const res = await request(app).patch('/posts/5').send({published: false});
        expect(res.statusCode).toBe(200);
        expect(res.body.published).toBe(false);
        expect(res.body.title).toBe('Disenar pensando en el desarrollador');
        expect(res.body.author_id).toBe(4);
    });

    test('update sin published conserva el valor actual', async () => {
        await request(app).patch('/posts/5').send({published: false});
        const res = await request(app).patch('/posts/5').send({title: 'Otro titulo'});
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe('Otro titulo');
        expect(res.body.published).toBe(false);
    });

    test('update post sin body', async () => {
        const res = await request(app).patch('/posts/5');
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('required');
    });

    test('update title solo espacios', async () => {
        const res = await request(app).patch('/posts/5').send({title: '     '});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Title is required');
    });

    test('update published que no es boolean', async () => {
        const res = await request(app).patch('/posts/5').send({published: 'true'});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('Boolean');
    });

    test('update author_id que no es un numero', async () => {
        const res = await request(app).patch('/posts/5').send({author_id: 'abc'});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Author ID should be a positive integer');
    });

    test('update author_id que no existe', async () => {
        const res = await request(app).patch('/posts/5').send({author_id: 999});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Author does not exist');
    });

    test('error ID no es un numero', async () => {
        const res = await request(app).patch('/posts/abc').send({title: 'Titulo'});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('integer');
    });

    test('PATCH error al no encontrar ID', async () => {
        const res = await request(app).patch('/posts/999').send({title: 'Titulo'});
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toContain('not found');
    });
});

describe('DELETE /posts', () => {
    beforeEach(async () => {
        await runSeed();
    });

    test('delete post 5', async () => {
        const res = await request(app).delete('/posts/5');
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(5);
        expect(res.body.title).toBe('Disenar pensando en el desarrollador');
        expect(res.body.author_id).toBe(4);
    });

    test('el post borrado ya no existe', async () => {
        await request(app).delete('/posts/5');
        const res = await request(app).get('/posts/5');
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toContain('not found');
    });

    test('borrar dos veces el mismo post', async () => {
        await request(app).delete('/posts/5');
        const res = await request(app).delete('/posts/5');
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toContain('not found');
    });

    test('borrar un post borra sus comentarios', async () => {
        const before = await request(app).get('/comments').query({post_id: 1});
        expect(before.body).toHaveLength(2);

        await request(app).delete('/posts/1');

        const after = await request(app).get('/comments').query({post_id: 1});
        expect(after.statusCode).toBe(200);
        expect(after.body).toEqual([]);
    });

    test('DELETE error al no encontrar ID', async () => {
        const res = await request(app).delete('/posts/999');
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toContain('not found');
    });

    test('error ID no es un numero', async () => {
        const res = await request(app).delete('/posts/abc');
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('integer');
    });
});

afterAll(async () => {
    await runSeed();
    await pool.end();
});
