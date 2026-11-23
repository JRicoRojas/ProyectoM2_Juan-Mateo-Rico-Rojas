import { describe, vi, test, expect } from "vitest";
import { validateId, validateEmail, validateString, validateBio, validateAuthorBody, validateAuthorPatch } from "../errors/validators";

describe('validateId', () => {
    test('ID valido llama next', () => {
        const next = vi.fn();
        validateId({ params: { id: '1' } }, {}, next);
        expect(next).toHaveBeenCalledOnce();
    });
    
    test('ID inválido lanza error', () => {
        const next = vi.fn();
        expect(() => validateId({ params: { id: 'abc' } }, {}, next)).toThrow('ID should be a positive integer');
        expect(next).not.toHaveBeenCalled();
    });
});

describe('validateEmail', () =>{
    test ('Acepta email valido', () =>{
        expect(()=>validateEmail('test@test.com')).not.toThrow();
    });

    test ('Rechaza email sin dominio', ()=>{
        expect(()=>validateEmail('abc@')).toThrow('Invalid email format');
    });

    test ('Rechaza email sin @', ()=>{
        expect(()=>validateEmail('abc.com')).toThrow('Invalid email format');
    });

    test ('Rechaza email sin .com', ()=>{
        expect(()=>validateEmail('abc@com')).toThrow('Invalid email format');
    });
});

describe('validateName', () => {
    test ('Acepta name valido', () =>{
        expect(()=>validateString('Juan Mateo Rico Rojas')).not.toThrow();
    });
    test ('Rechaza name no string', ()=>{
        expect(()=>validateString(1, 'Name')).toThrow("Name should be a 'String'");
    });
    test ('Rechaza name no string', ()=>{
        expect(()=>validateString('', 'Name')).toThrow('Name is required');
    });
    test ('Rechaza name no string', ()=>{
        expect(()=>validateString('      ', 'Name')).toThrow('Name is required');
    });
});

describe('validateBio', ()=>{
    test ('Acepta bio valida', () =>{
        expect(()=>validateBio('Test bio only with string 123123')).not.toThrow();
    });

    test ('No acepta bio sin texto', () =>{
        expect(()=>validateBio(111)).toThrow('Bio should be a "String"');
    });

    test ('No acepta bio solo espacios', () =>{
        expect(()=>validateBio('       ')).toThrow('Bio is required');
    });
});

describe('validateAuthorBody', ()=>{
    test('body completo llama a next', ()=>{
        const next = vi.fn();
        const req = {body: {name: 'test', email: 'test@test.com', bio: 'test bio test'}};
        validateAuthorBody(req, {}, next);
        expect(next).toHaveBeenCalledOnce();
    });
    test ('bio es opcional', ()=>{
        const next = vi.fn();
        const req = {body: {name: 'test', email: 'test@test.com'}};
        validateAuthorBody(req, {}, next);
        expect(next).toHaveBeenCalledOnce();
    });
    
    test ('No deja sin name',()=>{
        const next = vi.fn();
        const req = {body: { email: 'test@test.com'}};
        expect(() => validateAuthorBody(req, {}, next)).toThrow('Name is required');
        expect(next).not.toHaveBeenCalled();
    });

    test ('No deja sin email',()=>{
        const next = vi.fn();
        const req = {body: { name: 'test'}};
        expect(() => validateAuthorBody(req, {}, next)).toThrow('Email is required');
        expect(next).not.toHaveBeenCalled();
    });

        test ('No deja sin body',()=>{
        const next = vi.fn();
        const req = {body: {}};
        expect(() => validateAuthorBody(req, {}, next)).toThrow('Name is required');
        expect(next).not.toHaveBeenCalled();
    });
});

describe('validateAuthorPatch', ()=>{
    test('patch con todos los valores para cambiar pasa',()=>{
        const next = vi.fn();
        const req = {body :{name: 'test', email: 'test@test.com', bio: 'este es un test de bio'}};
        validateAuthorPatch(req, {}, next);
        expect(next).toHaveBeenCalledOnce();
    });
        test('patch con todos los solo name',()=>{
        const next = vi.fn();
        const req = {body :{name: 'test'}};
        validateAuthorPatch(req, {}, next);
        expect(next).toHaveBeenCalledOnce();
    });
    test('patch con todos los solo email',()=>{
        const next = vi.fn();
        const req = {body :{email: 'test@test.com'}};
        validateAuthorPatch(req, {}, next);
        expect(next).toHaveBeenCalledOnce();
    });
    test('patch con todos los solo bio',()=>{
        const next = vi.fn();
        const req = {body :{bio: 'este es un test de bio'}};
        validateAuthorPatch(req, {}, next);
        expect(next).toHaveBeenCalledOnce();
    });
    test('patch con name y email',()=>{
        const next = vi.fn();
        const req = {body :{name: 'test', email: 'test@test.com'}};
        validateAuthorPatch(req, {}, next);
        expect(next).toHaveBeenCalledOnce();
    });
    test('patch con name y bio',()=>{
        const next = vi.fn();
        const req = {body :{name: 'test', bio: 'este es un test de bio'}};
        validateAuthorPatch(req, {}, next);
        expect(next).toHaveBeenCalledOnce();
    });
    test('patch con email y bio',()=>{
        const next = vi.fn();
        const req = {body :{email: 'test@test.com', bio: 'este es un test de bio'}};
        validateAuthorPatch(req, {}, next);
        expect(next).toHaveBeenCalledOnce();
    });
    test('No deja sin body',()=>{
        const next = vi.fn();
        const req = {body :{}};
        expect(() => validateAuthorPatch(req, {}, next)).toThrow('At least one field is required');
        expect(next).not.toHaveBeenCalled();
    });
});