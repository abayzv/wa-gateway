import express from "express";
// @ts-ignore
import swaggerUi from "swagger-ui-express";
import { swaggerConfig } from "../config/swagger";

import auth from "./auth/auth.routes";
import users from "./users/users.routes";
import role from "./role/role.routes";
import permission from "./permission/permission.routes";
import whatsapp from "./whatsapp/whatsapp.routes";

const router = express.Router();

router.use("/auth", auth);
router.use("/users", users);
router.use("/roles", role);
router.use("/permissions", permission);
router.use("/wa-gateway", whatsapp);

// Swagger setup

// swagger
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerConfig));

export default router;
