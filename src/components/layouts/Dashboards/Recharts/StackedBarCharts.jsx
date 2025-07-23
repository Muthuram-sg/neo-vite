import React, { useState,useEffect,useCallback } from 'react';
import { BarChart, Bar,XAxis,YAxis,CartesianGrid,Tooltip,Legend,LabelList } from 'recharts';
import moment from 'moment'; 
import ListNDL from 'components/Core/DropdownList/ListNDL.jsx';
import Typography from 'components/Core/Typography/TypographyNDL';
import { useTranslation } from 'react-i18next';
import configParam from 'config';
import { useRecoilState } from 'recoil';
import { dashBtnGrp,metricsList, dashboardHideGap } from 'recoilStore/atoms';
import { useCurrentPng } from "recharts-to-png";
import FileSaver from "file-saver"; 
import MenuList from 'assets/neo_icons/Dashboard/MenuList.svg?react'; 
import  useTheme from "TailwindTheme";

const StackedBarCharts =({data,width,height,meta})=>{ 
   
    const mainTheme = useTheme();
    const [btGroupValue] = useRecoilState(dashBtnGrp);
    const [hideGap] = useRecoilState(dashboardHideGap);
    const [metrics] = useRecoilState(metricsList);
    const [uniquedata,setuniquedata] = useState([]);
    const [uniquelegend,setuniquelegend] = useState([]);
    const [FinalData,setFinalData] = useState([]);
    const [uniColor,setuniColor] = useState([])
    const [open,setOpen] = useState(null);
    const { t } = useTranslation();
    const [,setconsumption] = useState([])

    const [getStackedPng, { ref: barRef }] = useCurrentPng();
    let janOffset = moment({M:0, d:1}).utcOffset(); //checking for Daylight offset
    let julOffset = moment({M:6, d:1}).utcOffset(); //checking for Daylight offset
    let stdOffset = Math.min(janOffset, julOffset);// Then we can make a Moment object with the current time at that fixed offset 

    function generateRandomColor(){
        let maxVal = 0xFFFFFF; // 16777215
        let randomNumber = Math.random() * maxVal; 
        randomNumber = Math.floor(randomNumber);
        randomNumber = randomNumber.toString(16);
        let randColor = randomNumber.padStart(6, 0);   
        return `#${randColor.toUpperCase()}`
    }
  
  
    let COLORS = [
  "#EF5F00",
"#208368",
"#74DAF8",
"#654DC4",
"#5151CD",
"#0588F0",
"#DC3E42",
"#FFBA18",
"#46A758",
"#FFDC00",
"#CF3897",
"#3358D4",
"#0797B9",
"#A144AF",
"#8347B9",
"#DD4425",
"#B0E64C",
"#DF3478",
]
    
    useEffect(()=>{
        let result = [] 
        let keysArr = []; 
let isKWH = []

        const formatted = data.map(x=>{
            x.time = new Date(x.time).getTime();
            return x
        })
      
        if(!hideGap){ 
             
            formatted.forEach(x=>{
                const instrument =x.instrument 
                const keyvalue = x.key;
                const key = meta.formulaName ? meta.formulaName : instrument+'-'+displayKey(keyvalue);
              
                const time = x.time; 
                const value = x.value ? (!isNaN(meta.decimalPoint) ? Number(x.value).toFixed(Number(meta.decimalPoint)) : x.value) : null;
                if(value){
                    let obj = {};        
                    obj[key] = value; 
            isKWH.push(value)

                    keysArr.push({key: key,show: true});
                    const index = result.findIndex(y=>y.time === time);
                    if(index >= 0){
                        let exist = {...result[index]};
                        exist = {...exist,...obj};
                        result[index] = exist;
                    }else{
                        obj['time'] = time;
                        result.push(obj);
                    }
                   // console.log(keysArr,"keysArrr")
                }
            })
        }else{
            formatted.forEach(x=>{
                const instrument =x.instrument 
                const keyvalue = x.key;
                const key = meta.formulaName ? meta.formulaName : instrument+'-'+displayKey(keyvalue);
                const time = x.time; 
                const value = x.value ? (!isNaN(meta.decimalPoint) ? Number(x.value).toFixed(Number(meta.decimalPoint)) : x.value) : null;
                let obj = {};        
                obj[key] = value;
            isKWH.push(value)

                keysArr.push({key: key,show: true});
                const index = result.findIndex(y=>y.time === time);
                if(index >= 0){
                    let exist = {...result[index]};
                    exist = {...exist,...obj};
                    result[index] = exist;
                }else{
                    obj['time'] = time;
                    result.push(obj);
                }
            })
        }

   
        
        
        const uniqueKeys = [...new Set(keysArr.map(a => JSON.stringify(a)))].map(a => JSON.parse(a)); 
        if (meta.tooltipSort === 'asc') {
            uniqueKeys.sort((a, b) => a.key.localeCompare(b.key));
        } else if (meta.tooltipSort === 'desc') {
            uniqueKeys.sort((a, b) => b.key.localeCompare(a.key));
        }
      
        setFinalData(result) 
        setuniquedata(uniqueKeys)
      
        let generateColor=COLORS
            uniqueKeys.forEach((x,i)=>{
                if( i+1 > COLORS.length){
                    generateColor.push(generateRandomColor())
                }
        })
            setuniColor(generateColor)
setconsumption(isKWH)
       
        setuniquelegend(uniqueKeys)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[data,hideGap])
    
    const togglePopper = (e) =>{
        setOpen(e.currentTarget);
    }
    const displayKey = (key) =>{        
        const metricArr = metrics && metrics.length >0? metrics.filter(y=>key.trim()===y.name):[]; 
        return  metricArr.length>0?metricArr[0].title:key;
    }

    function renderCusomizedLegend({payload}){
     
       
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
                    payload.sort((b, a) => sortByDataKey(b, a));
                }
        return (
            <div className="customized-legend" style={{overflow: 'auto',height: '100%',textAlign: 'left',marginLeft:isGreater ? undefined : "40px"}}>
               
              {payload.map(entry => {
                const { dataKey, color,active } = entry;
               
                const style = {
                  marginRight: 10,
                  color: !active ? "#AAA" : "#000"
                };
      
                return (
                  <span
                  key={dataKey}
                    className="legend-item"
                    onClick={() => filterLegend(dataKey)}
                    style={style}
                  >
                          
                          <svg width={6} height={6}  xmlns="http://www.w3.org/2000/svg">
            <circle cx="3" cy="3" r="3" fill={color} />
          </svg>
        
                      {!active && (
                       <svg width={4} height={4}  xmlns="http://www.w3.org/2000/svg">
                       <circle cx="2" cy="2" r="2" fill={"#FFF"} />
                     </svg>
                   
                     
                      )}
                  
                     <span className={'text-Text-text-primary dark:text-Text-text-primary-dark'} style={{paddingLeft: 5,fontSize:'12px'}}>{dataKey}</span>
                  </span>
                );
              })}
            </div>
          ); 
    }

    const handleAreaDownload = useCallback(async () => {
        const png = await getStackedPng();
        if (png) {
          FileSaver.saveAs(png, "StackedBar-chart.png");
        }
      }, [getStackedPng]);

    function filterLegend(g){
        if(uniquedata.find(x=>x.key === g)){
            const cloned = [...uniquedata];
            const index = cloned.findIndex(a=>a.key === g);
            cloned[index].show = !cloned[index].show;
            setuniquedata(cloned)
        }
         
    }
    const menuOption = [{id:"1", name:"Download PNG"}]
    const allowDecimals =meta.isDecimal?meta.isDecimal:undefined
   const YaxisDomain = meta.isCustomYaxis && meta.yaxisFromRef && meta.yaxisToRef?[Number(meta.yaxisFromRef),Number(meta.yaxisToRef)]:undefined
   const isGreater = true
 
   const tickFormaterYaxis =(decimalValue)=>{
    if(meta.isDecimal){
  return parseFloat(decimalValue).toFixed(2)
    }else{
        return decimalValue
    }
   }

   const chartWidth = meta.isDecimal?90:60


    return( 
        
        FinalData.length>0?( 
           <div className='flex'>
               
                
            <BarChart width={isGreater ? width :width + 75} style={{marginLeft:isGreater ? undefined : "-44px"}}  height={height-15} data={FinalData} ref={barRef} margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 10
                }}>
                <CartesianGrid vertical={false}  strokeDasharray="8 0" stroke="#E8E8E8" /> 
                    {
                        uniquedata.map((x, i) => {
                            const renderBar = () => {
                                return x.show ? <Bar type="monotone" dataKey={x.key} stackId="a" fill={uniColor[i]} label={meta.isLabel ? {  position: 'top' } : ""}
                                isAnimationActive={false} >
                                    
                                    {/* {meta.isLabel && (
                                            <LabelList
                                                dataKey={x.key}
                                                position="center"
                                            />
                                        )} */}
                                        </Bar> : null;
                                    };

                            return renderBar();
                        })
                    }
              
                <Tooltip 
                labelStyle={{ fontWeight: 'bold' }}  
                cursor={{fill:'transparent'}}
                labelFormatter={function(value) {
                return `${moment(value).utcOffset(stdOffset).format('DD-MM-YYYY HH:mm')}`;
                }}/>
                <Legend
                verticalAlign="bottom"
                height={36}
                align="center"
                payload={uniquelegend.map((pair,i) => ({
                    dataKey: pair.key,
                    color: uniColor[i],
                    active: pair.show
                  }))}
                content={renderCusomizedLegend}
                />
                {/* <Legend /> */}
                <XAxis  tickLine={false} axisLine={false} dataKey="time"    
                    tickFormatter={(unixTime) =>configParam.FORMAT_TIME(btGroupValue, unixTime)}
                />
                <YAxis  allowDecimals={allowDecimals} 
                allowDataOverflow
                domain={YaxisDomain} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(val)=>tickFormaterYaxis(val)}                
                width={chartWidth}
                />
            </BarChart>  
            <div style={{ width: '30px'}}>
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
        ):(
            <div style={{ textAlign: "center"}}>
                <Typography value={t("No Data")} variant="4xl-body-01" style={{color:'#0F6FFF'}} />
                <Typography value={t("EditORReload")} variant="heading-02-sm" />
                
            </div>
        )
    )
} 
export default StackedBarCharts;