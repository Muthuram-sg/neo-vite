import React,{useEffect,useState} from 'react';
import { useTranslation } from "react-i18next";
import { userDefaultLines,dashBtnGrp} from 'recoilStore/atoms';
import { useRecoilState } from "recoil";
import Card from "components/Core/KPICards/KpiCardsNDL"; 
import CircularProgress  from 'components/Core/ProgressIndicators/ProgressIndicatorNDL';
import TaskIcon from 'assets/neo_icons/Dashboard/Task_icon.svg' 
import useGetTasks from '../hooks/useGetTasks';
import TypographyNDL from 'components/Core/Typography/TypographyNDL.jsx'
import TasksIcon from 'assets/neo_icons/newUIIcons/Tasks.svg?react';



function Tasks(props){
    const { t } = useTranslation(); 
    const [btGroupValue] = useRecoilState(dashBtnGrp);
    const [Details,setDetails] = useState({});
    const [plantata,setPlantData] = useState([])
    const [userDefaultList] = useRecoilState(userDefaultLines);  
    const {  TaskCountLoading, TaskCountData, TaskCountError, getTaskCount } = useGetTasks();    
    useEffect(()=>{       
        getTaskCount(btGroupValue,props.customdatesval,props.headPlant);  
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[btGroupValue])

    useEffect(()=>{  
        if(props.DatesSearch){     
            getTaskCount(btGroupValue,props.customdatesval,props.headPlant);
            props.loading(true)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.DatesSearch])
    
    useEffect(()=>{
        if(!TaskCountLoading && TaskCountData && !TaskCountError){
            let exist = {...Details};
            let actual = 0;
            let today = 0;
            const formatted = TaskCountData.map(x=>{
                const currObj = {...x};
                const childPlant = userDefaultList.filter(y=> y.line.id === x.line).map(z=>z.line)[0]; 
                console.log(currObj,"obj")
                currObj['line_name'] = childPlant.name;
                currObj["plantName"]= childPlant.name;
                currObj['module'] = 'Tasks';
                currObj['schema'] = childPlant.plant_name
                currObj['type'] = 'Tasks';
                currObj['title'] = "Tasks";
                currObj['icon'] = TaskIcon;
                actual += x.actual_range;
                today += x.today;
                return currObj;
            })
            setPlantData(formatted);
            // console.log('taskcount',actual,today,last_thirty,current_thirty)
            exist['actual'] = actual;
            exist['today'] = today;
            setDetails(exist);
            props.loading(false,formatted,'Tasks')
        }  
        if(!TaskCountLoading && !TaskCountData && TaskCountError){
            setPlantData([]);
            setDetails({});
            props.loading(false)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[TaskCountData])
    return(
        <Card  style={{cursor:'pointer',height:"160px"}} onClick={()=>props.getChild(plantata,'Tasks')}>
                            <div  className='flex flex-col justify-between gap-2' >
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <TypographyNDL variant="label-01-s" color='secondary' style={{ textAlign: 'left' }} value={t("Tasks")} />
                                    {TaskCountLoading ? <CircularProgress disableShrink size={15} color="primary" /> : <></>}
                                    <TasksIcon />
                                </div>
                                <TypographyNDL mono  variant="display-lg">
                                {Details && !isNaN(Details.actual) && Details.actual !== null?Details.actual:"--"}</TypographyNDL>
                                <div className='flex flex-col gap-0.5'>
                                                                            <TypographyNDL variant="paragraph-xs" color='secondary'>{t("Today")}</TypographyNDL>
                                                                            <TypographyNDL mono variant="paragraph-xs">{Details && !isNaN(Details.today) && Details.today !== null ?Details.today:"--"}</TypographyNDL>
                             </div>
                                 
                            </div>
                        </Card>
    )
}
export default Tasks;