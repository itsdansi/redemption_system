import {Request, Response} from "express";
import fs from "fs";

export const getAllProducts = (req: Request, res: Response) => {
  try {
    // const data = fs.readFileSync("data2/NCH_catalogue.json", "utf8");
    const data = fs.readFileSync("data2/Nichino_Plantinum_250523.json", "utf8");
    // const data = fs.readFileSync("data/NCH_catalogue.json", "utf8");
    const productData = JSON.parse(data);

    // Get the filter condition from the query parameters
    // const startPoint = parseInt(req.query.maxpoints as string, 10);
    // const endPoint = parseInt(req.query.minPoints as string, 10);

    // const filteredProducts = productData.filter(
    //   (product: any) => product.Points >= startPoint
    // );
    // console.log(filterProducts);

    // // Filter the products based on the dynamic condition
    // const filteredProducts = productData.flatMap((element: any) => {
    //   return element.subcategory.flatMap((data: any) => {
    //     return data.products.filter((product: any) => product.Points >= filterPoints);
    //   });
    // });

    console.log(productData);
    res.json(productData);
    return true;
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Internal Server Error"});
  }
};

export const getProductsBySubCategory = (req: Request, res: Response) => {
  try {
    // const data = fs.readFileSync("data2/NCH_catalogue.json", "utf8");
    const data = fs.readFileSync("data2/Nichino_Plantinum_250523.json", "utf8");
    const productData = JSON.parse(data);

    // Get the filter condition from the query parameters
    const filterSubCategory = req.query.subcategory;

    // // Filter the products based on the dynamic condition
    // const filteredProducts = productData.flatMap((element: any) => {
    //   return element.subcategory.filter((data: any) => (data.name = filterSubCategory));
    // });

    // const products = filteredProducts.flatMap((element: any) => {
    //   return element.products;
    // });

    // // console.log("result", filteredProducts);
    // // res.json(filteredProducts);
    // res.json(products);

    // const test = productData.map((prod: any) => prod["Sub-Category"]);

    const filteredProducts = productData.filter(
      (element: any) => element["Sub-Category"] == filterSubCategory
    );

    // console.log(test);
    // console.log(filteredProducts);
    return res.send(filteredProducts);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Internal Server Error"});
  }
};

export const getAllCategory = (req: Request, res: Response) => {
  try {
    const data = fs.readFileSync("data2/Nichino_Plantinum_250523.json", "utf8");
    const productData = JSON.parse(data);

    const categories = productData.map((prod: any) => prod["Sub-Category"]);
    const uniqueCategories = [...new Set(categories)];

    return res.send(uniqueCategories);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Internal Server Error"});
  }
};

export const getSingleProduct = (req: Request, res: Response) => {
  try {
    const data = fs.readFileSync("data2/Nichino_Plantinum_250523.json", "utf8");
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
