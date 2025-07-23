import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,ReferenceLine,Area,ComposedChart} from 'recharts';
import ListNDL from 'components/Core/DropdownList/ListNDL.jsx';
import Typography from 'components/Core/Typography/TypographyNDL';
import  useTheme from "TailwindTheme";
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import configParam from 'config';
import { useRecoilState } from 'recoil';
import { dashBtnGrp, dashboardHideGap, metricsList } from 'recoilStore/atoms';
import { useCurrentPng } from "recharts-to-png";
import FileSaver from "file-saver";
import MenuList from 'assets/neo_icons/Dashboard/MenuList.svg?react';

const LineCharts = ({ data, width, height, meta ,cwValues }) => {
    
    const mainTheme = useTheme();
    const [btGroupValue] = useRecoilState(dashBtnGrp);
    const [hideGap] = useRecoilState(dashboardHideGap);
    const [metrics] = useRecoilState(metricsList);
    const [uniquedata,setuniquedata] = useState([]);
    const [isOutSideRange,setisOutSideRange] = useState(false)  
    const [uniquelegend,setuniquelegend] = useState([]);
    const [FinalData,setFinalData] = useState([]);
    const [alertConfig,setalertConfig] =useState({})
    const [open,setOpen] = useState(null);
    const [,setconsumption] = useState([])
    const { t } = useTranslation();
    const [getAreaPng, { ref: areaRef }] = useCurrentPng();
   
    let COLORS =  ["#EF5F00",
        "#FFBA18",
        "#FFDC00",
        "#B0E64C",
        "#DC3E42",
        "#DD4425",
        "#DC3B5D",
        "#DF3478",
        "#CF3897",
        "#A144AF",
        "#8347B9",
        "#654DC4",
        "#5151CD",
        "#3358D4",
        "#74DAF8",
        "#0588F0",
        "#0797B9",
        "#0D9B8A",
        "#4CBBA5",
        "#30A46C",
        "#46A758",
        "#208368"]
    
    let janOffset = moment({ M: 0, d: 1 }).utcOffset(); //checking for Daylight offset
    let julOffset = moment({ M: 6, d: 1 }).utcOffset(); //checking for Daylight offset
    let stdOffset = Math.min(janOffset, julOffset);// Then we can make a Moment object with the current time at that fixed offset 
    const [stats, setStats] = useState({
        min: null,
        max: null,
        average: null,
    });
// console.log(data,FinalData,"line data")
    useEffect(() => {
        if (meta.isDataStats) {
         
            const filteredData = FinalData.filter(entry => typeof entry === 'object' && entry !== null);
            const allProperties = filteredData.flatMap(entry => Object.keys(entry).filter(key => key !== 'time' && key !== 'LCL' && key !== 'LSL' && key !== 'USL' && key !== 'UCL' && key !== 'Normal'));
            const allValues = allProperties.flatMap(prop => filteredData.map(entry => entry[prop]))
     
            if (allValues.length > 0) {
                const min = Math.floor(Math.min(...allValues));
                const max = Math.floor(Math.max(...allValues));
                // Convert string elements to numbers
                const numbers = allValues.map(Number);
                const sum = numbers.reduce((acc, curr) => acc + curr, 0);
                const average = Math.floor(sum / numbers.length);
             
                
                const current = allValues[allValues.length - 1]
                // console.log({ min, max, average,current },"{ min, max, average,current }")
                setStats({ min, max, average,current });
            } else {
                // If there are no valid values, set stats to null
                setStats({ min: null, max: null, average: null,current:null });
            }
        }
    }, [FinalData, meta.isDataStats]);
    useEffect(()=>{
        let result = [] 
        let keys = [];
        let formatData = [];
        let isKWH = []
    
        data.map(x => {
            const instrument = x.instrument
            const keyvalue = x.key;
            const key = instrument+'-'+displayKey(keyvalue);
            const exist = formatData.findIndex(fd=>fd.time === x.time); 
            if(exist>=0){
                let obj2 = {...formatData[exist]}
                obj2[key] = x.value?parseFloat(x.value).toFixed(2):"";
                formatData[exist] = obj2;
            } else {
                let obj1 = {};
                obj1['time'] = moment(x.time).utcOffset(stdOffset).format('YYYY-MM-DD HH:mm');
                obj1[key] = x.value ? parseFloat(x.value).toFixed(2) : "";
                formatData.push(obj1)
            }
        })
     
        const formatted = data.map(x=>{
            x.time = new Date(x.time).getTime();
            return x
        })
        if(!hideGap){ 
            formatted.forEach(x=>{
                const instrument =x.instrument 
                const keyvalue = x.key;
                const keyVal = meta.formulaName ? meta.formulaName : instrument + '-' + displayKey(keyvalue);
              
                const time = x.time;
                const key = keyVal;
             
                const value = x.value ? (!isNaN(meta.decimalPoint) ? Number(x.value).toFixed(Number(meta.decimalPoint)) : x.value) : null;
                if (value) {
                    let obj = {};
                    isKWH.push(value)
                    obj[key] = value;
                  
                     
                    keys.push({ key: key, show: true });
                    const index = result.findIndex(y => y.time === time);
                    if (index >= 0) {
                        let exist = { ...result[index] };
                        exist = { ...exist, ...obj };
                        result[index] = exist;
                    } else {
                        obj['time'] = time;
                        result.push(obj);
                    }
                }
            })
        } else {
            formatted.forEach(x => {
              
                const instrument = x.instrument
                const keyvalue = x.key;
                const keyVal = meta.formulaName ? meta.formulaName : instrument + '-' + displayKey(keyvalue);
                const time = x.time;
                const key = keyVal;
               
                const value = x.value ? (!isNaN(meta.decimalPoint) ? Number(x.value).toFixed(Number(meta.decimalPoint)) : x.value) : null;
                    let obj = {};    
                isKWH.push(value)

                    obj[key] = value;
                
                    keys.push({key: key,show: true});
                    const index = result.findIndex(y=>y.time === time);
                    if(index >= 0){
                        let exist = {...result[index]};
                        exist = {...exist,...obj};
                        result[index] = exist;
                    }else{
                        obj['time'] = time
                        result.push(obj);
                    }
                
            })
        }
      

        const uniqueKeys = [...new Set(keys.map(a => JSON.stringify(a)))].map(a => JSON.parse(a));
      

        if (meta.tooltipSort === 'asc') {
            uniqueKeys.sort((a, b) => a.key.localeCompare(b.key));
        } else if (meta.tooltipSort === 'desc') {
            uniqueKeys.sort((a, b) => b.key.localeCompare(a.key));
        }
        
            result.sort((a, b) => new Date(a.time) - new Date(b.time))
          
           if(isOutSideRange){

            result = result.map(x=>{
                return {...x,
                    USL: [0,alertConfig.critMin],
                    UCL: [alertConfig.critMin,alertConfig.warnmin],
                    Normal: [alertConfig.warnmin,alertConfig.warnmax],
                    LCL: [alertConfig.warnmax,alertConfig.critMax],
                    LSL: [alertConfig.critMax,((alertConfig.critMax + alertConfig.critMax/2) *1.55).toFixed(2)]
                }
            })
           }
          console.log(result,"result")
        setFinalData(result)
        setconsumption(isKWH)
        setuniquedata(uniqueKeys)
        setuniquelegend(uniqueKeys)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[data,hideGap,isOutSideRange])
   
    
    useEffect(()=>{
        if(meta && meta.isShowAlarm && cwValues.alertObj && cwValues.alertObj.critical_type && cwValues.alertObj.critical_type === "outside_the_range" && cwValues.alertObj.warn_type && cwValues.alertObj.warn_type === "outside_the_range" ){
         
            setisOutSideRange(true)
            setalertConfig({warnmin:Number(cwValues.alertObj.warn_min_value),warnmax:Number(cwValues.alertObj.warn_max_value),critMin:Number(cwValues.alertObj.critical_min_value),critMax:Number(cwValues.alertObj.critical_max_value)})


        }else{
            setisOutSideRange(false)
            setalertConfig({})
        }

    },[data,meta,cwValues])


    const handleAreaDownload = useCallback(async () => {
        const png = await getAreaPng();
        if (png) {
            FileSaver.saveAs(png, "Line-chart.png");
            setOpen(null)
        }
    }, [getAreaPng]);
  
    const togglePopper = (e) => {
        // // console.log(e.currentTarget)
        setOpen(e.currentTarget);
    }

    
    function renderReferenceLines() {
        if (meta.isShowAlarm && meta.alarmLevel) {
           
            return (
                <>
    
                    <ReferenceLine y={cwValues.c} stroke="red" strokeDasharray="3 3"  > 
                    
                   </ReferenceLine>
                    <ReferenceLine y={cwValues.w} stroke="yellow" strokeDasharray="3 3"  >
                   
                   </ReferenceLine>
                </>
            );
        }
        return null;
    }

    function renderCusomizedLegend({ payload }) {
    //   // console.log(payload,"payload")
        const sortByDataKey = (a, b) => {
            const dataKeyA = a.dataKey.toUpperCase();
            const dataKeyB = b.dataKey.toUpperCase();
            if (dataKeyA < dataKeyB) {
                return -1;
            }
            if (dataKeyA > dataKeyB) {
                return 1;
            }
            return 0;
        };

      
        if (meta.tooltipSort === 'asc') {
            payload.sort(sortByDataKey);
        } else if (meta.tooltipSort === 'desc') {
            payload.sort((a, b) => sortByDataKey(b, a));
        }
      
        return (
            <div className="customized-legend" style={{ overflow: 'auto', height: '100%', textAlign: 'left' ,marginLeft:isGreater ? undefined : "40px"}}>
                {payload.map(entry => {
                    const { dataKey, color, active } = entry;
               
                    const style = {
                        marginRight: 10,
                        color: !active ? "#AAA" : "#000"
                    };

                    return (
                        <span
                            className="legend-item"
                            onClick={() => filterLegend(dataKey)}
                            style={style}
                        >


                            <svg width={6} height={6} xmlns="http://www.w3.org/2000/svg">
                                <circle cx="3" cy="3" r="3" fill={color} />
                            </svg>

                            {!active && (
                                <svg width={4} height={4} xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="2" cy="2" r="2" fill={"#FFF"} />
                                </svg>


                            )}

                            <span className='text-Text-text-primary dark:text-Text-text-primary-dark' style={{ paddingLeft: 5, fontSize: '12px' }}>{dataKey}</span>
                        </span>
                    );
                })}
            </div>
        );
    }

    function filterLegend(fldata){
      //  // console.log(uniquedata,"uniquedata")
        if(uniquedata.find(x=>x.key === fldata)){
            const cloned = [...uniquedata];
            const index = cloned.findIndex(a=>a.key === fldata);
            cloned[index].show = !cloned[index].show;
            setuniquedata(cloned)
        }
    }

    function renderReferenceLines() {
        if (meta.isShowAlarm && meta.alarmLevel && cwValues) {
           
            return (
                <>
    
                    <ReferenceLine y={cwValues.c} stroke="red" strokeDasharray="3 3"  /> 
                    <ReferenceLine y={cwValues.w} stroke="yellow" strokeDasharray="3 3"  />
                  
                </>
            );
        }
        return null;
    }

    const displayKey = (key) =>{    
         
        const metricArr = metrics && metrics.length >0? metrics.filter(y=>key && key.trim()===y.name):[];  
        return metricArr.length>0 ? metricArr[0].title : key;
    }
    

      const CustomizedDot = (props) => {
        const { cx, cy,fillcolor } = props;
        return (
            <svg x={cx - 3} y={cy - 3} width={4} height={4} xmlns="http://www.w3.org/2000/svg">
                <circle cx="2" cy="2" r="2" fill={fillcolor} />
            </svg>
        );
    };
    // // console.log(FinalData,"FinalData")
    const menuOption = [{ id: "1", name: "Download PNG" }]
    const decimalValue = meta.isDecimal?meta.isDecimal: meta.decimalPoint ? meta.decimalPoint !== 'none' : undefined
    const findHighestValue = (data) => {
        let highestValue = -Infinity;
        data.forEach(item => {
          if (item.value > highestValue) {
            highestValue = item.value;
          }
        });
        // const roundedValue = Math.round(highestValue / 100) * 100;      
        return highestValue;
      };      
      
    const highestValue = findHighestValue(data);
    const chartWidth = (meta.isDecimal || meta.decimalPoint !== 'none') ? 90 : 60
    const isDecimal = (v) =>{
        if(meta.isDecimal || meta.decimalPoint !== 'none'){
            return parseFloat(v).toFixed(2)

        }else{
            return Math.round(v);
        }

    } 
    const DomainValues = meta.isCustomYaxis && meta.yaxisFromRef && meta.yaxisToRef?[Number(meta.yaxisFromRef),Number(meta.yaxisToRef)]:undefined
 
    const isGreater = true
 
    const CustomizedLabel = (props) => {
        const { x, y, stroke, value } = props;
        return (
            <text x={x} y={y} dy={-4} fill={stroke} fontSize={12} textAnchor="middle">
                {value}
            </text>
        );
    };
     

  const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // // console.log(payload,"payload")
    const filteredPayload = payload

    if (filteredPayload.length > 0) {
      return (
        <div className="bg-[#FFFFFF] rounded-lg  p-2">
          <p className="label">{`${moment(label).utcOffset(stdOffset).format('DD-MM-YYYY HH:mm')}`}</p>
          {filteredPayload.map((item, index) => (
            <p key={`item-${index}`} style={{ color: item.color }}>
              {`${item.name} : ${item.value}`}
            </p>
          ))}
        </div>
      );
    }
  }

  return null
}
    
    const renderAreaAlertChart =()=>{

        return(
         
                <div className='flex '>
                    <div>
                    <ComposedChart
              ref={areaRef} 
              layout="horizontal"
              width={width} 
              height={(meta.isDataStats && width >= 625) ? height - 70 : height - 15}
              data={FinalData}
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis tickLine={false} axisLine={false}   dataKey="time"
                        tickFormatter={(unixTime) =>configParam.FORMAT_TIME(btGroupValue, unixTime)}//moment(unixTime).format('DD-MM-YYYY HH:mm')}//configParam.FORMAT_TIME(btGroupValue, unixTime)}
                    />
                    <YAxis  allowDecimals={decimalValue} 
                    allowDataOverflow
                    domain={DomainValues ? DomainValues : [0, highestValue]} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(val)=>isDecimal(val)}
                    width={chartWidth}
                    interval="preserveStartEnd" 
                    />
            
            <Tooltip  content={<CustomTooltip />} />
              <Legend />
              <Area dataKey="USL" fill="#F40B0B" stroke="#F40B0B"    legendType="none"  />
              <Area dataKey="UCL" fill="#FFC300" stroke="#FFC300"  legendType="none"  />
              <Area dataKey="Normal" fill="#0FF40B" stroke="#0FF40B"  legendType="none" />
              <Area dataKey="LCL" fill="#FFC300" stroke="#FFC300"   legendType="none"  />
              <Area dataKey="LSL" fill="#F40B0B" stroke="#F40B0B" legendType="none" />
              {/* <Bar dataKey="pv" barSize={20} fill="#413ea0" /> */}
              {
                        uniquedata.filter(e => e.key !== data).map((x, i) => {
                            return x.show && <Line type="monotone" isAnimationActive={false} dataKey={x.key} stroke={COLORS[i]} dot={<CustomizedDot fillcolor={COLORS[i]} />} activeDot={{ r: 8 }} label={meta.isLabel ? <CustomizedLabel /> : ""} /> 
                        })
                    }    
            </ComposedChart>
                    </div>

                <div style={{ width: '30px', marginLeft: 'auto' }}>
            <div style={{ height: '25px' }}>
                <div style={{ minWidth: 30, float: 'right' }} onClick={(e) => togglePopper(e)}>
                    <MenuList stroke={mainTheme.colorPalette.primary} />
                </div>
            </div>
            <ListNDL
                options={menuOption}
                Open={open}
                optionChange={handleAreaDownload}
                keyValue={"name"}
                keyId={"id"}
                id={"popper-chart-menu"}
                onclose={(e) => { setOpen(null) }}
                anchorEl={open}
                width="150px"
            />
        </div>
                </div>
            
           
         
        

    
        )

    }

    const classes={
        cardItems: {
            display: "grid",
            borderLeft: "1px solid  #E0E0E0",
            paddingLeft: "16px"

        },
        cardContentAlign: {
            display: "flex",
            justifyContent: "space-between",
            paddingTop: 8,
            paddingBottom: 8,

        }
    }

