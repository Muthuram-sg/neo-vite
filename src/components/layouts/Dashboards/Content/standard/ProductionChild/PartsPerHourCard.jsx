/* eslint-disable no-useless-computed-key */
import React, { useState, useEffect, useCallback,useRef  } from 'react'; 
import CircularProgress from "components/Core/ProgressIndicators/ProgressIndicatorNDL";
import ClickAwayListener from 'react-click-away-listener';
import ListNDL from 'components/Core/DropdownList/ListNDL.jsx';
import { useRecoilState } from "recoil";
import { themeMode } from "recoilStore/atoms";
import { useTranslation } from 'react-i18next'; 
import moment from 'moment';
import DrillDownParts from '../DrillDownParts'; 
import configParam from "config";
import Button from 'components/Core/ButtonNDL';
import KpiCards from "components/Core/KPICards/KpiCardsNDL"  
import TypographyNDL from "components/Core/Typography/TypographyNDL"; 
import MenuList from 'assets/neo_icons/Dashboard/MenuList.svg?react'; 
import { useCurrentPng } from "recharts-to-png";
// import { toPng } from "recharts-to-png";
import FileSaver from "file-saver";
import {
    Bar,
    Brush,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Line, ComposedChart, LabelList
} from 'recharts';
import ContentSwitcher from "components/Core/ContentSwitcher/ContentSwitcherNDL"; 
import * as xlsx from 'xlsx';
  
