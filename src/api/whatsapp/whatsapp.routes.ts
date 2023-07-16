import express from "express";
import Wa from "./whatsapp.services";
import QRCode from "qrcode";

const router = express.Router();
let wa = new Wa();

router.get("/connect/:user", async (req: any, res: any, next: any) => {
  const { user } = req.params;

  try {
    await wa.connect(user);
    res.json({ message: `Connected to WhatsApp ${user}` });
  } catch (error) {
    next(error);
  }
});

router.get("/qr-code", async (req: any, res: any, next: any) => {
  // @ts-ignore
  const qrCode = await QRCode.toDataURL(wa.qrCode);

  try {
    res.json({ qrCode });
  } catch (error) {
    next(error);
  }
});

export default router;
