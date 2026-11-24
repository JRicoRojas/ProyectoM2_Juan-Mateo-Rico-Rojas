import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { errorHandler } from "../errors/errorHandler";
import { badRequest, notFound } from "../errors/errors";

function mockRes() {
    const res = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
}

describe('errorHandler', () => {
    beforeEach(() => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test('usa el code entero como status (badRequest)', () => {
        const res = mockRes();
        errorHandler(badRequest('test'), {}, res, vi.fn());
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'test' });
    });

    test('usa el code entero como status (notFound)', () => {
        const res = mockRes();
        errorHandler(notFound('no existe'), {}, res, vi.fn());
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'no existe' });
    });

    test('error sin code responde 500 con su mensaje', () => {
        const res = mockRes();
        errorHandler(new Error('algo fallo'), {}, res, vi.fn());
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'algo fallo' });
    });

    test('code no entero (string de pg) responde 500', () => {
        const res = mockRes();
        const err = new Error('conexion rechazada');
        err.code = 'ECONNREFUSED';
        errorHandler(err, {}, res, vi.fn());
        expect(res.status).toHaveBeenCalledWith(500);
    });

    test('usa err.status cuando no hay code entero (ej. JSON roto de express.json)', () => {
        const res = mockRes();
        const err = new Error('Unexpected end of JSON input');
        err.status = 400;
        errorHandler(err, {}, res, vi.fn());
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Unexpected end of JSON input' });
    });

    test('err.status fuera de rango 4xx/5xx se ignora y responde 500', () => {
        const res = mockRes();
        const err = new Error('raro');
        err.status = 200;
        errorHandler(err, {}, res, vi.fn());
        expect(res.status).toHaveBeenCalledWith(500);
    });

    test('error sin mensaje usa "Internal server error"', () => {
        const res = mockRes();
        errorHandler(new Error(''), {}, res, vi.fn());
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });

    test('constraint conocida (authors_email_key) responde 409', () => {
        const res = mockRes();
        const err = new Error('llave duplicada viola restriccion de unicidad «authors_email_key»');
        err.code = '23505';
        err.constraint = 'authors_email_key';
        errorHandler(err, {}, res, vi.fn());
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ error: 'Author email already exists' });
    });

    test('constraint conocida (posts_author_id_fkey) responde 400', () => {
        const res = mockRes();
        const err = new Error('insercion o actualizacion en la tabla «posts» viola la llave foranea «posts_author_id_fkey»');
        err.code = '23503';
        err.constraint = 'posts_author_id_fkey';
        errorHandler(err, {}, res, vi.fn());
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Author does not exist' });
    });

    test('constraint desconocida cae al flujo normal (500)', () => {
        const res = mockRes();
        const err = new Error('otra restriccion');
        err.code = '23505';
        err.constraint = 'otra_constraint';
        errorHandler(err, {}, res, vi.fn());
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'otra restriccion' });
    });
});
