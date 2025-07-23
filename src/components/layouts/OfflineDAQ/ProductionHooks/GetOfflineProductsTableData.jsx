import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const GetOfflineTableData = () => {
 const [offlineProductsLoading, setLoading] = useState(false);
 const [getofflineProductData, setData] = useState(null);
 const [offlineProductsError, setError] = useState(null);

 const GetOfflineTableData = async (line_id) => {
  setLoading(true);
  await configParam.RUN_GQL_API(gqlQueries.getOfflineProducts, {line_id:line_id})
   .then((productData) => {
    if (productData.neo_skeleton_production_form) {
     setData(productData.neo_skeleton_production_form)
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
 return { offlineProductsLoading, getofflineProductData, offlineProductsError, GetOfflineTableData };
};

export default GetOfflineTableData;