//     return (
//         <>
//             {(meta.isDataStats && width >= 339) &&  (
//                 <div style={classes.cardContentAlign}>
//                      <div style={classes.cardItems} >
//                         <Typography variant={'h3'} value={"Current"} />
//                         <div style={{ color: '#525252' }} className=" text-base font-normal leading-snug ">{stats.current !== null ? stats.current: "--"}</div>
//                     </div>
//                     <div style={classes.cardItems}>
//                         <Typography variant={'h3'} value={"Average"} />
//                         <div style={{ color: '#525252' }} className=" text-base font-normal leading-snug ">{stats.average !== null ?  (!isNaN(meta.decimalPoint) ? Number(stats.average).toFixed(Number(meta.decimalPoint)) : stats.average): "--"}</div>
//                     </div>
                  
//                     <div style={classes.cardItems}>
//                         <Typography variant={'h3'} value={"Minimum"} />
//                         <div style={{ color: '#525252' }} className=" text-base font-normal leading-snug ">{stats.min !== null ? (!isNaN(meta.decimalPoint) ? Number(stats.min).toFixed(Number(meta.decimalPoint)) : stats.min): "--"}</div>
//                     </div>
//                     <div style={classes.cardItems}>
//                         <Typography variant={'h3'} value={"Maximum"} />
//                         <div style={{ color: '#525252' }} className=" text-base font-normal leading-snug ">{stats.max !== null ?  (!isNaN(meta.decimalPoint) ? Number(stats.max).toFixed(Number(meta.decimalPoint)) : stats.max): "--"}</div>
//                     </div>
//                 </div>
//             )}

