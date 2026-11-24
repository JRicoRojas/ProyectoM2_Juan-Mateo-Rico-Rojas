import { describe, test, expect, beforeAll, beforeEach, afterAll } from "vitest";
import pool from '../db/config.js';
import request from 'supertest';
import app from '../app.js';
import runSeed from "../db/runSeed.js";

describe('GET /comments', () => {
    beforeAll(async () => {
        await runSeed();
    });

    test('Obtener todos los comentarios', async () => {
        const res = await request(app).get('/comments');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toHaveLength(5);

        for (const comment of res.body) {
            expect(comment).toEqual({
                id: expect.any(Number),
                content: expect.any(String),
                author_id: expect.any(Number),
                post_id: expect.any(Number),
                created_at: expect.any(String),
            });
        }
    });

    test('los comentarios vienen ordenados por id', async () => {
        const res = await request(app).get('/comments');
        expect(res.body.map(comment => comment.id)).toEqual([1, 2, 3, 4, 5]);
    });

    test('query por author_id', async () => {
        const res = await request(app).get('/comments').query({author_id: 2});
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].id).toBe(1);
        expect(res.body[0].content).toBe('Muy buen resumen, me sentí identificado');
    });

    test('query por post_id', async () => {
        const res = await request(app).get('/comments').query({post_id: 1});
        expect(res.statusCode).toBe(200);
        expect(res.body.map(comment => comment.id)).toEqual([1, 2]);
    });

    test('query por post_id usa la columna post_id y no author_id', async () => {
        const res = await request(app).get('/comments').query({post_id: 3});
        expect(res.statusCode).toBe(200);
        expect(res.body.map(comment => comment.id)).toEqual([4, 5]);
    });

    test('query post_id sin comentarios', async () => {
        const res = await request(app).get('/comments').query({post_id: 999});
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });

    test('query author_id sin comentarios', async () => {
        const res = await request(app).get('/comments').query({author_id: 999});
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });

    test('query con post_id y author_id que coinciden', async () => {
        const res = await request(app).get('/comments').query({post_id: 2, author_id: 4});
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].id).toBe(3);
    });

    test('query con post_id y author_id que no coinciden', async () => {
        const res = await request(app).get('/comments').query({post_id: 2, author_id: 1});
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });

    test('query author_id no es un numero', async () => {
        const res = await request(app).get('/comments').query({author_id: 'abc'});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Author ID should be a positive integer');
    });

    test('query post_id negativo', async () => {
        const res = await request(app).get('/comments').query({post_id: -1});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Post ID should be a positive integer');
    });

    test('query post_id cero', async () => {
        const res = await request(app).get('/comments').query({post_id: 0});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Post ID should be a positive integer');
    });

    test('Obtener comentario por ID', async () => {
        const res = await request(app).get('/comments/1');
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(1);
        expect(res.body.content).toBe('Muy buen resumen, me sentí identificado');
        expect(res.body.author_id).toBe(2);
        expect(res.body.post_id).toBe(1);
    });

    test('error al no encontrar ID', async () => {
        const res = await request(app).get('/comments/999');
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Comment not found');
    });

    test('error ID no es un numero', async () => {
        const res = await request(app).get('/comments/abc');
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('integer');
    });

    test('Obtener el autor de un comentario', async () => {
        const res = await request(app).get('/comments/1/author');
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(1);
        expect(res.body.author_id).toBe(2);
        expect(res.body.author_name).toBe('Andrés Pardo');
        expect(res.body.author_email).toBe('andres.pardo@devspark.io');
    });

    test('autor de un comentario que no existe', async () => {
        const res = await request(app).get('/comments/999/author');
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Comment not found');
    });

    test('Obtener el post de un comentario', async () => {
        const res = await request(app).get('/comments/1/post');
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(1);
        expect(res.body.post_id).toBe(1);
        expect(res.body.post_title).toBe('Cómo empecé en el desarrollo web');
    });

    test('post de un comentario que no existe', async () => {
        const res = await request(app).get('/comments/999/post');
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Comment not found');
    });

    test('post de un comentario con ID invalido', async () => {
        const res = await request(app).get('/comments/abc/post');
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('integer');
    });
});

