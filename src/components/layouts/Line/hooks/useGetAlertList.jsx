import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useGetAlertList = () => {
    const [outGetAlertListLoading, setLoading] = useState(false);
    const [outGetAlertListData, setData] = useState(null);
    const [outGetAlertListError, setError] = useState(null);

    const getAlertList  = async ( line_id) => {
        setLoading(true);

        configParam.RUN_GQL_API(Queries.alertList,{ line_id: line_id })
            .then((returnData) => {
                if(returnData!== undefined && returnData.neo_skeleton_alerts_v2 && returnData.neo_skeleton_alerts_v2.length > 0 ? returnData.neo_skeleton_alerts_v2 : []){
                    setData(returnData.neo_skeleton_alerts_v2);
                    setError(false)
                    setLoading(false)
                }
                else{
                    setData(null)
                    setError(true)
                    setLoading(false)
                    }
                
            })
            .catch((e) => {
                console.log("NEW MODEL", "ERR", e, "Line Setting Update", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { outGetAlertListLoading, outGetAlertListData, outGetAlertListError, getAlertList };
}


export default useGetAlertList;