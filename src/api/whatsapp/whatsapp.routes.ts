import express from "express";
import Wa from "./whatsapp.services";

const router = express.Router();

router.get("/connect/:user", async (req: any, res: any, next: any) => {
  const { user } = req.params;

  try {
    await new Wa(user).connect();
    res.json({ message: `Connected to WhatsApp ${user}` });
  } catch (error) {
    next(error);
  }
});

export default router;