//            { FinalData.length > 0 ? 
    
//     isOutSideRange && FinalData.length > 0 ? 
//         <React.Fragment>
//             {renderAreaAlertChart()}
//         </React.Fragment>


//         :

//        !isOutSideRange &&  FinalData.length > 0 ? (
//             <div>
//                 <div style={{ width: '30px', marginLeft: 'auto' }}>
//                     <div style={{ height: '25px' }}>
//                         <div style={{ minWidth: 30, float: 'right' }} onClick={(e) => togglePopper(e)}>
//                             <MenuList stroke={mainTheme.colorPalette.primary} />
//                         </div>
//                     </div>
//                     <ListNDL
//                         options={menuOption}
//                         Open={open}
//                         optionChange={handleAreaDownload}
//                         keyValue={"name"}
//                         keyId={"id"}
//                         id={"popper-chart-menu"}
//                         onclose={(e) => { setOpen(null) }}
//                         anchorEl={open}
//                         width="150px"
//                     />
//                 </div>

//                 <LineChart width={width} height={(meta.isDataStats && width >= 339) ? height-70 : height-15} data={FinalData} ref={areaRef} margin={{
//                     top: 20,
//                     right: 30,
//                     left: 20,
//                     bottom: 10
//                 }}>
//                     <CartesianGrid vertical={false} strokeDasharray="8 0" stroke="#E8E8E8" />
//                     {renderReferenceLines()}
//                     {
//                         uniquedata.filter(e => e.key !== data).map((x, i) => {
//                             return x.show && <Line type="monotone" isAnimationActive={false} dataKey={x.key} stroke={COLORS[i]} dot={<CustomizedDot fillcolor={COLORS[i]} />} activeDot={{ r: 8 }} label={meta.isLabel ? <CustomizedLabel /> : ""}> 
//                              {/* {meta.isLabel && ( <LabelList dataKey={x.key} position="top"  content={({ x, y, width, height, value, viewBox }) => (
//                                                                             <g>
//                                                                                 <rect
//                                                                                     x={viewBox.x + viewBox.width / 2 - 18} // Adjust the positioning
//                                                                                     y={viewBox.y - 28} // Adjust the positioning
//                                                                                     width="38" // Adjust the width
//                                                                                     height="24" // Adjust the height
//                                                                                     rx="4"
//                                                                                     ry="4"
//                                                                                     radius={4}
//                                                                                     fill="#0F6FFF" // Customize the div's color
//                                                                                 />
//                                                                                 <text
//                                                                                     x={viewBox.x + viewBox.width / 2}
//                                                                                     y={viewBox.y - 10}
//                                                                                     fill="#FFFFFF" // Change the label color here
//                                                                                     textAnchor="middle"
//                                                                                     fontWeight={500}
//                                                                                 >
//                                                                                     {value}
//                                                                                 </text>
//                                                                             </g>
//                                                                         )} />)} */}
//                                                                          </Line>
// })
//                     }            
//                     <Tooltip 
//                     labelStyle={{ fontWeight: 'bold' }}  
//                     labelFormatter={function(value) {
//                     return `${moment(value).utcOffset(stdOffset).format('DD-MM-YYYY HH:mm')}`;
//                     }}/>
//                     <Legend
//                         verticalAlign="bottom"
//                         height={36}
//                         align="center"
//                         payload={uniquelegend.map((pair, i) => ({
//                             dataKey: pair.key,
//                             color: COLORS[i],
//                             active: pair.show
//                         }))}
//                         content={renderCusomizedLegend}
//                     />
//                     <XAxis tickLine={false} axisLine={false}   dataKey="time"
//                         tickFormatter={(unixTime) =>configParam.FORMAT_TIME(btGroupValue, unixTime)}//moment(unixTime).format('DD-MM-YYYY HH:mm')}//configParam.FORMAT_TIME(btGroupValue, unixTime)}
//                     />
//                     <YAxis  allowDecimals={decimalValue} 
//                     allowDataOverflow
//                     domain={DomainValues} 
//                     tickLine={false} 
//                     axisLine={false}
//                     tickFormatter={(val)=>isDecimal(val)}
//                     width={chartWidth}
//                     interval="preserveStartEnd" 
//                     />

