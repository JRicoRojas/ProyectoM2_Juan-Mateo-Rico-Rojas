import { describe, vi, test, expect } from "vitest";
import { validateId, validateEmail, validateString, validateBio, validateAuthorBody, validateAuthorPatch, validateBoolean, validatePostsBody, validatePostPatch, validateCommentsBody, validateCommentPatch, validateAuthorId, validatePostId, validatePostsQuery, validateCommentsQuery } from "../errors/validators";

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
        expect(()=>validateBio(111)).toThrow("Bio should be a 'String'");
    });

    test ('No acepta bio solo espacios', () =>{
        expect(()=>validateBio('       ')).toThrow('Bio is required');
    });
    test ('No acepta bio null', () =>{
        expect(()=>validateBio(null)).toThrow("Bio should be a 'String'");
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
    test('author_id cero', () => {
        const next = vi.fn();
        const req = {body: {title: 'Test title', content: 'test content', author_id: 0}};
        expect(() => validatePostsBody(req, {}, next)).toThrow('Author ID should be a positive integer');
        expect(next).not.toHaveBeenCalled();
    });
});

describe('validateString con valores falsy', () => {
    test.each([[0], [false]])('rechaza %j como tipo incorrecto, no como vacio', (valor) => {
        expect(() => validateString(valor, 'Name')).toThrow("Name should be a 'String'");
    });
});

describe('validateAuthorId y validatePostId', () => {
    test('acepta un entero positivo', () => {
        expect(() => validateAuthorId(1)).not.toThrow();
        expect(() => validatePostId(1)).not.toThrow();
    });
    test.each([[undefined], [null]])('falta (%j) lanza required', (valor) => {
        expect(() => validateAuthorId(valor)).toThrow('Author ID is required');
        expect(() => validatePostId(valor)).toThrow('Post ID is required');
    });
    test.each([[0], [-1], [1.5], ['abc'], ['1'], [true]])('rechaza %j como entero positivo', (valor) => {
        expect(() => validateAuthorId(valor)).toThrow('Author ID should be a positive integer');
        expect(() => validatePostId(valor)).toThrow('Post ID should be a positive integer');
    });
});

describe('validateCommentsBody', () => {
    const validBody = () => ({content: 'Buen post', author_id: 1, post_id: 1});

    test('body completo llama a next', () => {
        const next = vi.fn();
        validateCommentsBody({body: validBody()}, {}, next);
        expect(next).toHaveBeenCalledOnce();
    });
    test('sin content', () => {
        const next = vi.fn();
        const body = validBody(); delete body.content;
        expect(() => validateCommentsBody({body}, {}, next)).toThrow('Content is required');
        expect(next).not.toHaveBeenCalled();
    });
    test('content solo espacios', () => {
        const next = vi.fn();
        const body = {...validBody(), content: '     '};
        expect(() => validateCommentsBody({body}, {}, next)).toThrow('Content is required');
        expect(next).not.toHaveBeenCalled();
    });
    test('content que no es string', () => {
        const next = vi.fn();
        const body = {...validBody(), content: 123};
        expect(() => validateCommentsBody({body}, {}, next)).toThrow("Content should be a 'String'");
        expect(next).not.toHaveBeenCalled();
    });
    test('sin author_id', () => {
        const next = vi.fn();
        const body = validBody(); delete body.author_id;
        expect(() => validateCommentsBody({body}, {}, next)).toThrow('Author ID is required');
        expect(next).not.toHaveBeenCalled();
    });
    test('sin post_id', () => {
        const next = vi.fn();
        const body = validBody(); delete body.post_id;
        expect(() => validateCommentsBody({body}, {}, next)).toThrow('Post ID is required');
        expect(next).not.toHaveBeenCalled();
    });
    test('author_id letras', () => {
        const next = vi.fn();
        const body = {...validBody(), author_id: 'abc'};
        expect(() => validateCommentsBody({body}, {}, next)).toThrow('Author ID should be a positive integer');
        expect(next).not.toHaveBeenCalled();
    });
    test('post_id cero', () => {
        const next = vi.fn();
        const body = {...validBody(), post_id: 0};
        expect(() => validateCommentsBody({body}, {}, next)).toThrow('Post ID should be a positive integer');
        expect(next).not.toHaveBeenCalled();
    });
    test('post_id decimal', () => {
        const next = vi.fn();
        const body = {...validBody(), post_id: 1.5};
        expect(() => validateCommentsBody({body}, {}, next)).toThrow('Post ID should be a positive integer');
        expect(next).not.toHaveBeenCalled();
    });
    test('request sin body', () => {
        const next = vi.fn();
        expect(() => validateCommentsBody({}, {}, next)).toThrow('Content is required');
        expect(next).not.toHaveBeenCalled();
    });
});

