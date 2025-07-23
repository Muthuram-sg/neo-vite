import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useWorkOrderList = () => {
    const [workorderListLoading, setLoading] = useState(false);
    const [workorderListData, setData] = useState(null);
    const [workorderListError, setError] = useState(null);

    const getWorkOrderList = async () => {
        setLoading(true);

        await configParam.RUN_GQL_API(gqlQueries.getWorkOrders)
            .then((returnData) => {
                if (returnData !== undefined && returnData.neo_skeleton_prod_order ) {
                    setData(returnData.neo_skeleton_prod_order);
                    setError(false)
                    setLoading(false)
                } else {
                    
                    setData(null)
                    setError(true)
                    setLoading(false)
                }
            })
            .catch((e) => {
                console.log("NEW MODEL", "API FAILURE",e , window.location.pathname.split("/").pop(), new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    };


        return { workorderListLoading, workorderListData, workorderListError, getWorkOrderList };
    };

    export default useWorkOrderList;