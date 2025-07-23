import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useResourcesUnitPrice = () => {
    const [outDTLoading, setLoading] = useState(false);
    const [outDTData, setData] = useState(null);
    const [outDTError, setError] = useState(null);

    const getResourcesUnitPrice = async (childLine,userDefaultList) => {
        setLoading(true);
      Promise.all(
        childLine.map(async (val,i) =>{
          let childPlant = userDefaultList.map(x => x.line).filter(v=> v.id === val.line_id)[0]; 
          return  configParam.RUN_GQL_API(gqlQueries.resources_unit_price, { line_id: val.line_id },val.token,val.line_id)
          .then((returnData) => {
            if (returnData !== undefined && returnData.neo_skeleton_resources_unit_price && returnData.neo_skeleton_resources_unit_price.length > 0) {
              return {Data:returnData.neo_skeleton_resources_unit_price, Line: childPlant}
            } else {
              return {Data:null, Line: childPlant}
            }
          })
        })
      )
      .then((data) => {
          setData(data)
          setError(false)
          setLoading(false)
      })
      .catch((e) => {
          console.log("NEW MODEL", "ERR", e, "Data Alerts Summary Dashboard", new Date())
          setLoading(false);
          setError(e);
          setData(null);
      })
         
        

    };
    return { outDTLoading, outDTData, outDTError, getResourcesUnitPrice };
};

export default useResourcesUnitPrice;