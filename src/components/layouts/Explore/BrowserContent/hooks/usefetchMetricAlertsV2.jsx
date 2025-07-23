import { useState } from "react";
import configParam from "config";

const useFetchMetricAlertsV2 = () => {
    const [metricAlertsV2Loading, setLoading] = useState(false);
    const [metricAlertsV2Data, setData] = useState(null);
    const [metricAlertsV2Error, setError] = useState(null);

    const getfetchMetricAlertsV2 = async (schema, instruments, keys) => {
        setLoading(true);
        const url ='/alerts/getMetricAlerts'
        
            let body = {schema:schema ,iid : instruments , key:keys}
            configParam.RUN_REST_API(url, body,'','','POST')
            .then(result => {
               if (result &&  result.data) {
                    setLoading(false)
                    setData(result.data)
                    setError(false)
                } else {
                    setLoading(false)
                    setData([])
                    setError(false)
                }
              
            })
            .catch((err) => {
              setError(err)
              console.log('error');
            })
      
        
    };

    return { metricAlertsV2Loading, metricAlertsV2Data, metricAlertsV2Error, getfetchMetricAlertsV2 };
};

export default useFetchMetricAlertsV2;