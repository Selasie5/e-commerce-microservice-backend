import express from "express";
import userRoutes from "./userRoute";
// import productRoutes from "./productRoutes";

const router = express.Router();

// Service-specific routes
router.use("/users", userRoutes);
// router.use("/products", productRoutes);

export default router;
