import { useState } from "react";
import configParam from "config"; 
import common from "components/layouts/Dashboards/Content/standard/EnergyDashboard/components/common.jsx"; 
import gqlQueries from "components/layouts/Queries";
import moment from 'moment';
import { customdates} from 'recoilStore/atoms';
import { useRecoilState } from "recoil"; 

const useWaterEnergy = () => {
    const [WaterEnergyLoading, setLoading] = useState(false);
    const [WaterEnergyData, setData] = useState(null);
    const [WaterEnergyError, setError] = useState(null);
    const [customdatesval] = useRecoilState(customdates);

    const getWaterEnergy  = async (childLine,btGroupValue,userDefaultList,typelist,headPlant ) => {
        setLoading(true);
        
        Promise.all(
            childLine.filter(e=> e.line_id !== headPlant.id).map(async (val,i) =>{
                let EnergyData=[]
                let childPlant = userDefaultList.map(x => x.line).filter(v=> v.id === val.line_id)[0]; 
                let range = common.Range(btGroupValue, childPlant, customdatesval)
                let viids = [] 
                let selecetedHierarchy = {}
                // console.log(childPlant,"childPlantchildPlant")
                let EnergyAsset  
                if (childPlant.node && childPlant.node.nodes && (childPlant.node.nodes.filter(f=> f.type === 2).length>0)) {
                    let type = childPlant.node.nodes.filter(f=> f.type === 2)[0].radio
                    let HierarchyData = childPlant.hierarchies
                    if (type === 'hierarchy' && childPlant.node.nodes.filter(f=> f.type === 2)[0].selectedHierarchy && HierarchyData.length > 0) {
                        selecetedHierarchy = HierarchyData.find(x => x.id === childPlant.node.nodes.filter(f=> f.type === 2)[0].selectedHierarchy)
                        viids = selecetedHierarchy ? selecetedHierarchy.hierarchy[0].children.map(x => x.subnode.id) : []
                        if (selecetedHierarchy && selecetedHierarchy.hierarchy.length > 0) {
                            viids.push(selecetedHierarchy.hierarchy[0].subnode.id)
                            EnergyAsset = selecetedHierarchy.hierarchy[0].subnode.id
                        }

                    }else{
                        viids = childPlant.node.nodes.filter(f=> f.type === 2)[0].nodes.map((valt) => valt.id);
                        viids.push(childPlant.node.nodes.filter(f=> f.type === 2)[0].asset) 
                        EnergyAsset = childPlant.node.nodes.filter(f=> f.type === 2)[0].asset
                    }
                    
                }
                else {
                    viids.push(childPlant.energy_asset) 
                } 
                // console.log(viids,"viidsviidsviids",childPlant)
                let dates = common.getBetweenDates(moment(range[0]), moment(range[1]), 'day') 
                let finalrequestarray = []
                if (EnergyAsset) { 
                    await configParam.RUN_GQL_API(gqlQueries.getVirtualInstrumentFormula, { VIID: viids },val.token,val.line_id)
                    .then(result => {
                        if (result && result.neo_skeleton_virtual_instruments && result.neo_skeleton_virtual_instruments.length > 0 ) {
                            
                            
                            let instruments
                            let metrics
                            let types 
                            result.neo_skeleton_virtual_instruments.forEach((valt) => {
                                let values = common.getVirtualInstrumentInfo(valt, typelist)
                                instruments = values[0]
                                metrics = values[1]
                                types = values[2]
                                
                                finalrequestarray.push({ "start": range[0], "end": range[1], "type": types, "metrics": metrics, "instruments": instruments, "viid": valt })
                            })
                            EnergyData.push({Data:finalrequestarray,dates:dates, PlantDetail: childPlant,token:val.token,EnergyAsset:EnergyAsset} )
                        }  
                    })
                }else{
                    finalrequestarray.push({ "start": range[0], "end": range[1], "type": [], "metrics": [], "instruments": '', "viid": '' })
                    EnergyData.push({Data:finalrequestarray,dates:dates, PlantDetail: childPlant,token:val.token,EnergyAsset:''} )
                }
                
                return EnergyData
            })
        )
        .then((data) => {
            
            let resultData = []; 
            data.forEach(x => resultData = [...resultData, ...x]);
            if(resultData.length>0){
                Promise.all(
                    resultData.map(async (val)=>{
                        let url = "/dashboards/energydashday";
                        let resultData2 = [];
                            await Promise.all(
                                val.Data.map(async (x) => { 
                                let body = {
                                data:{
                                    start: x.start,
                                    end: x.end,
                                    metrictype: x.type,
                                    instruments: x.instruments,
                                    metrics: x.metrics,
                                    viid: x.viid ? x.viid.id : "",
                                    dates: val.dates,
                                    previousdates: [],
                                    groupby:x.groupby
                                }
                            }

                                return   configParam.RUN_REST_API(url, body,val.token,val.line_id,'POST')
                                .then(res => {
                                    // console.log(res,"eneryPlants",val.PlantDetail)
                                    if (res && !res.errorTitle && res.data) {
                                        return [res.data]
                                    } else {
                                        return []
                                    }
                                })
                            }))

                            .then((data2) => {
                                data2.forEach(x => resultData2 = [...resultData2, ...x]);
                                
                            })
                            return {Data : resultData2,PlantDetail: val.PlantDetail,token:val.token,EnergyAsset:val.EnergyAsset}
                    })
                )
                .then((data3) => {
                    setLoading(false);
                    setError(false);
                    setData(data3);
                })
                
            }else{
                setLoading(false);
                setError(false);
                setData(null);
            }
            
        })
        .catch((e) => {
            console.log("NEW MODEL", "ERR", e, "Data Alerts Summary Dashboard", new Date())
            setLoading(false);
            setError(e);
            setData(null);
        })
    }

    return { WaterEnergyLoading, WaterEnergyData, WaterEnergyError, getWaterEnergy };
}


export default useWaterEnergy;