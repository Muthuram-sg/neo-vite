import React, { useEffect, useState } from "react";
import  useTheme from "TailwindTheme";
import {selectedInstrument, selectedPlant, customdates, selectedInterval, themeMode } from "recoilStore/atoms"
import { useRecoilState } from "recoil";
import TypographyNDL from 'components/Core/Typography/TypographyNDL'
import CombinedTrendGraph from "./combinedTrendGraph"
import useGetFetchGroupLimits from "../../hooks/useGetGroupedLimits.jsx"
import Maximize from 'assets/neo_icons/Explore/expand.svg?react';
import Minimize from 'assets/neo_icons/Explore/minimize.svg?react';
import useGroupedTrends from "../../hooks/useGroupedTrends.jsx";
import LoadingScreenNDL from "LoadingScreenNDL";
import { metricConst } from "./constant.jsx";
import TrendsChartGrouped from "../TrendsGraph/components/TrendsChartGrouped.jsx";


import Alarm from 'assets/neo_icons/Explore/Explore_Icons/Alarm.svg?react';

import Button from 'components/Core/ButtonNDL';

import ListNDL from 'components/Core/DropdownList/ListNDL.jsx';

export default function TrendsGroup({ props }){
    const mainTheme = useTheme();
    const [selectedExploreInstrument] = useRecoilState(selectedInstrument)
    const [customdatesval,] = useRecoilState(customdates);
    const [selectedIntervals] = useRecoilState(selectedInterval);
    const [currTheme] = useRecoilState(themeMode)
    const [selectedValue] = useState([]);
    
    const [detail, setDetail] = useState(false)
    const [data, setData] = useState({})
    const [, setLoading] = useState(true)

    setTimeout(() => {
        setLoading(false)
    }, 3000)

    const { groupedtrendsdataLoading, groupedtrendsdataData, getGroupedTrends } = useGroupedTrends();
    
    const { fetchGroupLimitsLoading, fetchGroupLimitsData, fetchGroupLimitsError, getFetchGroupLimits } = useGetFetchGroupLimits()
    const [headPlant] = useRecoilState(selectedPlant);
    const [ydata, setYdata] = useState({})
    const [passingData, setPassingData] = useState();
    const [groupedMetric, setGroupedMetric] = useState([])
    const [groupedTitle, setGroupedTtitle] = useState([])
    const [groupedColor, setGroupedColor] = useState([])
    const [overallData, setOverallData] = useState([])

    const [limitannots, setlimitannotations] = useState([])
    const [min, setmin] = useState(undefined)
    const [max, setmax] = useState(undefined)
    const [yAxisDatamax] = useState(null)
    const [yAxisDatamin] = useState(null)
    const [forecastAnnotation] = useState('');

    let menuOption=[]
    const [openmenu,setopenmenu] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuOptions,setmenuOptions]=useState(menuOption)
    const handleClick = (event) => {
        setopenmenu(!openmenu)
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setopenmenu(false)
        setAnchorEl(null);
    };

    

    function optionChange(e){
        let menu = menuOptions.map((f) => {
            if(f.id === e.id) {
                return { ...f, checked: !e.checked}
            } else {
                return f;
            }
        })
        setmenuOptions(menu)
        handleClose()
        let checked = menu.filter((x) => x.checked === true)
        let temp = {
            metric_title: []
        }
        let t_data = Object.values(data)?.[0][0]
        checked.forEach((x) => {
            temp = {
                ...t_data,
                metric_title: [ ...temp.metric_title, x.name ],
                metric_val: temp.metric_val ? temp.metric_val + ',' + x.id : x.id,
            }
        })
        console.log(temp)
        if(temp.metric_title.length != 0){
            getFetchGroupLimits([temp])
        } else {
            getFetchGroupLimits([ {
                ...t_data,
                metric_val: '',
                metric_title: []
            } ])
        }
    }



    function toggleChange(e,opt){
        
    }

    useEffect(() => {
        console.log(")))))))", selectedExploreInstrument)
        let metric = ''
        let grouped_metric = []
        let grouped_title = []
        let grouped_color = []
        for(let i = 0; i<selectedExploreInstrument.length; i++){
            metric = metric !== '' ? `${metric},${Object.values(selectedExploreInstrument[i])[0][0]?.metric_val}` : Object.values(selectedExploreInstrument[i])[0][0]?.metric_val
            grouped_metric.push(Object.values(selectedExploreInstrument[i])[0][0]?.metric_val.split(','))
            grouped_title.push(Object.values(selectedExploreInstrument[i])[0][0]?.metric_title)
            grouped_color.push(Object.values(selectedExploreInstrument[i])[0][0]?.colour)
        }
        let res = { ...Object.values(selectedExploreInstrument[0])[0][0] }
        res.metric_val = metric
        setDetail(null)
        setPassingData(res)
        setGroupedColor(grouped_color)
        setGroupedTtitle(grouped_title)
        setGroupedMetric(grouped_metric)
        getGroupedTrends([ res ], headPlant.schema, false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedExploreInstrument])

    useEffect(() => {
        if(passingData || !detail){
            getGroupedTrends([ passingData ], headPlant.schema, false, customdatesval)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customdatesval, selectedIntervals, detail])

    useEffect(()=> {
        if(detail){
        if(groupedtrendsdataData?.data.length > 0) {
            let units = Object.values(data)?.[0][0].metric_val.split(',')
            let raw_data = Object.values(data)?.[0][0]
            let res_data = []
            units.map((x, i) => {
                res_data.push({
                    // name: `${raw_data.metric_title[i]}(${x})`,
                    name: `${raw_data.metric_title[i]}`,
                    id: raw_data.id,
                    color: raw_data.colour[i],
                    type: 'line',
                    data: groupedtrendsdataData?.data?.[0].filter((z) => z.key === x)
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
        }
        } else {
            if(groupedtrendsdataData?.data?.length> 0){
                let data = []
                let grouped = []
                setOverallData([])

                groupedMetric.forEach((z) => {
                    console.log(z)
                    data = []
                    groupedtrendsdataData?.data?.[0]?.map((xx) => {
                        if(z.includes(xx.key)){
                            data.push(xx)
                        }
                    })
                    grouped.push(data)
                })
                setOverallData(grouped)
                console.log("DATAT___", grouped)
            }
            
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groupedtrendsdataData])


    useEffect(() => {
        setOverallData([])
    }, [headPlant.id])

    

    useEffect(() => {
        if(detail){
            let options = Object.values(data)?.[0][0].metric_title
            let menuOption = []
            options.map((x) => {
                menuOption.push({id: x.replace(' ', '_').toLowerCase(), name: x, stroke:mainTheme.colorPalette.primary, toggle: false, checked:false })
            })
            setmenuOptions(menuOption)
            getGroupedTrends(Object.values(data)?.[0], headPlant.schema, false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [detail])

    useEffect(() => {
            if(detail){
                if (!fetchGroupLimitsLoading && fetchGroupLimitsData  && !fetchGroupLimitsError) {
                    let annotations = fetchGroupLimitsData
                    console.log("fetchGroupLimitsData_____", fetchGroupLimitsData)
                    setlimitannotations(annotations)
                    let annotmax = Math.max(...annotations.filter((item) => item !== undefined).map((val) => { return val.y }))
                    let annotmin = Math.min(...annotations.filter((item) => item !== undefined).map((val) => { return val.y }))
        
                    yAxisDatamax < annotmax && isFinite(annotmax) ? setmax(annotmax) : setmax(undefined)
                    yAxisDatamin > annotmin && isFinite(annotmin) ? setmin(annotmin) : setmin(undefined)
        
                   
                }
            } else {
                console.log("VALUE__", fetchGroupLimitsData)
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchGroupLimitsLoading, fetchGroupLimitsData, fetchGroupLimitsError])

    const setcoord = (x, y, iid, metric) => {
        props.setcoord(x, y, iid, metric)
    }

    return (
        <>
        {detail 
        ?
            <div style={{padding: '10px',  backgroundColor: currTheme === 'dark' ? '#191919' : '#F9F9F9', height: '93%', overflowX: 'hidden'}}>
                
                <div style={{ border: '1px solid',  borderColor: currTheme === 'dark' ? '#2a2a2a' : '#E8E8E8', borderRadius: '16px' , backgroundColor: currTheme === 'dark' ? '#191919' :'#FCFCFC' ,padding: '5px 15px 5px 10px', margin: '5px', marginRight: '20px', height: '700px'}}>
                    <div style={{ paddingBottom: '5px', display: "flex", alignItems: 'center', justifyContent: 'space-between'}}> 
                       <TypographyNDL variant="xl-heading-01" style={{ padding: 5 }}>{Object.values(data)?.[0][0].instrument_name}&nbsp;({ Object.values(data)?.[0][0].unit})</TypographyNDL>
                       <div>

                        <Button 
                            // stroke={'#646464'}
                            icon={Alarm} 
                            type='ghost' 
                            onClick={handleClick} />
                        <Button 
                            style={{ paddingLeft: 0, paddingRight: 0}}
                            icon={Minimize} 
                            type='ghost' 
                            onClick={() => {setDetail(false)}} />
                        </div>
                        <ListNDL 
                            options={menuOptions}  
                            Open={openmenu}  
                            optionChange={optionChange}
                            keyValue={"name"}
                            keyId={"id"}
                            id={"popper-Menu"}
                            onclose={handleClose}
                            anchorEl={anchorEl}
                            width="220px"
                            IconButton
                            isIconRight
                            toggleChange={toggleChange}
                            selectAll={false}
                            selectedOpt={selectedValue}
                            selectAllText={"Select All"}
                            multiple={true}
                        />
                    </div>
                    {
                        groupedtrendsdataLoading 
                        ? 
                            <div style={{ textAlign: "center", height: 990, alignContent: 'center'  }}>
                                <TypographyNDL value={groupedtrendsdataLoading ? "Please wait" : "No Data"} variant="4xl-body-01" style={{ color: '#0F6FFF' }} />
                                <TypographyNDL value={groupedtrendsdataLoading ? "Fetching Data" : "Edit OR Reload"} variant="heading-02-sm" />
                            </div>
                        :
                            <TrendsChartGrouped showLegend={true} details={true} annotations={limitannots} height={620} hideSeriess={() => {}} yData={ydata} setcoord={setcoord} min={min} max={max} isCSV={false}  forecastAnnotation={forecastAnnotation} />
                    }
                    {groupedtrendsdataLoading ? <LoadingScreenNDL/> : <></>}
                </div>
            </div>
        : 
            <div style={{ padding: '10px', backgroundColor: currTheme === 'dark' ? '#191919' : '#F9F9F9', height: '94%', overflowX: 'hidden'}}>
            <TypographyNDL  variant="xl-heading-02" style={{ padding: 12 , fontWeight: 600 }}>{Object.values(selectedExploreInstrument?.[0])[0][0]?.hierarchy.split('_').slice(1).join(' / ')} &nbsp; ({Object.values(selectedExploreInstrument?.[0])[0][0]?.id})</TypographyNDL>
            
                {
                    overallData.flat().length > 0 ? <>
                    <div style={{display: 'grid', gap: '8px',  gridTemplateColumns: "49% 49%"}}>
                        {
                            selectedExploreInstrument?.map((x, index) => (
                                <div key={index+1} style={{ border: '1px solid', borderColor: currTheme === 'dark' ? '#2a2a2a' : '#E8E8E8', borderRadius: '16px' , backgroundColor:currTheme === 'dark' ? '#191919' : '#FCFCFC' ,padding: '5px 10px 5px 10px'}}> 
                                    <div style={{ paddingBottom: '5px', display: "flex", alignItems: 'center', justifyContent: 'space-between'}}> 
                                        <TypographyNDL style={{ fontSize: '18px', color: currTheme === 'dark' && '#eeeeee' }} fontSize={18}>{metricConst[Object.keys(x)?.[0]] || Object.keys(x)?.[0]}</TypographyNDL>
                                        <div style={{ display: "flex", alignItems: 'center', justifyContent: 'end'}}>
                                            <Button icon={Maximize} style={{ paddingLeft: 0, paddingRight: 0}} type='ghost' onClick={() => {setData(x);setDetail(true)}} />
                                        </div>
                                    </div>
                                    
                                    <CombinedTrendGraph 
                                        index={index} 
                                        setcoord={setcoord} 
                                        setLoading={(val) => setLoading(false)} 
                                        data={overallData[index]}
                                        raw_data={x}
                                        metric={groupedMetric}
                                        selectedMetric={groupedMetric[index]}
                                        title={groupedTitle[index]}
                                        color={groupedColor[index]}
                                        key={Object.values(selectedExploreInstrument?.[0])[0][0]?.instrument_name}
                                    />
                                </div>
                            ))
                        }
                    </div>
                    </>
                    : <>
                    <div style={{ textAlign: "center", height: 990, alignContent: 'center'  }}>
                                <TypographyNDL value={"No Data Found"} variant="4xl-body-01" style={{ color: '#0F6FFF' }} />
                                <TypographyNDL value={"Please select other instrument/metric"} variant="heading-02-sm" />
                            </div>
                    </>
                }
                {groupedtrendsdataLoading ? <LoadingScreenNDL/> : <></>}
            </div>
        }
        </>
    )
}