import React,{useEffect,useState} from 'react';
import { useTranslation } from "react-i18next";
import Card from "components/Core/KPICards/KpiCardsNDL"; 
import CircularProgress  from 'components/Core/ProgressIndicators/ProgressIndicatorNDL';
import PackageIcon from 'assets/neo_icons/Dashboard/Package_icon.svg'  
import { dashBtnGrp,userDefaultLines } from 'recoilStore/atoms';
import { useRecoilState } from 'recoil';
import usePartSignalCount from '../hooks/useMultiLinePartSignal';
import TypographyNDL from 'components/Core/Typography/TypographyNDL.jsx'
import PartsIcon from 'assets/neo_icons/newUIIcons/Parts.svg?react';


function PartsProduced(props){
    const { t } = useTranslation();    
    const [btGroupValue] = useRecoilState(dashBtnGrp);
    const [Details,setDetails] = useState({});
    const [plantata,setPlantData] = useState([])
    const [userDefaultList] = useRecoilState(userDefaultLines);   
    const { PartSignalCountLoading, PartSignalCountData, PartSignalCountError, getPartSignalCount } = usePartSignalCount();
    useEffect(()=>{
        getPartSignalCount(btGroupValue,props.customdatesval,props.headPlant); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[btGroupValue])

    useEffect(()=>{
        if(props.DatesSearch){
            getPartSignalCount(btGroupValue,props.customdatesval,props.headPlant);
            props.loading(true)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.DatesSearch])


    useEffect(()=>{
        if(!PartSignalCountLoading && PartSignalCountData && !PartSignalCountError){
            // console.log('PartSignalCountData',PartSignalCountData)
            let exist = {...Details};
            let actual = 0;
            let today = 0; 
            const formatted = PartSignalCountData.map(x=>{
                console.log(x,"part x")
                const currObj = {...x};
                const childPlant = userDefaultList.filter(y=> y.line.id === x.line).map(z=>z.line)[0]; 
                currObj['line_name'] = childPlant.name;
                currObj["plantName"]= childPlant.name;
                currObj['schema'] = childPlant.plant_name
                currObj['module'] = 'dashboard';
                currObj['type'] = 'production';
                currObj['title'] = "Parts Produced";
                currObj['icon'] = PackageIcon;
                actual += x.actual_range;
                today += x.today; 
                return currObj;
            })
            setPlantData(formatted);
            // console.log('taskcount',actual,today,last_thirty,current_thirty)
            exist['actual'] = actual;
            exist['today'] = today; 
            // console.log('exist',exist)
            setDetails(exist);
            props.loading(false,formatted,'parts') 
        }  
        if(!PartSignalCountLoading && !PartSignalCountData && PartSignalCountError){
            setPlantData([]);
            setDetails({});
            props.loading(false) 
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[PartSignalCountData])
    return(
        <Card  style={{cursor:'pointer',height:"160px"}}  onClick={()=>props.getChild(plantata,'parts')}>
                            <div   className='flex flex-col justify-between gap-2'>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <TypographyNDL variant="label-01-s" color='secondary' style={{ textAlign: 'left' }} value={t("Parts Produced")} />
                                    {PartSignalCountLoading ? <CircularProgress disableShrink size={15} color="primary" /> :<> </>}
                               <PartsIcon />
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
export default PartsProduced;