"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRefreshToken = void 0;
function sendRefreshToken(res, token) {
    res.cookie("refresh_token", token, {
        httpOnly: true,
        sameSite: true,
        path: "/api/v1/auth",
    });
}
exports.sendRefreshToken = sendRefreshToken;
//# sourceMappingURL=sendRefreshToken.js.map