export const PATTERN_AGENT = [
    /^[A-Za-z](\d{7}|\d{9})$/,     // letter + 7 or 9 digits
    /^[A-Za-z]{2}\d{6}$/,          // two letters + 6 digits
    /^\d{2}[A-Za-z]\d{5}$/,        // two digits + one letter + five digits
    /^\d{4,8}$/                    // 4 to 8 digits
];

export const PATTERN_EMAIL =
    /^[\w.+-]+@([\w-]+\.)+[A-Za-z]{2,24}$/i;