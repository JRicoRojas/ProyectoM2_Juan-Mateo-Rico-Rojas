import { describe, test, expect, beforeAll, afterAll } from "vitest";
import pool from '../db/config.js';
import  request  from 'supertest';
import app from '../app.js'
import runSeed from "../db/runSeed.js";

describe ('GET / authors' , () => {
    beforeAll(async () => {
        await runSeed();
    });

    test('Obtener todos los autores', async () => {
        const response = await request(app)
            .get('/authors')
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toHaveLength(5);

        for (const author of response.body) {
            expect(author).toEqual({
                id: expect.any(Number),
                name: expect.any(String),
                email: expect.any(String),
                bio: expect.any(String),
                created_at: expect.any(String),
            });
        }
    });

    test ('query por name', async () => {
        const res = await request (app)
            .get('/authors').query({name: 'cam'});
        expect(res.statusCode).toBe(200);
        expect(res.body[0].id).toBe(3);
        expect(res.body[0].name).toBe('Camila Rojas');
        expect(res.body[0].email).toBe('camila.rojas@devspark.io');
        expect(res.body[0].bio).toBe('');
    });

    test ('query name sin valores', async () => {
        const res = await request (app)
            .get('/authors').query({name: 'zzzz'});
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });

    test('query por email', async() =>{
        const res = await request(app).get('/authors').query({email: 'laura.gomez@devspark.io'});
        expect(res.statusCode).toBe(200);
        expect(res.body[0].id).toBe(1);
        expect(res.body[0].name).toBe('Laura Gomez');
        expect(res.body[0].email).toBe('laura.gomez@devspark.io');
        expect(res.body[0].bio).toBe('Escribe sobre desarrollo web y carreras en tecnologia');
    });

    test ('query email sin valores', async () => {
        const res = await request (app).get('/authors').query({email: 'noexiste@test.com'});
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });

    test ('query email sin formato', async () => {
        const res = await request (app).get('/authors').query({email: 'test'});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Invalid email format');
    });

    test ('query email sin dominio', async () => {
        const res = await request (app).get('/authors').query({email: 'test@'});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Invalid email format');
    });

    test ('query email vacio', async () => {
        const res = await request (app).get('/authors').query({email: ''});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Email is required');
    });

    test ('query name y email validos a la vez', async () => {
        const res = await request (app).get('/authors').query({name: 'laura', email: 'laura.gomez@devspark.io'});
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].id).toBe(1);
    });

    test ('query name valido con email invalido', async () => {
        const res = await request (app).get('/authors').query({name: 'laura', email: 'abc'});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Invalid email format');
    });


    test ('Obtener autor por ID', async () =>{
        const res = await request(app)
            .get('/authors/1');
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(1);
        expect(res.body.name).toBe('Laura Gomez');
        expect(res.body.email).toBe('laura.gomez@devspark.io');
        expect(res.body.bio).toBe('Escribe sobre desarrollo web y carreras en tecnologia');
    });

    test('error al no encontrar ID', async()=>{
        const res = await request(app)
            .get('/authors/6');
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toContain('not found');
    });

    test('error ID no es un numero', async()=>{
        const res = await request(app)
            .get('/authors/abc');
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('integer');
    });

    test('error ID es cero', async()=>{
        const res = await request(app)
            .get('/authors/0');
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('integer');
    });

    test('error ID es negativo', async()=>{
        const res = await request(app)
            .get('/authors/-1');
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('integer');
    });

    test('Obtener un autor con sus posts', async () => {
        const res = await request(app).get('/authors/1/posts');
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(1);
        expect(res.body.name).toBe('Laura Gomez');
        expect(res.body.email).toBe('laura.gomez@devspark.io');
        expect(res.body.posts.map(post => post.id)).toEqual([1, 2]);
    });

    test('autor sin posts devuelve la lista vacia', async () => {
        const res = await request(app).get('/authors/5/posts');
        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe('Valentina Torres');
        expect(res.body.posts).toEqual([]);
    });

    test('posts de un autor que no existe', async () => {
        const res = await request(app).get('/authors/999/posts');
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Author not found');
    });

    test('posts de un autor con ID invalido', async () => {
        const res = await request(app).get('/authors/abc/posts');
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('integer');
    });

    test('/authors/:id/posts y /posts/author/:id devuelven lo mismo', async () => {
        const porAutores = await request(app).get('/authors/1/posts');
        const porPosts = await request(app).get('/posts/author/1');
        expect(porPosts.body).toEqual(porAutores.body);
    });
});

