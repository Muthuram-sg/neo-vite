import { useState } from "react";
import configParam from "config";

const useTrends = () => {
    const [trendsdataLoading, setLoading] = useState(false);
    const [trendsdataData, setData] = useState(null);
    const [trendsdataError, setError] = useState(null);

    const getTrends =  (meters,schema,append) => {
        setLoading(true);
        const url = "/iiot/gettrends";
        Promise.all(meters.map(async (x)=>{
            let body = {
                schema: schema,
                from: x.frmDate,
                to: x.toDate, 
                interval: x.interval, 
                instrumentid: x.id, 
                metricid: x.metric_val
            }
            return  configParam.RUN_REST_API(url, body)
            .then((response) => {

                if (response && !response.errorTitle && response.data) {
                   return  response.data 
                } else {
                    return [] 
                }
            })
        }))
        .then((result)=>{
          //  console.log("result",result)
            setLoading(false);
            setError(false);
            setData({data:result,append:append});
        })
        .catch((e) => {
            setLoading(false);
            setError(e);
            setData(null);
        });
            
       
        

        
    };

    return { trendsdataLoading, trendsdataData, trendsdataError, getTrends };
};

export default useTrends;