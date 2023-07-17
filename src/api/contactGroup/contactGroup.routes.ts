import express from "express";
import { checkSchema, validationResult, matchedData } from "express-validator";
import { isPermited, isAuthenticated, activityLogger } from "../../middlewares";
import {
  viewAllContactGroups,
  addContactGroup,
  deleteContactGroup,
  findContactGrupByName,
  findContactGroupById,
} from "./contactGroup.services";

const router = express.Router();

const rules = {
  name: {
    isString: true,
    isLength: {
      options: { min: 3 },
      errorMessage: "Name must be at least 3 characters long",
    },
  },
  description: {
    isString: true,
    isLength: {
      options: { min: 3 },
      errorMessage: "Description must be at least 3 characters long",
    },
  },
};

// View All Contact Groups
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
      const data = await viewAllContactGroups(query, userId);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
);

// Add Contact Group
router.post(
  "/",
  isAuthenticated,
  isPermited,
  checkSchema(rules),
  async (req: any, res: any, next: any) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json(errors);
      }
      const data = matchedData(req);

      const isExist = await findContactGrupByName(data.name);
      if (isExist)
        return res.status(422).json({ message: "Contact group already exist" });

      const contactGroupData = {
        user: req.payload.userId,
        name: data.name,
        description: data.description,
      };

      const contactGroup = await addContactGroup(contactGroupData);
      res.json(contactGroup);
    } catch (error) {
      next(error);
    }
  }
);

// Delete Contact Group
router.delete(
  "/:id",
  isAuthenticated,
  isPermited,
  async (req: any, res: any, next: any) => {
    const contactGroup = await findContactGroupById(req.params.id);
    if (!contactGroup)
      return res.status(404).json({ message: "Contact group not found" });

    try {
      const data = await deleteContactGroup(req.params.id);
      res.json({ message: "Contact group deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
