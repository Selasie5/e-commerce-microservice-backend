import express from "express";
import { forwardRequest } from "../utils/requestForwarder";
import { SERVICE_PORTS } from "../../common/constants";

const router = express.Router();

router.post("/register", (req, res) =>
  forwardRequest(req, res, `${SERVICE_PORTS
.USER_SERVICE}/register`)
);

router.post("/login", (req, res) =>
  forwardRequest(req, res, `${SERVICE_PORTS
.USER_SERVICE}/login`)
);

router.get("/profile", (req, res) =>
  forwardRequest(req, res, `${SERVICE_PORTS
.USER_SERVICE}/profile`)
);

export default router;
