import React,{useEffect} from 'react'; 
import SAContinuous from './SAContinuous';
import SASuperImpose from './SASuperImpose';
import { useRecoilState } from "recoil";
import {  SigTabval } from "recoilStore/atoms";
import { useTranslation } from 'react-i18next';
import AnalyticsTabs from "components/layouts/Explore/ExploreMain/ExploreTabs/components/ExploreTabs.jsx" 
 

export default function SignatureTabs(props) {
    const { t } = useTranslation(); 
     
    const [tabValue, setTabValue] = useRecoilState(SigTabval);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };
    useEffect(() => {
       if(props.module === 'continuous'){
        setTabValue(0)
       }
       else if(props.module === 'superimpose'){
        setTabValue(1)
       }
    })
    const MenuList = [
        { 
            title: t("Continuous"), 
            content: <SAContinuous normalize={props.normalizeParam} normalizeParam={props.normalize} asset={props.asset} metric={props.metric}/>
        },
        {
            title: t("Superimpose"), 
            content: <SASuperImpose normalize={props.normalizeParam} normalizeParam={props.normalize} asset={props.asset} metric={props.metric}/>
        },
        
        
    ];
    console.log("normalize in sigtopbar",props.normalize)
    return (
        <React.Fragment>
            <div className='bg-Background-bg-primary dark:bg-Background-bg-primary-dark'>
            <AnalyticsTabs MenuTabs={MenuList} width={"300px"} currentTab={tabValue} tabChange={handleTabChange}/>
            </div>
            
        </React.Fragment>
    );
}