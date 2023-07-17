"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findRefreshTokenByUserId = exports.revokeTokens = exports.deleteRefreshToken = exports.findRefreshTokenById = exports.addRefreshTokenToWhitelist = void 0;
const db_1 = require("../../utils/db");
const hashToken_1 = require("../../utils/hashToken");
function addRefreshTokenToWhitelist({ jti, refreshToken, userId, }) {
    return db_1.db.refreshToken.create({
        data: {
            id: jti,
            hashedToken: (0, hashToken_1.hashToken)(refreshToken),
            userId,
        },
    });
}
exports.addRefreshTokenToWhitelist = addRefreshTokenToWhitelist;
function findRefreshTokenById(id) {
    return db_1.db.refreshToken.findUnique({
        where: {
            id,
        },
    });
}
exports.findRefreshTokenById = findRefreshTokenById;
function deleteRefreshToken(id) {
    return db_1.db.refreshToken.update({
        where: {
            id,
        },
        data: {
            revoked: true,
        },
    });
}
exports.deleteRefreshToken = deleteRefreshToken;
function revokeTokens(userId) {
    return db_1.db.refreshToken.updateMany({
        where: {
            userId,
        },
        data: {
            revoked: true,
        },
    });
}
exports.revokeTokens = revokeTokens;
// find refreshTokenByUserId
const findRefreshTokenByUserId = (userId) => {
    // find refreshToken by userId and revoked = false
    return db_1.db.refreshToken.findFirst({
        where: {
            userId,
            revoked: false,
        },
    });
};
exports.findRefreshTokenByUserId = findRefreshTokenByUserId;
//# sourceMappingURL=auth.services.js.map