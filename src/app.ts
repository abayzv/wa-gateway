import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import dotenv from "dotenv";

import { notFound, errorHandler } from "./middlewares";
import router from "./api";

// @ts-ignore
import swaggerUi from "swagger-ui-express";
import { swaggerConfig } from "./config/swagger";

dotenv.config();

const app: express.Application = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

// swagger
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerConfig));

// app.use(activityLogger);

app.use("/api/v1", router);

app.use(notFound);
app.use(errorHandler);

export default app;
