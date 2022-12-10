"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPasswordValid = exports.validatePassword = void 0;
const validatePassword = (req, res, next) => {
    const { password } = req.body;
    if (!(0, exports.isPasswordValid)(password))
        return res.status(401).json({ detail: "Invalid credentials" });
    next();
};
exports.validatePassword = validatePassword;
const isPasswordValid = (password) => {
    if (!password)
        return false;
    return true;
};
exports.isPasswordValid = isPasswordValid;
