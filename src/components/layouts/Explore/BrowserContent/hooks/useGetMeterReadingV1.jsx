import { useState } from "react";
import configParam from "config";

const useGetMeterReadingV1 = () => {
    const [meterReadingsV1Loading, setLoading] = useState(false);
    const [meterReadingsV1Data, setData] = useState(null);
    const [meterReadingsV1Error, setError] = useState(null);

    const getMeterReadingsV1 = async (schema, iid, params,from,to) => {
        setLoading(true);

        const body = {
            schema: schema,
            iid: iid,
            parameters: params,
            from : from,
            to : to
        }
        const url = '/iiot/meterreadingV1';
        configParam.RUN_REST_API(url, { data: body },'','','POST')
            .then(result => {
                if (result &&  result.data) {
                     setLoading(false)
                     setData(result)
                     setError(false)
                 } else {
                     setLoading(false)
                     setData({data: result})
                     setError(false)
                 } 
             })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
            });
    };

    return { meterReadingsV1Loading, meterReadingsV1Data, meterReadingsV1Error, getMeterReadingsV1 };
};

export default useGetMeterReadingV1;