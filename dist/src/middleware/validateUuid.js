"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidUUID = exports.validateUUID = void 0;
const validateUUID = (req, res, next) => {
    const uuid = req.params.uuid;
    const detail = req.params.detail;
    if (uuid.toLowerCase() !== 'me') {
        if (!(0, exports.isValidUUID)(uuid))
            return res.status(400).json({ detail: 'Invalid UUID' });
    }
    if (detail && !(0, exports.isValidUUID)(detail))
        return res.status(400).json({ detail: 'Invalid UUID' });
    next();
};
exports.validateUUID = validateUUID;
const isValidUUID = (uuid) => {
    const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    return regexExp.test(uuid);
};
exports.isValidUUID = isValidUUID;
