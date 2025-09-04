export function isValidSafePlace(checkString: string, safePlaceElem: HTMLInputElement): boolean {
	const checkOK = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz -'";

	let allValid = true;

	if (safePlaceElem.value === "Z:Other" && checkString.length === 0) {
		return false;
	}

	if (safePlaceElem.value === "Z:Other" && checkString.length !== 0) {
		for (let i = 0; i < checkString.length; i++) {
			let ch = checkString.charAt(i);

			for (let j = 0; j < checkOK.length; j++) {
				if (ch == checkOK.charAt(j)) {
				    break;
                }

                if (j === checkOK.length) {
                    allValid = false;

                    break;
                }
            }
		}
	}

	return allValid;
}