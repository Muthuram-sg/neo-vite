import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useDelAlerts = () => {
    const [useDelAlertsLoading, setLoading] = useState(false);
    const [useDelAlertsData, setData] = useState(null);
    const [useDelAlertsError, setError] = useState(null);

    const getDelAlerts = async (map1) => {
        setLoading(true);

        configParam.RUN_GQL_API(mutations.delAlertsV2, { insrument_metrics_id: map1})
            .then((response) => {
                if(response!==undefined && response.delete_neo_skeleton_alerts_v2){
                setData(response);
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
                console.log("NEW MODEL", "API FAILURE",e , window.location.pathname.split("/").pop(), new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { useDelAlertsLoading, useDelAlertsData, useDelAlertsError, getDelAlerts };
}


export default useDelAlerts;