import { describe, test, expect } from "vitest";
import request from 'supertest';
import app from '../app.js';

describe('GET /', () => {
    test('responde con la informacion de la API', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe('MiniBlog API');
        expect(res.body.docs).toBe('/api-docs');
        expect(res.body.endpoints).toEqual({
            authors: '/authors',
            posts: '/posts',
            comments: '/comments',
        });
    });

    test('los endpoints que lista existen', async () => {
        const res = await request(app).get('/');
        for (const ruta of Object.values(res.body.endpoints)) {
            const respuesta = await request(app).get(ruta);
            expect(respuesta.statusCode).not.toBe(404);
        }
    });

    test('la documentacion que lista responde', async () => {
        const res = await request(app).get('/api-docs/');
        expect(res.statusCode).toBe(200);
    });
});
