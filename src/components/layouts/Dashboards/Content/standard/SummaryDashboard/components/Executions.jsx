import React,{useEffect,useState} from 'react';
import { useTranslation } from "react-i18next";
import { userDefaultLines,dashBtnGrp} from 'recoilStore/atoms';
import { useRecoilState } from "recoil";
import Card from "components/Core/KPICards/KpiCardsNDL"; 
import CircularProgress  from 'components/Core/ProgressIndicators/ProgressIndicatorNDL';
import Execution from 'assets/neo_icons/Dashboard/Executions_icon.svg' 
import useGetExecution from '../hooks/useGetExecution';
import TypographyNDL from 'components/Core/Typography/TypographyNDL.jsx'
import ExecutionsIcon from 'assets/neo_icons/newUIIcons/Execution.svg?react';


function Executions(props){
    const { t } = useTranslation(); 
    const [btGroupValue] = useRecoilState(dashBtnGrp);
    const [Details,setDetails] = useState({});
    const [plantata,setPlantData] = useState([])
    const [userDefaultList] = useRecoilState(userDefaultLines);  
    const {  ExecutionCountLoading, ExecutionCountData, ExecutionCountError, getExecutionCount } = useGetExecution();    
    useEffect(()=>{       
        getExecutionCount(btGroupValue,props.customdatesval,props.headPlant); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[btGroupValue])

    useEffect(()=>{  
        if(props.DatesSearch){
            getExecutionCount(btGroupValue,props.customdatesval,props.headPlant); 
            props.loading(true)
        }    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.DatesSearch])

    useEffect(()=>{
        if(!ExecutionCountLoading && ExecutionCountData && !ExecutionCountError){
            let exist = {...Details};
            let actual = 0;
            let today = 0;
            const formatted = ExecutionCountData.map(x=>{
                console.log(x,"exec x")
                const currObj = {...x};
                const childPlant = userDefaultList.filter(y=> y.line.id === x.line).map(z=>z.line)[0];
                currObj['line_name'] = childPlant.name;                
                currObj['module'] = 'dashboard';
                currObj['schema'] = childPlant.plant_name
                currObj["plantName"]= childPlant.name;                
                currObj['type'] = 'production';
                currObj['title'] = "Execution";
                currObj['icon'] = Execution;
                actual += x.actual_range;
                today += x.today;
                return currObj;
            })
            setPlantData(formatted);
            // console.log('execution_count',actual,today,last_thirty,current_thirty)
            exist['actual'] = actual;
            exist['today'] = today;            
            setDetails(exist);
            props.loading(false,formatted,'Executions')
        }  
        
        if(!ExecutionCountLoading && !ExecutionCountData && ExecutionCountError){
            setPlantData([]);
            setDetails({});
            props.loading(false)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[ExecutionCountData])
    return(
        <Card  style={{cursor:'pointer',height:"160px"}} onClick={()=>props.getChild(plantata,'Executions')}>
                            <div  className='flex flex-col justify-between gap-2' >
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <TypographyNDL variant="label-01-s" color='secondary' style={{ textAlign: 'left' }} value={t("Execution")}/>
                                    {ExecutionCountLoading ? <CircularProgress disableShrink size={15} color="primary" /> : <></>}
                                    <ExecutionsIcon />
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
export default Executions;