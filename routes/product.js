import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import { uploadFiles } from "../middleware/multer.js";
import {
  deleteProduct,
  getAllProduct,
  getSingleProduct,
  productController,
  updateProduct,
} from "../controller/productController.js";

const router = express.Router();

router.post("/product/create", isAuth, uploadFiles, productController);
router.get("/product/getallproduct", getAllProduct);
router.get("/product/singleproduct/:id", getSingleProduct);
router.post("/product/deleteproduct/:id", isAuth, deleteProduct);
router.post("/product/updateproduct/:id",isAuth, uploadFiles, updateProduct);

export default router;
