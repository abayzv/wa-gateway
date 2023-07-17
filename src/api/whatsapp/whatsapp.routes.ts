import express from "express";
import Wa from "./whatsapp.services";
import QRCode from "qrcode";
import { WaGateway } from "./whatsapp.services";
import { isPermited, isAuthenticated } from "../../middlewares";
import { createBroadcast } from "../broadcast/broadcast.services";
import { BroadcastType } from "@prisma/client";

interface Session {
  user: string;
  number: string;
  client: WaGateway;
}

const router = express.Router();
let session: Array<Session> = [];

router.get(
  "/connect/:user",
  isAuthenticated,
  isPermited,
  async (req: any, res: any, next: any) => {
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
  }
);

router.get(
  "/qr-code/:user",
  isAuthenticated,
  isPermited,
  async (req: any, res: any, next: any) => {
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
  }
);

// get status
router.get(
  "/status/:user",
  isAuthenticated,
  isPermited,
  async (req: any, res: any, next: any) => {
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
    const qrCode = await QRCode.toDataURL(isUser.client.qrCode);
    try {
      res.json({ qrcode: qrCode, status: isUser.client.status });
    } catch (error) {
      next(error);
    }
  }
);

// send message
router.post(
  "/send-message/:user",
  isAuthenticated,
  isPermited,
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
      const sentMsg = await isUser.client.sendMessage(number, message);

      const broadcastData = {
        user: req.payload.userId,
        title: "Send Message",
        number: number,
        type: BroadcastType.TEXT,
        status: "success",
        message: message,
      };

      await createBroadcast(broadcastData);

      res.json({ message: sentMsg });
    } catch (error) {
      const broadcastData = {
        user: req.payload.userId,
        title: "Send Message",
        number: number,
        type: BroadcastType.TEXT,
        status: "failed",
        message: message,
      };

      await createBroadcast(broadcastData);
      next(error);
    }
  }
);

// send template message
router.post(
  "/send-template-message/:user",
  isAuthenticated,
  isPermited,
  async (req: any, res: any, next: any) => {
    const { number, message, list } = req.body;

    const { user } = req.params;

    const isUser = session.find((item) => item.user === user);

    if (!isUser)
      return res.json({
        message: "User not found, please connect to server first",
      });

    if (!number || !message || !list)
      return res.json({ message: "Please provide number, message and list" });

    try {
      const sentMsg = await isUser.client.sendTemplateMessage(
        number,
        message,
        list
      );

      const broadcastData = {
        user: req.payload.userId,
        title: "Send Template Message",
        number: number,
        type: BroadcastType.TEMPLATE,
        status: "success",
        message: message,
      };

      await createBroadcast(broadcastData);

      res.json({ message: sentMsg });
    } catch (error) {
      const broadcastData = {
        user: req.payload.userId,
        title: "Send Template Message",
        number: number,
        type: BroadcastType.TEMPLATE,
        status: "failed",
        message: message,
      };

      await createBroadcast(broadcastData);

      next(error);
    }
  }
);

// send template message
router.post(
  "/send-image/:user",
  isAuthenticated,
  isPermited,
  async (req: any, res: any, next: any) => {
    const { number, message, imageUrl } = req.body;

    const { user } = req.params;

    const isUser = session.find((item) => item.user === user);

    if (!isUser)
      return res.json({
        message: "User not found, please connect to server first",
      });

    if (!number || !message || !imageUrl)
      return res.json({
        message: "Please provide number and message and imageUrl",
      });

    try {
      const sentMsg = await isUser.client.sendImage(number, message, imageUrl);

      const broadcastData = {
        user: req.payload.userId,
        title: "Send Image",
        number: number,
        type: BroadcastType.MEDIA,
        status: "success",
        message: message,
        imageUrl: imageUrl,
      };

      await createBroadcast(broadcastData);

      res.json({ message: sentMsg });
    } catch (error) {
      const broadcastData = {
        user: req.payload.userId,
        title: "Send Image",
        number: number,
        type: BroadcastType.MEDIA,
        status: "failed",
        message: message,
        imageUrl: imageUrl,
      };

      await createBroadcast(broadcastData);

      next(error);
    }
  }
);

// logout
router.get(
  "/logout/:user",
  isAuthenticated,
  isPermited,
  async (req: any, res: any, next: any) => {
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
  }
);

// get session
router.get(
  "/session",
  isAuthenticated,
  isPermited,
  async (req: any, res: any, next: any) => {
    try {
      res.json({ session });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
