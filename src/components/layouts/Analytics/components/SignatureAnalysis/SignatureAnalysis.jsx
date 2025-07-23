import React from 'react';
import SignatureTabs from './SignatureTabs';
import SATable from './SATable/SATable';
import { useRecoilState } from "recoil";
import {  SigTabval, customdates, MetricSANames, saAssetArray, selectedPlant } from "recoilStore/atoms";
export default function SignatureAnalysis(props) {
    const [normalize,setnormalize]=React.useState(JSON.parse(localStorage.getItem('analyticsDefault'))?.normalize || false)
    const [tabValue] = useRecoilState(SigTabval);
    const [Customdatesval] = useRecoilState(customdates);
    const [assetArray] = useRecoilState(saAssetArray);
    const [MetricArray] = useRecoilState(MetricSANames)
    const [headPlant] = useRecoilState(selectedPlant);

   
   
    React.useEffect(() => {
        // if(headPlant.id){
            let analyticDefaults = JSON.parse(localStorage?.getItem('analyticsDefault'))?.startDate ? JSON.parse(localStorage?.getItem('analyticsDefault')) : null
            if(analyticDefaults){
                localStorage.setItem('analyticsDefault', JSON.stringify({
                    tabValue: tabValue,
                    startDate: analyticDefaults ? new Date(analyticDefaults.startDate) :  new Date(),
                    endDate: analyticDefaults ? new Date(analyticDefaults.endDate) : new Date(),
                    asset: assetArray,
                    metric: MetricArray.flat(),
                    normalize: normalize
                }))
            }
            
        // }
        

    }, [tabValue, assetArray, MetricArray, normalize])  

    const setnormalizeval=(val)=>{
       setnormalize(val)
    } 
    return (
        <div className="bg-Background-bg-primary dark:bg-Background-bg-primary-dark">
        <SignatureTabs normalize={normalize} normalizeParam={props.normalize} asset={props.asset} metric={props.metric} module={props.module} setModule={props.setModule} range={props.range} />
            <SATable normalize={normalize} setnormalize={setnormalizeval} normalizeParam={props.normalize} asset={props.asset} metric={props.metric} module={props.module} setModule={props.setModule} range={props.range}/>
        </div>
    )
}