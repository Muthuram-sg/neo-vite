import { useState } from "react";
import Queries from "components/layouts/Queries";
import configParam from "config";
import moment from 'moment'; 
import Common from '../common.jsx';
import commons from "components/layouts/Dashboards/Content/standard/EnergyDashboard/components/common.jsx"; 
import { customdates,userDefaultLines } from 'recoilStore/atoms';
import { useRecoilState } from 'recoil';

const useGetOEE = () => {
  const [GetOEELoading, setLoading] = useState(false);
  const [GetOEEData, setData] = useState(null);
  const [GetOEEError, setError] = useState(null);
  const [userDefaultList] = useRecoilState(userDefaultLines); 
  const [customdatesval] = useRecoilState(customdates);

  const getOEEFunc = async (rangevalue,headPlant) => { 
    setLoading(true);
    let child_lines = JSON.parse(localStorage.getItem("child_line_token")) 
    if(child_lines && child_lines.length>0){
        child_lines = child_lines.filter(e=> e.line_id !== headPlant.id)
        Promise.all(            
            child_lines.map( async x=>{                    
                return  configParam.RUN_GQL_API(Queries.GetMultiLineOEEAssets, {line_id: x.line_id},x.token,x.line_id)
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
                            return { line_id: x.line_id,data: null}
                        }
                        
                        return response;
                    }else{
                        return { line_id: x.line_id,data: null}
                    }
                });                            
            })        
        )
        .then((data) => {
                const result = data.flat();
                if(result.length>0){
                    Promise.all(
                        result.map( async x=>{  
                            if(x.data){                              
                                const childPlant = userDefaultList.filter(y=> y.line.id === x.line_id).map(z=>z.line)[0];                      
                                let range = commons.Range(rangevalue, childPlant, customdatesval)
                                const start = moment().startOf('day').format('YYYY-MM-DDTHH:mm:ssZ');
                                const end = moment().format('YYYY-MM-DDTHH:mm:ssZ')
                            // today
                               const cycleTime = await Common.cycleTime(x.data.entity.id,start,end,x.token,x.line_id);
                               const getPartsCompleted = await Common.getPartsCompleted(x.data,start,end,x.token,x.line_id)
                               const getAssetStatus = await Common.getAssetStatus(x.data,start,end,x.token,x.line_id)
                               const getQualityDefects = await Common.getQualityDefects(x.data,start,end,x.token,x.line_id)
                            // range
                            let range_cycleTime 
                            let range_getPartsCompleted 
                            let range_getAssetStatus 
                            let range_getQualityDefects
                            if (rangevalue === 6 || rangevalue === 7 || rangevalue === 10 || rangevalue === 11  || rangevalue === 19  || rangevalue === 20  || rangevalue === 21  || rangevalue === 22  || rangevalue === 23) {
                                range_cycleTime = await Common.cycleTime(x.data.entity.id,range[0],range[1],x.token,x.line_id);
                                range_getPartsCompleted = await Common.getPartsCompleted(x.data,range[0],range[1],x.token,x.line_id)
                                 range_getAssetStatus = await Common.getAssetStatus(x.data,range[0],range[1],x.token,x.line_id)
                                 range_getQualityDefects = await Common.getQualityDefects(x.data,range[0],range[1],x.token,x.line_id)
                            }
                                
                               return { 
                                cycleTime: cycleTime,partsProduced: getPartsCompleted,assetStatus: getAssetStatus,qualityDefects: getQualityDefects,
                                range_cycleTime: range_cycleTime,range_partsProduced: range_getPartsCompleted,range_assetStatus: range_getAssetStatus,range_qualityDefects: range_getQualityDefects,
                                start: start,end: end,range_start: range[0],range_end: range[1],
                                line_id: x.line_id
                            };
                            }else{
                                return {line_id: x.line_id,range: 0,today:0};
                            }                   
                        })
                    ).then(res=>{
                        let linewiseData = [];
                        let range_linewiseData = [];
                        res.forEach(val=>{
                            const ind = linewiseData.findIndex(o => o.line_id === val.line_id)
                            if (ind === -1) {
                            linewiseData.push({
                                job_cycleTime: [val.cycleTime && val.cycleTime.cycleTime ? val.cycleTime.cycleTime : 0],
                                mode_cycleTime: [val.partsProduced && val.partsProduced.cycleTime ? val.partsProduced.cycleTime : 0],
                                part_act_cycle_time: [val.partsProduced && val.partsProduced.actCycleTime ? val.partsProduced.actCycleTime : 0],
                                total_parts: [(val.partsProduced && val.partsProduced.data && val.partsProduced.data.length) ? val.partsProduced.data.length : 0],
                                total_unplanned_dt: [val.assetStatus && val.assetStatus.dTime ? val.assetStatus.totalDTime : 0],
                                total_dt: [val.assetStatus && val.assetStatus.totalDTime ? val.assetStatus.dTime : 0],
                                quality_defects: [val.qualityDefects && val.qualityDefects.loss ? val.qualityDefects.loss : 0],
                                total_duration: [(new Date(val.end) - new Date(val.start)) / 1000],
                                line_id: val.line_id ? val.line_id : ''
                            })
                            } else {
                                linewiseData[ind].job_cycleTime.push(val.cycleTime && val.cycleTime.cycleTime ? val.cycleTime.cycleTime : 0)
                                linewiseData[ind].mode_cycleTime.push(val.partsProduced && val.partsProduced.cycleTime ? val.partsProduced.cycleTime : 0)
                                linewiseData[ind].part_act_cycle_time.push(val.partsProduced && val.partsProduced.actCycleTime ? val.partsProduced.actCycleTime : 0)
                                linewiseData[ind].total_parts.push((val.partsProduced && val.partsProduced.data && val.partsProduced.data.length) ? val.partsProduced.data.length : 0)
                                linewiseData[ind].total_unplanned_dt.push(val.assetStatus && val.assetStatus.dTime ? val.assetStatus.totalDTime : 0)
                                linewiseData[ind].total_dt.push(val.assetStatus && val.assetStatus.dTime ? val.assetStatus.totalDTime : 0)
                                linewiseData[ind].quality_defects.push(val.qualityDefects && val.qualityDefects.loss ? val.qualityDefects.loss : 0)
                                linewiseData[ind].total_duration.push((new Date(val.end) - new Date(val.start)) / 1000)  
                            }
                            const range_ind = range_linewiseData.findIndex(o => o.line_id === val.line_id)
                            if (range_ind === -1) {
                            range_linewiseData.push({
                                job_cycleTime: [val.range_cycleTime && val.range_cycleTime.cycleTime ? val.range_cycleTime.cycleTime : 0],
                                mode_cycleTime: [val.range_partsProduced && val.range_partsProduced.cycleTime ? val.range_partsProduced.cycleTime : 0],
                                part_act_cycle_time: [val.range_partsProduced && val.range_partsProduced.actCycleTime ? val.range_partsProduced.actCycleTime : 0],
                                total_parts: [(val.range_partsProduced && val.range_partsProduced.data && val.range_partsProduced.data.length) ? val.range_partsProduced.data.length : 0],
                                total_unplanned_dt: [val.range_assetStatus && val.range_assetStatus.dTime ? val.range_assetStatus.totalDTime : 0],
                                total_dt: [val.range_assetStatus && val.range_assetStatus.totalDTime ? val.range_assetStatus.dTime : 0],
                                quality_defects: [val.range_qualityDefects && val.range_qualityDefects.loss ? val.range_qualityDefects.loss : 0],
                                total_duration: [(new Date(val.range_end) - new Date(val.range_start)) / 1000],
                                line_id: val.line_id ? val.line_id : ''
                            })
                            } else {
                                range_linewiseData[range_ind].job_cycleTime.push(val.range_cycleTime && val.range_cycleTime.cycleTime ? val.range_cycleTime.cycleTime : 0)
                                range_linewiseData[range_ind].mode_cycleTime.push(val.range_partsProduced && val.range_partsProduced.cycleTime ? val.range_partsProduced.cycleTime : 0)
                                range_linewiseData[range_ind].part_act_cycle_time.push(val.range_partsProduced && val.range_partsProduced.actCycleTime ? val.range_partsProduced.actCycleTime : 0)
                                range_linewiseData[range_ind].total_parts.push((val.range_partsProduced && val.range_partsProduced.data && val.range_partsProduced.data.length) ? val.range_partsProduced.data.length : 0)
                                range_linewiseData[range_ind].total_unplanned_dt.push(val.range_assetStatus && val.range_assetStatus.dTime ? val.range_assetStatus.totalDTime : 0)
                                range_linewiseData[range_ind].total_dt.push(val.range_assetStatus && val.range_assetStatus.dTime ? val.range_assetStatus.totalDTime : 0)
                                range_linewiseData[range_ind].quality_defects.push(val.range_qualityDefects && val.range_qualityDefects.loss ? val.range_qualityDefects.loss : 0)
                                range_linewiseData[range_ind].total_duration.push((new Date(val.range_end) - new Date(val.range_start)) / 1000)  
                            }

                        }) 
                       
                        const aggregatedOEE = linewiseData.map((val,index)=>{
                            let rangewise = range_linewiseData.filter(x=>val.line_id === x.line_id)[0];
                            let OEE = Common.get_aggregated_oee_value({
                                job_cycleTime :val.job_cycleTime,
                                mode_cycleTime :val.mode_cycleTime,
                                part_act_cycle_time :val.part_act_cycle_time,
                                total_parts :val.total_parts,
                                total_unplanned_dt :val.total_unplanned_dt,
                                total_dt :val.total_dt,
                                quality_defects :val.quality_defects,
                                total_duration :val.total_duration
                            }
                              )
                              let rangeOEE = Common.get_aggregated_oee_value(
                                {
                                    job_cycleTime :rangewise.job_cycleTime,
                                    mode_cycleTime :rangewise.mode_cycleTime,
                                    part_act_cycle_time :rangewise.part_act_cycle_time,
                                    total_parts :rangewise.total_parts,
                                    total_unplanned_dt :rangewise.total_unplanned_dt,
                                    total_dt :rangewise.total_dt,
                                    quality_defects :rangewise.quality_defects,
                                    total_duration :rangewise.total_duration
                                }
                                
                              )
                              const availability = isNaN(OEE.availability) ? 0 : OEE.availability;
                              const performance = isNaN(OEE.performance) ? 0 : OEE.performance;
                              const Quality = isNaN(OEE.quality) ? 0 : OEE.quality;
                              const OEEValue = Math.floor((availability * performance * Quality) * 100)
                              const range_availability = isNaN(rangeOEE.availability) ? 0 : rangeOEE.availability;
                              const range_performance = isNaN(rangeOEE.performance) ? 0 : rangeOEE.performance;
                              const range_Quality = isNaN(rangeOEE.quality) ? 0 : rangeOEE.quality;
                              const range_OEEValue = Math.floor((range_availability * range_performance * range_Quality) * 100)
                              return { availability: availability,performance: performance, Quality:Quality,today: OEEValue,range_availability: range_availability,range_performance: range_performance, range_Quality:range_Quality,actual_range: range_OEEValue,line: val.line_id}
                        })
                        setLoading(false);
                        setError(false);
                        setData(aggregatedOEE);
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
 

  return { GetOEELoading, GetOEEData, GetOEEError, getOEEFunc };
};

export default useGetOEE;