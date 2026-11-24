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

    test('ID inválido lanza error', () => {
        const next = vi.fn();
        expect(() => validateId({ params: { id: 0 } }, {}, next)).toThrow('ID should be a positive integer');
        expect(next).not.toHaveBeenCalled();
    });

    test('ID inválido lanza error', () => {
        const next = vi.fn();
        expect(() => validateId({ params: { id: -1 } }, {}, next)).toThrow('ID should be a positive integer');
        expect(next).not.toHaveBeenCalled();
    });

        test('ID inválido lanza error', () => {
        const next = vi.fn();
        expect(() => validateId({ params: { id: '' } }, {}, next)).toThrow('ID should be a positive integer');
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

    test ('Rechaza email sin punto en el dominio', ()=>{
        expect(()=>validateEmail('abc@com')).toThrow('Invalid email format');
    });

    test ('Rechaza sin', ()=>{
        expect(()=>validateEmail(undefined)).toThrow('Email is required');
    });
});

describe('validateName', () => {
    test ('Acepta name valido', () =>{
        expect(()=>validateString('Juan Mateo Rico Rojas')).not.toThrow();
    });
    test ('Rechaza name que no es string', ()=>{
        expect(()=>validateString(1, 'Name')).toThrow("Name should be a 'String'");
    });
    test ('Rechaza name vacio', ()=>{
        expect(()=>validateString('', 'Name')).toThrow('Name is required');
    });
    test ('Rechaza name solo espacios', ()=>{
        expect(()=>validateString('      ', 'Name')).toThrow('Name is required');
    });
    test ('Rechaza undefined', ()=>{
        expect(()=>validateString(undefined, 'Name')).toThrow('Name is required');
    });
    test ('Rechaza null', ()=>{
        expect(()=>validateString(null, 'Name')).toThrow('Name is required');
    });
    test ('Rechaza array', ()=>{
        expect(()=>validateString([], 'Name')).toThrow("Name should be a 'String'");
    });
    test ('Rechaza objeto', ()=>{
        expect(()=>validateString({}, 'Name')).toThrow("Name should be a 'String'");
    });
    test ('Rechaza booleano', ()=>{
        expect(()=>validateString(true, 'Name')).toThrow("Name should be a 'String'");
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
    test ('No acepta bio solo espacios', () =>{
        expect(()=>validateBio(null)).toThrow('Bio should be a "String"');
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

    test ('No deja sin name solo espacios',()=>{
        const next = vi.fn();
        const req = {body: { name: '      ', email: 'test@test.com'}};
        expect(() => validateAuthorBody(req, {}, next)).toThrow('Name is required');
        expect(next).not.toHaveBeenCalled();
    });

    test ('No deja sin name no string',()=>{
        const next = vi.fn();
        const req = {body: { name: 123, email: 'test@test.com'}};
        expect(() => validateAuthorBody(req, {}, next)).toThrow("Name should be a 'String'");
        expect(next).not.toHaveBeenCalled();
    });

    test ('No deja sin email',()=>{
        const next = vi.fn();
        const req = {body: { name: 'test'}};
        expect(() => validateAuthorBody(req, {}, next)).toThrow('Email is required');
        expect(next).not.toHaveBeenCalled();
    });

    test ('No deja con email sin formato',()=>{
        const next = vi.fn();
        const req = {body: { name: 'test', email : 'test'}};
        expect(() => validateAuthorBody(req, {}, next)).toThrow('Invalid email format');
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
    test ('No pasa un null', () => {
        expect (()=>validateBoolean(null, 'Published')).toThrow("Published should be a 'Boolean'");
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
        const req = {body :{title: 'test', content: 'test content', published : true, author_id : 1}};
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

    test('patch con published false solo pasa',()=>{
        const next = vi.fn();
        const req = {body :{published : false}};
        validatePostPatch(req, {}, next);
        expect(next).toHaveBeenCalledOnce();
    });
    test('patch con title solo espacios',()=>{
        const next = vi.fn();
        const req = {body :{title : '     '}};
        expect(() => validatePostPatch(req, {}, next)).toThrow('Title is required');
        expect(next).not.toHaveBeenCalled();
    });
    test('patch con content solo espacios',()=>{
        const next = vi.fn();
        const req = {body :{content : '     '}};
        expect(() => validatePostPatch(req, {}, next)).toThrow('Content is required');
        expect(next).not.toHaveBeenCalled();
    });
    test('patch con title que no es string',()=>{
        const next = vi.fn();
        const req = {body :{title : 123}};
        expect(() => validatePostPatch(req, {}, next)).toThrow("Title should be a 'String'");
        expect(next).not.toHaveBeenCalled();
    });
    test('patch con published que no es boolean',()=>{
        const next = vi.fn();
        const req = {body :{published : 'true'}};
        expect(() => validatePostPatch(req, {}, next)).toThrow("Published should be a 'Boolean'");
        expect(next).not.toHaveBeenCalled();
    });
    test('patch con author_id letras',()=>{
        const next = vi.fn();
        const req = {body :{author_id : 'abc'}};
        expect(() => validatePostPatch(req, {}, next)).toThrow('Author ID should be a positive integer');
        expect(next).not.toHaveBeenCalled();
    });
    test('patch con author_id negativo',()=>{
        const next = vi.fn();
        const req = {body :{author_id : -1}};
        expect(() => validatePostPatch(req, {}, next)).toThrow('Author ID should be a positive integer');
        expect(next).not.toHaveBeenCalled();
    });
    test('patch con author_id decimal',()=>{
        const next = vi.fn();
        const req = {body :{author_id : 1.5}};
        expect(() => validatePostPatch(req, {}, next)).toThrow('Author ID should be a positive integer');
        expect(next).not.toHaveBeenCalled();
    });
});

describe('validateId casos limite', () => {
    test.each(['0', '-1', '1.5', ''])('ID "%s" lanza error', (id) => {
        const next = vi.fn();
        expect(() => validateId({ params: { id } }, {}, next)).toThrow('ID should be a positive integer');
        expect(next).not.toHaveBeenCalled();
    });
});

describe('validateEmail casos faltantes', () => {
    test('Rechaza email undefined', () => {
        expect(() => validateEmail(undefined)).toThrow('Email is required');
    });
    test('Rechaza email vacio', () => {
        expect(() => validateEmail('')).toThrow('Email is required');
    });
});

describe('validateString casos faltantes', () => {
    test('Rechaza undefined', () => {
        expect(() => validateString(undefined, 'Name')).toThrow('Name is required');
    });
    test('Rechaza null', () => {
        expect(() => validateString(null, 'Name')).toThrow('Name is required');
    });
    test.each([[[]], [{}], [true]])('Rechaza tipo no string (%j)', (valor) => {
        expect(() => validateString(valor, 'Name')).toThrow("Name should be a 'String'");
    });
    test('El mensaje usa la etiqueta recibida', () => {
        expect(() => validateString('', 'Title')).toThrow('Title is required');
    });
});

describe('validateBio y validateBoolean con null', () => {
    test('validateBio rechaza null', () => {
        expect(() => validateBio(null)).toThrow('Bio should be');
    });
    test('validateBoolean rechaza null', () => {
        expect(() => validateBoolean(null, 'Published')).toThrow("Published should be a 'Boolean'");
    });
});

describe('validateAuthorBody casos de error', () => {
    test('email sin formato', () => {
        const next = vi.fn();
        const req = {body: {name: 'test', email: 'abc'}};
        expect(() => validateAuthorBody(req, {}, next)).toThrow('Invalid email format');
        expect(next).not.toHaveBeenCalled();
    });
    test('name solo espacios', () => {
        const next = vi.fn();
        const req = {body: {name: '     ', email: 'test@test.com'}};
        expect(() => validateAuthorBody(req, {}, next)).toThrow('Name is required');
        expect(next).not.toHaveBeenCalled();
    });
    test('name que no es string', () => {
        const next = vi.fn();
        const req = {body: {name: 123, email: 'test@test.com'}};
        expect(() => validateAuthorBody(req, {}, next)).toThrow("Name should be a 'String'");
        expect(next).not.toHaveBeenCalled();
    });
    test('bio que no es string', () => {
        const next = vi.fn();
        const req = {body: {name: 'test', email: 'test@test.com', bio: 123}};
        expect(() => validateAuthorBody(req, {}, next)).toThrow('Bio should be');
        expect(next).not.toHaveBeenCalled();
    });
    test('request sin body', () => {
        const next = vi.fn();
        expect(() => validateAuthorBody({}, {}, next)).toThrow('Name is required');
        expect(next).not.toHaveBeenCalled();
    });
});

describe('validateAuthorPatch casos de error', () => {
    test('email sin formato', () => {
        const next = vi.fn();
        const req = {body: {email: 'abc'}};
        expect(() => validateAuthorPatch(req, {}, next)).toThrow('Invalid email format');
        expect(next).not.toHaveBeenCalled();
    });
    test('name solo espacios', () => {
        const next = vi.fn();
        const req = {body: {name: '     '}};
        expect(() => validateAuthorPatch(req, {}, next)).toThrow('Name is required');
        expect(next).not.toHaveBeenCalled();
    });
    test('name que no es string', () => {
        const next = vi.fn();
        const req = {body: {name: 123}};
        expect(() => validateAuthorPatch(req, {}, next)).toThrow("Name should be a 'String'");
        expect(next).not.toHaveBeenCalled();
    });
    test('bio que no es string', () => {
        const next = vi.fn();
        const req = {body: {bio: 123}};
        expect(() => validateAuthorPatch(req, {}, next)).toThrow('Bio should be');
        expect(next).not.toHaveBeenCalled();
    });
    test('bio solo espacios', () => {
        const next = vi.fn();
        const req = {body: {bio: '     '}};
        expect(() => validateAuthorPatch(req, {}, next)).toThrow('Bio is required');
        expect(next).not.toHaveBeenCalled();
    });
    test('request sin body', () => {
        const next = vi.fn();
        expect(() => validateAuthorPatch({}, {}, next)).toThrow('At least one field is required');
        expect(next).not.toHaveBeenCalled();
    });
});

describe('validatePostsBody casos de error', () => {
    test('published false pasa', () => {
        const next = vi.fn();
        const req = {body: {title: 'Test title', content: 'test content', published: false, author_id: 1}};
        validatePostsBody(req, {}, next);
        expect(next).toHaveBeenCalledOnce();
    });
    test('title solo espacios', () => {
        const next = vi.fn();
        const req = {body: {title: '     ', content: 'test content', author_id: 1}};
        expect(() => validatePostsBody(req, {}, next)).toThrow('Title is required');
        expect(next).not.toHaveBeenCalled();
    });
    test('content solo espacios', () => {
        const next = vi.fn();
        const req = {body: {title: 'Test title', content: '     ', author_id: 1}};
        expect(() => validatePostsBody(req, {}, next)).toThrow('Content is required');
        expect(next).not.toHaveBeenCalled();
    });
    test('published que no es boolean', () => {
        const next = vi.fn();
        const req = {body: {title: 'Test title', content: 'test content', published: 'true', author_id: 1}};
        expect(() => validatePostsBody(req, {}, next)).toThrow("Published should be a 'Boolean'");
        expect(next).not.toHaveBeenCalled();
    });
    test('author_id negativo', () => {
        const next = vi.fn();
        const req = {body: {title: 'Test title', content: 'test content', author_id: -1}};
        expect(() => validatePostsBody(req, {}, next)).toThrow('Author ID should be a positive integer');
        expect(next).not.toHaveBeenCalled();
    });
    test('author_id decimal', () => {
        const next = vi.fn();
        const req = {body: {title: 'Test title', content: 'test content', author_id: 1.5}};
        expect(() => validatePostsBody(req, {}, next)).toThrow('Author ID should be a positive integer');
        expect(next).not.toHaveBeenCalled();
    });
    test('request sin body', () => {
        const next = vi.fn();
        expect(() => validatePostsBody({}, {}, next)).toThrow('Title is required');
        expect(next).not.toHaveBeenCalled();
    });
});