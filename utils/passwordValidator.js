// Password rules. Returns a list of problems; an empty list means the password is OK.

const MIN_LENGTH = 8;
const MAX_LENGTH = 72; // bcrypt only uses the first 72 bytes, so longer passwords add nothing

// A few of the most common leaked passwords. Extend this list as needed.
const COMMON_PASSWORDS = new Set([
    "password", "password1", "password123", "12345678", "123456789", "1234567890",
    "qwerty123", "qwertyuiop", "iloveyou", "admin123", "welcome1", "letmein1",
    "abc12345", "football1", "monkey123", "passw0rd", "p@ssw0rd", "p@ssword1",
]);

const validatePassword = (password, userName = "") => {
    const errors = [];

    if (typeof password !== "string") {
        return ["Password must be a string"];
    }
    if (password.length < MIN_LENGTH) {
        errors.push(`Password must be at least ${MIN_LENGTH} characters long`);
    }
    if (Buffer.byteLength(password, "utf8") > MAX_LENGTH) {
        errors.push(`Password must be at most ${MAX_LENGTH} characters long`);
    }
    if (!/[a-z]/.test(password)) {
        errors.push("Password must contain a lowercase letter");
    }
    if (!/[A-Z]/.test(password)) {
        errors.push("Password must contain an uppercase letter");
    }
    if (!/[0-9]/.test(password)) {
        errors.push("Password must contain a number");
    }
    if (!/[^A-Za-z0-9\s]/.test(password)) {
        errors.push("Password must contain a special character (e.g. !@#$%)");
    }
    if (/\s/.test(password)) {
        errors.push("Password must not contain spaces");
    }
    if (/(.)\1\1/.test(password)) {
        errors.push("Password must not repeat the same character 3 times in a row");
    }
    if (userName && password.toLowerCase().includes(userName.toLowerCase())) {
        errors.push("Password must not contain the user name");
    }
    if (COMMON_PASSWORDS.has(password.toLowerCase())) {
        errors.push("Password is too common");
    }

    return errors;
};

module.exports = { validatePassword };