function PartsPerHourCardFunction(props) {
    // const chartRef = useRef(null);
    const [curTheme] = useRecoilState(themeMode);
    const { t } = useTranslation(); 
    const [enablePartsDash, setEnablePartsDash] = useState(false);
    const [HourChart, setHourChart] = useState(true);
    const [partsPerSecond, setPartsPerSecond] = useState([]);
    const [partsPerHour, setPartsPerHour] = useState([]);
    const [LabelDate, setLabelDate] = useState([]);
    const [DressChart, setDressChart] = useState([]) 
    const [open,setOpen] = useState(false);
    const [getPng, chartRef ] = useCurrentPng();
    const [CSVData, setCSVData] = useState([]);
    const [contentSwitchIndex, setContentSwitchIndex] = useState(0); 
    
    const [brushDefaultDomain,setbrushDefaultDomain] = useState({"startIndex": 0,   "endIndex": 7})
    const [brushDressing,setbrushDressing] = useState({"startIndex": 0,   "endIndex": 7})
    let janOffset = moment({ M: 0, d: 1 }).utcOffset(); //checking for Daylight offset
    let julOffset = moment({ M: 6, d: 1 }).utcOffset(); //checking for Daylight offset
    let stdOffset = Math.min(janOffset, julOffset);// Then we can make a Moment object with the current time at that fixed offset
    let TZone = moment().utcOffset(stdOffset).format('Z') // Time Zone without Daylight
    // const [partsPerHourLength,setPartsPerHou
    
    useEffect(() => {
        // console.log(props.partsData.length,'parts length')

        if (props.trendsData.length > 0) {
            // console.log(props.trendsData,"props.trendsData")
            let hourArr = props.trendsData.sort(function (a, b) {
                return new Date(b.hour) - new Date(a.hour);
            }); 

            let Labeldate = []
            const formatPartsHour = hourArr.map(x => {
                Labeldate.push([moment(new Date(x.hour).getTime()).format('DD-MM-YYYY')])
                Labeldate.reverse()
                setLabelDate(Labeldate)
                let roundTime = ''

                let minutes = moment(new Date(x.hour).getTime()).format('MM')
                // showing parts between hour as round value like HH.00
                if (minutes > 0) {
                    roundTime = props.isLongRange ? moment(x.hour).subtract(moment(x.hour).isDST() ? 1 : 0, 'hour').add(60 - minutes, 'minutes').startOf('hour').format('DD/MM/YYYY') : moment(x.hour).subtract(moment(x.hour).isDST() ? 1 : 0, 'hour').add(60 - minutes, 'minutes').startOf('hour').format('HH:mm')
                } else {
                    roundTime = props.isLongRange ? moment(x.hour).subtract(moment(x.hour).isDST() ? 1 : 0, 'hour').format('DD/MM/YYYY') : moment(x.hour).subtract(moment(x.hour).isDST() ? 1 : 0, 'hour').format('HH:mm')
                    // return value
                }
                let key = moment(new Date(x.hour).getTime()).format('YYYY-MM-DDTHH:00')
                let secondsforExpectedParts = props.isLongRange ? 86400 : 3600
                let planedDowntime = props.assetStatusData[key]
                planedDowntime = planedDowntime === undefined ? 0 : planedDowntime
                let expectedParts = Number(((secondsforExpectedParts - planedDowntime) / props.expectedCycleTime).toFixed(0))
                if (props.ProdGroupRange !== 7 || props.ProdGroupRange !== 20 || props.ProdGroupRange !== 21) {  // taking current hour expected parts for today,current shift,shift today
                    let nowTime = moment().format("HH:00")

                    if (nowTime === roundTime) {

                        let now = moment()
                        let hourStartTime = moment(moment(new Date()).format('YYYY-MM-DDTHH:00'))
                        let duration = (now - hourStartTime) / 1000
                        expectedParts = Number(((duration - planedDowntime) / props.expectedCycleTime).toFixed(0))
                    }
                }
                //below return is used for data binding in recharts
                return { "hour": roundTime, "actualParts": parseInt(x.partsperhour), "dressing": props.headPlant.appTypeByAppType.id !== 1 ? parseInt(x.dressingCount) : null, "rawtime": x.hour, expectedparts: isNaN(expectedParts) || !isFinite(expectedParts) || !expectedParts ? 0 : expectedParts }

            }).reverse()
             
            setPartsPerHour(formatPartsHour)
            setCSVData(formatPartsHour) 
        } else {
            // if data is empty it will clear the previous state
            setPartsPerHour([])
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.trendsData, props.expectedCycleTime, props.assetStatusData])

    // console.log(partsPerHour.length ,"empty")
    const showPartsPersec = (val) => {
        console.log('rawtime',moment(val.payload.rawtime).format('YYYY-MM-DDTHH:mm:ss'),moment(val.payload.rawtime).format('YYYY-MM-DDTHH:mm:ss' + TZone))
        const body = {
            schema: props.headPlant.schema,
            instrument_id: props.OEEData.instrument.id,
            metric_name: props.OEEData.metric.name,
            start_date: moment(val.payload.rawtime).format('YYYY-MM-DDTHH:mm:ss' + TZone),
            end_date: moment(val.payload.rawtime).add('1', 'hour').format('YYYY-MM-DDTHH:mm:ss' + TZone),
            binary: props.OEEData.is_part_count_binary,
            downfall: props.OEEData.is_part_count_downfall
        }
        configParam.RUN_REST_API("/dashboards/actualPartSignal", body)
            .then(res => {
                let tempParts = [];
                if (res && res.data && res.data.length > 0) {
                     res.data.forEach((x, index, arr) => {
                        let obj = { x: index + 1, y: index === (arr.length - 1) ? 30 : moment(x.time).diff(moment(arr[index + 1]?.time), 'seconds') }
                        tempParts.push(obj);
                    })
                     setPartsPerSecond(tempParts);
                    setEnablePartsDash(true);
                } else {
                    setPartsPerSecond([])
                }
            })
    }

    

    useEffect(() => {
        if (props.DressData.length > 0) {

             const DressArr = props.DressData.map(x => { return {...x, time : moment(new Date(moment(x.time).subtract(moment(x.time).isDST() ? 1 : 0, 'hour'))).format("HH:mm")} })
            
            setDressChart(DressArr)
        }
        else {
            setDressChart([])
        }
    }, [props.DressData])


    const renderLegend1 = (props) => {    // render custom legend for  dressing plant
        const { payload } = props;

        return (
            <ul style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                {payload.map((entry, index) => (
                    <div key={`item-${entry.value}`} style={{ display: "flex", alignItems: "center" }}>
                        <svg width="13" height="12" viewBox="0 0 13 12" fill="none" style={{ marginLeft: "8px" }} xmlns="http://www.w3.org/2000/svg">
                            <circle cx="6.5" cy="6" r="6" fill={entry.color} />
                        </svg>

                        <li key={`item-${entry.value}`} style={{ color: entry.color, marginLeft: "8px" }}>
                            {entry.value}
                        </li>
                    </div>
                ))}
            </ul>
        );
    };

    const renderLegend2 = (props) => {    // render custom legend for non dressing plant
        const { payload } = props;
        let filteredPayload = payload.filter(entry => entry.dataKey !== 'dressing');

        return (
            <ul style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                {filteredPayload.map((entry, index) => (
                    <div key={`item-${entry.value}`} style={{ display: "flex", alignItems: "center" }}>
                        <svg width="13" height="12" viewBox="0 0 13 12" fill="none" style={{ marginLeft: "8px" }} xmlns="http://www.w3.org/2000/svg">
                            <circle cx="6.5" cy="6" r="6" fill={entry.color} />
                        </svg>

                        <li key={`item-${entry.value}`} style={{ color: entry.color, marginLeft: "8px" }}>
                            {entry.value}
                        </li>
                    </div>
                ))}
            </ul>
        );
    };

    const togglePopper = (e) => {
        // console.log(e.currentTarget)
        setOpen(e.currentTarget);
    } 
    const handleDownload = async () => {
        console.log("Chart ref: ", chartRef .current);
        setTimeout(async () => {
            const png = await getPng();
            console.log("Generated PNG:", png); // Debugging
        
            if (png) {
              const link = document.createElement("a");
              link.href = png;
              link.download = "chart.png";
              link.click();
            } else {
              console.error("Failed to generate PNG");
            }
          }, 500); // Small delay before capturing
      };

    // const handleAreaDownload = useCallback(async () => {
    //     const png = await getAreaPng();
    //     if (png) {
    //         FileSaver.saveAs(png, "Bar-chart.png");
    //     }
    // }, [getAreaPng]);

    const handleExcelDownload = () => {
        downloadExcel(CSVData, "Exported Data Table");
      };
      
    //CSV Download
    const downloadExcel = (data, name) => {
        let filteredData = data.map((item) => {     // remove key from array
            const { ...rest } = item;
            return rest;
        })
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, name + ".xlsx");
    };
    const menuOption = [{id:"1", name:"Download PNG"},{id:"2", name:"Download SVG"},{ id: "3", name: "Download Excel" },]

    function optionChange(e){
        console.log(e,"handleAreaDownloadhandleAreaDownload")
        if(e === '1'){
            handleDownload()
        } else if (e === '2') {
            // handleAreaDownload(); // Handle SVG download
          } else if (e === '3') {
            handleExcelDownload(); // Handle Excel download
          }
    }
    const buttonList = [
        {id:"0", value:"Hourly", disabled:false},
        {id:"1", value:"Dressing", disabled:false},
      
      ]
    
      const contentSwitcherClick = (e) =>{
        setContentSwitchIndex(e)
        console.log(e)
    } 
    
    //    console.log (props.cycleTime,props.cycleTime && Number(props.cycleTime) > 30 ? 'bar' : 'line',"props.DressData.length")
    return (
        <KpiCards>
            <div style={{ padding: 10, }}>
                <TypographyNDL color='secondary' variant="heading-01-xs" 
                    value={<div style={{display:'flex',alignItems:'center'}}>
                    {HourChart ? (props.isLongRange ? "Parts per Day" :"Parts per hour"): "Parts between dressings"}
                            {HourChart ? (props.partLoading || props.loading) && <div style={{ marginTop: 5, marginLeft: 10 }}><CircularProgress disableShrink size={15} color="primary" /></div> : props.dressLoading && <div style={{ marginTop: 5, marginLeft: 10 }}><CircularProgress disableShrink size={15} color="primary" /></div>}
                        {enablePartsDash && <Button style={{ marginLeft: 'auto' }} value={'Back'} onClick={() => setEnablePartsDash(false)} />}
                    {(!enablePartsDash && (props.headPlant.appTypeByAppType.id !== 1) && !props.isLongRange) &&
                        <div style={{ display: 'flex', marginLeft: 'auto' }}>
                             <ContentSwitcher width={'120px'} listArray={buttonList} contentSwitcherClick={contentSwitcherClick} switchIndex={contentSwitchIndex} />
                        </div>}
                        </div>
                        }
                />
                 
                <ClickAwayListener onClickAway={()=>setOpen(null)}>
                        <div style={{ display: 'flex', justifyContent:'end',height:'20px',marginTop:"8px" }}>
                            <div style={{ minWidth: 30, float: 'right' }} onClick={(e)=>togglePopper(e)}>
                                    <MenuList stroke={curTheme === 'dark'   ? '#e8e8e8'  : '#646464'} />
                            </div>
                            <ListNDL
                                options={menuOption}
                                Open={open}
                                optionChange={optionChange}
                                keyValue={"name"}
                                keyId={"id"}
                                id={"popper-chart-menu"}
                                onclose={(e) => { setOpen(null) }}
                                anchorEl={open}
                                width="150px"
                            />
                           
                        </div>
                        
                </ClickAwayListener>

                {
                    contentSwitchIndex === 0 ?
                        enablePartsDash ? (
                            <DrillDownParts data={partsPerSecond} expectedCycleTime={props.expectedCycleTime} />
                        ) : (
                            <>
                                {
                                     partsPerHour && partsPerHour.length > 0 ?
                                        <div style={{ heigth: "258px" }}>
                                            <div style={{ width: "100%", height: "315px" }} ref={chartRef}>
                                                {/* chart component */}

                                                <ResponsiveContainer  >

                                                    <ComposedChart 
                                                    
                                                        data={partsPerHour}
                                                        height={258}
                                                        margin={{
                                                            top: 30,    // Increase top margin
                                                            right: 0,
                                                            left: 0,
                                                            bottom: 0, // Increase bottom margin
                                                        }}
                                                    >
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis
                                                            dataKey="hour"
                                                            interval={props.isLongRange ? 0 : 1}
                                                            tickLine={true}
                                                            axisLine={{ stroke: "#f5f5f5" }}
                                                        // tickCount={data.length}
                                                        />

                                                        <Tooltip />
                                                        <Legend content={props.headPlant.appTypeByAppType.id !== 1 ? renderLegend1 : renderLegend2} verticalAlign="bottom" wrapperStyle={{ lineHeight: "40px" }} />

                                                        <Bar
                                                            radius={[2, 2, 0, 0]}
                                                            dataKey="expectedparts"
                                                            barSize={60}
                                                            fill="#AAC9FF"
                                                            yAxisId="left"
                                                            legendType="rect"
                                                            name="Expected parts"
                                                            isAnimationActive={false}
                                                        >
                                                            <LabelList
                                                                dataKey="expectedparts"
                                                                position="bottom"

                                                                content={(props) => ( //NOSONAR
                                                                    <g>
                                                                        <rect
                                                                            x={props.viewBox.x + props.viewBox.width / 2 - 18} // Adjust the positioning
                                                                            y={props.viewBox.y - 28} // Adjust the positioning
                                                                            width="38" // Adjust the width
                                                                            height="24" // Adjust the height
                                                                            rx="4"
                                                                            ry="4"
                                                                            radius={4}
                                                                            fill="#0F6FFF" // Customize the div's color
                                                                        />
                                                                        <text
                                                                            x={props.viewBox.x + props.viewBox.width / 2}
                                                                            y={props.viewBox.y - 10}
                                                                            fill="#FFFFFF" // Change the label color here
                                                                            textAnchor="middle"
                                                                            fontWeight={500}
                                                                        >
                                                                            {props.value}
                                                                        </text>
                                                                    </g>
                                                                )}
                                                            />
                                                            {/* <LabelList dataKey="expectedparts" position="top" /> */}
                                                        </Bar>
                                                        <Bar
                                                            radius={[2, 2, 0, 0]}
                                                            dataKey="actualParts"
                                                            barSize={60}
                                                            fill="#0F6FFF"
                                                            yAxisId="left"
                                                            legendType="rect"
                                                            name="Actual Parts"
                                                            onClick={showPartsPersec}
                                                            isAnimationActive={false}

                                                        >
                                                            {/* <LabelList dataKey="actualParts" position="top" /> */}
                                                            {

                                                            }
                                                            <LabelList
                                                                dataKey="actualParts"
                                                                position="bottom"
                                                                content={(props) => ( //NOSONAR
                                                                    <g>
                                                                        <rect
                                                                            x={props.viewBox.x + props.viewBox.width / 2 - 18} // Adjust the positioning
                                                                            y={props.viewBox.y - 28} // Adjust the positioning
                                                                            width="38" // Adjust the width
                                                                            height="24" // Adjust the height
                                                                            rx="4"
                                                                            ry="4"
                                                                            radius={4}
                                                                            fill="#0F6FFF" // Customize the div's color
                                                                        />
                                                                        <text
                                                                            x={props.viewBox.x + props.viewBox.width / 2}
                                                                            y={props.viewBox.y - 10}
                                                                            fill="#FFFFFF" // Change the label color here
                                                                            textAnchor="middle"
                                                                            fontWeight={500}
                                                                        >
                                                                            {props.value}
                                                                        </text>
                                                                    </g>
                                                                )}
                                                            />
                                                        </Bar>
                                                        {
                                                            props.headPlant.appTypeByAppType.id !== 1 &&
                                                        <Line

                                                            strokeWidth={2}
                                                            strokeLinecap="round"
                                                            type="linear"
                                                            dataKey="dressing"
                                                            stroke="#76CA66"
                                                            yAxisId="right"
                                                            legendType="rect"
                                                            name="Dressing"
                                                            fill="#76CA66"
                                                        >

                                                            {/* <LabelList dataKey="dressing" content={renderCustomLabel} position="top" /> */}
                                                        </Line>}


                                                        <YAxis
                                                            label={{ value: 'Parts (NO)', angle: -90, position: 'left', fill: "#0F6FFF" }}
                                                            tickLine={false}
                                                            yAxisId="left"
                                                            stroke="#3B7AD9"
                                                            axisLine={{ stroke: "#3B7AD9" }}
                                                            domain={[5, "dataMax + 5"]}
                                                            tickCount={5}

                                                        />

                                                        {/* {
                                                            props.headPlant.appTypeByAppType.id !== 1 ? */}
                                                                <YAxis
                                                                    label={{ value: 'Dressing', angle: -90, position: 'right', fill: "#76CA66" }}
                                                                    tickLine={false}
                                                                    yAxisId="right"
                                                                    orientation="right"
                                                                    stroke="#76CA66"
                                                                    axisLine={{ stroke: "#76CA66" }}
                                                                    // unit="K"
                                                                    domain={[5, "dataMax + 5"]}
                                                                    tickCount={5}

                                                                />
                                                                {/* : null

                                                        } */}



                                                        {
                                                            partsPerHour.length > 8 ?
                                                                <Brush dataKey="hour" height={20} 
                                                                // travellerWidth={10} 
                                                                stroke="#0074CB" startIndex={brushDefaultDomain.startIndex} endIndex={brushDefaultDomain.endIndex} onChange={(e)=>{setbrushDefaultDomain(e)}}
                                                                />
                                                                :
                                                                null
                                                        }


                                                    </ComposedChart>

                                                </ResponsiveContainer>
                                            </div> 
                                            {
                                                !props.isLongRange && LabelDate.length > 1 && 
                                                <p className='text-Text-text-primary dark:text-Text-text-primary-dark' style={{ fontSize: "14px", fontWeight: 600, lineHeight: "22px", textAlign: "center" }}>{t("Hours") + '(' + (LabelDate.length > 4 ? LabelDate[3] : LabelDate.length > 1 ? LabelDate[1] : "") + ')'}</p>

                                            }
                                        </div>
                                        :
                                        (
                                            <div style={{ padding: 10, textAlign: "center", height: "342px" }}>
                                                <TypographyNDL variant="paragraph-s" value={t('No Parts Data')}/>
                                            </div>
                                        )


                                } 
                                
                            </>
                        )
                        :contentSwitchIndex === 1 ?
                        <React.Fragment>
                            {
                                props.DressData && props.DressData.length > 0 ?
                                    <div style={{ height:'315px', width: '100%' }}>
                                      
                                       
                                            <ResponsiveContainer>

                                                <ComposedChart 
                                                // ref={areaRef}
                                                    data={DressChart}
                                                    height={258}
                                                    margin={{
                                                        top: 30,    // Increase top margin
                                                        right: 0,
                                                        left: 10,
                                                        bottom: 0, // Increase bottom margin
                                                    }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis
                                                        dataKey="time"
                                                        interval={props.isLongRange ? 0 : 1}
                                                        tickLine={true}
                                                        axisLine={{ stroke: "#f5f5f5" }}
                                                    // tickCount={data.length}
                                                    />

                                                    <Tooltip />
                                                    <Legend content={props.headPlant.appTypeByAppType.id !== 1 ? renderLegend1 : renderLegend2} verticalAlign="bottom" wrapperStyle={{ lineHeight: "40px" }} />

                                                     
                                                    <Line

                                                        strokeWidth={2}
                                                        strokeLinecap="round"
                                                        type="linear"
                                                        dataKey="count"
                                                        stroke="#76CA66"
                                                        yAxisId="right"
                                                        legendType="rect"
                                                        name={t("Parts between dressing")}
                                                        fill="#76CA66"
                                                    >
                                                        <LabelList
                                                                dataKey="count"
                                                                position="top"
                                                                content={(props) => ( //NOSONAR
                                                                    <g>
                                                                        <rect
                                                                            x={props.viewBox.x + props.viewBox.width / 2 - 18} // Adjust the positioning
                                                                            y={props.viewBox.y - 28} // Adjust the positioning
                                                                            width="38" // Adjust the width
                                                                            height="24" // Adjust the height
                                                                            rx="4"
                                                                            ry="4"
                                                                            radius={4}
                                                                            fill="#0F6FFF" // Customize the div's color
                                                                        />
                                                                        <text
                                                                            x={props.viewBox.x + props.viewBox.width / 2}
                                                                            y={props.viewBox.y - 10}
                                                                            fill="#FFFFFF" // Change the label color here
                                                                            textAnchor="middle"
                                                                            fontWeight={500}
                                                                        >
                                                                            {props.value}
                                                                        </text>
                                                                    </g>
                                                                )}
                                                            />
                                                        {/* <LabelList dataKey="dressing" content={renderCustomLabel} position="top" /> */}
                                                    </Line> 
                                                    
                                                            <YAxis
                                                                label={{ value: 'Dressing', angle: -90, position: 'right', fill: "#76CA66" }}
                                                                tickLine={false}
                                                                yAxisId="right"
                                                                orientation="right"
                                                                stroke="#76CA66"
                                                                axisLine={{ stroke: "#76CA66" }}
                                                                // unit="K"
                                                                domain={[5, "dataMax + 5"]}
                                                                tickCount={5}

                                                            />  

                                                    {
                                                        DressChart.length > 8 ?
                                                            <Brush dataKey="time" height={20} stroke="#0074CB" startIndex={brushDressing.startIndex} endIndex={brushDressing.endIndex} onChange={(e)=>{setbrushDressing(e)}}/>
                                                            :
                                                            null
                                                    }


                                                </ComposedChart>

                                            </ResponsiveContainer>
                                    </div>
                                    : (
                                        <div style={{ padding: 10, textAlign: "center", height: "342px" }}>
                                            <TypographyNDL variant="paragraph-s" value={t('No Dressing Data')}/>
                                        </div>
                                    )
                            }
                        </React.Fragment>
                        :
                        <React.Fragment></React.Fragment>
                }
            </div>
        </KpiCards>
    )
}
const isRender = (prev, next) => {
    if ((prev.trendsData.length) !== next.trendsData.length) {
        return false
    }
    else if (next.trendsData.length > 0 && (prev.trendsData[prev.trendsData.length - 1].partsperhour) !== next.trendsData.partsperhour) {
        return false
    }
    else if (next.trendsData.length > 0 && (prev.trendsData[prev.trendsData.length - 1].dressingCount) !== next.trendsData.dressingCount) {
        return false
    }
    else if (prev.partLoading !== next.partLoading) {
        return false;
    }
    else if (prev.dressLoading !== next.dressLoading) {
        return false;
    }
    else {
        return true
    }
}
const PartsPerHourCard = React.memo(PartsPerHourCardFunction, isRender);
export default PartsPerHourCard;