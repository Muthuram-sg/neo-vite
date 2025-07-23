import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetMetricForInstrument = () => {
    const [instrumentMetricListLoading, setLoading] = useState(false);
    const [instrumentMetricListData, setData] = useState(null);
    const [instrumentMetricListError, setError] = useState(null); 
    const instrumentMetricList = async (MetArr,type) => { 
        console.log(MetArr,type,"MetArr,type")
        setLoading(true);
        Promise.all( 
            MetArr.map( async x=>{
                return await configParam.RUN_GQL_API(gqlQueries.getMetricsForSingleInstrument, {instruments_id:x.instrument_id})
                .then((response) => {
                    if (response !== undefined && response.neo_skeleton_instruments_metrics) {
                       
                        let formatted = response.neo_skeleton_instruments_metrics.map(y=>{
                            y['name'] = y.metric.name;
                            y['title'] = y.metric.title;
                            return y;
                        })
                        console.log(formatted,'formattedstatus') 
                        if(type === 'Status'){
                            formatted = formatted.filter(e=> (e.metric.metric_datatype === 1 || e.metric.metric_datatype === 4) )  
                            
                        }else{
                           
                            formatted = formatted.filter(e=> (e.metric.metric_datatype === 2 || e.metric.metric_datatype === 3) )    
                        }
                        return {...x,metOpt:formatted,field:x.field,instruments_id: x.instrument_id}
                    }
                    else{
                        return {...x,metOpt:[],field:x.field,instruments_id: x.instrument_id}
                     
                    }
                })
                .catch((e) => {
                    return {...x,metOpt:[],field:x.field,instruments_id: x.instrument_id}
                });
            })
        ).then((data) => {  
            setLoading(false);
            setError(false);
            setData(data);
             
        })  
        .catch((e) => {
            setLoading(false);
            setError(true);
            setData(null);
        });         

    };
    return { instrumentMetricListLoading, instrumentMetricListData, instrumentMetricListError, instrumentMetricList };
};

export default useGetMetricForInstrument;