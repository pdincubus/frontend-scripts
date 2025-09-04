import { veryBadPasswords, badPasswords } from "../utilities/general/forbiddenPasswords.js";

type OverallScore = {
   strength: number,
   complexity: string,
}

type PasswordStrengthValues = {
    obviousPatterns: Object,
    obviousSequentialAlpha: Object,
    obviousSequentialNumbers: Object,
    obviousSequentialSymbols: Object,
    scoreModifications: Object,
    scoreDeductions: Object,
    meetsBaseRequirements: Object,
    keywordDeductions: Object,
    scoreBonuses: Object,
    rollingScore: Object,
    overallValues: Object,
    outputs: Object,
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
    private commonPasswordsStrict: Array<string>;
    private commonPasswordsMediumStrict: Array<string>;

	constructor (
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
        sequentialAlphaCharsString = "abcdefghijklmnopqrstuvwxyz",
        sequentialNumbersString = "01234567890",
        sequentialSymbolsString = "!\"£#$%&'()*+,-./:;<=>?@[\]^_`{|}~",
        //commonPasswordsStrict = ['love','123456','baby','fuck','dog','password','qwerty','angel','big','alex','sexy','monkey','jack','dragon','daniel','asdf','jess','bull','jesus'],
        commonPasswordsStrict = veryBadPasswords,
        //commonPasswordsMediumStrict = ['cat']
        commonPasswordsMediumStrict = badPasswords,
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

    public checkPassword (passwordValue: string): PasswordStrengthValues {
        let startingScore = (passwordValue.length * this.characterMultiplier) as number;

        // Loop through password to check for Symbol, Numeric, Lowercase and Uppercase pattern matches
        const obviousPatterns = this.checkObviousPatterns(passwordValue);
        // Check for sequential alpha string patterns (forward and reverse)
        const obviousSequentialAlpha = this.checkObviousSequentialAlphaStringPatterns(passwordValue);
        // Check for sequential numeric string patterns (forward and reverse)
        const obviousSequentialNumbers = this.checkObviousSequentialNumericPatterns(passwordValue);
        // Check for sequential symbol string patterns (forward and reverse)
        const obviousSequentialSymbols = this.checkObviousSequentialSymbolPatterns(passwordValue);

        // General point assignment
        const scoreModifications = this.scoreModificationUsageVsRequirements(
            passwordValue,
            obviousPatterns.uppercaseLetters,
            obviousPatterns.lowercaseLetters,
            obviousPatterns.numbers,
            obviousPatterns.symbols,
            obviousPatterns.midCharacters
        );

        // Point deductions for poor practices
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
            obviousSequentialSymbols,
        );

        // Determine if mandatory requirements have been met and set image indicators accordingly
        const meetsBaseRequirements = this.checkMeetsBaseRequirements(
            passwordValue.length,
            obviousPatterns.uppercaseLetters,
            obviousPatterns.lowercaseLetters,
            obviousPatterns.numbers,
            obviousPatterns.symbols,
        );

        // Make sure we're not using any obvious common words
        const keywordDeductions = this.checkKeywordMatches(passwordValue);
        // Determine if additional bonuses need to be applied and set image indicators accordingly
        const scoreBonuses = this.scoreBonuses(obviousPatterns.midCharacters);

        const rollingScore = (startingScore + scoreModifications + scoreDeductions + meetsBaseRequirements + keywordDeductions + scoreBonuses);

        // Work out overall strength and complexity values to use in visualisation
        const overallValues = this.determineComplexity(rollingScore);

        // What we're actually using on screen for people
        const outputs = this.calculateOutputs(passwordValue, rollingScore, overallValues.strength, overallValues.complexity);

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
            outputs,
        };
    }

    private checkObviousPatterns (passwordValue: string) {
        let uppercaseLetters = 0 as number;
        let consecutiveUppercase = 0 as number;
        let rollingUppercaseLettersTotal = 0 as number;

        let lowercaseLetters = 0 as number;
        let consecutiveLowercase = 0 as number;
        let rollingLowercaseLettersTotal = 0 as number;

        let numbers = 0 as number;
        let consecutiveNumbers = 0 as number;
        let rollingNumbersTotal = 0 as number;

        let symbols = 0 as number;
        let consecutiveSymbols = 0 as number;
        let rollingSymbolsTotal = 0 as number;

        let repeatingIncrements = 0 as number;
        let repeatingCharacters = 0 as number;
        let uniqueCharacters = 0 as number;
        let midCharacters = 0 as number;
        let consecutiveCharacters = 0 as number;

        const passwordLength = passwordValue.length as number;
        const arrPwd = passwordValue.replace(/\s+/g,"").split(/\s*/) as Array<string>;

        for (let a = 0; a < arrPwd.length; a += 1) {
            // Check for uppercase letters
			if (arrPwd[a].match(/[A-Z]/g)) {
                if ((rollingUppercaseLettersTotal + 1) === a) {
                    consecutiveUppercase += 1;
                    consecutiveCharacters += 1;
                }

				rollingUppercaseLettersTotal = a;
				uppercaseLetters += 1;
			}

            if (arrPwd[a].match(/[a-z]/g)) {
                // Check for lowercase letters
				if ((rollingLowercaseLettersTotal + 1) == a) {
                    consecutiveLowercase += 1;
                    consecutiveCharacters += 1;
                }

				rollingLowercaseLettersTotal = a;
				lowercaseLetters += 1;
			}

            if (arrPwd[a].match(/[0-9]/g)) {
                // Check for numbers
				if (a > 0 && a < (passwordLength - 1)) {
                    midCharacters += 1;
                }

				if ((rollingNumbersTotal + 1) === a) {
                    consecutiveNumbers += 1;
                    consecutiveCharacters += 1;
                }

				rollingNumbersTotal = a;
				numbers += 1;
			}

            if (arrPwd[a].match(/[!"£#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~]/g)) {
                // Check for all manner of symbols
				if (a > 0 && a < (passwordLength - 1)) {
                    midCharacters += 1;
                }

				if ((rollingSymbolsTotal + 1) === a) {
                    consecutiveSymbols += 1;
                    consecutiveCharacters += 1;
                }

				rollingSymbolsTotal = a;
				symbols += 1;
			}

			// Internal loop through password to check for repeat characters
			let bCharExists = false;

            for (let b = 0; b < passwordLength; b += 1) {
				if (
                    (arrPwd[a] === passwordValue[b])
                    && (a !== b)
                ) {
					bCharExists = true;

					// Calculate increment deduction based on proximity to identical characters
                    // Deduction is incremented each time a new match is discovered
                    // Deduction amount is based on total password length divided by the
                    // difference of distance between currently selected match
					repeatingIncrements += Math.abs(passwordLength / (b - a));
				}
			}

			if (bCharExists) {
				repeatingCharacters += 1;
				uniqueCharacters = (passwordLength - repeatingCharacters);
				repeatingIncrements = (uniqueCharacters > 0) ? Math.ceil(repeatingIncrements / uniqueCharacters) : Math.ceil(repeatingIncrements);
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
        };
    }

    private checkObviousSequentialAlphaStringPatterns(passwordValue: string): number {
        let obviousSequentialAlpha = 0 as number;

        for (let s = 0; s < 23; s += 1) {
			const forwardStr = this.sequentialAlphaCharsString.substring(s, s + 3);
			const reverseStr = this.stringReverse(forwardStr);

            if (
                passwordValue.toLowerCase().includes(forwardStr)
                || passwordValue.toLowerCase().includes(reverseStr)
            ) {
                obviousSequentialAlpha += 1;
            }
		}

        return obviousSequentialAlpha;
    }

    private checkObviousSequentialNumericPatterns(passwordValue: string): number {
        let obviousSequentialNumbers = 0 as number;

        for (let s = 0; s < 8; s += 1) {
			const forwardStr = this.sequentialNumbersString.substring(s, s + 3);
			const reverseStr = this.stringReverse(forwardStr);

            if (
                passwordValue.toLowerCase().includes(forwardStr)
                || passwordValue.toLowerCase().includes(reverseStr)
            ) {
                obviousSequentialNumbers += 1;
            }
		}

        return obviousSequentialNumbers;
    }

    private checkObviousSequentialSymbolPatterns(passwordValue: string): number {
        let sequentialSymbols = 0 as number;

        for (let s = 0; s < 8; s += 1) {
			const forwardStr = this.sequentialSymbolsString.substring(s, s + 3);
			const reverseStr = this.stringReverse(forwardStr);

            if (
                passwordValue.toLowerCase().includes(forwardStr)
                || passwordValue.toLowerCase().includes(reverseStr)
            ) {
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
        let rollingScore = 0 as number;

		if (
            uppercaseLetters > 0
            && uppercaseLetters < passwordValue.length
        ) {
			rollingScore = rollingScore + ((passwordValue.length - uppercaseLetters) * 2);
		}

		if (
            lowercaseLetters > 0
            && lowercaseLetters < passwordValue.length
        ) {
			rollingScore = rollingScore + ((passwordValue.length - lowercaseLetters) * 2);
		}

		if (
            numbers > 0
            && numbers < passwordValue.length
        ) {
			rollingScore = rollingScore + (numbers * this.numberMultiplier);
		}

		if (symbols > 0) {
			rollingScore = rollingScore + (symbols * this.symbolMultiplier);
		}

		if (midCharacters > 0) {
			rollingScore = rollingScore + (midCharacters * this.numMidChars);
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
        sequentialSymbols: number,
    ): number {
        let rollingDeductions = 0 as number;
        let alphaCharsOnly = 0 as number;
        let numbersOnly = 0 as number;

        // Only Letters
		if (
            (lowercaseLetters > 0 || uppercaseLetters > 0)
            && symbols === 0
            && numbers === 0
        ) {
			rollingDeductions = rollingDeductions - passwordValue.length;
			alphaCharsOnly = passwordValue.length;
		}

        // Only Numbers
		if (
            lowercaseLetters === 0
            && uppercaseLetters === 0
            && symbols === 0
            && numbers > 0
        ) {
			rollingDeductions = rollingDeductions - passwordValue.length;
			numbersOnly = passwordValue.length;
		}

        // Same character exists more than once
		if (repeatingCharacters > 0) {
			rollingDeductions = rollingDeductions - repeatingIncrements;
		}

        // Consecutive Uppercase Letters exist
		if (consecutiveUppercase > 0) {
			rollingDeductions = rollingDeductions - (consecutiveUppercase * this.consecutiveUppercaseChars);
		}

        // Consecutive Lowercase Letters exist
		if (consecutiveLowercase > 0) {
			rollingDeductions = rollingDeductions - (consecutiveLowercase * this.consecutiveLowercaseChars);
		}

        // Consecutive Numbers exist
		if (consecutiveNumbers > 0) {
			rollingDeductions = rollingDeductions - (consecutiveNumbers * this.consecutiveNumbers);
		}

        // Sequential alpha strings exist (3 characters or more)
		if (sequentialAlphaChars > 0) {
			rollingDeductions = rollingDeductions - (sequentialAlphaChars * this.sequentialAlphaChars);
		}

        // Sequential numeric strings exist (3 characters or more)
		if (sequentialNumbers > 0) {
			rollingDeductions = rollingDeductions - (sequentialNumbers * this.sequentialNumbers);
		}

        // Sequential symbol strings exist (3 characters or more)
		if (sequentialSymbols > 0) {
			rollingDeductions = rollingDeductions - (sequentialSymbols * this.sequentialSymbols);
		}

        return rollingDeductions;
    }

    private checkMeetsBaseRequirements(
        passwordLength: number,
        uppercaseLetters: number,
        lowercaseLetters: number,
        numbers: number,
        symbols: number,
    ): number {
		const arrChars = [passwordLength, uppercaseLetters, lowercaseLetters, numbers, symbols];
		const arrCharsIds = ["passwordLength", "uppercaseLetters", "lowercaseLetters", "numbers", "symbols"];
		const arrCharsLen = arrChars.length;

        let minVal = 0 as number;
        let nReqChar = 0 as number;
        let nRequirements = 0 as number;
        let nMinReqChars = 0 as number;
        let runningScore = 0 as number;

		for (let c = 0; c < arrCharsLen; c += 1) {
			if (arrCharsIds[c] == "passwordLength") {
                minVal = this.minLength - 1;
            } else {
                minVal = 0;
            }

			if (arrChars[c] === minVal + 1) {
				nReqChar += 1;
			} else if (arrChars[c] > (minVal + 1)) {
				nReqChar += 1;
			}
		}

		nRequirements = nReqChar;

		if (passwordLength >= this.minLength) {
            nMinReqChars = 3;
        } else {
            nMinReqChars = 4;
        }

        // One or more required characters exist
        if (nRequirements > nMinReqChars) {
			runningScore = runningScore + (nRequirements * 2);
		}

        return runningScore;
    }

    private checkKeywordMatches(passwordValue: string): number {
		if (this.matchKeyword(passwordValue.toLowerCase(), this.commonPasswordsStrict)) {
            return -60;
        } else if (this.matchKeyword(passwordValue.toLowerCase(), this.commonPasswordsMediumStrict)) {
            return -20;
        }

        return 0;
    }

    private scoreBonuses(midCharacters: number): number {
        let nRequirements = 0 as number;
        let nMinReqChars = 0 as number;
        let runningScore = 0 as number

		const arrChars = [midCharacters, nRequirements];
		const arrCharsIds = ["midCharacters", "nRequirements"];
		const arrCharsLen = arrChars.length;

		for (let c = 0; c < arrCharsLen; c += 1) {
			if (arrCharsIds[c] == "nRequirements") {
                runningScore = nMinReqChars;
            } else {
                runningScore = 0;
            }
		}

        return runningScore;
    }

    private determineComplexity(runningScore: number): OverallScore {
        let passwordStrength = 0 as number;
        let passwordComplexity = '' as string;

		if (runningScore > 100) {
            runningScore = 100;
        }

        if (runningScore < 0) {
            runningScore = 0;
        }

        if (runningScore >= 80) {
            passwordStrength = 5;
            passwordComplexity = "Very Strong";
        } else if (runningScore >= 60) {
            passwordStrength = 4;
            passwordComplexity = "Strong";
        } else if (runningScore >= 40) {
            passwordStrength = 3;
            passwordComplexity = "Good";
        } else if (runningScore >= 20) {
            passwordStrength = 2;
            passwordComplexity = "Weak";
        } else if (runningScore >= 0)  {
            passwordStrength = 1;
            passwordComplexity = "Very Weak";
        } else {
            passwordStrength = 0;
            passwordComplexity = "Unacceptable";
        }

        return {
            strength: passwordStrength,
            complexity: passwordComplexity,
        }
    }

    private calculateOutputs(passwordValue: string, runningScore: number, currentStrength: number, currentComplexity: string): Object {
        let isValid = false as boolean;
        let errorMessage = '' as string;

        if (passwordValue.length < this.minLength) {
            runningScore = 0;
            currentComplexity = "Too Short";
            isValid = false;
            errorMessage = `Your password must be at least ${this.minLength} characters.`;
        } else if (passwordValue.length > this.maxLength) {
            runningScore = 0;
            currentComplexity = "Too Long";
            isValid = false;
            errorMessage = `Password must be at most ${this.maxLength} characters.`;
        } else if (!passwordValue.match(this.regexTest)) {
            isValid = false;
            errorMessage = "Password can only contain letters, numbers and these<br>special characters: !&#x22;&#xA3;#$%&#x26;&#x27;()*+,-./:;&#x3C;=&#x3E;?@[&#x5C;\]^_&#x60;{|}~";
        } else if (
            (passwordValue.toLowerCase() === "password")
            && (window.location.hostname.substring(0,3).toLowerCase() !== "www")
        ) {
            isValid = true;
            errorMessage = '';
        } else if (currentStrength < 3) {
            isValid = false;
            errorMessage = "Please choose a more secure password. You may want to try adding special characters or numbers";
        } else {
            isValid = true;
            errorMessage = '';
        }

        return {
            strength: currentStrength,
            score: runningScore,
            currentComplexity,
            isValid,
            errorMessage,
        };
    }

    private matchKeyword(sWord: string, aList: Array<string>) {
        for(let i = 0; i < aList.length; i += 1) {
            if((sWord).indexOf((aList[i])) != -1) {
                return true;
            }
        }

        return false;
    }

    private stringReverse(stringToReverse: string): string {
        let newString = '';

        for (var s = 0; s < stringToReverse.length; s += 1) {
            newString = stringToReverse.charAt(s) + newString;
        }

        return newString;
    }
}