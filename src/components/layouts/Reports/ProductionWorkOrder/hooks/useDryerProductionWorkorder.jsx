import { useState } from "react";
import configParam from "config";

const useDryerProductionWorkorder = () => {
    const [DryerProductionWorkorderLoading, setLoading] = useState(false);
    const [DryerProductionWorkorderData, setData] = useState(null);
    const [DryerProductionWorkorderError, setError] = useState(null);

    const getDryerProductionWorkorder = async (schema, data, dates) => {     
        Promise.all(data.map(async (dryer) => { 
            const dryerObj = dryer.entity.dryer_config;
            const feed_iid =dryerObj.total_sand_fed_instrument;
            const feed_key = dryerObj.MetricBySandFeed?dryerObj.MetricBySandFeed.name:"";
            const dried_iid = dryerObj.total_sand_dried_instrument;
            const dried_key = dryerObj.MetricBySandDried?dryerObj.MetricBySandDried.name:"";
            const scrap_iid = dryerObj.total_scrap_instrument;
            const scrap_key = dryerObj.MetricBySandScrap?dryerObj.MetricBySandScrap.name:"";
            const gas_iid = dryerObj.gas_energy_consumption_instrument;
            const gas_key = dryerObj.MetricByGasEnergy?dryerObj.MetricByGasEnergy.name:"";
            const elect_iid = dryerObj.electrical_energy_consumption_instrument;
            const elect_key = dryerObj.MetricByElectricalEnergy?dryerObj.MetricByElectricalEnergy.name:"";
            const moistin_iid = dryerObj.moisture_input_instrument;
            const moistin_key = dryerObj.MetricByMoistureIn?dryerObj.MetricByMoistureIn.name:"";
            const moistout_iid = dryerObj.moisture_output_instrument;
            const moistout_key = dryerObj.MetricByMoistureOut?dryerObj.MetricByMoistureOut.name:"";
            const execution_iid = dryerObj.total_startup_time_instrument;
            const execution_key = dryerObj.MetricByExecution?dryerObj.MetricByExecution.name:"";
            return Promise.all(dates.map(async (d) => {
                setLoading(true);

                const APIFetch=async(apiurl,apibody)=>{
                    configParam.RUN_REST_API(apiurl, apibody)
                    .then((response) => {
                        if (response && !response.errorTitle) { 
                            return response.data; 
                        } else {
                            return null;
                        }
                    })
                    .catch((e) => {
                        return null;
                    });
                }
                /*------ fetching material data-------*/
                const mat_body = {
                    schema: schema,
                    feed_iid: feed_iid,
                    feed_key: feed_key,
                    dried_iid: dried_iid,
                    dried_key: dried_key,
                    scrap_iid: scrap_iid,
                    scrap_key: scrap_key,
                    from: d.start_date, 
                    to: d.end_date
                }
                const mat_url = "/dashboards/getdryermaterialdata";
                const material = await APIFetch(mat_url, mat_body)  
                /*------ fetching material data-------*/
                 /*------ fetching gas data-------*/
                let gas_body = {
                    schema: schema,
                    iid: gas_iid,
                    key: gas_key,
                    from: d.start_date, 
                    to: d.end_date
                  } 
                const gas_url =  "/dashboards/getdryerenergydata";
                const gas = await APIFetch(gas_url, gas_body) 
                
                /*------ fetching gas data-------*/
                 /*------ fetching energy data-------*/
                  gas_body = {
                    schema: schema,
                    iid: elect_iid,
                    key: elect_key,
                    from: d.start_date, 
                    to: d.end_date
                  }  
                const elect = await APIFetch(gas_url, gas_body) 
                /*------ fetching energy data-------*/
                 /*------ fetching moistin data-------*/
                 gas_body = {
                    schema: schema,
                    iid: moistin_iid,
                    key: moistin_key,
                    from: d.start_date, 
                    to: d.end_date
                  }
                const moistin_url = "/dashboards/getdryermoisturedata";
                const moistin = await APIFetch(moistin_url, gas_body)  
                /*------ fetching moistin data-------*/
                 /*------ fetching moistout data-------*/
                 gas_body = {
                    schema: schema,
                    iid: moistout_iid,
                    key: moistout_key,
                    from: d.start_date, 
                    to: d.end_date
                  } 
                const moistout = await APIFetch(moistin_url, gas_body)  
                /*------ fetching moistout data-------*/
                 /*------ fetching execution data-------*/
                const execution_body = {
                schema: schema,
                iid: execution_iid,
                key: execution_key,
                entity_id: dryer.entity_id,
                from: d.start_date, 
                to: d.end_date
                }
                const execution_url = "/dashboards/getdryerdowntime";
                const execution = await APIFetch(execution_url, execution_body) 
                /*------ fetching moistout data-------*/
                return {gas: gas,elect: elect,moistin: moistin,moistout: moistout,execution: execution,feed: material.feed_data?material.feed_data:0,dried: material.dried_data?material.dried_data:0,scrap: material.scrap_data?material.scrap_data:0}
            }))
        }
        ))
        .then(Finaldata => {
            if (Finaldata.length > 0) {
                setData(Finaldata.flat());
            }
            setError(false)
        })
        .catch((e) => {
            setData(e);
            setError(true)
        })
        .finally(() => {
            setLoading(false)
        });
    }; 
    return { DryerProductionWorkorderLoading, DryerProductionWorkorderData, DryerProductionWorkorderError, getDryerProductionWorkorder };
};



export default useDryerProductionWorkorder;