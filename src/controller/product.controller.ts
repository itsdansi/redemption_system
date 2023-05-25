import {Request, Response} from "express";
import fs from "fs";

export const getAllProducts = (req: Request, res: Response) => {
  try {
    const data = fs.readFileSync("data2/NCH_catalogue.json", "utf8");
    // const data = fs.readFileSync("data/NCH_catalogue.json", "utf8");
    const productData = JSON.parse(data);

    // Get the filter condition from the query parameters
    const filterPoints = parseInt(req.query.points as string, 10);

    // Filter the products based on the dynamic condition
    const filteredProducts = productData.flatMap((element: any) => {
      return element.subcategory.flatMap((data: any) => {
        return data.products.filter((product: any) => product.Points >= filterPoints);
      });
    });

    res.json(filteredProducts);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Internal Server Error"});
  }
};

export const getProductsBySubCategory = (req: Request, res: Response) => {
  try {
    const data = fs.readFileSync("data2/NCH_catalogue.json", "utf8");
    const productData = JSON.parse(data);

    // Get the filter condition from the query parameters
    const filterSubCategory = req.query.subcategory;

    // Filter the products based on the dynamic condition
    const filteredProducts = productData.flatMap((element: any) => {
      return element.subcategory.filter((data: any) => (data.name = filterSubCategory));
    });

    const products = filteredProducts.flatMap((element: any) => {
      return element.products;
    });

    // console.log("result", filteredProducts);
    // res.json(filteredProducts);
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Internal Server Error"});
  }
};
