import { describe, test, expect } from "vitest";
import { validateId, validateEmail, validateName,validateBio,validateAuthorBody,validateAuthorPatch } from "../errors/validators";

describe('validateId',() => {
    test('Get valid ID',()=>{
        expect(validateId(1)).toBe(null);
    });
});