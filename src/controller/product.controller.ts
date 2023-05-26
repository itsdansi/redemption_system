import {Request, Response} from "express";
import fs from "fs";

const platiniumData = fs.readFileSync("data2/Nichino_Plantinum_250523.json", "utf8");
const directorData = fs.readFileSync("data2/Nichino Director 250523.json", "utf8");

export const getAllProducts = (req: Request, res: Response) => {
  try {
    const user: any = req.user;
    const data = user.userType == "platinium" ? platiniumData : directorData;
    const productData = JSON.parse(data);
    var filteredProducts;

    // Get the filter condition from the query parameters
    const maxPoints = parseInt(req.query.maxPoints as string, 10);
    const minPoints = parseInt(req.query.minPoints as string, 10);

    if (maxPoints && minPoints) {
      filteredProducts = productData.filter(
        (product: any) => product.Points >= minPoints && product.Points <= maxPoints
      );
    } else if (minPoints) {
      filteredProducts = productData.filter(
        (product: any) => product.Points >= minPoints
      );
    } else if (maxPoints) {
      filteredProducts = productData.filter(
        (product: any) => product.Points <= maxPoints
      );
    } else {
      filteredProducts = productData;
    }

    return res.json(filteredProducts);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Internal Server Error"});
  }
};

export const getProductsBySubCategory = (req: Request, res: Response) => {
  try {
    const user: any = req.user;
    const data = user.userType == "platinium" ? platiniumData : directorData;
    const productData = JSON.parse(data);

    // Get the filter condition from the query parameters
    const filterSubCategory = (req.query.subcategory as string).toLowerCase();

    // const productData = JSON.parse(data);
    var filteredProducts;

    // Get the filter condition from the query parameters
    const maxPoints = parseInt(req.query.maxPoints as string, 10);
    const minPoints = parseInt(req.query.minPoints as string, 10);

    if (maxPoints && minPoints) {
      filteredProducts = productData.filter(
        (product: any) => product.Points >= minPoints && product.Points <= maxPoints
      );
    } else if (minPoints) {
      filteredProducts = productData.filter(
        (product: any) => product.Points >= minPoints
      );
    } else if (maxPoints) {
      filteredProducts = productData.filter(
        (product: any) => product.Points <= maxPoints
      );
    } else {
      filteredProducts = productData;
    }

    const products = filteredProducts.filter(
      (element: any) => element["Sub-Category"].toLowerCase() === filterSubCategory
    );

    // return res.send(products);

    return res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Internal Server Error"});
  }
};

export const getAllCategory = (req: Request, res: Response) => {
  try {
    const user: any = req.user;
    const data = user.userType == "platinium" ? platiniumData : directorData;
    const productData = JSON.parse(data);

    const subcategoriesByCategory = {};

    // Iterate over each product
    for (const product of productData) {
      const category = product.Category;
      const subcategory = product["Sub-Category"];

      // If the category doesn't exist in the object, initialize it with an empty array
      if (!subcategoriesByCategory[category]) {
        subcategoriesByCategory[category] = [];
      }

      // Push the subcategory to the corresponding category array is already not presented
      if (!subcategoriesByCategory[category].includes(subcategory)) {
        subcategoriesByCategory[category].push(subcategory);
      }
    }

    // Output the subcategories grouped by categories
    for (const category in subcategoriesByCategory) {
      const subcategories = subcategoriesByCategory[category];
      console.log(`${category}: ${subcategories.join(", ")}`);
    }

    return res.send(subcategoriesByCategory);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Internal Server Error"});
  }
};

export const getSingleProduct = (req: Request, res: Response) => {
  try {
    const user: any = req.user;
    const data = user.userType == "platinium" ? platiniumData : directorData;
    const productData = JSON.parse(data);

    const serialNumber = req.params.id;

    const filteredProducts = productData.filter(
      (element: any) => element["Sr no"] == serialNumber
    );

    return res.send(filteredProducts);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Internal Server Error"});
  }
};

// fix: minor fix in get products by category
