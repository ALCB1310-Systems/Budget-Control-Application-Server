"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmailValid = exports.validateEmail = void 0;
const validateEmail = (req, res, next) => {
    const { email } = req.body;
    if (!email)
        return res
            .status(401)
            .json({ detail: `Invalid credentials` });
    if (email ? !(0, exports.isEmailValid)(email) : null)
        return res
            .status(401)
            .json({ detail: `Invalid credentials` });
    next();
};
exports.validateEmail = validateEmail;
const isEmailValid = (email) => {
    const mailformat = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return mailformat.test(email);
};
exports.isEmailValid = isEmailValid;
