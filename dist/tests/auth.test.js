import { hashPassword, checkPasswordHash } from "../api/auth.js";
import { describe, it, expect, beforeAll } from "vitest";
describe("Password Hashing", () => {
    const password1 = "correctPassword123!";
    const password2 = "anotherPassword456!";
    let hash1;
    let hash2;
    beforeAll(async () => {
        hash1 = await hashPassword(password1);
        hash2 = await hashPassword(password2);
    });
    it("should return true for the correct password", async () => {
        const result = await checkPasswordHash(password1, hash1);
        expect(result).toBe(true);
    });
    it("should return false due to hash being wrong", async () => {
        const result = await checkPasswordHash(password1, hash2); //wrong hash in db test
        expect(result).toBe(false);
    });
    it("should return false due to incorrect pwd", async () => {
        const result = await checkPasswordHash(password2, hash1); //user puts in wrong password
        expect(result).toBe(false);
    });
    it("should return true for the correct password, diffrent user password/hash", async () => {
        const result = await checkPasswordHash(password2, hash2);
        expect(result).toBe(true);
    });
});