describe('POST/authors', () => {
    beforeAll(async () => {
        await runSeed();
    });
    
    test('crear author con datos validos', async () => {
        const res = await request(app).post('/authors').send({ name: 'Juan', email: 'juan@example.com', bio: 'Test bio' });
        expect(res.statusCode).toBe(201);
        expect(res.body.id).toBe(6);
        expect(res.body.name).toBe('Juan');
        expect(res.body.email).toBe('juan@example.com');
        expect(res.body.bio).toBe('Test bio');
    });

    test ('intento author sin body', async () =>{
        const res = await request(app).post('/authors').send({});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('is required');
    });

    test ('intento author sin name', async () =>{
        const res = await request(app).post('/authors').send({email: 'juan@example.com', bio: 'Test bio'});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('is required');
    });

    test ('intento author sin email', async () =>{
        const res = await request(app).post('/authors').send({name: 'Juan'});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('is required');
    });

    test ('intento author sin bio', async () =>{
        const res = await request(app).post('/authors').send({ name: 'Mateo', email: 'mateo@example.com'});
        expect(res.statusCode).toBe(201);
        expect(res.body.id).toBe(7);
        expect(res.body.name).toBe('Mateo');
        expect(res.body.email).toBe('mateo@example.com');
        expect(res.body.bio).toBe(null);
    });

    test ('intento author con mismo email', async () =>{
        const res = await request(app).post('/authors').send({ name: 'Mateo', email: 'mateo@example.com'});
        expect(res.statusCode).toBe(409);
        expect(res.body.error).toContain('Author');
    });

    test ('intento author con name no String', async () =>{
        const res = await request(app).post('/authors').send({ name: 123, email: 'mateo@example.com'});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('String');
    });

    test ('intento author con mal con bio no string', async () =>{
        const res = await request(app).post('/authors').send({ name: 'test name', email: 'mateo@example.com', bio: 123});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('Bio should be');
    });

    test ('intento author con mal email format', async () =>{
        const res = await request(app).post('/authors').send({ name: 'test name', email: 'mateo', bio: 123});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('Invalid email format');
    });

    test('update name solo espacion', async () => {
        const res = await request(app).post('/authors').send({name: '     ',email: 'juan@example.com'});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('required');
    });
});

describe('PUT /authors', () =>{
    beforeAll(async () => {
        await runSeed();
    });

    test('replace author con datos validos', async () => {
        const res = await request(app).put('/authors/5').send({ name: 'Juan', email: 'juan@example.com', bio: 'Test bio' });
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(5);
        expect(res.body.name).toBe('Juan');
        expect(res.body.email).toBe('juan@example.com');
        expect(res.body.bio).toBe('Test bio');
    });

    test('replace author sin bio', async () => {
        const res = await request(app).put('/authors/5').send({ name: 'Juan', email: 'juan@example.com'});
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(5);
        expect(res.body.name).toBe('Juan');
        expect(res.body.email).toBe('juan@example.com');
        expect(res.body.bio).toBe(null);
    });

    test('replace author sin name', async () => {
        const res = await request(app).put('/authors/5').send({email: 'juan@example.com', bio: 'Test bio' });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('is required');
    });

    test('replace author sin email', async () => {
        const res = await request(app).put('/authors/5').send({ name: 'Juan', bio: 'Test bio' });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('is required');
    });

    test('replace author solo con bio', async () => {
        const res = await request(app).put('/authors/5').send({ bio: 'Test bio' });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('is required');
    });

    test('replace author sin body', async () => {
        const res = await request(app).put('/authors/5');
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('is required');
    });

    test('replace email sin formato', async () => {
        const res = await request(app).put('/authors/5').send({name: 'Juan', email: 'juan'});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('format');
    });

    test('update name solo espacion', async () => {
        const res = await request(app).put('/authors/5').send({name: '     ',email: 'juan@example.com'});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('required');
    });

    test('error ID no es un numero', async()=>{
        const res = await request(app).put('/authors/abc').send({name: 'Juan', email: 'juan@example.com', bio: 'Test bio' });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('integer');
    });

    test('PUT author con name no string', async () => {
        const res = await request(app).put('/authors/5').send({ name: 123, email: 'juan@example.com' });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('String');
    });

    test('PUT author con bio no string', async () => {
        const res = await request(app).put('/authors/5').send({ name: 'Juan', email: 'juan@example.com', bio: 123 });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('Bio should be');
    });

    test('PUT error al no encontrar ID', async()=>{
        const res = await request(app).put('/authors/999').send({name: 'Juan', email: 'juan@example.com', bio: 'Test bio' });
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toContain('not found');
    });

    test ('intento author con mismo email', async () =>{
        const res = await request(app).put('/authors/5').send({ name: 'Mateo', email: 'laura.gomez@devspark.io'});
        expect(res.statusCode).toBe(409);
        expect(res.body.error).toContain('Author');
    });
});

