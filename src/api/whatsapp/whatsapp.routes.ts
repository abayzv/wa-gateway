import express from "express";
import Wa from "./whatsapp.services";
import QRCode from "qrcode";
import { WaGateway } from "./whatsapp.services";

interface Session {
  user: string;
  number: string;
  client: WaGateway;
}

const router = express.Router();
let session: Array<Session> = [];

router.get("/connect/:user", async (req: any, res: any, next: any) => {
  const { user } = req.params;

  // check if user allready connect to server
  const isUser = session.find((item) => item.user === user);
  if (isUser)
    return res.json({
      message: "User allready connect to server",
    });

  const client = new Wa();
  try {
    const status = await client.connect(user);
    const number = await client.profile.id;

    const data = { user, number, client };
    session.push(data);
    res.json({
      message: "Success connect to server",
      data: { user: data.user, number: data.number },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/qr-code/:user", async (req: any, res: any, next: any) => {
  const { user } = req.params;

  const isUser = session.find((item) => item.user === user);

  if (!isUser)
    return res.json({
      message: "User not found, please connect to server first",
    });

  if (!isUser.client.qrCode)
    return res.json({
      message: "Please start server before use the QrCode",
    });

  // @ts-ignore
  const qrCode = await QRCode.toDataURL(isUser.client.qrCode);
  try {
    res.json({ qrCode });
  } catch (error) {
    next(error);
  }
});

// get status
router.get("/status/:user", async (req: any, res: any, next: any) => {
  const { user } = req.params;

  const isUser = session.find((item) => item.user === user);

  if (!isUser)
    return res.json({
      message: "User not found, please connect to server first",
    });

  if (isUser.client.status === "open")
    return res.json({
      qrCode: "Device allready connect to server",
      status: isUser.client.status,
    });

  if (isUser.client.status === "close") {
    // delete session
    const index = session.findIndex((item) => item.user === user);
    session.splice(index, 1);

    // reconnect
    const client = new Wa();
    try {
      const status = await client.connect(user);
      const number = await client.profile.id;

      const data = { user, number, client };
      session.push(data);

      if (number) {
        return res.json({
          qrCode: "Device allready connect to server",
          status: client.status,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  // @ts-ignore
  const qrCode = await QRCode.toDataURL(isUser.client.status);
  try {
    res.json({ qrcode: qrCode, status: isUser.client.status });
  } catch (error) {
    next(error);
  }
});

// send message
router.post("/send-message/:user", async (req: any, res: any, next: any) => {
  const { number, message } = req.body;
  const { user } = req.params;

  const isUser = session.find((item) => item.user === user);

  if (!isUser)
    return res.json({
      message: "User not found, please connect to server first",
    });

  if (!number || !message)
    return res.json({ message: "Please provide number and message" });

  try {
    const sentMsg = await isUser.client.sendMessage(number, message);
    res.json({ message: sentMsg });
  } catch (error) {
    next(error);
  }
});

// send template message
router.post(
  "/send-template-message/:user",
  async (req: any, res: any, next: any) => {
    const { number, message } = req.body;

    const { user } = req.params;

    const isUser = session.find((item) => item.user === user);

    if (!isUser)
      return res.json({
        message: "User not found, please connect to server first",
      });

    if (!number || !message)
      return res.json({ message: "Please provide number and message" });

    try {
      const sentMsg = await isUser.client.sendTemplateMessage(number, message);
      res.json({ message: sentMsg });
    } catch (error) {
      next(error);
    }
  }
);

// logout
router.get("/logout/:user", async (req: any, res: any, next: any) => {
  const { user } = req.params;

  const isUser = session.find((item) => item.user === user);

  if (!isUser)
    return res.json({
      message: "User not found, please connect to server first",
    });

  try {
    const index = session.findIndex((item) => item.user === user);

    const wa = session[index];
    const { isLogout } = await wa.client.logout();
    if (!isLogout) return res.json({ message: "Failed logout" });

    session.splice(index, 1);
    res.json({ message: "Success logout" });
  } catch (error) {
    next(error);
  }
});

// get session
router.get("/session", async (req: any, res: any, next: any) => {
  try {
    res.json({ session });
  } catch (error) {
    next(error);
  }
});

export default router;
