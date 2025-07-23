import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useResourcesUnitPrice = () => {
    const [outDTLoading, setLoading] = useState(false);
    const [outDTData, setData] = useState(null);
    const [outDTError, setError] = useState(null);

    const getResourcesUnitPrice = async (line_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.resources_unit_price, { line_id: line_id })
        .then((returnData) => {
          if (returnData !== undefined && returnData.neo_skeleton_resources_unit_price && returnData.neo_skeleton_resources_unit_price.length > 0) {
            setLoading(false);
            setData(returnData.neo_skeleton_resources_unit_price);
          } else {
            setLoading(false);
            setError(null);
            setData(null);
          }
        })
        .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
                console.log("NEW MODEL", "ERR", e, "User Setting", new Date())
            });
            

    };
    return { outDTLoading, outDTData, outDTError, getResourcesUnitPrice };
};

export default useResourcesUnitPrice;