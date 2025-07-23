import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries"; 

const useGetAlertConfigurations = () => {
    const [alertConfigurationsLoading, setLoading] = useState(false);
    const [alertConfigurationsdata, setData] = useState(null);
    const [alertConfigurationserror, setError] = useState(null);

    const getAlertConfigurations = async (line_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.alertConfigurations, { line_id: line_id })
            .then(alertConfigurations => {
                if (alertConfigurations !== undefined && alertConfigurations ) {
                    let merged = [];
                    if(alertConfigurations.neo_skeleton_alerts_v2 && alertConfigurations.neo_skeleton_alerts_v2.length > 0){
                        const alerts = alertConfigurations.neo_skeleton_alerts_v2.map(x=> {

                            let obj1 = {...x};
                            let downtime = (obj1.entity_type === "downtime" || obj1.entity_type === "tool") ? obj1.entity_type : 'alert'
                            obj1.instrument_id = obj1 && obj1.instruments_metric && obj1.instruments_metric.instrument && obj1.instruments_metric.instrument.id ?obj1.instruments_metric.instrument.id:0;
                            obj1.instrument_name = obj1 && obj1.instruments_metric && obj1.instruments_metric.instrument && obj1.instruments_metric.instrument.name ?obj1.instruments_metric.instrument.name:0;
                            obj1.alertType = obj1.entity_type === "time_slot" ? "timeslot" : downtime;
                            return obj1;
                        });
                        merged = [...merged,...alerts]
                    }
                    if(alertConfigurations.neo_skeleton_connectivity && alertConfigurations.neo_skeleton_connectivity.length > 0){
                        const alerts = alertConfigurations.neo_skeleton_connectivity.map(x=> {
                            let obj1 = {...x};
                            obj1.instrument_id = obj1 && obj1.instrument_id?obj1.instrument_id:0;
                            obj1.instrument_name = obj1 && obj1.instrument && obj1.instrument.name?obj1.instrument.name:'';
                            obj1.gateway_id = obj1 && obj1.gateway_id ? obj1.gateway_id:0;
                            obj1.gateway_name = obj1 && obj1.gateway && obj1.gateway.name?obj1.gateway.name:'';

                            obj1.alertType='connectivity'
                            return obj1;
                        });
                        merged = [...merged,...alerts]
                    } 
                    setData(merged)
                    setError(false)
                    setLoading(false)
                } else {
                    setData(null)
                    setError(true)
                    setLoading(false)
                }


               
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
            });



    }
    return { alertConfigurationsLoading, alertConfigurationsdata, alertConfigurationserror, getAlertConfigurations };
}

export default useGetAlertConfigurations;
