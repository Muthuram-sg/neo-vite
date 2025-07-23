import React, { useState, useEffect, useCallback } from 'react';
import CircularProgress from "components/Core/ProgressIndicators/ProgressIndicatorNDL";
import ClickAwayListener from 'react-click-away-listener';
import KpiCards from "components/Core/KPICards/KpiCardsNDL";
import { useRecoilState } from "recoil";
import { themeMode } from "recoilStore/atoms"; 
import { useTranslation } from 'react-i18next'; 
import Chart from "react-apexcharts"; 
import ListNDL from 'components/Core/DropdownList/ListNDL.jsx';
import ContentSwitcherNDL from "components/Core/ContentSwitcher/ContentSwitcherNDL";
import TypographyNDL from "components/Core/Typography/TypographyNDL"; 
import MenuList from 'assets/neo_icons/Dashboard/MenuList.svg?react'; 
import { useCurrentPng } from "recharts-to-png";
import FileSaver from "file-saver"; 
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend, ResponsiveContainer, Brush,LabelList
} from "recharts";
import * as XLSX from 'xlsx'
function DryerEfficiencyCard(props){
    const [curTheme] = useRecoilState(themeMode);    
    const [isHourChart,setIsHourChart] = useState(0);
    const { t } = useTranslation();
    const [isLong,setisLong] = useState(false)
    const brushDefaultDomain = [0, 7]
    const [open,setOpen] = useState(false);
    const [getAreaPng, { ref: areaRef }] = useCurrentPng();
    
     
    useEffect(()=>{
        if(props.isLongRange){
            setIsHourChart(1)
        }else{
            setIsHourChart(0) 
        }
        setisLong(props.isLongRange)

    },[props.isLongRange])

    const togglePopper = (e) =>{
        setOpen(e.currentTarget);
    }

    const handleAreaDownload = useCallback(async () => {
        const png = await getAreaPng();
        if (png) {
          FileSaver.saveAs(png, "Bar-chart.png");
        }
      }, [getAreaPng]);

    //CSV Download
    const downloadExcel = (data, name) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, name + ".xlsx");
    };

    const renderBrush = () =>{
        if( props.hourlyData.length > 8 ){
            return (
                <Brush dataKey="hour" height={20} stroke="#0074CB" startIndex={brushDefaultDomain[0]} endIndex={brushDefaultDomain[1]} />
            )

        }else{
            return null
        }
    }
    let chartDataLabel 
    if(props.efficiencyLable && props.efficiencyLable.length > 4){
        chartDataLabel = props.efficiencyLable[3]
    }else if(props.efficiencyLable && props.efficiencyLable.length > 0){
        chartDataLabel = props.efficiencyLable[0]

    }else{
        chartDataLabel  =  null
    } 

    const renderChartLabel =(prop)=>{
        return(
            <g>
            <rect
                x={prop.value < 99  ?prop.viewBox.x + prop.viewBox.width / 2 - 12 :  prop.viewBox.x + prop.viewBox.width / 2 - 18 }  // Adjust the positioning
                y={prop.viewBox.y - 28} // Adjust the positioning
                width={prop.value < 99  ? "26" : "38"}
                height="24" // Adjust the height
                rx="4"
                ry="4"
                radius={4}
                fill="#0F6FFF" // Customize the div's color
            />
            <text
                x={prop.viewBox.x + prop.viewBox.width / 2}
                y={prop.viewBox.y - 10}
                fill="#FFFFFF" // Change the label color here
                textAnchor="middle"
                fontWeight={500}
            >
                {prop.value}
            </text>
        </g>
        )
    }

    const renderHourChart = ()=>{
        if(isHourChart){
            if(props.hourlyData && props.hourlyData.length > 0){
return(
    <div style={{ heigth: "379px" }} >
    <div style={{ height: "379px" }}>
        <ResponsiveContainer>

            <BarChart ref={areaRef}
                height={280}
                data={props.hourlyData}
                margin={{
                    top: 30,
                    right: 0,
                    left: 0,
                    bottom: 0
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                dataKey="hour"
                interval={isLong ? 0 :1}
                tickLine={true}
                axisLine={{ stroke: "#f5f5f5" }}
                 />
                <YAxis
                                    label={{ value: 'Consumption (kwh)', angle: -90, position: 'left',fill:"#525252" }}
                                    tickLine={false}
                                    yAxisId="left"
                                    stroke="#3B7AD9"
                                    axisLine={{ stroke: "#3B7AD9" }}
                                    domain={[5, "dataMax + 5"]}
                                    tickCount={5}

                                />
                <Tooltip />
                <Legend />
                <Bar dataKey="OEE"  yAxisId="left" fill="#FF6C3E" >
                <LabelList
                                        dataKey="OEE"
                                        position="bottom"

                                        content={(prop) => (
                                            renderChartLabel(prop)
                                            )}
                                    />
                </Bar>
                <Bar dataKey="ME"  yAxisId="left" fill="#9721B6" >
                <LabelList
                                        dataKey="ME"
                                        position="bottom"

                                        content={(prop) => (
                                            renderChartLabel(prop)
                                            
                                            )}
                                    />
                </Bar>
                <Bar dataKey="EE"  yAxisId="left" fill="#3DA3F5" >
                <LabelList
                                        dataKey="EE"
                                        position="bottom"

                                        content={(prop) => ( //NOSONAR
                                            <g>
                                                <rect
                                                   x={prop.value < 99  ?prop.viewBox.x + prop.viewBox.width / 2 - 12 :  prop.viewBox.x + prop.viewBox.width / 2 - 18 }  // Adjust the positioning
                                                    y={prop.viewBox.y - 28} // Adjust the positioning
                                                    width={prop.value < 99  ? "26" : "38"} // Adjust the width
                                                    height="24" // Adjust the height
                                                    rx="4"
                                                    ry="4"
                                                    radius={4}
                                                    fill="#0F6FFF" // Customize the div's color
                                                />
                                                <text
                                                    x={prop.viewBox.x + prop.viewBox.width / 2}
                                                    y={prop.viewBox.y - 10}
                                                    fill="#FFFFFF" // Change the label color here
                                                    textAnchor="middle"
                                                    fontWeight={500}
                                                >
                                                    {prop.value}
                                                </text>
                                            </g>
                                        )}
                                    />
                </Bar>
               
                {renderBrush()}

            </BarChart>

        </ResponsiveContainer>
    </div>

    {
        !isLong &&
<p style={{ fontSize: "14px", fontWeight: 600, lineHeight: "22px", textAlign: "center" }}>{t("Hours") + '(' + (chartDataLabel) + ')'}</p>

    }
</div>
)
            }else{
                return(
                    <div style={{ padding: 10, textAlign: "center", height: 258 }}>
                    <TypographyNDL variant="label-02-m" value={t('No Efficiency Data')}/>
                </div>
                )
            }
        }else{
            if(props.shiftData && props.shiftData.length > 0){
                return(
                    <Chart
                    height={380}
                    width={"100%"}
                    options={{
                        theme: {
                            mode: curTheme
                  },
                        chart: {
                            id: "PartsPerDressingChart",
                            width: '100%',
                            background: '0',
                            type: 'bar',
                            stacked: true,
                            zoom: {
                                autoScaleYaxis: true
                            },
                            toolbar: {
                                autoSelected: 'zoom'
                            }
                            ,
                           

                        },
                        plotOptions: {
                            bar: {
                                borderRadius: 10,
                                dataLabels: {
                                    position: 'center', // top, center, bottom
                                },
                            }
                        },
                        tooltip: {
                            enabled: true,
                            
                        },
                        dataLabels: {
                            enabled: true,
                            formatter: function (val, opts) {
                                // Show the label for the last bar only
                                const seriesIndex = opts.seriesIndex;
                                const yValue = opts.w.globals.series[seriesIndex][opts.dataPointIndex];
                                return `${yValue}`;
                            }
                        },
                        stroke: {
                            curve: ['smooth'],
                            width: [0, 0, 0]
                        },
                        markers: {
                            size: 3,
                            style: "hollow",
                        },

                    }}
                    series={props.shiftData}
                    type="bar"
                />
                )
            }else{
                return(
                    <div style={{ padding: 10, textAlign: "center", height: 200 }}>
                    <TypographyNDL variant="label-02-m" value={t("No Shift Data")} />
                </div>
                )
            }
        }
    }
    const OverAllList = [
        { id: "Shift", value: "Shift", disabled: false },
        { id: "Hour", value: "Hour", disabled: false },
    ]
    const menuOption = [{id:"1", name:"Download PNG"},{id:"2", name:"Download CSV"}]

    function optionChange(e){
        if(e === '1'){
            handleAreaDownload()
        } else if (e === '2') {
            downloadExcel(props.hourlyData, "Info") // Handle SVG download
          }  
    }
    return (
        <KpiCards >
            <div>
                <div className='flex items-center justify-between'>
                    <TypographyNDL  color='secondary' variant="heading-01-xs" style={{display:"flex",alignItems:"center"}}> 
                        {isLong ? " Efficiency Per Day" : " Efficiency"}
                        <>
                            {
                            isHourChart?props.hourLoading && <div style={{marginLeft: 10}}><CircularProgress disableShrink size={15} color="primary" /></div>:props.shiftLoading && <div style={{marginLeft: 10}}><CircularProgress disableShrink size={15} color="primary" /></div>
                            }
                        </>
                        </TypographyNDL>
                        {!isLong &&
                            <ContentSwitcherNDL listArray={OverAllList} contentSwitcherClick={(e) => setIsHourChart(e)} switchIndex={isHourChart} ></ContentSwitcherNDL>
                            // <div style={{ display: 'flex', marginLeft: 'auto' }}>
                            //     <Button type={!isHourChart ? "primary" : "ghost"} value="Shift" onClick={showShiftChart} />
                            //     <Button type={isHourChart ? "primary" : "ghost"} value="Hour" onClick={showHourChart} />
                            // </div>
                        }
                    
                </div> 
                <ClickAwayListener onClickAway={()=>{setOpen(null)}}>
                    <div>
                        <div style={{ height: '25px',marginTop:"8px" }}>
                            <div style={{ minWidth: 30, float: 'right' }} onClick={(e)=>togglePopper(e)}> 
                                    <MenuList stroke={curTheme === 'dark'   ? '#e8e8e8'  : '#646464'}/> 
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
                         
                    </div>
                </ClickAwayListener>
                {renderHourChart()}
            </div>
        </KpiCards>
    )
}
export default DryerEfficiencyCard;