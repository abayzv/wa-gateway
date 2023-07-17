"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const baileys_1 = __importStar(require("@whiskeysockets/baileys"));
const fs = __importStar(require("fs"));
async function waGateway(user) {
    const { state, saveCreds } = await (0, baileys_1.useMultiFileAuthState)(`wa-state/${user}`);
    const sock = (0, baileys_1.default)({
        version: [2, 2323, 4],
        auth: state,
        printQRInTerminal: true,
    });
    sock.ev.on("creds.update", saveCreds);
    return sock;
}
class Wa {
    constructor() {
        this.qrCode = "";
        this.status = "close";
    }
    async connect(user) {
        this.client = await waGateway(user);
        this.client.ev.on("connection.update", async (update) => {
            var _a, _b;
            const { qr, connection, lastDisconnect } = update;
            this.qrCode = qr;
            if (connection === "close") {
                const shouldReconnect = ((_b = (_a = lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode) !==
                    baileys_1.DisconnectReason.loggedOut;
                console.log("connection closed due to ", lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error, ", reconnecting ", shouldReconnect);
                // reconnect if not logged out
                if (shouldReconnect) {
                    waGateway(user);
                }
                this.status = "close";
            }
            else if (connection === "open") {
                console.log("opened connection");
                this.status = "open";
            }
        });
        const userInfo = await this.client.user;
        if (!userInfo) {
            this.status = "connecting";
        }
        this.profile = Object.assign(Object.assign({}, userInfo), { user });
    }
    async sendMessage(number, message) {
        // if number first ist 0, replace with 62
        if (number[0] === "0") {
            number = number.replace("0", "62");
        }
        const id = `${number}@s.whatsapp.net`;
        try {
            const sentMsg = await this.client.sendMessage(id, {
                text: message,
            });
            return sentMsg;
        }
        catch (error) {
            console.log(error);
        }
    }
    async sendTemplateMessage(number, message, list) {
        // if number first ist 0, replace with 62
        if (number[0] === "0") {
            number = number.replace("0", "62");
        }
        const id = `${number}@s.whatsapp.net`;
        const templateMessage = {
            text: message,
            footer: "mahesadev.com",
            templateButtons: list,
        };
        try {
            const sendMsg = await this.client.sendMessage(id, templateMessage);
            return sendMsg;
        }
        catch (error) {
            console.log(error);
        }
    }
    async sendImage(number, message, imageUrl) {
        // if number first ist 0, replace with 62
        if (number[0] === "0") {
            number = number.replace("0", "62");
        }
        const id = `${number}@s.whatsapp.net`;
        try {
            const sentMsg = await this.client.sendMessage(id, {
                caption: message,
                image: { url: imageUrl },
            });
            return sentMsg;
        }
        catch (error) {
            console.log(error);
        }
    }
    async logout() {
        // delete session file from wa-state folder
        const { user } = this.profile;
        const path = `wa-state/${user}`;
        fs.rmSync(path, { recursive: true });
        return {
            message: "Success logout from server",
            isLogout: true,
        };
    }
}
// class Wa {
//   client: any;
//   session: Array<Session>;
//   public constructor() {
//     this.client = null;
//     this.session = [];
//   }
//   async connect(user: string) {
//     if (this.session.length) {
//       const isExist = this.session.find((item) => item.user === user);
//       if (isExist) {
//         return "User allready connected, please check status for more information";
//       }
//     }
//     this.client = await waGateway(user);
//     const userSession: Session = {
//       user,
//       status: "",
//       qrCode: "",
//     };
//     this.client.ev.on("connection.update", async (update: any) => {
//       const { qr, connection } = update;
//       if (qr) {
//         userSession.qrCode = qr;
//       }
//       if (connection) {
//         userSession.status = connection;
//       }
//     });
//     this.session.push(userSession);
//     return "Success init connection for user " + user;
//   }
//   async sendMessage(number: string, message: string) {
//     // if number first ist 0, replace with 62
//     if (number[0] === "0") {
//       number = number.replace("0", "62");
//     }
//     const id = `${number}@s.whatsapp.net`;
//     try {
//       const sentMsg = await this.client.sendMessage(id, {
//         text: message,
//       });
//       return sentMsg;
//     } catch (error) {
//       console.log(error);
//     }
//   }
// }
exports.default = Wa;
//# sourceMappingURL=whatsapp.services.js.map