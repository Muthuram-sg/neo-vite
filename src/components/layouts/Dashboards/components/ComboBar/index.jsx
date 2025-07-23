import React, { useState,useEffect } from 'react';
import { ComposedChart,
    Line, Area, CartesianGrid, Bar, XAxis, YAxis,Tooltip, Legend } from 'recharts'; 
import Typography from 'components/Core/Typography/TypographyNDL';
import { useTranslation } from 'react-i18next';
import configParam from 'config';
import { useRecoilState } from 'recoil';
import { dashBtnGrp,metricsList, dashboardHideGap } from 'recoilStore/atoms';
import moment from 'moment';
import { useCurrentPng } from "recharts-to-png";
import MenuList from 'assets/neo_icons/Dashboard/MenuList.svg?react';
import ListNDL from 'components/Core/DropdownList/ListNDL.jsx';
import  useTheme from "TailwindTheme";
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';


const CustomizedLabel = (props) => {
    const { x, y, stroke, value,meta } = props;

    return (
        <text x={x} y={y} dy={-4} fill={stroke} fontSize={12} textAnchor="middle">
            {(!isNaN(meta.decimalPoint) ? Number(value).toFixed(Number(meta.decimalPoint)) : value)}
        </text>
    );
};

const ComboCharts =({data,width,height,meta})=>{ 
    const mainTheme = useTheme();
    const { t } = useTranslation();
    const [btGroupValue] = useRecoilState(dashBtnGrp);
    const [hideGap] = useRecoilState(dashboardHideGap);
    const [metrics] = useRecoilState(metricsList);
    const [uniquedata,setuniquedata] = useState([]);
    const [uniquelegend,setuniquelegend] = useState([]);
    const [FinalData,setFinalData] = useState([]);
    const [,setuniColor] = useState([])
    const [open,setOpen] = useState(null);
    const [,setconsumption] = useState([])
    const [, { ref: areaRef }] = useCurrentPng();



    let janOffset = moment({M:0, d:1}).utcOffset(); //checking for Daylight offset
    let julOffset = moment({M:6, d:1}).utcOffset(); //checking for Daylight offset
    const stdOffset = Math.min(janOffset, julOffset);
    

    let COLORS = [
        "#DC3E42",
        "#DD4425",
        "#DC3B5D",
        "#654DC4",
        "#5151CD",
        "#46A758",
        "#EF5F00",
        "#FFBA18",
        "#FFDC00",
        "#B0E64C",
        "#DF3478",
        "#CF3897",
        "#3358D4",
        "#74DAF8",
        "#0588F0",
        "#0797B9",
        "#A144AF",
        "#8347B9",
        "#654DC4",
        "#5151CD",
        "#46A758",
        "#208368"]
    
        COLORS = COLORS.reverse()


     const downloadChart = async () => {
    if (areaRef.current === null) {
      return;
    }

    try {
        const png = await toPng(areaRef.current, {
        skipFonts: true,
      });
      saveAs(png, 'Combo_Bar.png');
      setOpen(null)
    } catch (error) {
      console.error('Error exporting chart:', error);
    }
  };

    function generateRandomColor(){
        let maxVal = 0xFFFFFF; // 16777215
        let randomNumber = Math.random() * maxVal; 
        randomNumber = Math.floor(randomNumber);
        randomNumber = randomNumber.toString(16);
        let randColor = randomNumber.padStart(6, 0);   
        return `#${randColor.toUpperCase()}`
    }

    function filterLegend(g){
        if(uniquedata.find(x=>x.key === g)){
            const cloned = [...uniquedata];
            const index = cloned.findIndex(a=>a.key === g);
            cloned[index].show = !cloned[index].show;
            setuniquedata(cloned)
        }
         
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
    <div className="customized-legend" style={{overflow: 'auto',height: '100%',textAlign: 'left'}}>
       
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


    const displayKey = (key) =>{        
        const metricArr = metrics && metrics.length >0? metrics.filter(y=>key.trim()===y.name):[]; 
        return  metricArr.length>0?metricArr[0].title:key;
    }

    

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
                        obj['name'] = time;
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
                    obj['name'] = time;
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
      
        const unikey = uniqueKeys.map((x, i) => { return {
            key: x.key,
            show: x.show,
            colour: COLORS[i]
        }})
        console.log(unikey)
        setFinalData(result) 
        setuniquedata(unikey)
        setconsumption(isKWH)
      
        let generateColor=COLORS
            uniqueKeys.forEach((x,i)=>{
                if( i+1 > COLORS.length){
                    generateColor.push(generateRandomColor())
                }
        })
            setuniColor(generateColor)
       
        setuniquelegend(unikey)
    },[data,hideGap])

    


    const isGreater = true
    
   
  
    const menuOption = [{ id: "1", name: "Download PNG" }] 


    const togglePopper = (e) =>{
        setOpen(e.currentTarget);
    }


    return( 
        (data.length > 0) ?
        <div ref={areaRef} className='flex'>

        <ComposedChart
        style={{marginLeft:isGreater ? undefined : "-10px"}} ref={areaRef} height={height} data={FinalData}  width={isGreater ? width :width + 75} 
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="name"  tickFormatter={(unixTime) =>configParam.FORMAT_TIME(btGroupValue, unixTime)}/>
          <YAxis domain={[0, 'auto']} allowDataOverflow/>
          <Tooltip 
                labelStyle={{ fontWeight: 'bold' }}  
                cursor={{fill:'transparent'}}
                labelFormatter={function(value) {
                return `${moment(value).utcOffset(stdOffset).format('DD-MM-YYYY HH:mm')}`;
                }}/>
          <Legend 
            verticalAlign="bottom"
            height={36}
            align="left"
            payload={uniquelegend.map((pair,i) => ({
                dataKey: pair.key,
                color: pair.colour,
                active: pair.show
              }))}
            content={renderCusomizedLegend}
          />
          {
            meta.chart1 === 'line' 
            ?
                meta.chart2 === 'area' 
                ?  <Area type="monotone" dataKey={uniquelegend?.[1]?.key} fill={uniquelegend?.[1]?.colour} stroke={uniquelegend?.[1]?.colour}  label={meta.isLabel ? <CustomizedLabel meta={meta}/> : ""}/>
                :  <Bar dataKey={uniquelegend?.[1]?.key} barSize={20} fill={uniquelegend?.[1]?.colour} label={meta.isLabel ? <CustomizedLabel meta={meta}/> : ""} />
            :   meta.chart1 === 'area'
                ? <Area type="monotone" dataKey={uniquelegend?.[0]?.key} fill={uniquelegend?.[0]?.colour} stroke={uniquelegend?.[0]?.colour}  label={meta.isLabel ? <CustomizedLabel meta={meta}/> : ""}/>
                :  <Bar dataKey={uniquelegend?.[0]?.key} barSize={20} fill={uniquelegend?.[0]?.colour}  label={meta.isLabel ? <CustomizedLabel meta={meta}/> : ""} />
          }
          <Line type="monotone" dataKey={meta.chart1 === 'line' ? uniquelegend?.[0]?.key : uniquelegend?.[1]?.key} stroke={meta.chart1 === 'line' ? uniquelegend?.[0]?.colour : uniquelegend?.[1]?.colour}  label={meta.isLabel ? <CustomizedLabel meta={meta}/> : ""}/>
          
          
        </ComposedChart> 
        {/* </ResponsiveContainer> */}
        <div style={{ width: '30px', marginLeft: 'auto' }}>
                            <div style={{ height: '25px' }}>
                                <div style={{ minWidth: 30, float: 'right' }} onClick={(e) => togglePopper(e)}>
                                    <MenuList stroke={mainTheme.colorPalette.primary} />
                                </div>
                            </div>
                            <ListNDL
                                options={menuOption}
                                Open={open}
                                optionChange={downloadChart}
                                keyValue={"name"}
                                keyId={"id"}
                                id={"popper-chart-menu"}
                                onclose={(e) => { setOpen(null) }}
                                anchorEl={open}
                                width="150px"
                            />
        {/* </ResponsiveContainer> */}
        </div>
        </div>
       
        // </div>
        :
            <div style={{ textAlign: "center"}}>
                <Typography value={t("No Data")} variant="4xl-body-01" style={{color:'#0F6FFF'}} />
                <Typography value={t("EditORReload")} variant= "Caption1" />
                    
                
            </div>
        
    )
} 
export default ComboCharts;