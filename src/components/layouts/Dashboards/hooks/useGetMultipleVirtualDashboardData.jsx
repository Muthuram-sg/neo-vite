import { useState } from "react";
import configParam from "config";

const useGetMultipleVirtulInstrumentDashboardData = () => {
    const [MultiVIDashboardDataLoading, setLoading] = useState(false);
    const [MultiVIDashboardData, setData] = useState(null);
    const [MultiVIDashboardError, setError] = useState(null);

    const getMultiVIDashboardData = async (body = []) => {

        try {
            let res = []
            // console.clear()

            for(let i in body){
                console.log("________BBO___________\n",i)
                let temp = await configParam.RUN_REST_API('/dashboards/virtualInstrumentData', i, '', '', 'POST')
                console.log(temp)
                res.push(temp?.data?.[0])
            }
            setData(res)
            setError(false)
            setLoading(false)
        }
        catch(e){
            console.log(e)
            console.log("NEW MODEL", "ERR", e, "getAlertsOverviewData - alerts", new Date())
                setLoading(false);
                setError(e);
                setData(null);
        }
    };
    return { MultiVIDashboardDataLoading, MultiVIDashboardData, MultiVIDashboardError, getMultiVIDashboardData };
};

export default useGetMultipleVirtulInstrumentDashboardData;
