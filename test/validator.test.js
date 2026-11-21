import { describe, test, expect } from "vitest";
import { validateId, validateEmail, validateName, validateBio, validateAuthorBody, validateAuthorPatch } from "../errors/validators";

describe('validateId', () => {
    test('ID valido llama next', () => {
        const next = vi.fn();
        validateId({ params: { id: '1' } }, {}, next);
        expect(next).toHaveBeenCalledOnce();
    });
    
    test('ID inválido lanza error', () => {
        const next = vi.fn();
        expect(() => validateId({ params: { id: 'abc' } }, {}, next))
            .toThrow('ID should be a positive integer');
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
        expect(()=>validateName('Juan Mateo Rico Rojas')).not.toThrow();
    });
    test ('Rechaza name no string', ()=>{
        expect(()=>validateName(1)).toThrow('Name should be a "String"');
    });
    test ('Rechaza name no string', ()=>{
        expect(()=>validateName('')).toThrow('Name is required');
    });
    test ('Rechaza name no string', ()=>{
        expect(()=>validateName('      ')).toThrow('Name is required');
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
    const next = vi.fn();

});