describe ('PATCH/authors', async () =>{

    beforeAll(async () => {
        await runSeed();
    });

    test('update author con datos validos', async () => {
        const res = await request(app).patch('/authors/5').send({ name: 'Juan', email: 'juan@example.com', bio: 'Test bio' });
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(5);
        expect(res.body.name).toBe('Juan');
        expect(res.body.email).toBe('juan@example.com');
        expect(res.body.bio).toBe('Test bio');
    });

    test('update author sin bio', async () => {
        const res = await request(app).patch('/authors/5').send({ name: 'Mateo', email: 'mateo@example.com'});
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(5);
        expect(res.body.name).toBe('Mateo');
        expect(res.body.email).toBe('mateo@example.com');
        expect(res.body.bio).toBe('Test bio');
    });

    test('update author sin email', async () => {
        const res = await request(app).patch('/authors/5').send({ name: 'camilo', bio: 'camilo bio' });
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(5);
        expect(res.body.name).toBe('camilo');
        expect(res.body.email).toBe('mateo@example.com');
        expect(res.body.bio).toBe('camilo bio');
    });

    test('update author sin name', async () => {
        const res = await request(app).patch('/authors/5').send({email: 'andres@example.com', bio: 'andres bio' });
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(5);
        expect(res.body.name).toBe('camilo');
        expect(res.body.email).toBe('andres@example.com');
        expect(res.body.bio).toBe('andres bio');
    });

    test('update author solo name', async () => {
        const res = await request(app).patch('/authors/5').send({name: 'andres'});
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(5);
        expect(res.body.name).toBe('andres');
        expect(res.body.email).toBe('andres@example.com');
        expect(res.body.bio).toBe('andres bio');
    });

    test('update author solo email', async () => {
        const res = await request(app).patch('/authors/5').send({email: 'rico@example.com'});
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(5);
        expect(res.body.name).toBe('andres');
        expect(res.body.email).toBe('rico@example.com');
        expect(res.body.bio).toBe('andres bio');
    });

    test('update author solo bio', async () => {
        const res = await request(app).patch('/authors/5').send({bio: 'test bio'});
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(5);
        expect(res.body.name).toBe('andres');
        expect(res.body.email).toBe('rico@example.com');
        expect(res.body.bio).toBe('test bio');
    });

    test('update author sin body', async () => {
        const res = await request(app).patch('/authors/5');
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('required');
    });

    test('update email sin formato', async () => {
        const res = await request(app).patch('/authors/5').send({email: 'rico'});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('format');
    });

    test('update name solo espacio', async () => {
        const res = await request(app).patch('/authors/5').send({name: '     '});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('required');
    });

    test('error ID no es un numero', async()=>{
        const res = await request(app).patch('/authors/abc').send({name: 'Juan', email: 'juan@example.com', bio: 'Test bio' });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('integer');
    });

    test('PATCH author con name no string', async () => {
        const res = await request(app).patch('/authors/5').send({ name: 123 });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('String');
    });

    test('PATCH author con bio no string', async () => {
        const res = await request(app).patch('/authors/5').send({ bio: 123 });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('Bio should be');
    });

    test('PATCH error al no encontrar ID', async()=>{
        const res = await request(app).patch('/authors/999').send({name: 'Juan', email: 'juan@example.com', bio: 'Test bio' });
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toContain('not found');
    });

    test ('intento author con mismo email', async () =>{
        const res = await request(app).patch('/authors/5').send({ name: 'Mateo', email: 'laura.gomez@devspark.io'});
        expect(res.statusCode).toBe(409);
        expect(res.body.error).toContain('Author');
    });
});

describe('DELETE/authors', () =>{

    beforeAll(async () => {
        await runSeed();
    });

    test('delete author 5', async () => {
        const res = await request(app).delete('/authors/5');
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(5);
        expect(res.body.name).toBe('Valentina Torres');
        expect(res.body.email).toBe('valentina.torres@devspark.io');
        expect(res.body.bio).toBe('Escribe resenas de libros tecnicos');
    });
    test('error ID no es un numero', async()=>{
        const res = await request(app).delete('/authors/abc');
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('integer');
    });
    test('DELETE error al no encontrar ID', async()=>{
        const res = await request(app).delete('/authors/999');
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toContain('not found');
    });
    test('Check delete author', async()=>{
        const res = await request(app).get('/authors/5');
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toContain('not found');
    });
});

describe('NOEXISTE/authors', () => {

    beforeAll(async () => {
        await runSeed();
    });

    test ('ruta no existe', async () =>{
        const res = await request(app).get('/noexiste');
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toContain('not found');
    });
});

describe('Query y body con valores que no son string', () => {
    test('GET con email repetido', async () => {
        const res = await request(app).get('/authors?email=abc&email=d@e.com');
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Invalid email format');
    });

    test('GET con name repetido', async () => {
        const res = await request(app).get('/authors?name=a&name=b');
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('String');
    });

    test('GET con name vacio', async () => {
        const res = await request(app).get('/authors').query({name: ''});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Name is required');
    });

    test('GET con name solo espacios', async () => {
        const res = await request(app).get('/authors').query({name: '     '});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Name is required');
    });

    test('POST con email como arreglo', async () => {
        const res = await request(app).post('/authors').send({name: 'Test', email: ['test@example.com']});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Invalid email format');
    });

    test('PUT con email como arreglo', async () => {
        const res = await request(app).put('/authors/5').send({name: 'Test', email: ['test@example.com']});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Invalid email format');
    });

    test('PATCH con email como arreglo', async () => {
        const res = await request(app).patch('/authors/5').send({email: ['test@example.com']});
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Invalid email format');
    });
});

describe('JSON malformado', () => {

    test('POST con JSON roto responde 400', async () => {
        const res = await request(app)
            .post('/authors')
            .set('Content-Type', 'application/json')
            .send('{"name": "Juan", ');
        expect(res.statusCode).toBe(400);
    });
});

afterAll(async () => {
    await runSeed();
    await pool.end();
});
