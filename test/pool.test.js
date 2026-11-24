import { describe, test, expect, afterAll } from "vitest";
import pool from '../db/config.js';

describe('pool de conexiones', () => {
    afterAll(async () => {
        await pool.end();
    });

    test('tiene un listener para errores de conexiones inactivas', () => {
        // Sin listener, un error en una conexion inactiva tumba el proceso de Node
        expect(pool.listenerCount('error')).toBeGreaterThan(0);
    });
});