describe('POST /comments', () => {
    beforeEach(async () => {
        await runSeed();
    });

    const validBody = () => ({content: 'Nuevo comentario', author_id: 1, post_id: 1});

    test('crear comentario con datos validos', async () => {
        const res = await request(app).post('/comments').send(validBody());
        expect(res.statusCode).toBe(201);
        expect(res.body.id).toBe(6);
        expect(res.body.content).toBe('Nuevo comentario');
        expect(res.body.author_id).toBe(1);
        expect(res.body.post_id).toBe(1);
    });

    test('el comentario creado se puede consultar', async () => {
        const created = await request(app).post('/comments').send(validBody());
        const res = await request(app).get(`/comments/${created.body.id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.content).toBe('Nuevo comentario');
    });

    test('sin content', async () => {
        const body = validBody();
        delete body.content;
        const res = await request(app).post('/comments').send(body);
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Content is required');
    });

    test('content solo espacios', async () => {
        const res = await request(app).post('/comments').send({...validBody(), content: '     '});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Content is required');
    });

    test('content que no es string', async () => {
        const res = await request(app).post('/comments').send({...validBody(), content: 123});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('String');
    });

    test('sin author_id', async () => {
        const body = validBody();
        delete body.author_id;
        const res = await request(app).post('/comments').send(body);
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Author ID is required');
    });

    test('sin post_id', async () => {
        const body = validBody();
        delete body.post_id;
        const res = await request(app).post('/comments').send(body);
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Post ID is required');
    });

    test('post_id no es un numero', async () => {
        const res = await request(app).post('/comments').send({...validBody(), post_id: 'abc'});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Post ID should be a positive integer');
    });

    test('author_id cero', async () => {
        const res = await request(app).post('/comments').send({...validBody(), author_id: 0});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Author ID should be a positive integer');
    });

    test('author_id que no existe', async () => {
        const res = await request(app).post('/comments').send({...validBody(), author_id: 999});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Author does not exist');
    });

    test('post_id que no existe', async () => {
        const res = await request(app).post('/comments').send({...validBody(), post_id: 999});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Post does not exist');
    });

    test('sin body', async () => {
        const res = await request(app).post('/comments').send({});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('is required');
    });
});

describe('PUT /comments', () => {
    beforeEach(async () => {
        await runSeed();
    });

    const validBody = () => ({content: 'Comentario reemplazado', author_id: 1, post_id: 2});

    test('replace comentario con datos validos', async () => {
        const res = await request(app).put('/comments/5').send(validBody());
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(5);
        expect(res.body.content).toBe('Comentario reemplazado');
        expect(res.body.author_id).toBe(1);
        expect(res.body.post_id).toBe(2);
    });

    test('replace comentario sin content', async () => {
        const body = validBody();
        delete body.content;
        const res = await request(app).put('/comments/5').send(body);
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Content is required');
    });

    test('replace comentario sin author_id', async () => {
        const body = validBody();
        delete body.author_id;
        const res = await request(app).put('/comments/5').send(body);
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Author ID is required');
    });

    test('replace comentario sin post_id', async () => {
        const body = validBody();
        delete body.post_id;
        const res = await request(app).put('/comments/5').send(body);
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Post ID is required');
    });

    test('replace comentario sin body', async () => {
        const res = await request(app).put('/comments/5');
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('is required');
    });

    test('replace comentario con author_id que no existe', async () => {
        const res = await request(app).put('/comments/5').send({...validBody(), author_id: 999});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Author does not exist');
    });

    test('replace comentario con post_id que no existe', async () => {
        const res = await request(app).put('/comments/5').send({...validBody(), post_id: 999});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Post does not exist');
    });

    test('error ID no es un numero', async () => {
        const res = await request(app).put('/comments/abc').send(validBody());
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('integer');
    });

    test('PUT error al no encontrar ID', async () => {
        const res = await request(app).put('/comments/999').send(validBody());
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Comment not found');
    });
});

describe('PATCH /comments', () => {
    beforeEach(async () => {
        await runSeed();
    });

    test('update comentario con todos los datos', async () => {
        const res = await request(app).patch('/comments/5').send({content: 'Nuevo contenido', author_id: 1, post_id: 2});
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(5);
        expect(res.body.content).toBe('Nuevo contenido');
        expect(res.body.author_id).toBe(1);
        expect(res.body.post_id).toBe(2);
    });

    test('update comentario solo content', async () => {
        const res = await request(app).patch('/comments/5').send({content: 'Solo contenido'});
        expect(res.statusCode).toBe(200);
        expect(res.body.content).toBe('Solo contenido');
        expect(res.body.author_id).toBe(3);
        expect(res.body.post_id).toBe(3);
    });

    test('update comentario solo author_id', async () => {
        const res = await request(app).patch('/comments/5').send({author_id: 1});
        expect(res.statusCode).toBe(200);
        expect(res.body.content).toBe('¿Aplica igual en tablas pequeñas?');
        expect(res.body.author_id).toBe(1);
        expect(res.body.post_id).toBe(3);
    });

    test('update comentario solo post_id', async () => {
        const res = await request(app).patch('/comments/5').send({post_id: 1});
        expect(res.statusCode).toBe(200);
        expect(res.body.content).toBe('¿Aplica igual en tablas pequeñas?');
        expect(res.body.author_id).toBe(3);
        expect(res.body.post_id).toBe(1);
    });

    test('update comentario sin body', async () => {
        const res = await request(app).patch('/comments/5');
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('required');
    });

    test('update content solo espacios', async () => {
        const res = await request(app).patch('/comments/5').send({content: '     '});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Content is required');
    });

    test('update author_id que no es un numero', async () => {
        const res = await request(app).patch('/comments/5').send({author_id: 'abc'});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Author ID should be a positive integer');
    });

    test('update post_id negativo', async () => {
        const res = await request(app).patch('/comments/5').send({post_id: -1});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Post ID should be a positive integer');
    });

    test('update author_id que no existe', async () => {
        const res = await request(app).patch('/comments/5').send({author_id: 999});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Author does not exist');
    });

    test('update post_id que no existe', async () => {
        const res = await request(app).patch('/comments/5').send({post_id: 999});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Post does not exist');
    });

    test('error ID no es un numero', async () => {
        const res = await request(app).patch('/comments/abc').send({content: 'Contenido'});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('integer');
    });

    test('PATCH error al no encontrar ID', async () => {
        const res = await request(app).patch('/comments/999').send({content: 'Contenido'});
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Comment not found');
    });
});

describe('DELETE /comments', () => {
    beforeEach(async () => {
        await runSeed();
    });

    test('delete comentario 5', async () => {
        const res = await request(app).delete('/comments/5');
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(5);
        expect(res.body.content).toBe('¿Aplica igual en tablas pequeñas?');
        expect(res.body.author_id).toBe(3);
        expect(res.body.post_id).toBe(3);
    });

    test('el comentario borrado ya no existe', async () => {
        await request(app).delete('/comments/5');
        const res = await request(app).get('/comments/5');
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Comment not found');
    });

    test('borrar dos veces el mismo comentario', async () => {
        await request(app).delete('/comments/5');
        const res = await request(app).delete('/comments/5');
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Comment not found');
    });

    test('borrar un comentario no borra su post ni su autor', async () => {
        await request(app).delete('/comments/5');
        const post = await request(app).get('/posts/3');
        const author = await request(app).get('/authors/3');
        expect(post.statusCode).toBe(200);
        expect(author.statusCode).toBe(200);
    });

    test('borrar un autor borra sus comentarios', async () => {
        await request(app).delete('/authors/2');
        const res = await request(app).get('/comments/1');
        expect(res.statusCode).toBe(404);
    });

    test('DELETE error al no encontrar ID', async () => {
        const res = await request(app).delete('/comments/999');
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Comment not found');
    });

    test('error ID no es un numero', async () => {
        const res = await request(app).delete('/comments/abc');
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('integer');
    });
});

afterAll(async () => {
    await runSeed();
    await pool.end();
});
