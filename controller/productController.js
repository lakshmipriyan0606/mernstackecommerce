import { ProductModel } from "../models/ProductModel.js";
import { rm } from "fs";
import { checkAdmin, checkToken } from "../utilis/index.js";
import { responseStatus } from "../utilis/statusFunction.js";

export const productController = async (req, res) => {
  try {
    await checkAdmin(req, res);

    const { title, description, stock, price, category } = req.body;
    const image = req.file;

    if (!title || !description || !stock || !price || !category) {
      const message = "Please provide all required fields";
      await responseStatus(res, 400, false, message);
    }

    if (!image) {
      await responseStatus(res, 400, false, "Please select an image");
    }

    await ProductModel.create({
      title,
      description,
      stock,
      price,
      category,
      image: image?.path,
    });

    await responseStatus(res, 201, true, "New product created");
  } catch (error) {
    await responseStatus(res, 400, false, error.message);
  }
};

export const getAllProduct = async (req, res) => {
  try {
    const token = req.headers.token;
    await checkToken(token, res);
    const allProduct = await ProductModel.find();

    await responseStatus(res, 200, true, "Data is available", allProduct);
  } catch (error) {
    await responseStatus(res, 400, false, error.message);
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const token = req.headers.token;

    await checkToken(token, res);
    const singleProduct = await ProductModel.findById(id);

    await responseStatus(res, 200, true, "Data is available", singleProduct);
  } catch (error) {
    await responseStatus(res, 400, false, error.message);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await checkAdmin(req, res);

    const id = req.params.id;
    const product = await ProductModel.findById(id);

    if (!product) {
      await responseStatus(res, 403, false, "Invalid product");
    }

    rm(product.image, () => {
      console.log("Image deleted");
    });

    await product.deleteOne();

    await responseStatus(res, 200, true, "Product Detail deleted success");
  } catch (error) {
    await responseStatus(res, 400, false, error.message);
  }
};

export const updateProduct = async (req, res) => {
  try {
    await checkAdmin(req, res);

    const id = req.params.id;
    const { title, description, stock, price, category } = req.body;

    const product = await ProductModel.findById(id);

    await responseStatus(res, 404, false, "Product not found");

    product.title = title;
    product.description = description;
    product.stock = stock;
    product.price = price;
    product.category = category;

    if (req.file) {
      const newImage = req.file.filename;
      product.image = newImage;
    }

    await product.save();

    await responseStatus(res, 200, true, "Successfully updated product");
  } catch (error) {
    await responseStatus(res, 400, false, error.message);
  }
};
