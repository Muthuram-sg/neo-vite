import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries"; 
const useCo2AllPlants = () => {
    const [Co2AllPlantsLoading, setLoading] = useState(false); 
    const [Co2AllPlantsError, setError] = useState(null); 
    const [Co2AllPlantsData, setData] = useState(null);  

    const getCo2AllPlants = async (child_lines,userDefaultList,headPlant) => {        
        setLoading(true); 
        if(child_lines && child_lines.length>0){ 
            child_lines = child_lines.filter(e=> e.line_id !== headPlant.id)
            Promise.all(
                child_lines.map(async x=>{                    
                    const childPlant = userDefaultList.filter(y=> y.line.id === x.line_id).map(z=>z.line)[0]; 
                    // console.log(childPlant,"getCo2AllPlants",x,headPlant.id)
                    return await configParam.RUN_GQL_API(Queries.Co2Factor,{ line_id: x.line_id})
        
                    .then((returnData) => { 
                        if (returnData !== undefined) { 
                            let Co2Factor = returnData.neo_skeleton_co2_factor;
                            return {Co2Factor:Co2Factor,PlantDetail: childPlant}
                        }
                        else{                        
                            return {Co2Factor:[],PlantDetail: childPlant}
                        }
                    })
                    .catch((e) => {
                        return {Co2Factor:[],PlantDetail: childPlant}
                    });
                    
                })
            ).then(result=>{ 
                setData(result);
                setError(false);
                setLoading(false);
            })
        }else{
            setData(null);
            setLoading(false);
            setError(false);            
        } 
    };
    return {  Co2AllPlantsLoading, Co2AllPlantsData, Co2AllPlantsError, getCo2AllPlants };
};

export default useCo2AllPlants;