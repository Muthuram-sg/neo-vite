import { useState } from "react";
import configParam from "config";

const useGetVirtulInstrumentDashboardData = () => {
    const [VIDashboardDataLoading, setLoading] = useState(false);
    const [VIDashboardData, setData] = useState(null);
    const [VIDashboardError, setError] = useState(null);

    const getVIDashboardData = async (body) => {

        await configParam.RUN_REST_API('/dashboards/virtualInstrumentData', body, '', '', 'POST')
            .then(res => {
                if (res && !res.errorTitle && res.data) {
                    setData(res.data);
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
                console.log("NEW MODEL", "ERR", e, "getAlertsOverviewData - alerts", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    };
    return { VIDashboardDataLoading, VIDashboardData, VIDashboardError, getVIDashboardData };
};

export default useGetVirtulInstrumentDashboardData;