//                 </LineChart>
//             </div>
//         )
//         :(
//             <div style={{ textAlign: "center"}}>
//                 <Typography value={t("No Data")} variant="4xl-body-01" style={{color:'#0F6FFF'}} />
//                 <Typography value={t("EditORReload")} variant="heading-02-sm"/>
                    
                
//             </div>
//         )

//         </>
//     )
return (
    <>
       {(meta.isDataStats && width >= 625) && (
                <div width={width} height={height-70}>
                <div style={classes.cardContentAlign}>
                     <div style={classes.cardItems} >
                        <Typography variant={'h3'} value={"Current"} />
                        <div style={{ color: '#525252' }} className=" text-base font-normal leading-snug ">{stats.current !== null ?  (!isNaN(meta.decimalPoint) ? Number(stats.current).toFixed(Number(meta.decimalPoint)) : Math.round(stats.current)): "--"}</div>
                    </div>
                    <div style={classes.cardItems}>
                        <Typography variant={'h3'} value={"Average"} />
                        <div style={{ color: '#525252' }} className=" text-base font-normal leading-snug ">{stats.average !== null ?  (!isNaN(meta.decimalPoint) ? Number(stats.average).toFixed(Number(meta.decimalPoint)) :Math.round(stats.average) ): "--"}</div>
                    </div>
                  
                    <div style={classes.cardItems}>
                        <Typography variant={'h3'} value={"Minimum"} />
                        <div style={{ color: '#525252' }} className=" text-base font-normal leading-snug ">{stats.min !== null ? (!isNaN(meta.decimalPoint) ? Number(stats.min).toFixed(Number(meta.decimalPoint)) : Math.round(stats.min)): "--"}</div>
                    </div>
                    <div style={classes.cardItems}>
                        <Typography variant={'h3'} value={"Maximum"} />
                        <div style={{ color: '#525252' }} className=" text-base font-normal leading-snug ">{stats.max !== null ?  (!isNaN(meta.decimalPoint) ? Number(stats.max).toFixed(Number(meta.decimalPoint)) : Math.round(stats.max)): "--"}</div>
                    </div>
                </div></div>
            )}

        {FinalData.length > 0 ? (
            isOutSideRange && FinalData.length > 0 ? (
                <React.Fragment>
                    {renderAreaAlertChart()}
                </React.Fragment>
            ) : (
                !isOutSideRange && FinalData.length > 0 && (
                    <div className='flex '>
                       
                        <LineChart
                         width={isGreater ? width :width + 75}
                         height={(meta.isDataStats && width >= 339) ? height - 70 : height - 15} 
                         data={FinalData} ref={areaRef} style={{marginLeft:isGreater ? undefined : "-60px"}} margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 10
                        }}>
                            <CartesianGrid vertical={false} strokeDasharray="8 0" stroke="#E8E8E8" />
                            {renderReferenceLines()}
                            {uniquedata.filter(e => e.key !== data).map((x, i) => (
                                x.show && <Line type="monotone" isAnimationActive={false} dataKey={x.key} stroke={COLORS[i]} dot={<CustomizedDot fillcolor={COLORS[i]} />} activeDot={{ r: 8 }} label={meta.isLabel ? <CustomizedLabel /> : ""}>
                                    
                                </Line>
                            ))}
                            <Tooltip
                                labelStyle={{ fontWeight: 'bold' }}
                                labelFormatter={function (value) {
                                    return `${moment(value).utcOffset(stdOffset).format('DD-MM-YYYY HH:mm')}`;
                                }} />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                align="center"
                                payload={uniquelegend.map((pair, i) => ({
                                    dataKey: pair.key,
                                    color: COLORS[i],
                                    active: pair.show
                                }))}
                                content={renderCusomizedLegend}
                            />
                            <XAxis tickLine={false} axisLine={false} dataKey="time"
                                tickFormatter={(unixTime) => configParam.FORMAT_TIME(btGroupValue, unixTime)} />
                            <YAxis allowDecimals={decimalValue}
                                allowDataOverflow
                                domain={DomainValues ? DomainValues : [0, highestValue]} 
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(val) => isDecimal(val)}
                                width={chartWidth}
                                interval="preserveStartEnd"
                            />
                        </LineChart>
                        <div style={{ width: '30px', marginLeft: 'auto' }}>
                            <div style={{ height: '25px' }}>
                                <div style={{ minWidth: 30, float: 'right' }} onClick={(e) => togglePopper(e)}>
                                    <MenuList stroke={mainTheme.colorPalette.primary} />
                                </div>
                            </div>
                            <ListNDL
                                options={menuOption}
                                Open={open}
                                optionChange={handleAreaDownload}
                                keyValue={"name"}
                                keyId={"id"}
                                id={"popper-chart-menu"}
                                onclose={(e) => { setOpen(null) }}
                                anchorEl={open}
                                width="150px"
                            />
                        </div>
                        
                       
                    </div>
                )
            )
        ) : (
            <div style={{ textAlign: "center" }}>
                <Typography value={t("No Data")} variant="4xl-body-01" style={{ color: '#0F6FFF' }} />
                <Typography value={t("EditORReload")} variant="heading-02-sm" />
            </div>
        )}
    </>
);

}
export default LineCharts;