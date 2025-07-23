import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { useRecoilState } from "recoil";
import {
    onlineTrendsMetrArr,
    onlineTrendsChipArr,
    TrendsMeterSummaryArr, selectedPlant, user, snackMessage, snackToggle, snackType, customdates, trendLegendView,
    DateSrch,dataForecastenable,normalMode, NormalizeMode
} from "recoilStore/atoms";
import moment from 'moment';
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";

import LegendsTopBar from './components/LegendsTopBar';
import LegendItem from './components/LegendItem';
import useCheckPointAnnot from './hooks/usecheckPointAnnot';
import useUpdateAnnotation from './hooks/useupdateAnnotation';
import useAddAnnotation from './hooks/useaddAnnotation';
import useSummaryData from '../../hooks/useSummaryData';
import commontrends from '../../common';



const TrendsLegends = forwardRef((props, ref) => {
    const [selectedmeterandchip, setselectedMeterAndChip] = useRecoilState(onlineTrendsMetrArr);
    const [, setSelectedChipArr] = useRecoilState(onlineTrendsChipArr);
    const [legendView, setLegendView] = useRecoilState(trendLegendView);
    const [annotView, setannotView] = useState([])
    const [commentView, setcommentView] = useState([])
    const [checkedMetricsInLegends, setCheckedMetricsInLegends] = useState([])
    const [allChecked, setAllChecked] = useState(false)
    const [headPlant] = useRecoilState(selectedPlant);
    const [, setselectedMeterSummary] = useRecoilState(TrendsMeterSummaryArr);
    const [selectedMetric, setSelectedMetric] = useState(props.metrics)
    const [comment, setComment] = useState('')
    const [tempComment,setTempComment] = useState('')
    const [x, setxcoord] = useState('')
    const [y, setycoord] = useState('')
    const [markedmetric,setmarkedmetric]=useState('')
    const [currUser] = useRecoilState(user);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [, setOpenSnack] = useRecoilState(snackToggle);

    const [customdatesval,] = useRecoilState(customdates);
    const [, setDatesSearch] = useRecoilState(DateSrch);
    const [forecastconfig, setForecastconfig] = useRecoilState(dataForecastenable);
    const [, setGraphMode] = useRecoilState(normalMode);
    const [, setNormalizeMode] = useRecoilState(NormalizeMode)
   
    //Hooks
    const { checkpointannotLoading, checkpointannotData, checkpointannotError, getCheckPointAnnot } = useCheckPointAnnot()
    const { updateannotLoading, updateannotData, updateannotError, getUpdateAnnotation } = useUpdateAnnotation()
    const { addAnnotationLoading, addAnnotationData, addAnnotationError, getAddAnnotation } = useAddAnnotation()
    const { summaryLoading, summaryData, summaryError, getSummaryData } = useSummaryData()
    useImperativeHandle(ref, () => ({
        setcoord: (xVal, yVal,iid,metric) => {
            setxcoord(moment(xVal).format())
            setycoord(yVal)
            setmarkedmetric(metric)
        },
        updateSummaryData: (meter) => {
            getSummaryData(meter, headPlant.schema)
        },
       
    }))

console.log(commentView,"view")
    useEffect(() => {


            let newmeters = [...selectedMetric]
            let { frmDate, toDate } = commontrends.getFromandToDate(props.selectedRange, customdatesval.StartDate, customdatesval.EndDate, headPlant)
            newmeters = newmeters.map((item, i) => {

                return Object.assign({}, item, { range: props.selectedRange, frmDate: frmDate, toDate: toDate })
            })

            localStorage.setItem('selectedChipArr', JSON.stringify(newmeters));
            setselectedMeterAndChip(newmeters)
            setSelectedMetric(newmeters)
            setDatesSearch(false)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.selectedRange,customdatesval])

    useEffect(() => {

        let newmeters = [...selectedMetric]

        newmeters = newmeters.map((item, i) => {

            if (Number(item.frequency) <= Number(props.selectedIntervals)) {
                return Object.assign({}, item, { interval: props.selectedIntervals })
            }

            else {
                return Object.assign({}, item);
            }
        })
        localStorage.setItem('selectedChipArr', JSON.stringify(newmeters));
        setselectedMeterAndChip(newmeters)
        setSelectedMetric(newmeters)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.selectedIntervals])



    useEffect(() => {

        let tempselectedmetric = [...selectedMetric]
        try {
            if (props.metrics.length > tempselectedmetric.length) {
                props.metrics.forEach((item) => {

                    if ((tempselectedmetric.findIndex((val) => val.id === item.id && val.metric_val === item.metric_val)) === -1) {

                        tempselectedmetric.push(item)
                    }
                })
            }
            else {
                tempselectedmetric.forEach((item) => {

                    if ((props.metrics.findIndex((val) => val.id === item.id && val.metric_val === item.metric_val)) === -1) {
                        let index = tempselectedmetric.findIndex((val) => val.id === item.id && val.metric_val === item.metric_val)

                        hideannot(tempselectedmetric[index])
                        tempselectedmetric.splice(index, 1)

                    }
                })
            }

        }
        catch (err) {
            console.log("ERR in legends", err)
        }
        setSelectedMetric(tempselectedmetric)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedmeterandchip.length])

    const removeMetrics = (val = '') => {
        if(val === 'all'){
            setselectedMeterAndChip([]);
            setSelectedMetric([])
            setSelectedChipArr([])
            setCheckedMetricsInLegends([])
        }
        else {
        let existingMeters = [...selectedmeterandchip]
        let tempmetrics = selectedMetric.filter(function (value, index) {
            if (value && checkedMetricsInLegends.indexOf(index) !== -1) {
                if ((value !== undefined) && (value.meter_value !== undefined)) {

                    let isForecastMetric = existingMeters[index].forecastenable;
                    if(forecastconfig && isForecastMetric)
                        setGraphMode(true);

                    hideannot(value);
                }
                
                //Remove from toggleLegend to remove annotations
                let toggledLegend = [...legendView];
                const key = `${value.metric_val}-${value.id}-${value.metric_title}`;
                if (toggledLegend.includes(key)) {
                    toggledLegend = toggledLegend.filter(tval => tval !== key)
                }
                setLegendView(toggledLegend);
            }
            else{
                if(existingMeters[index].forecastenable !== value.forecastenable){console.log("changed")
                    value.forecastenable = existingMeters[index].forecastenable;
                }
            }
            return checkedMetricsInLegends.indexOf(index) === -1;
        });
        let tempArr = tempmetrics.map(xvalue => xvalue.metric_val)
        setselectedMeterAndChip(tempmetrics);
        setSelectedMetric(tempmetrics)
        setSelectedChipArr(tempArr)
        setCheckedMetricsInLegends([])
        localStorage.setItem('selectedChipArr', JSON.stringify(tempmetrics));
    }
        
    }
    const showSeries = ((val, fft) => {
        let toggledLegend = [...legendView];
        const key = `${val.metric_val}-${val.id}-${val.metric_title}`;
        if (toggledLegend.includes(key)) {
            toggledLegend = toggledLegend.filter(tval => tval !== key)
        }

        setLegendView(toggledLegend);
        props.showSeries(val.metric_title + ' (' + val.id + ')', fft,val)
    })
    const hideSeries = ((val, fft) => {
        let toggledLegend = [...legendView];
        const key = `${val.metric_val}-${val.id}-${val.metric_title}`;
        if (!toggledLegend.includes(key)) {
            toggledLegend.push(key);
        }
        setLegendView(toggledLegend);
        props.hideSeries(val.metric_title + ' (' + val.id + ')', fft,val)
    }
    )

  

    const extractedDataArray = val => {
        props.extractedDataArray(val)
    }

    const getForecastSeries = (metric,key) => {
        props.getForecastSeries(metric,key)
    }

    const showannot = val => {
        let toggledannot = [...annotView];
        const key = `${val.metric_val}_${val.id}`;
        if (!toggledannot.includes(key)) {
            toggledannot.push(key);
        }

        setannotView(toggledannot);
        props.showannot(val.metric_title + ' (' + val.id + ')')
    }

    const hideannot = val => {
        
        let toggledannot = [...annotView];
        const key = `${val.metric_val}_${val.id}`;
        if (toggledannot.includes(key)) {
            toggledannot = toggledannot.filter(tval => tval !== key)
        }
        setannotView(toggledannot);
        const metricTitle = val.metric_title.replace(/\//g, '-');
        console.log(val, annotView, toggledannot, metricTitle)
        props.hideannot(metricTitle.replace(/[ ()]/g, '-')+ '-' + val.id + '-', val)
    }

    const setMetrics = (e, index) => {
        let data = selectedMetric.map((item, iVal) => {
            if (iVal === index) {
                return Object.assign({}, item, { checked: e.target.checked });
            }
            else {
                return Object.assign({}, item);
            }
        });


        if (e.target.checked) {
            checkedMetricsInLegends.push(index)
        }
        else {
            let i = checkedMetricsInLegends.indexOf(index)
            checkedMetricsInLegends.splice(i, 1)
            setAllChecked(false)
        }
        setSelectedMetric(data)
        localStorage.setItem('selectedChipArr', JSON.stringify(data));
    }


    const setAlertLimitMetric = (e) => {
        let data = selectedMetric.map((item) => {
            if (item.id === e.id && item.metric_val === e.metric_val) {
                return Object.assign({}, item, { alertenabled: !item.alertenabled});
            }
            else {
                return Object.assign({}, item);
            }
        });
        console.log("data",data)
        setSelectedMetric(data)
    }

useEffect(()=>{
let uncheckedbox = selectedMetric.filter(k=>k.checked === false)
if(uncheckedbox.length > 0){
    setAllChecked(false)
}
},[selectedMetric])


    const removeAllLegend = (e) => {
        if (allChecked) {
            setselectedMeterAndChip([]);
            setSelectedMetric([])
            setSelectedChipArr([])
            setLegendView([]);
            setCheckedMetricsInLegends([])
            localStorage.setItem('selectedChipArr', JSON.stringify([]));
            setForecastconfig(false)
            setGraphMode(false);
            setNormalizeMode(false)
        }
        else {
            if(e === 'all')
            {
                removeMetrics('all')
            } else {
                removeMetrics()
            }
        }
    }
    const changeLegendColour = (e, legend) => {

        let meterLegend = [...selectedMetric]
        const meters = meterLegend.map(val => {
            if (val.id === legend.id && val.metric_val === legend.metric_val) {
                let obj = { ...val };
                obj.colour = e.target.value;
                return obj;
            } else {
                return val;
            }
        })
        localStorage.setItem('selectedChipArr', JSON.stringify(meters));
        props.generateChart();
        setSelectedMetric(meters)
        setselectedMeterAndChip(meters);

    }

    const loadNormalData = () => {
        let newmeters = [...selectedMetric]
        props.setTrendsData([])
        props.fetchOnlineData(newmeters, false)
        getSummaryData(newmeters, headPlant.schema)
    }
   
    const handleCheckAll = () => {
        const updatedMetrics = selectedMetric.map((item,index) => {
            if(!allChecked)
            checkedMetricsInLegends.push(index)
            else
                checkedMetricsInLegends.splice(0, checkedMetricsInLegends.length)
            return { ...item, checked: !allChecked };
        });

        setSelectedMetric(updatedMetrics);
        setAllChecked(!allChecked);
    };
    
    
    

    useEffect(() => {
        if (!summaryLoading && summaryData && !summaryError) {
            updateSummary(selectedMetric, summaryData)
            setselectedMeterSummary(summaryData)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [summaryLoading, summaryData, summaryError])




    const updateSummary = (data, sdata) => {
        let newmeters = JSON.parse(JSON.stringify(data))
        sdata.flat(1).forEach((item) => {
            const index = newmeters
                .map((metric) => { return { "id": metric.id, "key": metric.metric_val } })
                .findIndex(i => i.id === item.iid && i.key === item.key)
            if (index >= 0) {
                newmeters[index].maximum = item.maximum
                newmeters[index].minimum = item.minimum
                newmeters[index].average = item.average
                newmeters[index].stddev = item.stddev
            }
        });
        setselectedMeterAndChip(newmeters)
        setSelectedMetric(newmeters)
    }


    const handlecommentchange = (e) => {
        setComment(e.target.value)
    }
 

    const addcomment = (metric_val, id,metric_title) => {
       console.log(metric_val, id,metric_title,"hi",markedmetric,commentView)
        if( (metric_title && metric_title + " (" + id + ")" === markedmetric) || !metric_title ) {
            let toggledcomment = [...commentView];
            const key = `${metric_val}_${id}`;
            console.log(commentView,key,toggledcomment,"check")
            if (!toggledcomment.includes(key)) {
                console.log('comment 1')
                toggledcomment.push(key);
            }
            else {
                console.log('comment 2',toggledcomment,key)
                toggledcomment = toggledcomment.filter(val => val === key)
            }
            console.log(toggledcomment,"toggle comment")
            setcommentView(toggledcomment)
        }
        else {
            setOpenSnack(true)
            SetType("warning")
            SetMessage("Select appropriate comment box")
        }
            

    }

console.log(commentView,"commentview")

    useEffect(() => {
        if (!updateannotLoading && updateannotData && !updateannotError) {
            if (updateannotData.data.affected_rows >= 1) {
                SetMessage("Comment Updated Successfully!")
                SetType("Success");
                setOpenSnack(true)
            }
            console.log("updateannotData",updateannotData)
            addcomment(updateannotData.metric_val, updateannotData.iid,updateannotData.metric_title)
            props.addpointannot(updateannotData.frm, updateannotData.to, updateannotData.metric_val, updateannotData.iid);
            setcommentView([])
        }
        else if (updateannotError && updateannotData) {
            SetMessage("Update Failed")
            SetType("Warning");
            setOpenSnack(true)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateannotLoading, updateannotData, updateannotError])

    useEffect(() => {
        if (!addAnnotationLoading && addAnnotationData && !addAnnotationError) {
            if (addAnnotationData.data.affected_rows >= 1) {
                SetMessage("Comment Added Successfully!")
                SetType("Success");
                setOpenSnack(true)
            }
            console.log("addAnnotationData",addAnnotationData)
            addcomment(addAnnotationData.metric_val, addAnnotationData.iid,addAnnotationData.metric_title)
            props.addpointannot(addAnnotationData.frm, addAnnotationData.to, addAnnotationData.metric_val, addAnnotationData.iid);
            setcommentView([])
        }
        else if (addAnnotationError && addAnnotationData) {
            SetMessage("Operation Failed")
            SetType("Warning");
            setOpenSnack(true)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addAnnotationLoading, addAnnotationData, addAnnotationError])

    useEffect(() => {
        if (!checkpointannotLoading && checkpointannotData && !checkpointannotError) {
            console.log(checkpointannotData,"comment data",comment,tempComment)
            if (checkpointannotData.data.length > 0) {
                getUpdateAnnotation({schema: headPlant.schema,x:x}, checkpointannotData.metric_val, checkpointannotData.iid, tempComment, headPlant.id, checkpointannotData.frm, checkpointannotData.to,checkpointannotData.metric_title)
            } else {
                getAddAnnotation({schema: headPlant.schema,x:x,y: y,metric_val:checkpointannotData.metric_val}, checkpointannotData.iid, tempComment, headPlant.id, currUser.id, checkpointannotData.frm, checkpointannotData.to,checkpointannotData.metric_title)
            }
        } else if (checkpointannotError && checkpointannotData) {
            SetMessage("Choose a data point")
            SetType("Info");
            setOpenSnack(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkpointannotLoading, checkpointannotData, checkpointannotError])


    const insertcomment = async (metric_val, iid, frm, to,title) => {
        console.log(metric_val, iid, frm, to,title,"comment",comment,commentView)
        getCheckPointAnnot(metric_val, iid, x, frm, to,title)
        setTempComment(comment)
        setComment("")
        setcommentView([])

    }


    const handleChange = (range, value, frmDate, toDate) => {
        let newmeters = [...selectedMetric]
        let index = newmeters.findIndex((item) => item.id === value.id && item.metric_val === value.metric_val)
        newmeters = newmeters.map((item, i) => {
            if (i === index) {
                return Object.assign({}, item, { range: range, frmDate: frmDate, toDate: toDate })
            }
            else {
                return Object.assign({}, item)
            }
        }
        )
        setselectedMeterAndChip(newmeters)
        setSelectedMetric(newmeters)
        if (index >= 0) {
            props.fetchOnlineData([newmeters[index]], false)
            getSummaryData([newmeters[index]], headPlant.schema)
        }
    }

    const handleInterval = (e, value) => {
        let newmeters = [...selectedMetric]
        let index = -1
        newmeters = newmeters.map((item, i) => {
            if (item.id === value.id && item.metric_val === value.metric_val) {
                index = i
                return Object.assign({}, item, { interval: e.target.value })
            }
            else {
                return item
            }
        })
        setselectedMeterAndChip(newmeters)
        setSelectedMetric(newmeters)
        if (index >= 0) {
            props.fetchOnlineData([newmeters[index]], false)
            getSummaryData([newmeters[index]], headPlant.schema)
        }
    }

   
    
    const handleDownloadTrendData = () => {
        props.handleDownloadTrendData()
    }

    const handleForecastSwitch = (option,id,val) => {console.log(id,val,option)
        let data = selectedmeterandchip.map((item) => {
            if (item.id === id && item.metric_val === val) {
                return Object.assign({}, item, { forecastenable: option });
            }
            else {
                return Object.assign({}, item);
            }
        });
        setSelectedMetric(data)
        localStorage.setItem('selectedChipArr', JSON.stringify(data));
        setselectedMeterAndChip(data);
    }

    const removeSingleMetrics = (val) => {
        let arr = [ ...selectedmeterandchip ]
        arr.splice(val, 1)
        setselectedMeterAndChip(arr);
        setSelectedMetric(arr) 
        setSelectedChipArr(arr.map((x) => x.metric_val)) 
    }

    return (

        <React.Fragment>
            <LegendsTopBar  selectedMetric={selectedMetric} handleCheckAll={handleCheckAll} handleChange={handleChange} handleInterval={handleInterval} removeAllLegend={removeAllLegend} handleDownloadTrendData={handleDownloadTrendData} allChecked={allChecked}
            CloseLegend={props.CloseLegend}
            />
            <HorizontalLine variant="divider1" />
            <div style={{height:props.height+'px',overflow:'auto'}}>
            <LegendItem selectedMetric={selectedMetric} setMetrics={setMetrics} changeLegendColour={changeLegendColour} annotView={annotView} hideannot={hideannot}
                showannot={showannot} showSeries={showSeries} addcomment={addcomment} commentView={commentView} handlecommentchange={handlecommentchange}  comment={comment}
                insertcomment={insertcomment} handleChange={handleChange} handleInterval={handleInterval} hideSeries={hideSeries} extractedDataArray={extractedDataArray} 
                setAlertLimitMetric={setAlertLimitMetric} getForecastSeries={getForecastSeries} loadNormalData={loadNormalData} handleForecastSwitch={handleForecastSwitch} 
                legendWith={(props.legendWith-10)} removeMetrics={removeSingleMetrics} setannotView={setannotView} markedmetric={markedmetric}
                />
            </div>
        </React.Fragment>
    )
})

export default TrendsLegends