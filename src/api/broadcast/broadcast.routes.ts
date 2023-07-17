import express from "express";
import { checkSchema, validationResult, matchedData } from "express-validator";
import { isPermited, isAuthenticated } from "../../middlewares";
import { viewAllBroadcasts, createBroadcast } from "./broadcast.services";

const router = express.Router();

router.get(
  "/",
  isAuthenticated,
  isPermited,
  async (req: any, res: any, next: any) => {
    const query = {
      name: req.query.name,
      page: req.query.page,
      show: req.query.show,
    };

    const userId = req.payload.userId;

    try {
      const data = await viewAllBroadcasts(query, userId);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
