import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const GetProducts = () => {
 const [productsLoading, setLoading] = useState(false);
 const [getProductData, setData] = useState(null);
 const [productsError, setError] = useState(null);

 const getProducts = async (lineID) => {
  setLoading(true);
  await configParam.RUN_GQL_API(gqlQueries.getProductsListOnly, {line_id: lineID})
   .then((productData) => {
    if (productData.neo_skeleton_prod_products) {
     setData(productData.neo_skeleton_prod_products)

     setError(false)
     setLoading(false)
    }
    else {
     setData([])
     setError(true)
     setLoading(false)
    }
   })
   .catch((e) => {
    console.log("NEW MODEL", e, "Getting Product Setting Screen", new Date())
    setLoading(false);
    setError(e);
    setData([]);
   });

 };
 return { productsLoading, getProductData, productsError, getProducts };
};

export default GetProducts;