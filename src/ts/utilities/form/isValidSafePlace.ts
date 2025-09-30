export function isValidSafePlace(
  checkString: string,
  safePlaceElem: HTMLInputElement
): boolean {
  if (safePlaceElem.value !== 'Z:Other') return true;
  if (checkString.length === 0) return false;

  // allow: letters, numbers, space, hyphen, apostrophe
  const allowedPattern = /^[0-9A-Za-z \-']+$/; // note the literal space, not \s
  return allowedPattern.test(checkString);
}