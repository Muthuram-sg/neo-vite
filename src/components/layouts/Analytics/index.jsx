import React,{useEffect,useState} from 'react'; 
import {useParams} from 'react-router-dom'
import SignatureAnalysis from './components/SignatureAnalysis/SignatureAnalysis';
import {currentPage,ErrorPage } from "recoilStore/atoms";
import { useRecoilState } from "recoil";

export default function Analytics() {
    let {moduleName,queryParam} = useParams()
    // Split the query string at '&' to separate each key-value pair
    const paramsArray = queryParam ? queryParam.split('&') : [];  
    // Create an empty object to store the values
    const queryParams = {}; 
    // Iterate over the array and split each key-value pair
    paramsArray.forEach(param => {   const [key, value] = param.split('=');   
    queryParams[key] = value; }); 
    // Extracting the respective values
    const range = queryParams['range'];
    const asset = queryParams['asset'];
    const metric = queryParams['metric'];
    const normalize = queryParams['normalize'];
    const [moduleParam,setModuleParam] = useState('')
    const [,setErrorPage] = useRecoilState(ErrorPage)
    const [assetParam,setAssetParam] = useState(asset ? asset : JSON.parse(localStorage.getItem('analyticsDefault'))?.asset?.[0])
    const [metricParam,setMetricParam] = useState(metric ? metric : JSON.parse(localStorage.getItem('analyticsDefault'))?.metric?.map((x) => x.title).join(','))
    const [normalizeParam,setNormalizeParam] = useState(normalize ? normalize : JSON.parse(localStorage.getItem('analyticsDefault'))?.normalize)
    const [rangeParam,setRangeParam] = useState(range ? range : null );
    const [, setCurPage] = useRecoilState(currentPage);
    useEffect(() => {
        setCurPage("analytics");
        if(['superimpose','continuous'].includes(moduleName) && queryParam && (queryParam.includes('=') || queryParam.includes('&'))){
            setModuleParam(moduleName)
            if(asset && metric && normalize && range){
                setAssetParam(asset)
                setMetricParam(metric)
                setNormalizeParam(normalize)
                setRangeParam(range)
            }else{
                setErrorPage(true)
            }
        }else if(moduleName && !['superimpose','continuous'].includes(moduleName) ){
            setErrorPage(true)
        }else if(['superimpose','continuous'].includes(moduleName) && queryParam && !(queryParam.includes('=') || queryParam.includes('&')) ){
            setErrorPage(true)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [queryParam,moduleName]);
    return (
        <div > 
            <SignatureAnalysis module={moduleParam} setModule={setModuleParam} asset={assetParam} metric={metricParam} normalize={normalizeParam} range={rangeParam}/>
        </div>
    )
}
