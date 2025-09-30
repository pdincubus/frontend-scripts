import { veryBadPasswords, badPasswords } from '../utilities/general/forbiddenPasswords.js';

type OverallScore = {
    strength: number;
    complexity: string;
};

type ObviousPatterns = {
    uppercaseLetters: number;
    consecutiveUppercase: number;
    lowercaseLetters: number;
    consecutiveLowercase: number;
    numbers: number;
    consecutiveNumbers: number;
    symbols: number;
    consecutiveSymbols: number;
    repeatingCharacters: number;
    uniqueCharacters: number;
    repeatingIncrements: number;
    consecutiveCharacters: number;
    midCharacters: number;
    midNumbers: number;
    midSymbols: number;
};

type Outputs = {
    strength: number;
    score: number;
    currentComplexity: string;
    isValid: boolean;
    errorMessage: string;
};

type PasswordStrengthValues = {
    obviousPatterns: ObviousPatterns;
    obviousSequentialAlpha: number;
    obviousSequentialNumbers: number;
    obviousSequentialSymbols: number;
    scoreModifications: number;
    scoreDeductions: number;
    meetsBaseRequirements: number;
    keywordDeductions: number;
    scoreBonuses: number;
    rollingScore: number;
    overallValues: OverallScore;
    outputs: Outputs;
};

export class PasswordStrength {
    private regexTest: RegExp;
    private minLength: number;
    private maxLength: number;
    private numMidChars: number;
    private consecutiveUppercaseChars: number;
    private consecutiveLowercaseChars: number;
    private consecutiveNumbers: number;
    private sequentialAlphaChars: number;
    private sequentialNumbers: number;
    private sequentialSymbols: number;
    private characterMultiplier: number;
    private numberMultiplier: number;
    private symbolMultiplier: number;
    private sequentialAlphaCharsString: string;
    private sequentialNumbersString: string;
    private sequentialSymbolsString: string;
    private commonPasswordsStrict: string[];
    private commonPasswordsMediumStrict: string[];

