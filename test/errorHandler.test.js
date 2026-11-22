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
        errorHandler(new Error('algo falló'), {}, res, vi.fn());
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'algo falló' });
    });

    test('code no entero (string de pg) responde 500', () => {
        const res = mockRes();
        const err = new Error('conexión rechazada');
        err.code = 'ECONNREFUSED';
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
        const err = new Error('duplicate key value violates unique constraint');
        err.code = '23505';
        err.constraint = 'authors_email_key';
        errorHandler(err, {}, res, vi.fn());
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ error: 'Author email already exists' });
    });

    test('constraint desconocida cae al flujo normal (500)', () => {
        const res = mockRes();
        const err = new Error('otra restricción');
        err.code = '23505';
        err.constraint = 'otra_constraint';
        errorHandler(err, {}, res, vi.fn());
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'otra restricción' });
    });
});
