import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import webhookRouter from "./webhook.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(webhookRouter);

export default router;
