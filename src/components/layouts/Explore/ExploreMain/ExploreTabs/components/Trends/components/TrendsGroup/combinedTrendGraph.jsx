import React, { useEffect, useState } from "react";
import useGroupedTrends from "../../hooks/useGroupedTrends.jsx";
import useGetFetchGroupLimits from "../../hooks/useGetGroupedLimits.jsx"
import Typography from 'components/Core/Typography/TypographyNDL';
import ApexCharts from 'apexcharts';
import TrendsChartGrouped from "../TrendsGraph/components/TrendsChartGrouped.jsx";

export default function CombinedTrendGraph(props){

    const { groupedtrendsdataLoading } = useGroupedTrends();
    const { fetchGroupLimitsLoading, fetchGroupLimitsData, fetchGroupLimitsError } = useGetFetchGroupLimits()
    const [ydata, setYdata] = useState({})
    
    const [limitannots, setlimitannotations] = useState([])
    const [min, setmin] = useState(undefined)
    const [max, setmax] = useState(undefined)
    const [yAxisDatamax] = useState(null)
    const [yAxisDatamin] = useState(null)
    const [forecastAnnotation] = useState('');

    const setcoord = (x, y, iid, metric) => {
        props.setcoord(x, y, iid, metric)
    }

    useEffect(() => {
            if (!fetchGroupLimitsLoading && fetchGroupLimitsData?.length > 0 && !fetchGroupLimitsError) {
                let annotations = fetchGroupLimitsData
                console.log("fetchGroupLimitsData_____", props.index, fetchGroupLimitsData)
                setlimitannotations(annotations)
                let annotmax = Math.max(...annotations?.filter((item) => item !== undefined)?.map((val) => { return val.y }))
                let annotmin = Math.min(...annotations?.filter((item) => item !== undefined)?.map((val) => { return val.y }))
    
                yAxisDatamax < annotmax && isFinite(annotmax) ? setmax(annotmax) : setmax(undefined)
                yAxisDatamin > annotmin && isFinite(annotmin) ? setmin(annotmin) : setmin(undefined)
    
                try {
                    for(let i = 0 ;i < annotations.length; i++){
                        ApexCharts.exec(`trendChart-${props?.index}`, 'addYaxisAnnotation', annotations)
                    }
                } catch (err) {
                    console.log("error in TrendsOnline while plotting alarm limits", err)
                }
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [fetchGroupLimitsLoading, fetchGroupLimitsData, fetchGroupLimitsError])

    useEffect(()=> {
        // getFetchGroupLimits(Object.values(props.raw_data)?.[0])
        try{
        if(props?.data?.length > 0) {
            let units = props.selectedMetric
            let raw_data = props.data
            let res_data = []
            units.map((x, i) => {
                res_data.push({
                    // name: `${props.title[i]}(${x})`,
                    name: `${props.title[i]}`,
                    id: raw_data.iid,
                    color: props.color[i],
                    type: 'line',
                    data: props?.data?.filter((z) => z.key === x)
                    .map((zz) => {
                        return {
                            x: new Date(zz.time).getTime(),
                            y: zz.value
                        }
                    })
                })
            })
            setYdata({ 
                data: res_data, 
                "annotation": [],
                "charttype": "timeseries" 
            })
            props.setLoading(false)
        }
    }
    catch(e){
        console.log(e)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props?.data])
    


    return (
        Object.values(ydata)?.length > 0 
        ?   <TrendsChartGrouped index={props.index} annotations={limitannots} showLegend={true} hideSeriess={() => {}} yData={ydata} setcoord={setcoord} min={min} max={max} isCSV={false}  forecastAnnotation={forecastAnnotation} height={400}/>
        : 
            <div style={{ textAlign: "center", height: 400, alignContent: 'center' }}>
                <Typography value={groupedtrendsdataLoading ? "Please wait" : "No Data"} variant="2xl-body-01" style={{ color: '#0F6FFF' }} />
                <Typography value={groupedtrendsdataLoading ? "Fetching Data" : "Edit OR Reload"} variant="heading-02-sm" />
            </div>
    )
}