describe('validateCommentPatch', () => {
    test.each([
        [{content: 'nuevo contenido'}],
        [{author_id: 2}],
        [{post_id: 2}],
        [{content: 'nuevo', author_id: 2}],
        [{content: 'nuevo', post_id: 2}],
        [{author_id: 2, post_id: 2}],
        [{content: 'nuevo', author_id: 2, post_id: 2}],
    ])('body %j llama a next', (body) => {
        const next = vi.fn();
        validateCommentPatch({body}, {}, next);
        expect(next).toHaveBeenCalledOnce();
    });
    test('body vacio', () => {
        const next = vi.fn();
        expect(() => validateCommentPatch({body: {}}, {}, next)).toThrow('At least one field is required');
        expect(next).not.toHaveBeenCalled();
    });
    test('request sin body', () => {
        const next = vi.fn();
        expect(() => validateCommentPatch({}, {}, next)).toThrow('At least one field is required');
        expect(next).not.toHaveBeenCalled();
    });
    test('content solo espacios', () => {
        const next = vi.fn();
        expect(() => validateCommentPatch({body: {content: '     '}}, {}, next)).toThrow('Content is required');
        expect(next).not.toHaveBeenCalled();
    });
    test('content que no es string', () => {
        const next = vi.fn();
        expect(() => validateCommentPatch({body: {content: 123}}, {}, next)).toThrow("Content should be a 'String'");
        expect(next).not.toHaveBeenCalled();
    });
    test('author_id invalido', () => {
        const next = vi.fn();
        expect(() => validateCommentPatch({body: {author_id: -1}}, {}, next)).toThrow('Author ID should be a positive integer');
        expect(next).not.toHaveBeenCalled();
    });
    test('post_id invalido', () => {
        const next = vi.fn();
        expect(() => validateCommentPatch({body: {post_id: 'abc'}}, {}, next)).toThrow('Post ID should be a positive integer');
        expect(next).not.toHaveBeenCalled();
    });
});

describe('validatePostsQuery', () => {
    test('sin filtros llama a next', () => {
        const next = vi.fn();
        validatePostsQuery({query: {}}, {}, next);
        expect(next).toHaveBeenCalledOnce();
    });
    test('filtros validos llaman a next', () => {
        const next = vi.fn();
        validatePostsQuery({query: {author_id: '1', published: 'false', title: 'git'}}, {}, next);
        expect(next).toHaveBeenCalledOnce();
    });
    test.each([['abc'], ['0'], ['-1'], ['1.5'], [''], [['1', '2']]])('author_id %j lanza error', (valor) => {
        const next = vi.fn();
        expect(() => validatePostsQuery({query: {author_id: valor}}, {}, next)).toThrow('Author ID should be a positive integer');
        expect(next).not.toHaveBeenCalled();
    });
    test.each([['maybe'], ['1'], ['TRUE'], ['']])('published %j lanza error', (valor) => {
        const next = vi.fn();
        expect(() => validatePostsQuery({query: {published: valor}}, {}, next)).toThrow("Published should be 'true' or 'false'");
        expect(next).not.toHaveBeenCalled();
    });
});

describe('validateCommentsQuery', () => {
    test('sin filtros llama a next', () => {
        const next = vi.fn();
        validateCommentsQuery({query: {}}, {}, next);
        expect(next).toHaveBeenCalledOnce();
    });
    test('filtros validos llaman a next', () => {
        const next = vi.fn();
        validateCommentsQuery({query: {author_id: '1', post_id: '2'}}, {}, next);
        expect(next).toHaveBeenCalledOnce();
    });
    test.each([['abc'], ['0'], ['-1'], ['1.5'], ['']])('author_id %j lanza error', (valor) => {
        const next = vi.fn();
        expect(() => validateCommentsQuery({query: {author_id: valor}}, {}, next)).toThrow('Author ID should be a positive integer');
        expect(next).not.toHaveBeenCalled();
    });
    test.each([['abc'], ['0'], ['-1'], ['1.5'], ['']])('post_id %j lanza error', (valor) => {
        const next = vi.fn();
        expect(() => validateCommentsQuery({query: {post_id: valor}}, {}, next)).toThrow('Post ID should be a positive integer');
        expect(next).not.toHaveBeenCalled();
    });
});