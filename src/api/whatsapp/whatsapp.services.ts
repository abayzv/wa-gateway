import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";

async function waGateway(user: string) {
  const { state, saveCreds } = await useMultiFileAuthState(`wa-state/${user}`);

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;
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

      if (qr) {
        console.log("qr code", qr);
      }
    } else if (connection === "open") {
      console.log("opened connection");
    }
  });

  sock.ev.on("messages.upsert", async (m) => {
    console.log(JSON.stringify(m, undefined, 2));

    console.log("replying to", m.messages[0].key.remoteJid);
    await sock.sendMessage(m.messages[0].key.remoteJid!, {
      text: "Hello there!",
    });
  });

  sock.ev.on("creds.update", saveCreds);
}

class Wa {
  constructor(user: string) {
    this.user = user;
  }

  user: string;

  async connect() {
    await waGateway(this.user);
  }

  async getQrCode() {}
}

export default Wa;
