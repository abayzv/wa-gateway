import express from "express";
import { checkSchema, validationResult, matchedData } from "express-validator";
import { isPermited, isAuthenticated, activityLogger } from "../../middlewares";
import {
  viewAllContacts,
  viewContact,
  createContact,
  updateContact,
  deleteContact,
  findContactByName,
} from "./contact.services";

const router = express.Router();

// Validation Rules
const rules = {
  name: {
    notEmpty: {
      errorMessage: "Name is required",
    },
    isLength: {
      options: { min: 3 },
      errorMessage: "Name must be at least 3 characters long",
    },
  },
  phoneNumber: {
    notEmpty: {
      errorMessage: "Phone is required",
    },
    isLength: {
      options: { min: 10 },
      errorMessage: "Phone must be at least 10 characters long",
    },
    // custom validator, phone must start with 62
    custom: {
      options: (value: string) => {
        return value.startsWith("62");
      },
      errorMessage: "Phone must start with 62",
    },
  },
};

const editRules = {
  name: {
    optional: true,
    isLength: {
      options: { min: 3 },
      errorMessage: "Name must be at least 3 characters long",
    },
  },
  phoneNumber: {
    optional: true,
    isLength: {
      options: { min: 10 },
      errorMessage: "Phone must be at least 10 characters long",
    },
    // custom validator, phone must start with 62
    custom: {
      options: (value: string) => {
        return value.startsWith("62");
      },
    },
  },
};

// View All Contacts
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
      const data = await viewAllContacts(query, userId);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
);

// View Contact
router.get(
  "/:id",
  isAuthenticated,
  isPermited,
  async (req: any, res: any, next: any) => {
    try {
      const data = await viewContact(req.params.id);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
);

// Create Contact
router.post(
  "/",
  isAuthenticated,
  isPermited,
  checkSchema(rules),
  async (req: any, res: any, next: any) => {
    // get user auth id

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json(errors);
      }
      const data = matchedData(req);

      const isExist = await findContactByName(data.name);
      if (isExist)
        return res.status(422).json({ message: "Contact already exist" });

      const contactData = {
        user: req.payload.userId,
        name: data.name,
        phoneNumber: data.phoneNumber,
        group: data.group,
      };

      const contact = await createContact(contactData);
      res.json(contact);
    } catch (error) {
      next(error);
    }
  }
);

// delete Contact
router.delete(
  "/:id",
  isAuthenticated,
  isPermited,
  async (req: any, res: any, next: any) => {
    const isExist = await viewContact(req.params.id);
    if (!isExist) return res.status(404).json({ message: "Contact not found" });

    try {
      const data = await deleteContact(req.params.id);
      res.json({
        message: "Contact deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
