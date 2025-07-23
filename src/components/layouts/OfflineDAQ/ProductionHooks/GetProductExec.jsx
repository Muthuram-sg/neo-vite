import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const GetProductExecTableData = () => {
 const [offlineProductExecLoading, setLoading] = useState(false);
 const [getofflineProductExecData, setData] = useState(null);
 const [offlineProductsExecError, setError] = useState(null);

 const GetProductExecTableData = async (line_id,id,start,end) => {
  setLoading(true);
  await configParam.RUN_GQL_API(gqlQueries.getProductDateWiseExec, {line_id:line_id,id:id, start:start, end:end})
   .then((productData) => {
    if (productData && productData.neo_skeleton_prod_exec) {
     setData(productData.neo_skeleton_prod_exec)
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
 return { offlineProductExecLoading, getofflineProductExecData, offlineProductsExecError, GetProductExecTableData };
};

export default GetProductExecTableData;