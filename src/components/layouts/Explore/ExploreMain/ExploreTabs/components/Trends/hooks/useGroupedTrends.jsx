import { useState } from "react";
import configParam from "config";
import moment from "moment";
import { selectedInterval } from "recoilStore/atoms"
import { useRecoilState } from "recoil";

const useTrends = () => {
    const [groupedtrendsdataLoading, setLoading] = useState(false);
    const [groupedtrendsdataData, setData] = useState(null);
    const [groupedtrendsdataError, setError] = useState(null);
    const [selectedIntervals] = useRecoilState(selectedInterval);

    const getGroupedTrends =  (meters,schema,append, customdatesval) => {
        setLoading(true);
        const url = "/iiot/gettrends";
        Promise.all(meters.map(async (x)=>{
            let body = {
                schema: schema,
                from: customdatesval ? moment(customdatesval.StartDate).format('YYYY-MM-DDTHH:mm:ss') : x.frmDate,
                to: customdatesval ? moment(customdatesval.EndDate).format('YYYY-MM-DDTHH:mm:ss') : x.toDate, 
                interval: selectedIntervals || x.interval, 
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

    return { groupedtrendsdataLoading, groupedtrendsdataData, groupedtrendsdataError, getGroupedTrends };
};

export default useTrends;