import { useState } from "react";
import Queries from "components/layouts/Queries";
import configParam from "config";
import common from "components/layouts/Dashboards/Content/standard/EnergyDashboard/components/common.jsx"; 
import { userDefaultLines } from 'recoilStore/atoms';
import { useRecoilState } from 'recoil';


const useMultiLinePartSignal = () => {
  const [PartSignalCountLoading, setLoading] = useState(false);
  const [PartSignalCountData, setData] = useState(null);
  const [PartSignalCountError, setError] = useState(null);
  const [userDefaultList] = useRecoilState(userDefaultLines);  

  const getPartSignalCount = async (rangevalue,customdatesval,headPlant) => { 
    setLoading(true);
    let child_lines = JSON.parse(localStorage.getItem("child_line_token")) 
    if(child_lines && child_lines.length>0){
        child_lines = child_lines.filter(e=> e.line_id !== headPlant.id)
        Promise.all(            
            child_lines.map( async x=>{                    
                 return configParam.RUN_GQL_API(Queries.GetMultiLineOEEAssets, {line_id: x.line_id},x.token,x.line_id)
                .then((returnData) => { 
                    if (returnData !== undefined) { 
                        let response = [];
                        if(returnData.neo_skeleton_prod_asset_oee_config.length > 0){
                            let filterDryer = returnData.neo_skeleton_prod_asset_oee_config.filter(f=> !f.entity.dryer_config)
                             response = filterDryer.map(y=>{
                                return {
                                    token: x.token,
                                    line_id: x.line_id,
                                    data: y
                                }                            
                            })
                        }else{
                            return { line_id: x.line_id,data: null,token: x.token}
                        }
                        
                        return response;
                    }else{
                        return { line_id: x.line_id,data: null,token: x.token}
                    }
                });                            
            })        
        )
        .then((data) => {
                const result = data.flat();
                // console.log(result,"MultiactualPartSignalCount")
                if(result.length>0){
                    Promise.all(
                        result.map( async x=>{  
                            if(x.data){                                
                                const childPlant = userDefaultList.filter(y=> y.line.id === x.line_id).map(z=>z.line)[0];
                                let rangeDate = common.Range(rangevalue, childPlant, customdatesval)
                                let rangeToday = common.Range(6, childPlant, customdatesval)
                                
                                const body = {
                                    schema: x.data.entity.line.schema,
                                    instrument_id: x.data.part_signal_instrument,
                                    metric_name: x.data.metric.name,
                                    start_date: rangeToday[0],
                                    end_date: rangeToday[1],
                                    binary: x.data.is_part_count_binary,
                                    downfall: x.data.is_part_count_downfall ,
                                    data_type:'summary'
                                }
                                
                                const url = "/dashboards/actualPartSignalCount";  
                                const today = await configParam.RUN_REST_API(url, body,x.token,x.line_id)
                                .then((res) => {  
                                        if(res.data.length > 0 && res.data[0].count !== '0'){
                                            return res.data[0].count 
                                        }else{
                                            return 0 
                                        }
                                      
                                })
                                const body1 = {
                                    schema: x.data.entity.line.schema,
                                    instrument_id: x.data.part_signal_instrument,
                                    metric_name: x.data.metric.name,
                                    start_date: rangeDate[0],
                                    end_date: rangeDate[1],
                                    binary: x.data.is_part_count_binary,
                                    downfall: x.data.is_part_count_downfall,
                                    data_type:'summary' 
                                }
                                const range = await configParam.RUN_REST_API(url, body1,x.token,x.line_id)
                                .then((res) => {  
                                        if(res.data.length > 0 && res.data[0].count !== '0'){
                                            return res.data[0].count 
                                        }else{
                                            return 0;
                                        }
                                      
                                }) 
                                return {line_id: x.line_id,range: range,today:today};
                            }else{
                                return {line_id: x.line_id,range: 0,today:0};
                            }                   
                        })
                    ).then(res=>{
                        let results = [];
                        res.forEach(datum=>{
                            const duplicated = results.findIndex(x=>x.line === datum.line_id); 
                            if(duplicated > -1){
                                results[duplicated]['actual_range'] = results[duplicated]['actual_range'] + Number(datum.range); 
                                results[duplicated]['today'] = results[duplicated]['today'] + Number(datum.today); 
                            }else{
                                let obj1 = {};                            
                                obj1['line'] = datum.line_id;                            
                                obj1['actual_range'] = Number(datum.range);                            
                                obj1['today'] = Number(datum.today);                            
                                results.push(obj1);
                            }
                            
                        })
                        setLoading(false);
                        setError(false);
                        setData(results);
                    })
                }else{                    
                    setLoading(false);
                    setError(true);
                    setData(null);
                }
            
        })  
        .catch((e) => {
            setLoading(false);
            setError(true);
            setData(null);
        });
    }else{
        setLoading(false);
        setData(null);
        setError(true);
    }
  };
 

  return { PartSignalCountLoading, PartSignalCountData, PartSignalCountError, getPartSignalCount };
};

export default useMultiLinePartSignal;