/* eslint-disable array-callback-return */

import React, { useEffect, useRef, useState, useImperativeHandle } from "react";
import InputFieldNDL from "components/Core/InputFieldNDL";
import Button from "components/Core/ButtonNDL";
import { useTranslation } from 'react-i18next';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import Grid from 'components/Core/GridNDL'
import TrendsChart from "components/layouts/Explore/ExploreMain/ExploreTabs/components/Trends/components/TrendsGraph/components/TrendsChart"
import Card from "components/Core/KPICards/KpiCardsNDL";
import moment from "moment";
import { useRecoilState } from "recoil";
import CircularProgress from "components/Core/ProgressIndicators/ProgressIndicatorNDL";
import useTrends from "components/layouts/Explore/ExploreMain/ExploreTabs/components/Trends/hooks/useTrends";
import useMeterReadingsV1 from "components/layouts/Explore/BrowserContent/hooks/useGetMeterReadingV1";
import { selectedPlant, instrumentsList,user } from "recoilStore/atoms";
import useTheme from 'TailwindTheme';
import trendsColours from "components/layouts/Explore/ExploreMain/ExploreTabs/components/Trends/components/trendsColours";
import { useAuth } from "components/Context";
import Download from 'assets/neo_icons/Menu/DownloadSimple.svg?react';
import CustomSwitch from "components/Core/CustomSwitch/CustomSwitchNDL";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import ModalNDL from 'components/Core/ModalNDL';
import useAddFaulrAcknowledgement from "../hooks/useAddFaultAcknowledgement";
import useGetFaultAcknowledgement from "../hooks/useGetFaultAcknowledgement";
import Toast from "components/Core/Toast/ToastNDL";
import StatusNDL from 'components/Core/Status/StatusNDL'
import * as XLSX from 'xlsx';
const ActionModal = React.forwardRef((props, ref) => { //NOSONAR
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true)
    const [graphdata, setGraphData] = useState({ 'data': [], 'annotation': [], 'charttype': "timeseries" })
    const [eAxis, setEaxis] = useState({ 'data': [], 'annotation': [], 'charttype': "timeseries" })
    const [headPlant] = useRecoilState(selectedPlant)
    const remarksRef = useRef();
    const [dialogModeSel, setDialogModeSel] = useState('')
    const [instrumentList] = useRecoilState(instrumentsList);
    const [instrumentmetricsinfo, setinstrumentsmetricsinfo] = useState([])
    const { trendsdataLoading, trendsdataData, trendsdataError, getTrends } = useTrends();
    const { meterReadingsV1Loading, meterReadingsV1Data, meterReadingsV1Error, getMeterReadingsV1 } = useMeterReadingsV1()
    const [selectedinstrument, setselectedinstrument] = useState({})
    const [instrumentname, setinstrumentname] = useState('')
    const [assetname, setassetname] = useState('')
    const [selectedmetric, setselectedmetric] = useState('')
    const theme = useTheme()
    const [trendsData, setTrendsData] = useState([])
    const { HF } = useAuth();
    const [checked, setchecked] = useState(false)
    const [faultAcknowledge, setfaultAcknowledge] = useState([])
    const [ isFaultAcknowledged, setisFaultAcknowledged ] = useState(false)
    const [ ischecked, setischecked ] = useState(false)
    const [addAcknowledgeDialog, setAddAcknowledgeDialog ] = useState(false)
    const [AckErrMsg,setAckErrMsg] = useState('')
    const alarmAcknowledgementRef = useRef();
    const { addFaultAcknowledgementLoading, addFaultAcknowledgementData, addFaultAcknowledgementError, getAddFaultAcknowledgement } = useAddFaulrAcknowledgement()
    const { getFaultAcknowledgementLoading, getFaultAcknowledgementData, getFaultAcknowledgementError, getFaultAcknowledgement } = useGetFaultAcknowledgement() //NOSONAR
    const [currUser] = useRecoilState(user);
    const [openSnack, setOpenSnack] = useState(false);
    const [message, SetMessage] = useState('');
    const [type, SetType] = useState('');
    const [placeholder, setPlaceholder] = useState("Choose an option");
    const [, setInstrument] = useState([]);
    const [ackCount, setackCount] = useState(-1);
    const [, setModalHeight] = useState("auto");

    const tableheadCells = [
        {
            id: 'Peak',
            numeric: false,
            disablePadding: true,
            label: 'Peak',
            align: 'center'
        },
        {
            id: 'Order',
            numeric: false,
            disablePadding: true,
            label: 'Order',
            align: 'center'
        },
        {
            id: 'Amplitude',
            numeric: false,
            disablePadding: true,
            label: 'Amplitude',
            align: 'center'
        },


    ];
    useImperativeHandle(ref, () =>
    (
        {
            getTrends: handleGetTrends,
            getRemarks: handleGetRemarks,
            getTrendgraph: handleGetTrendgraph,
            getCreateTask: handleCreateTask
        }
    )
    )

    const handleCreateTask = (instrumentdata,value, dialogMode) => {
        setLoading(true)
        setDialogModeSel(dialogMode)
    };

    const handleGetTrends = (instrument, instrument_name, asset_name, dialogMode, trendsobj) => {
        setLoading(true)
        setselectedinstrument(instrument)
        setinstrumentname(instrument_name)
        setassetname(asset_name)
        getTrends(trendsobj, headPlant.schema)
        setDialogModeSel(dialogMode)
    };

    const handleGetRemarks = (instrument, instrument_name, asset_name,ackCount, dialogMode) => {
        setInstrument(instrument)
        setselectedinstrument(instrument)
        setinstrumentname(instrument_name)
        setassetname(asset_name)
        setDialogModeSel(dialogMode)
        setackCount(ackCount)
    };

    useEffect(() => {
          setModalHeight("700px");
      }, [dialogModeSel]);

    const handleGetTrendgraph = (instrument, instrument_name, asset_name, dialogMode) => {
        setLoading(true)
        setselectedinstrument(instrument)
        setinstrumentname(instrument_name)
        setassetname(asset_name)
        let result = getiidparam(instrument.iid)
        let sptime = moment(instrument.time).add(30, 'seconds').format('YYYY-MM-DDTHH:mm:ssZ');
        let sttime = moment(instrument.time).subtract(30, 'seconds').format('YYYY-MM-DDTHH:mm:ssZ');
        getMeterReadingsV1(headPlant.schema, result[0], result[1], sttime, sptime)
        setDialogModeSel(dialogMode)
    };

    useEffect(() => {

        if (!addFaultAcknowledgementLoading && addFaultAcknowledgementData && !addFaultAcknowledgementError) {

            if(addFaultAcknowledgementData.affected_rows >= 1){
                SetMessage(t('Added Alarm Acknowledgement Successfully'))
                SetType("success")
                setOpenSnack(true)
                setAddAcknowledgeDialog(false)
                getFaultAcknowledgement(headPlant.id)
            }
        } 
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addFaultAcknowledgementData])

    useEffect(()=>{
        getFaultAcknowledgement(headPlant.id)
    },[headPlant])

    const handleCardClick = (key) => {
        if (!loading) {  
            setLoading(true);
            getTrendgraph(key) 
        }
    };

    useEffect(() => {
        if (getFaultAcknowledgementData) {
            setfaultAcknowledge([
                ...getFaultAcknowledgementData,
                { id: 'new', name: (
                    <div onClick={handleNewFaultAcknowledgement} className="flex items-center cursor-pointer mt-4">
                        <Plus />
                        <TypographyNDL style={{color:"#0F6FFF"}} value={"Add New Reason"}/>
                    </div>
                ) }
            ]);
        }
    }, [getFaultAcknowledgementData]);


    useEffect(() => {

        remarks()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedinstrument])

    useEffect(() => {
        if (!trendsdataLoading && trendsdataData && trendsdataData.data && trendsdataData.data.flat(1).length > 0 && !trendsdataError) {
            let finalDataArr = { 'data': [], 'annotation': [], 'charttype': "timeseries" }
            const merged = trendsdataData.data.flat(1);
            let appendedData = [...merged]
            if (trendsdataData.append) {
                setTrendsData(JSON.parse(JSON.stringify(trendsData.concat(merged))))
                appendedData = trendsData.concat(merged)
            }
            if (merged.length > 0) {
                try {
                    merged.map((trend) => {
                        let colorindex = Math.floor(cryptoRandom() * trendsColours[1].length)
                        let metricColour = trendsColours[1][colorindex]
                        let tempObj = {
                            name: trend.key + " (" + trend.iid + ")",
                            id: trend.iid,
                            color: metricColour,// "#0F6FFF",
                            data: [],
                            time: "",
                            peaks: []
                        }

                        JSON.parse(trend.value).map((fft, i) => {
                            let obj1 = {
                                x: 0.625 * i,
                                y: fft
                            }
                            tempObj.data.push(obj1)
                        })
                        if (!checked) {
                            finalDataArr.charttype = "fft"
                            let fft_data = JSON.parse(JSON.stringify(tempObj.data));
                            let result = getPeaksData(fft_data.sort(function (a, b) { return Number(b.y) - Number(a.y) }))
                            tempObj.peaks = result.map(r => [r.x, (r.x / selectedinstrument.rpm).toFixed(4), (r.y).toFixed(4)])
                            tempObj.time = trend.time

                            let key = finalDataArr.data.findIndex(d => d.name === trend.key + " (" + trend.iid + ")")
                            if (key >= 0) {
                                finalDataArr.data[key].data.push(tempObj)
                            } else {
                                finalDataArr.data.push({ "name": trend.key + " (" + trend.iid + ")", data: [tempObj], "selectedIndex": 0, "axis": trend.key.split("_")[1] ? trend.key.split("_")[1].toUpperCase() : "" })
                            }
                        } else {
                            finalDataArr.data.push(tempObj)
                        }

                    })
                    if (!checked) {
                        let fromIndex = finalDataArr.data.findIndex(a => a.axis.toLowerCase() === selectedinstrument.key.toLowerCase())
                        let element = finalDataArr.data[fromIndex];
                        finalDataArr.data.splice(fromIndex, 1);
                        finalDataArr.data.splice(0, 0, element);
                    }
                    if (checked) {
                        let filteredData = finalDataArr.data.filter(x => !x.name.includes('fft_e'));
                        setGraphData({ ...finalDataArr, data: filteredData });
                    } else {
                        let dataE = finalDataArr.data.filter(x => x.axis==='E');
                        setEaxis({ ...finalDataArr, data: dataE})
                        setGraphData(finalDataArr);
                    }
                    setLoading(false)
                }
                catch (error) {

                    getChartData(appendedData)

                }



            }

        }

else if (!trendsdataLoading && trendsdataData !== null && trendsdataError !== null ) {
            setLoading(false)
        } 



        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trendsdataLoading, trendsdataData, trendsdataError, checked])

    const fetchmeterdata = (instrument, meterdata) => {
        let instrument_metrics_index = instrumentList.findIndex(i => i.id === instrument.iid)
        let instrument_metrics_array = []
        if (instrument_metrics_index >= 0) {
            //metricarray
            let temp_instrument_metrics_array = instrumentList[instrument_metrics_index].instruments_metrics.map(m => m.metric)
            temp_instrument_metrics_array.map((tm, index) => {
                let metric_index = meterdata.findIndex(m => tm.name === m.key && tm.metric_datatype !== 4)
                let selectpresent = instrument_metrics_array.findIndex(val => val.selected)
                let colorindex = Math.floor(cryptoRandom() * trendsColours[1].length)
                let metricColour = trendsColours[1][colorindex]
                if (metric_index >= 0) {
                    instrument_metrics_array.push({ "title": tm.title, "selected": (tm.props && tm.props.axis && tm.props.axis.toLowerCase() === instrument.key.toLowerCase() && (tm.name.includes("vel") || tm.name.includes("env"))) && selectpresent < 0 ? true : false, "time": meterdata[metric_index].time, "iid": meterdata[metric_index].iid, "value": meterdata[metric_index].value, "key": meterdata[metric_index].key, "colour": metricColour })
                } else {
                    instrument_metrics_array.push({ "title": tm.title, "selected": (tm.props && tm.props.axis && tm.props.axis.toLowerCase() === instrument.key.toLowerCase() && (tm.name.includes("vel") || tm.name.includes("env"))) && selectpresent < 0 ? true : false, "time": tm.time, "iid": tm.iid, "value": '-', "key": tm.name, "colour": metricColour })
                }
            })
            if (instrument_metrics_array.length > 0) {
                if (instrument_metrics_array.filter(val => val.selected).length > 0) {
                    getTrendgraph(instrument_metrics_array.filter(val => val.selected)[0].key)
                    setselectedmetric(instrument_metrics_array.filter(val => val.selected)[0].title)
                } else {
                    setLoading(false)
                }

            }
            setinstrumentsmetricsinfo(instrument_metrics_array)
        }
    }
    useEffect(() => {

        if (!meterReadingsV1Loading && meterReadingsV1Data && !meterReadingsV1Error) {
            fetchmeterdata(selectedinstrument, meterReadingsV1Data.data)
        } else if (meterReadingsV1Error) {
         //   setLoading(false)
        }


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [meterReadingsV1Loading, meterReadingsV1Data, meterReadingsV1Error])
    const remarks = () => {
        setTimeout(() => {
            if (remarksRef.current) {
                remarksRef.current.value = selectedinstrument.remarks ? selectedinstrument.remarks : "";
            }
        }, 500);
    };
    function cryptoRandom() {
        let array = new Uint32Array(1);
        return window.crypto.getRandomValues(array)[0] / Math.pow(2, 32);
    }

    const handleDownloadTrendData = (yData) => {

        if (yData.data && yData.data.length > 0) {


            let timestamps = []

            yData.data.forEach((item) => {

                let categoryX = item.data.map((i) => { return i.x })


                timestamps.push(...[...categoryX]);
            })

            let filterTimestamps = timestamps.filter((item,
                index) => timestamps.indexOf(item) === index);

            // Sort the array of timestamps
            const convertToTimestamp = (timestamp) => new Date(timestamp);

            const compareTimestamps = (a, b) => convertToTimestamp(b) - convertToTimestamp(a);

            const sortedTimestamps = filterTimestamps.slice(); // Create a copy of the array
            sortedTimestamps.sort(compareTimestamps);
            sortedTimestamps.reverse();
            let finalTrendData = [];

            filterTimestamps.forEach((date) => {
                let objResult = {};
                yData.data.forEach((item) => {
                    let yValue = item.data.filter((e) => e.x === date);

                    let data = {
                        "Range": moment(new Date(date)).subtract(moment(date).isDST() ? 1 : 0, 'hour').format('Do MMM YYYY ' + HF.HMSS),
                        [item.name]: yValue.length > 0 ? yValue[0].y : ""
                    };
                    Object.assign(objResult, data);
                });
                finalTrendData.push(objResult);
            });

            downloadExcel(finalTrendData, "trendsChartData - " + moment(Date.now()).format('YYYY_MM_DD_HH_mm_ss'))
        }
    }

    const downloadExcel = (data, name) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, name + ".xlsx");
    }
    const getChartData = (chartdata) => {
        let finalDataArr = { 'data': [], 'annotation': [], 'charttype': "timeseries" }
        instrumentmetricsinfo && instrumentmetricsinfo.forEach((im) => {
            if (im.selected) {
                let tempObj = {
                    name: im.key + " (" + im.iid + ")",
                    id: im.iid,
                    color: im.colour,
                    data: [],
                    type: "line"
                };

                chartdata.forEach((a) => {
                    if (a.key === im.key) {
                        let yValue = null;

                        if (a.value !== null) {
                            yValue = !isNaN(Number(a.value)) ? Number(a.value).toFixed(2) : null;
                        }

                        let obj1 = {
                            x: new Date(a.time).getTime(),
                            y: yValue
                        };

                        tempObj.data.push(obj1);
                    }
                });


                finalDataArr.data.push(tempObj);
            }
        });

        setGraphData(finalDataArr)
        setTimeout(() => {
            if (document.getElementById('apexchartstrendChart') && document.getElementById('apexchartstrendChart').getElementsByClassName('apexcharts-menu-item exportCSV')[0]) {
                document.getElementById('apexchartstrendChart').getElementsByClassName('apexcharts-menu-item exportCSV')[0].style.display = 'none'
            }
        }, 500)
        setLoading(false)


    }
    function getPeaksData(sorteddata) {
        let result = []
        sorteddata.map((s, index) => {
            if (result.length < 10) {
                if (result.length > 0) {
                    // The buffer value for fft peaks
                    if (result.every(r => (Number(s.x) > (Number(r.x) + (3 * 0.625))) || (Number(s.x) < (Number(r.x) - (3 * 0.625))))) {
                        result.push(s)
                    }
                } else {
                    result.push(s)
                }
            } else {
                return
            }

        })
        return result
    }
    const getTrendgraph = (value) => {
        let trends = []
        let instrumetrics = [...instrumentmetricsinfo]
        setinstrumentsmetricsinfo(instrumetrics.map(val => {
            if (val.key === value) {
                setselectedmetric(val.title)
                return Object.assign({}, val, { "selected": !val.selected })
            }
            else return Object.assign({}, val, { "selected": val.selected })
        }))
        if (trendsData.findIndex(m => m.key === value) < 0) {
            trends.push({
                "frmDate": moment(selectedinstrument.time).subtract(24, 'hours').format("YYYY-MM-DD HH:mm:ssZ"),
                "toDate": moment(selectedinstrument.time).add(24, 'hours').format("YYYY-MM-DD HH:mm:ssZ"),
                "interval": 15,
                "id": selectedinstrument.iid,
                "metric_val": value,
            })
            getTrends(trends, headPlant.schema, true)
        } else {
            let removeexistingdata = trendsData.filter(m => m.key != value)
            setTrendsData(removeexistingdata)
            getChartData(removeexistingdata)
        }

    }
    const getiidparam = (instrument) => {
        let iid_index = instrumentList.findIndex(val => val.id === instrument)
        let paramArr = ''
        let param = []
        if (iid_index >= 0) {
            param = instrumentList[iid_index].instruments_metrics.filter(im => im.metric.metric_datatype !== 4).map(m => m.metric.name)
        }
        paramArr = param.toString()
        return [instrument, paramArr]
    }
    let title = "";

    if (dialogModeSel === "fft") {
        title = t("View FFT");
    } else if (dialogModeSel === "trend") {
        title = t("View Trend");
    } else if (dialogModeSel === "remarks") {
        title = selectedinstrument && selectedinstrument.remarks ? t("Fault Acknowledgement") : t("Fault Acknowledgement");
    }

    let textValue;

    if (dialogModeSel === "trend") {
        textValue = assetname + " - " + instrumentname + " - " + selectedmetric;
    } else {
        textValue = assetname + " - " + instrumentname + " - " +
            (selectedinstrument && selectedinstrument.length > 0 ? selectedinstrument.key + " RMS Velocity" : "");
    }    

    const renderBackgroundColor = (col) => {
        if (col === "severe") {
            return "error-alt"

        } else if (col === "minor") {
            return "warning01-alt"

        } else {
            return "warning02-alt"

        }

    }

    const renderTagName = (col) => {
        if (col === "severe") {
            return "Severe"

        } else if (col === "minor") {
            return "Minor"
              } else if (col === "All") {
            return "Normal"

        } else {
            return "Moderate"
        }
    }

    const handleFaultAcknowledgement = (selectedOption) => {
        const selectedId = selectedOption.target.value;
        if (selectedId === 'new') {
            setPlaceholder('');
        } else {
            const selectedName = faultAcknowledge.find(option => option.id === selectedId)?.name || "Choose an option";
            setPlaceholder(selectedName);
        }
        setisFaultAcknowledged(false);
    };

    const handleNewFaultAcknowledgement = (e) => {
            setAddAcknowledgeDialog(true)
    }

    const handleCheckAcknowledge = (e) => {
        setischecked(e.target.checked)
    }

    const handleCloseAcknowledgeType = () => {
        setAddAcknowledgeDialog(false)
        setAckErrMsg('')
    }

    const handleAddFaultAcknowlwdgement = () => {
        if(alarmAcknowledgementRef.current.value){
            getAddFaultAcknowledgement(alarmAcknowledgementRef.current.value, headPlant.id, currUser.id)
            setAckErrMsg('')
        }else{
            setAckErrMsg('Enter Alarm Acknowledgement')
            return false
        }
    }

    const fnAcknowledge = () => {
            if (!faultAcknowledge) {
                setisFaultAcknowledged(true)
                return false;
            }
            else{
                setisFaultAcknowledged(false)
        }
        if (!isFaultAcknowledged) { 
            props.handleSaveFaultAcknowlwdgement(placeholder, ischecked)
        }
    }

    const renderModelContent = () => {
        if( loading === false){
        if (dialogModeSel === "fft") {
            return (
                <div style={{marginTop:"16px", height: "600px"}}>
                     {graphdata.data && graphdata.data.length > 0 ?
                        <TrendsChart yData={graphdata} disableMeter={true} yaxistitle={t("RMS Velocity (mm/s)")} ymin={0} xmin={0} zoom={false} headCells={tableheadCells} showTable={!checked ? true : false} merged={checked} />
                        : !loading && <TypographyNDL variant="heading-02-s" style={{ 
                            position : "absolute" , left : "50%" , top : "50%" , }} model value={"No Data"} />
                    }
                    {
                        checked && eAxis.data && eAxis.data.length > 0 &&  
                        <TrendsChart yData={eAxis} disableMeter={true} yaxistitle={t("RMS Velocity (mm/s)")} ymin={0} xmin={0} zoom={false} headCells={tableheadCells} showTable='show' merged={!checked} />
                    }

                    {/* {
                        checked && eAxis.data && eAxis.data.length > 0 &&  
                        <TrendsChart yData={eAxis} disableMeter={true} yaxistitle={t("RMS Velocity (mm/s)")} ymin={0} xmin={0} zoom={false} headCells={tableheadCells} showTable='show' merged={!checked} />
                    } */}
                </div>
               
            )
        } if (dialogModeSel === "trend") {
            return (
                <div style={{ height: "600px"}}>
                    <Grid container spacing={2} style={{ width: '100%', margin: 0, marginTop:"16px" }}>
                        {instrumentmetricsinfo.map(im => {
                            return (

                                <Grid xs={3} key={im.key}>
                                    <Card 
                                        onClick={() => handleCardClick(im.key)} 
                                        style={{ cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.5 : 1 }}
                                    >
                                        <TypographyNDL 
                                            variant="label-02-s" 
                                            model 
                                            value={im.title} 
                                            style={{ color: im.selected ? theme.colorPalette.blue : "" }} 
                                        />
                                        <TypographyNDL 
                                            variant="lable-01-m" 
                                             mono
                                            value={im.value} 
                                            style={{ 
                                                width: 66, 
                                                whiteSpace: "nowrap", 
                                                display: "inline-block", 
                                                overflow: "hidden", 
                                                textOverflow: "ellipsis", 
                                                color: im.selected ? theme.colorPalette.blue : "" 
                                            }} 
                                        />
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                    <Button  type="ghost"  icon={Download} style={{ float: "right", margin:"10px", cursor: "pointer",  marginRight:"16px" }} onClick={() => handleDownloadTrendData(graphdata)} />
                    <div style={{ height: "52%", marginRight: 30, marginTop:"20px" }}>
{graphdata.data && graphdata.data.length > 0 ?
<div className="mt-4 h-[46vh]">
                        <TrendsChart yData={graphdata} disableMeter={true} yaxistitle={selectedmetric} />
                        </div>
:
                            !loading && <TypographyNDL variant="heading-02-s" style={{ position : "absolute" , left : "50%" , top : "80%" }} model value={"No Data"} />
                        }
                    </div>
                </div>
            );
        } else if (dialogModeSel === "remarks") {
            return (
                <React.Fragment>
                    <div style={{ marginBottom: '20px' }}>
                <TypographyNDL 
                    variant="paragraph-s"
                    color='secondary' 
                    value={"You are about to acknowledge this fault. This action confirms that you are aware of this existing fault and this action cannot be undone.  Please review the fault details carefully before proceeding."} 
                />
                </div>
                <div style={{ marginBottom: '16px' }}>
                <SelectBox
                    labelId="select-acknowledge-label"
                    label=""
                    id="select-acknowledge"
                    placeholder={placeholder}
                    auto={false}
                    options={faultAcknowledge}
                    isMArray={true}
                    value={faultAcknowledge}
                    onChange={handleFaultAcknowledgement}
                    keyValue="name"
                    keyId="id"
                    multiple={false}
                    checkbox={false}
                    msg={isFaultAcknowledged ? t('Please Select Fault Acknowledgement') : ""}
                />
                </div>
                {props.ackType === 3 &&
                <div style={{ marginBottom: '16px' }}>
                <CustomSwitch 
                    id={'check'} 
                    switch={false} 
                    checked={ischecked} 
                    onChange={handleCheckAcknowledge}
                    primaryLabel={t('Acknowledge remaining ') + (ackCount > 0 ? ackCount.toString() : '0') + t(' faults for this metric')}
                /> 
                </div>
        }
            </React.Fragment>
            )
        } 
        } else {
            return (
                <React.Fragment></React.Fragment>
            )
        }
    }

    const handleCheck = () => {
        setchecked(!checked)
    }

    return (
        <React.Fragment>
            <Toast type={type} message={message} toastBar={openSnack}  handleSnackClose={() => setOpenSnack(false)} ></Toast>
        <React.Fragment>
            <ModalHeaderNDL>
                <div style={{ display: "block" }}>
                    <TypographyNDL variant="heading-02-xs" model value={title} />
                </div>

            </ModalHeaderNDL>
            <ModalContentNDL height>
            <div className="h-[75vh]">
                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", margin: 10 }}>
                    <CircularProgress />
                    </div>
                ) : (
                    <>
                    {dialogModeSel !== "remarks" && (
                        <>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div className="flex gap-4 items-center py-2">
                            <TypographyNDL variant="label-02-m" model value={selectedinstrument.defect_name} />
                            <StatusNDL
                                lessHeight
                                style={selectedinstrument.severity_name === "All" ? { backgroundColor: "#76A43D" } : {}}
                                colorbg={renderBackgroundColor(selectedinstrument.severity_name)}
                                name={renderTagName(selectedinstrument.severity_name)}
                            />
                            </div>

                            {dialogModeSel === "fft" && (
                            <div className="pl-2 pr-2">
                                <CustomSwitch
                                id={'Merge FFT'}
                                switch={false}
                                checked={checked}
                                onChange={handleCheck}
                                primaryLabel={t("Merge FFT")}
                                />
                            </div>
                            )}
                        </div>

                        <TypographyNDL
                            variant="lable-01-s"
                            model
                            value={
                            assetname + " - " +
                            instrumentname + " - " +
                            (dialogModeSel === "trend"
                                ? selectedmetric + " - " + moment(selectedinstrument.time).format("DD/MM/YYYY hh:mm:ss A")
                                : selectedinstrument.key + " RMS Velocity - RPM : " +
                                (selectedinstrument.rpm !== '-'
                                    ? (selectedinstrument.rpm * 60) + " (" + selectedinstrument.rpm + "Hz) - "
                                    : "NA - ") +
                                moment(selectedinstrument.time).format("DD/MM/YYYY hh:mm:ss A")
                            )
                            }
                        />
                        </>
                    )}
                    {renderModelContent()}
                    </>
                )}
                </div>
            </ModalContentNDL>

            <ModalFooterNDL>


                <Button type="secondary" style={{ width: "80px" }} value={(dialogModeSel === "fft" || dialogModeSel === "trend") ? t("Close") : t('Cancel')} onClick={() => props.handleFaultDialogClose()} />
                {(dialogModeSel === "remarks") && <Button type="primary" value={selectedinstrument && selectedinstrument.remarks ? t("Acknowledge") : t("Acknowledge")} onClick={() => { fnAcknowledge() }} />}

            </ModalFooterNDL>
            
        </React.Fragment >
         <React.Fragment>
         <ModalNDL open={addAcknowledgeDialog}  >
             <ModalHeaderNDL>
                 <TypographyNDL variant="heading-02-s" value={t("Add Alarm Acknowledgement")} ></TypographyNDL>
             </ModalHeaderNDL>
             <ModalContentNDL>
                 <InputFieldNDL
                 id="txtAcknowledgement"
                 placeholder={t('Fault Acknowledgement')}
                 inputRef={alarmAcknowledgementRef}
                 label={t('Fault Acknowledgement')}
                 error={AckErrMsg ? true : false}
                 helperText={AckErrMsg}
                 >
                 </InputFieldNDL>
             </ModalContentNDL>
             <ModalFooterNDL>
                 <Button type="secondary"  value={t('Cancel')} onClick={() => handleCloseAcknowledgeType()} />
                 <Button type="primary"  value={t('Save')} 
                 onClick={handleAddFaultAcknowlwdgement} 
                 />
             </ModalFooterNDL>
         </ModalNDL>

     </React.Fragment>
     </React.Fragment>

    )
})
export default ActionModal;