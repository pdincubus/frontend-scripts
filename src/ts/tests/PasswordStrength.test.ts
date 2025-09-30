import { describe, it, expect } from 'vitest';
import { PasswordStrength } from '../global/PasswordStrength';

function build() {
    return new PasswordStrength(
        undefined, // regex
        8,         // min
        64,        // max
        2, 2, 2, 2,  // numMidChars, cons penalties
        3, 3, 3,     // sequential penalties
        4, 4, 6,     // multipliers
        'abcdefghijklmnopqrstuvwxyz',
        '0123456789',
        '!"£#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~',
        ['password', 'letmein', 'qwerty'],
        ['football', 'monkey']
    );
}

describe('PasswordStrength.checkPassword', () => {
    it('flags sequential alpha, numbers, and symbols', () => {
        const ps = build();
        // flags sequential alpha, numbers, and symbols
        // abc  → alpha forward
        // 321  → numbers reverse (from 123)
        // #$%  → symbols forward (contiguous in your table)
        const res = ps.checkPassword('xxabcXX321#$%');

        expect(res.obviousSequentialAlpha).toBeGreaterThanOrEqual(1);
        expect(res.obviousSequentialNumbers).toBeGreaterThanOrEqual(1);
        expect(res.obviousSequentialSymbols).toBeGreaterThanOrEqual(1);

        expect(typeof res.scoreDeductions).toBe('number');
    });

    it('does not count repeated symbols as a sequential symbol run', () => {
        const ps = build();
        const res = ps.checkPassword('!!!AAAA111'); // repeats, not a sequence

        expect(res.obviousSequentialSymbols).toBe(0);
    });

    it('rejects too short passwords and sets Too Short', () => {
        const ps = build();
        const res = ps.checkPassword('Ab1!');

        expect(res.outputs.isValid).toBe(false);
        expect(res.outputs.currentComplexity).toBe('Too Short');
        expect(res.outputs.score).toBe(0);
    });

    it('rejects invalid characters via regex', () => {
        const ps = build();
        const res = ps.checkPassword('Bad space here 123');

        expect(res.outputs.isValid).toBe(false);
        expect(res.outputs.errorMessage).toContain('Password can only contain');
    });

    it('applies heavy penalty for strict common passwords', () => {
        const ps = build();
        const withKeyword = ps.checkPassword('Abc123!xpassword');
        const withoutKeyword = ps.checkPassword('Abc123!xy');

        expect(withKeyword.keywordDeductions).toBeLessThanOrEqual(-20);
        expect(withoutKeyword.rollingScore).toBeGreaterThan(withKeyword.rollingScore);
        expect(withoutKeyword.overallValues.strength).toBeGreaterThanOrEqual(
            withKeyword.overallValues.strength
        );
    });

    it('rewards mid numbers and symbols compared with edge-only placement', () => {
        const ps = build();
        const edgey = ps.checkPassword('!A1bcdefg!');
        const mid = ps.checkPassword('A!1bcdefg!');

        expect(mid.rollingScore).toBeGreaterThan(edgey.rollingScore);
    });

    it('awards a combo bonus when both mid numbers and mid symbols exist', () => {
        const ps = build();
        const onlyNumMid = ps.checkPassword('Ab1cdefgh');
        const numsAndSymsMid = ps.checkPassword('Ab!1cdefg');

        expect(numsAndSymsMid.rollingScore).toBeGreaterThan(onlyNumMid.rollingScore);
    });

    it('respects a hard cap on bonuses to avoid runaway scores', () => {
        const ps = build();
        const a = ps.checkPassword('AA!!!111!!!bbbCCC');
        const b = ps.checkPassword('AA!!!111!!!bbbCCCC');

        expect(b.rollingScore - a.rollingScore).toBeLessThanOrEqual(2);
    });

    it('mixed password is Good or better', () => {
        const ps = build();
        const res = ps.checkPassword('A9b!cDe#12');

        expect(res.outputs.isValid).toBe(true);
        expect(['Good', 'Strong', 'Very Strong']).toContain(res.overallValues.complexity);
        expect(res.overallValues.strength).toBeGreaterThanOrEqual(3);
    });

    it('penalises repeating characters', () => {
        const ps = build();
        const rep = ps.checkPassword('AAAaaa111!!!bbb');

        expect(rep.obviousPatterns.repeatingCharacters).toBeGreaterThan(0);
        expect(rep.scoreDeductions).toBeLessThanOrEqual(0);
    });

    it('detects sequential numbers correctly with the fixed sequence string', () => {
        const ps = build();
        const res = ps.checkPassword('xx012xyz');

        expect(res.obviousSequentialNumbers).toBeGreaterThanOrEqual(1);
    });
});