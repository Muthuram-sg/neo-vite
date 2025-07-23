import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";
import common from "components/layouts/Dashboards/Content/standard/EnergyDashboard/components/common.jsx"; 
import { userDefaultLines } from 'recoilStore/atoms';
import { useRecoilState } from 'recoil';
const useGetTasks = () => {
    const [TaskCountLoading, setLoading] = useState(false); 
    const [TaskCountError, setError] = useState(null); 
    const [TaskCountData, setData] = useState(null); 
    const [userDefaultList] = useRecoilState(userDefaultLines); 

    const getTaskCount = async (rangevalue,customdatesval,headPlant) => {        
        setLoading(true);
        let child_lines = JSON.parse(localStorage.getItem("child_line_token")) 
        console.log(child_lines,userDefaultList,"lineee")
        if(child_lines && child_lines.length>0){ 
            child_lines = child_lines.filter(e=> e.line_id !== headPlant.id)
          
            Promise.all(
                child_lines.map(async x=>{               
                    const childPlant = userDefaultList.filter(y=> y.line.id === x.line_id).map(z=>z.line)[0];
                    const childSchema = userDefaultList.filter(y=> y.line.id === x.line_id).map(z=>z.line.schema)[0];
                    let range = common.Range(rangevalue, childPlant, customdatesval)
                    let rangeToday = common.Range(6, childPlant, customdatesval)
                    return  configParam.RUN_GQL_API(Queries.taskCountForline,{ line_id: x.line_id,start:range[0],end:range[1],today_start:rangeToday[0],today_end: rangeToday[1] },x.token,x.line_id)
        
                    .then((returnData) => { 
                        if (returnData !== undefined) { 
                            let taskcount = {}; 
                            taskcount["actual_range"] = returnData.actual_range.aggregate.count;
                            taskcount["today"] = returnData.today.aggregate.count;
                            taskcount["line"] = x.line_id; 
                            taskcount["schema"] = childSchema 
                            return taskcount;
                        }
                        else{                        
                            let taskcount = {}; 
                            taskcount["actual_range"] = 0;
                            taskcount["today"] = 0;
                            taskcount["line"] = x.line_id;  
                            taskcount["schema"] = childSchema 
                            return taskcount;
                        }
                    })
                    .catch((e) => {
                        let taskcount = {}; 
                            taskcount["actual_range"] = 0;
                            taskcount["today"] = 0;
                            taskcount["line"] = x.line_id;  
                            return taskcount;
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
    return {  TaskCountLoading, TaskCountData, TaskCountError, getTaskCount };
};

export default useGetTasks;