    constructor(
        regexTest = /^[\w!"£#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~]+$/,
        minLength = 8,
        maxLength = 64,
        numMidChars = 2,
        consecutiveUppercaseChars = 2,
        consecutiveLowercaseChars = 2,
        consecutiveNumbers = 2,
        sequentialAlphaChars = 3,
        sequentialNumbers = 3,
        sequentialSymbols = 3,
        characterMultiplier = 4,
        numberMultiplier = 4,
        symbolMultiplier = 6,
        sequentialAlphaCharsString = 'abcdefghijklmnopqrstuvwxyz',
        sequentialNumbersString = '0123456789', // fixed
        sequentialSymbolsString = '!"£#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~',
        commonPasswordsStrict = veryBadPasswords,
        commonPasswordsMediumStrict = badPasswords
    ) {
        this.regexTest = regexTest;
        this.minLength = minLength;
        this.maxLength = maxLength;
        this.numMidChars = numMidChars;
        this.consecutiveUppercaseChars = consecutiveUppercaseChars;
        this.consecutiveLowercaseChars = consecutiveLowercaseChars;
        this.consecutiveNumbers = consecutiveNumbers;
        this.sequentialAlphaChars = sequentialAlphaChars;
        this.sequentialNumbers = sequentialNumbers;
        this.sequentialSymbols = sequentialSymbols;
        this.characterMultiplier = characterMultiplier;
        this.numberMultiplier = numberMultiplier;
        this.symbolMultiplier = symbolMultiplier;
        this.sequentialAlphaCharsString = sequentialAlphaCharsString;
        this.sequentialNumbersString = sequentialNumbersString;
        this.sequentialSymbolsString = sequentialSymbolsString;
        this.commonPasswordsStrict = commonPasswordsStrict;
        this.commonPasswordsMediumStrict = commonPasswordsMediumStrict;
    }

    public checkPassword(passwordValue: string): PasswordStrengthValues {
        const startingScore = passwordValue.length * this.characterMultiplier;

        const obviousPatterns = this.checkObviousPatterns(passwordValue);
        const obviousSequentialAlpha = this.checkObviousSequentialAlphaStringPatterns(passwordValue);
        const obviousSequentialNumbers = this.checkObviousSequentialNumericPatterns(passwordValue);
        const obviousSequentialSymbols = this.checkObviousSequentialSymbolPatterns(passwordValue);

        const scoreModifications = this.scoreModificationUsageVsRequirements(
            passwordValue,
            obviousPatterns.uppercaseLetters,
            obviousPatterns.lowercaseLetters,
            obviousPatterns.numbers,
            obviousPatterns.symbols,
            obviousPatterns.midCharacters
        );

        const scoreDeductions = this.scoreDeductions(
            passwordValue,
            obviousPatterns.uppercaseLetters,
            obviousPatterns.lowercaseLetters,
            obviousPatterns.numbers,
            obviousPatterns.symbols,
            obviousPatterns.repeatingCharacters,
            obviousPatterns.consecutiveUppercase,
            obviousPatterns.consecutiveLowercase,
            obviousPatterns.consecutiveNumbers,
            obviousPatterns.repeatingIncrements,
            obviousSequentialAlpha,
            obviousSequentialNumbers,
            obviousSequentialSymbols
        );

        const meetsBaseRequirements = this.checkMeetsBaseRequirements(
            passwordValue.length,
            obviousPatterns.uppercaseLetters,
            obviousPatterns.lowercaseLetters,
            obviousPatterns.numbers,
            obviousPatterns.symbols
        );

        const keywordDeductions = this.checkKeywordMatches(passwordValue);

        const scoreBonuses = this.scoreBonuses(
            obviousPatterns.midNumbers,
            obviousPatterns.midSymbols
        );

        const rollingScore =
            startingScore +
            scoreModifications +
            scoreDeductions +
            meetsBaseRequirements +
            keywordDeductions +
            scoreBonuses;

        const overallValues = this.determineComplexity(rollingScore);

        const outputs = this.calculateOutputs(
            passwordValue,
            rollingScore,
            overallValues.strength,
            overallValues.complexity
        );

        return {
            obviousPatterns,
            obviousSequentialAlpha,
            obviousSequentialNumbers,
            obviousSequentialSymbols,
            scoreModifications,
            scoreDeductions,
            meetsBaseRequirements,
            keywordDeductions,
            scoreBonuses,
            rollingScore,
            overallValues,
            outputs
        };
    }

    private checkObviousPatterns(passwordValue: string): ObviousPatterns {
        let uppercaseLetters = 0;
        let consecutiveUppercase = 0;
        let rollingUppercaseLettersTotal = -2;

        let lowercaseLetters = 0;
        let consecutiveLowercase = 0;
        let rollingLowercaseLettersTotal = -2;

        let numbers = 0;
        let consecutiveNumbers = 0;
        let rollingNumbersTotal = -2;

        let symbols = 0;
        let consecutiveSymbols = 0;
        let rollingSymbolsTotal = -2;

        let repeatingIncrements = 0;
        let repeatingCharacters = 0;
        let uniqueCharacters = 0;
        let midCharacters = 0;
        let consecutiveCharacters = 0;

        let midNumbers = 0;
        let midSymbols = 0;

        const passwordLength = passwordValue.length;
        const arrPwd = passwordValue.replace(/\s+/g, '').split(/\s*/);

        for (let a = 0; a < arrPwd.length; a += 1) {
            // Uppercase
            if (/[A-Z]/.test(arrPwd[a])) {
                if (rollingUppercaseLettersTotal + 1 === a) {
                    consecutiveUppercase += 1;
                    consecutiveCharacters += 1;
                }

                rollingUppercaseLettersTotal = a;
                uppercaseLetters += 1;
            }

            // Lowercase
            if (/[a-z]/.test(arrPwd[a])) {
                if (rollingLowercaseLettersTotal + 1 === a) {
                    consecutiveLowercase += 1;
                    consecutiveCharacters += 1;
                }

                rollingLowercaseLettersTotal = a;
                lowercaseLetters += 1;
            }

            // Numbers
            if (/[0-9]/.test(arrPwd[a])) {
                if (a > 0 && a < passwordLength - 1) {
                    midCharacters += 1;
                    midNumbers += 1;
                }

                if (rollingNumbersTotal + 1 === a) {
                    consecutiveNumbers += 1;
                    consecutiveCharacters += 1;
                }

                rollingNumbersTotal = a;
                numbers += 1;
            }

            // Symbols
            if (/[!"£#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~]/.test(arrPwd[a])) {
                if (a > 0 && a < passwordLength - 1) {
                    midCharacters += 1;
                    midSymbols += 1;
                }

                if (rollingSymbolsTotal + 1 === a) {
                    consecutiveSymbols += 1;
                    consecutiveCharacters += 1;
                }
                rollingSymbolsTotal = a;
                symbols += 1;
            }

            // Repeats
            let bCharExists = false;

            for (let b = 0; b < passwordLength; b += 1) {
                if (arrPwd[a] === passwordValue[b] && a !== b) {
                    bCharExists = true;
                    repeatingIncrements += Math.abs(passwordLength / (b - a));
                }
            }

            if (bCharExists) {
                repeatingCharacters += 1;
                uniqueCharacters = passwordLength - repeatingCharacters;
                repeatingIncrements =
                    uniqueCharacters > 0
                        ? Math.ceil(repeatingIncrements / uniqueCharacters)
                        : Math.ceil(repeatingIncrements);
            }
        }

        return {
            uppercaseLetters,
            consecutiveUppercase,
            lowercaseLetters,
            consecutiveLowercase,
            numbers,
            consecutiveNumbers,
            symbols,
            consecutiveSymbols,
            repeatingCharacters,
            uniqueCharacters,
            repeatingIncrements,
            consecutiveCharacters,
            midCharacters,
            midNumbers,
            midSymbols
        };
    }

    private checkObviousSequentialAlphaStringPatterns(passwordValue: string): number {
        let obviousSequentialAlpha = 0;

        const lower = passwordValue.toLowerCase();

        for (let s = 0; s < 23; s += 1) {
            const fwd = this.sequentialAlphaCharsString.substring(s, s + 3);
            const rev = this.stringReverse(fwd);

            if (lower.includes(fwd) || lower.includes(rev)) {
                obviousSequentialAlpha += 1;
            }
        }

        return obviousSequentialAlpha;
    }

    private checkObviousSequentialNumericPatterns(passwordValue: string): number {
        let obviousSequentialNumbers = 0;

        const lower = passwordValue.toLowerCase();

        for (let s = 0; s <= this.sequentialNumbersString.length - 3; s += 1) {
            const fwd = this.sequentialNumbersString.substring(s, s + 3);
            const rev = this.stringReverse(fwd);

            if (lower.includes(fwd) || lower.includes(rev)) {
                obviousSequentialNumbers += 1;
            }
        }

        return obviousSequentialNumbers;
    }

    private checkObviousSequentialSymbolPatterns(passwordValue: string): number {
        let sequentialSymbols = 0;

        const lower = passwordValue.toLowerCase();

        for (let s = 0; s <= this.sequentialSymbolsString.length - 3; s += 1) {
            const fwd = this.sequentialSymbolsString.substring(s, s + 3);
            const rev = this.stringReverse(fwd);

            if (lower.includes(fwd) || lower.includes(rev)) {
                sequentialSymbols += 1;
            }
        }

        return sequentialSymbols;
    }

    private scoreModificationUsageVsRequirements(
        passwordValue: string,
        uppercaseLetters: number,
        lowercaseLetters: number,
        numbers: number,
        symbols: number,
        midCharacters: number
    ): number {
        let rollingScore = 0;

        if (uppercaseLetters > 0 && uppercaseLetters < passwordValue.length) {
            rollingScore += (passwordValue.length - uppercaseLetters) * 2;
        }

        if (lowercaseLetters > 0 && lowercaseLetters < passwordValue.length) {
            rollingScore += (passwordValue.length - lowercaseLetters) * 2;
        }

        if (numbers > 0 && numbers < passwordValue.length) {
            rollingScore += numbers * this.numberMultiplier;
        }

        if (symbols > 0) {
            rollingScore += symbols * this.symbolMultiplier;
        }

        if (midCharacters > 0) {
            rollingScore += midCharacters * this.numMidChars;
        }

        return rollingScore;
    }

    private scoreDeductions(
        passwordValue: string,
        uppercaseLetters: number,
        lowercaseLetters: number,
        numbers: number,
        symbols: number,
        repeatingCharacters: number,
        consecutiveUppercase: number,
        consecutiveLowercase: number,
        consecutiveNumbers: number,
        repeatingIncrements: number,
        sequentialAlphaChars: number,
        sequentialNumbers: number,
        sequentialSymbols: number
    ): number {
        let rollingDeductions = 0;

        // Only letters
        if ((lowercaseLetters > 0 || uppercaseLetters > 0) && symbols === 0 && numbers === 0) {
            rollingDeductions -= passwordValue.length;
        }

        // Only numbers
        if (lowercaseLetters === 0 && uppercaseLetters === 0 && symbols === 0 && numbers > 0) {
            rollingDeductions -= passwordValue.length;
        }

        if (repeatingCharacters > 0) {
            rollingDeductions -= repeatingIncrements;
        }

        if (consecutiveUppercase > 0) {
            rollingDeductions -= consecutiveUppercase * this.consecutiveUppercaseChars;
        }

        if (consecutiveLowercase > 0) {
            rollingDeductions -= consecutiveLowercase * this.consecutiveLowercaseChars;
        }

        if (consecutiveNumbers > 0) {
            rollingDeductions -= consecutiveNumbers * this.consecutiveNumbers;
        }

        if (sequentialAlphaChars > 0) {
            rollingDeductions -= sequentialAlphaChars * this.sequentialAlphaChars;
        }

        if (sequentialNumbers > 0) {
            rollingDeductions -= sequentialNumbers * this.sequentialNumbers;
        }

        if (sequentialSymbols > 0) {
            rollingDeductions -= sequentialSymbols * this.sequentialSymbols;
        }

        return rollingDeductions;
    }

    private checkMeetsBaseRequirements(
        passwordLength: number,
        uppercaseLetters: number,
        lowercaseLetters: number,
        numbers: number,
        symbols: number
    ): number {
        const arrChars = [passwordLength, uppercaseLetters, lowercaseLetters, numbers, symbols];
        const arrCharsIds = ['passwordLength', 'uppercaseLetters', 'lowercaseLetters', 'numbers', 'symbols'];

        let nReqChar = 0;

        for (let c = 0; c < arrChars.length; c += 1) {
            const isLength = arrCharsIds[c] === 'passwordLength';
            const minVal = isLength ? this.minLength - 1 : 0;
            if (arrChars[c] === minVal + 1) nReqChar += 1;
            else if (arrChars[c] > minVal + 1) nReqChar += 1;
        }

        const nRequirements = nReqChar;
        const nMinReqChars = passwordLength >= this.minLength ? 3 : 4;

        let runningScore = 0;

        if (nRequirements > nMinReqChars) {
            runningScore += nRequirements * 2;
        }

        return runningScore;
    }

    private checkKeywordMatches(passwordValue: string): number {
        const s = passwordValue.toLowerCase();

        if (this.matchKeyword(s, this.commonPasswordsStrict)) return -60;

        if (this.matchKeyword(s, this.commonPasswordsMediumStrict)) return -20;

        return 0;
    }

    private scoreBonuses(midNumbers: number, midSymbols: number): number {
        const midNumWeight = Math.max(1, Math.floor(this.numberMultiplier / 2)); // softer than main modifier
        const midSymWeight = Math.max(2, Math.floor(this.symbolMultiplier / 2));

        let bonus = midNumbers * midNumWeight + midSymbols * midSymWeight;

        if (midNumbers > 0 && midSymbols > 0) bonus += 2;

        const hardCap = 12;
        return Math.min(bonus, hardCap);
    }

    private determineComplexity(runningScore: number): OverallScore {
        let s = runningScore;

        if (s > 100) s = 100;
        if (s < 0) s = 0;

        if (s >= 80) return { strength: 5, complexity: 'Very Strong' };
        if (s >= 60) return { strength: 4, complexity: 'Strong' };
        if (s >= 40) return { strength: 3, complexity: 'Good' };
        if (s >= 20) return { strength: 2, complexity: 'Weak' };

        return { strength: 1, complexity: 'Very Weak' };
    }

    private calculateOutputs(
        passwordValue: string,
        runningScore: number,
        currentStrength: number,
        currentComplexity: string
    ): Outputs {
        let isValid = false;
        let errorMessage = '';
        let s = runningScore;
        let comp = currentComplexity;

        if (passwordValue.length < this.minLength) {
            s = 0;
            comp = 'Too Short';
            isValid = false;
            errorMessage = `Your password must be at least ${this.minLength} characters.`;
        } else if (passwordValue.length > this.maxLength) {
            s = 0;
            comp = 'Too Long';
            isValid = false;
            errorMessage = `Password must be at most ${this.maxLength} characters.`;
        } else if (!passwordValue.match(this.regexTest)) {
            isValid = false;
            errorMessage =
                'Password can only contain letters, numbers and these<br>special characters: !&#x22;&#xA3;#$%&#x26;&#x27;()*+,-./:;&#x3C;=&#x3E;?@[&#x5C;\\]^_&#x60;{|}~';
        } else if (
            passwordValue.toLowerCase() === 'password' &&
            window.location.hostname.substring(0, 3).toLowerCase() !== 'www'
        ) {
            isValid = true;
            errorMessage = '';
        } else if (currentStrength < 3) {
            isValid = false;
            errorMessage =
                'Please choose a more secure password. You may want to try adding special characters or numbers';
        } else {
            isValid = true;
            errorMessage = '';
        }

        return {
            strength: currentStrength,
            score: s,
            currentComplexity: comp,
            isValid,
            errorMessage
        };
    }

    private matchKeyword(sWord: string, list: string[]): boolean {
        return list.some(w => sWord.includes(w));
    }

    private stringReverse(str: string): string {
        let out = '';

        for (let i = 0; i < str.length; i += 1) {
            out = str.charAt(i) + out;
        }

        return out;
    }
}