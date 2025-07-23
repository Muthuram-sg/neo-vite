import { useState } from "react";
import configParam from "config";

const useMeterReadingsV2 = () => {
    const [meterReadingsV2Loading, setLoading] = useState(false);
    const [meterReadingsV2Data, setData] = useState(null);
    const [meterReadingsV2Error, setError] = useState(null);
    const getMeterReadingsV2 = async (schema,line_id,isOffline) => {
        setLoading(true);
        let body = { schema: schema ,line_id:line_id}
        if(isOffline){
            body = {...body, is_Offline:isOffline}
        }
        const url = "/iiot/meterreadingV2";
        await configParam.RUN_REST_API(url, body)
            .then((response) => {
                if (response && !response.errorTitle) {
                    setData(response.data);
                    setError(false);
                } else {
                    setData(response);
                    setError(true);
                } setLoading(false);
            }).catch((e) => {
                setLoading(false);
                setError(e); setData(null);
            });
    };
    return { meterReadingsV2Loading, meterReadingsV2Data, meterReadingsV2Error, getMeterReadingsV2 };
}

 export default useMeterReadingsV2;