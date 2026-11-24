import { describe, vi, test, expect } from "vitest";
import { validateId, validateEmail, validateString, validateBio, validateAuthorBody, validateAuthorPatch, validateBoolean, validatePostsBody, validatePostPatch } from "../errors/validators";

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

    test('Acepta sin bio', () =>{
        expect(()=> validateBio(undefined)).not.toThrow();
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

describe('validateBoolean', () =>{
    test('Pasa sin boolean', () => {
        expect(()=> validateBoolean(undefined)).not.toThrow();
    });
    test ('Pasa un boolean true',()=>{
        expect(()=> validateBoolean(true)).not.toThrow();
    });
    test ('Pasa un boolean false', () => {
        expect (()=> validateBoolean(false)).not.toThrow();
    });
    test ('No pasa un string', () => {
        expect (()=>validateBoolean('true', 'Published')).toThrow("Published should be a 'Boolean'");
    });
    test ('No pasa un number', () => {
        expect (()=>validateBoolean(123, 'Published')).toThrow("Published should be a 'Boolean'");
    });
});

describe('validatePostsBody', () => {
    test ('Pasa un post body', () => {
        const next = vi.fn();
        const req = {body :{title : 'Test title', content: 'test content', published : true, author_id : 1}};
        validatePostsBody(req,{},next)
        expect(next).toHaveBeenCalledOnce();
    });
    test ('Pasa un post body sin published', () => {
        const next = vi.fn();
        const req = {body :{title : 'Test title', content: 'test content', author_id : 1}};
        validatePostsBody(req,{},next)
        expect(next).toHaveBeenCalledOnce();
    });
    test ('No pasa un post body sin author_id', () => {
        const next = vi.fn();
        const req = {body :{title : 'Test title', content: 'test content', published : true}};
        expect(()=>validatePostsBody(req,{},next)).toThrow("Author ID is required");

    });
    test ('No pasa un post body author_id letras', () => {
        const next = vi.fn();
        const req = {body :{title : 'Test title', content: 'test content', published : true, author_id : 'true'}};
        expect(()=>validatePostsBody(req,{},next)).toThrow("Author ID should be a positive integer");
    });
    test ('No pasa un post body sin title', () => {
        const next = vi.fn();
        const req = {body :{content: 'test content', published : true, author_id : 1}};
        expect(()=>validatePostsBody(req,{},next)).toThrow("Title is required");
    });
    test ('No pasa un post body sin content', () => {
        const next = vi.fn();
        const req = {body :{title : 'Test title', published : true, author_id : 1}};
        expect(()=>validatePostsBody(req,{},next)).toThrow("Content is required");
    });
});
describe('validatePostPatch', ()=>{
    test('patch con todos los valores para cambiar pasa',()=>{
        const next = vi.fn();
        const req = {body :{title: 'test', content: 'content test', content: 'test content', published : true, author_id : 1}};
        validatePostPatch(req, {}, next);
        expect(next).toHaveBeenCalledOnce();
    });
        test('patch con todos los solo title',()=>{
        const next = vi.fn();
        const req = {body :{title: 'test'}};
        validatePostPatch(req, {}, next);
        expect(next).toHaveBeenCalledOnce();
    });
    test('patch con todos los solo content',()=>{
        const next = vi.fn();
        const req = {body :{content: 'content test'}};
        validatePostPatch(req, {}, next);
        expect(next).toHaveBeenCalledOnce();
    });
    test('patch con todos los solo published',()=>{
        const next = vi.fn();
        const req = {body :{published : true}};
        validatePostPatch(req, {}, next);
        expect(next).toHaveBeenCalledOnce();
    });
    test('patch con todos los solo author_ID',()=>{
        const next = vi.fn();
        const req = {body :{author_id : 1}};
        validatePostPatch(req, {}, next);
        expect(next).toHaveBeenCalledOnce();
    });
    test('patch con title y content',()=>{
        const next = vi.fn();
        const req = {body :{title: 'test', content: 'content test'}};
        validatePostPatch(req, {}, next);
        expect(next).toHaveBeenCalledOnce();
    });
    test('patch con title y published',()=>{
        const next = vi.fn();
        const req = {body :{title: 'test', published : true}};
        validatePostPatch(req, {}, next);
        expect(next).toHaveBeenCalledOnce();
    });
    test('patch con title y author_id',()=>{
        const next = vi.fn();
        const req = {body :{title: 'test', author_id : 1}};
        validatePostPatch(req, {}, next);
        expect(next).toHaveBeenCalledOnce();
    });
    test('patch con content y published',()=>{
        const next = vi.fn();
        const req = {body :{content: 'test', published : true}};
        validatePostPatch(req, {}, next);
        expect(next).toHaveBeenCalledOnce();
    });
    test('patch con content y author_id',()=>{
        const next = vi.fn();
        const req = {body :{content: 'test', author_id : 1}};
        validatePostPatch(req, {}, next);
        expect(next).toHaveBeenCalledOnce();
    });
    test('patch con published y author_id',()=>{
        const next = vi.fn();
        const req = {body :{published: true, author_id : 1}};
        validatePostPatch(req, {}, next);
        expect(next).toHaveBeenCalledOnce();
    });
    test('No deja sin body',()=>{
        const next = vi.fn();
        const req = {body :{}};
        expect(() => validatePostPatch(req, {}, next)).toThrow('At least one field is required');
        expect(next).not.toHaveBeenCalled();
    });
});