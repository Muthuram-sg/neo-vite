import { useState } from "react";
import configParam from "config"; 

const useGetAlertsOverviewData = () => {
    const [AlertsOverviewLoading, setLoading] = useState(false);
    const [AlertsOverviewData, setData] = useState(null);
    const [AlertsOverviewError, setError] = useState(null);

    const getAlertsOverviewData  = async (body) => {
        setLoading(true);
         
        try {
            const returnData = await configParam.RUN_REST_API('/alerts/getAlertsByDateRange', body, '', '', 'POST');
            if (returnData !== undefined) {
                const updatedData = returnData.data.map(alert => {
                    const matchingAlert = returnData.finalAlertsData.find(finalAlert => finalAlert.alert_id === alert.alert_id);
                    if (matchingAlert) {
                        alert.LastActiveAt = matchingAlert.value_time;
                    }
                    return alert;
                });
                returnData.data = updatedData;

                setData(returnData);
                setError(false);
            } else {
                setData(null);
                setError(true);
            }
        } catch (e) {
            console.log("NEW MODEL", "ERR", e, "getAlertsOverviewData - alerts", new Date());
            setLoading(false);
            setError(e);
            setData(null);
        } finally {
            setLoading(false);
        }
    }

    return { AlertsOverviewLoading, AlertsOverviewData, AlertsOverviewError, getAlertsOverviewData };
}

export default useGetAlertsOverviewData;
