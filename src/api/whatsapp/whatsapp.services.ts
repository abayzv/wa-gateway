import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import * as fs from "fs";

async function waGateway(user: string) {
  const { state, saveCreds } = await useMultiFileAuthState(`wa-state/${user}`);

  const sock = makeWASocket({
    version: [2, 2323, 4],
    auth: state,
    printQRInTerminal: true,
  });

  sock.ev.on("creds.update", saveCreds);

  return sock;
}

export interface WaGateway {
  client: any;
  qrCode: string;
  status: string;
  profile: any;
  sendMessage(number: string, message: string): Promise<any>;
  sendTemplateMessage(number: string, message: string, list: any): Promise<any>;
  sendImage(number: string, message: string, imageUrl: string): Promise<any>;
  logout(): Promise<any>;
}

class Wa implements WaGateway {
  public client: any;
  public qrCode: string;
  public status: string;
  public profile: any;

  public constructor() {
    this.qrCode = "";
    this.status = "close";
  }

  async connect(user: string) {
    this.client = await waGateway(user);
    this.client.ev.on("connection.update", async (update: any) => {
      const { qr, connection, lastDisconnect } = update;
      this.qrCode = qr;

      if (connection === "close") {
        const shouldReconnect =
          (lastDisconnect?.error as Boom)?.output?.statusCode !==
          DisconnectReason.loggedOut;
        console.log(
          "connection closed due to ",
          lastDisconnect?.error,
          ", reconnecting ",
          shouldReconnect
        );
        // reconnect if not logged out
        if (shouldReconnect) {
          waGateway(user);
        }

        this.status = "close";
      } else if (connection === "open") {
        console.log("opened connection");
        this.status = "open";
      }
    });

    const userInfo = await this.client.user;

    if (!userInfo) {
      this.status = "connecting";
    }

    this.profile = {
      ...userInfo,
      user,
    };
  }

  async sendMessage(number: string, message: string) {
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
    } catch (error) {
      console.log(error);
    }
  }

  async sendTemplateMessage(number: string, message: string, list: any) {
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
    } catch (error) {
      console.log(error);
    }
  }

  async sendImage(number: string, message: string, imageUrl: string) {
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
    } catch (error) {
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

export default Wa;
