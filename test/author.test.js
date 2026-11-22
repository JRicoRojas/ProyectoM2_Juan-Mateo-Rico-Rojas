import { describe, test, expect, beforeEach, beforeAll, afterAll, afterEach } from "vitest";
import pool from './db/config.js';
import  request  from 'supertest';
import app from '../app.js'
import runSeed from "../db/runSeed.js";

describe ('GET' , ()=>{
    beforeAll(async ()=>{
        await runSeed();
    });
    afterAll(async () => {
    await pool.end();
  });
});