import React, { useState,useEffect } from 'react';
import { BarChart, CartesianGrid, Bar, XAxis, YAxis,Tooltip, Legend } from 'recharts'; 
import Typography from 'components/Core/Typography/TypographyNDL';
import { useTranslation } from 'react-i18next';
import configParam from 'config';
import { useRecoilState } from 'recoil';
import { useCurrentPng } from "recharts-to-png";
import  useTheme from "TailwindTheme";

import { dashBtnGrp,metricsList, dashboardHideGap } from 'recoilStore/atoms';
import moment from 'moment';
import MenuList from 'assets/neo_icons/Dashboard/MenuList.svg?react';
import ListNDL from 'components/Core/DropdownList/ListNDL.jsx';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';



const GroupedBarCharts =({data,width,height,meta})=>{ 
  const mainTheme = useTheme();

    const { t } = useTranslation();
    const [btGroupValue] = useRecoilState(dashBtnGrp);
    const [hideGap] = useRecoilState(dashboardHideGap);
    const [metrics] = useRecoilState(metricsList);
    const [uniquedata,setuniquedata] = useState([]);
    const [uniquelegend,setuniquelegend] = useState([]);
    const [FinalData,setFinalData] = useState([]);
    const [uniColor,setuniColor] = useState([])
    const [open,setOpen] = useState(null);
    const [,setconsumption] = useState([])


    let janOffset = moment({M:0, d:1}).utcOffset(); //checking for Daylight offset
    let  julOffset = moment({M:6, d:1}).utcOffset(); //checking for Daylight offset
    const stdOffset = Math.min(janOffset, julOffset);

    const [, { ref: areaRef }] = useCurrentPng();

    let COLORS = [
      '#107d98', '#e54666', '#60b3d7', '#ffba18', '#0090ff', '#00749e',
      '#dd93c2', '#ca244d', '#12a594', '#6550b9', '#b0e64c', '#71624b',
      '#402060', '#cc4e00', '#5c7c2f', '#3a5bc7', '#8e4ec6', '#74daf8',
      '#2b9a66', '#978365', '#c2298a', '#ef5f00', '#ab6400', '#9e6c00',
      '#ce2c31', '#dc3e42', '#ffdc00', '#008573', '#0d74ce', '#7de0cb'
    ]
    
    COLORS = COLORS.reverse()


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
            payload.sort((a, b) => sortByDataKey(b, a));
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

    const togglePopper = (e) =>{
        setOpen(e.currentTarget);
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
 
    },[data,hideGap])

    const findHighestValue = (data) => {
      let highestValue = -Infinity;
      data.forEach(item => {
        if (item.value > highestValue) {
          highestValue = item.value;
        }
      });
         
      return highestValue;
    };      
    
    const highestValue = findHighestValue(data);

    const DomainValues = meta.isCustomYaxis && meta.yaxisFromRef && meta.yaxisToRef?[Number(meta.yaxisFromRef),Number(meta.yaxisToRef)]:undefined
    const isGreater = true


  

  const menuOption = [{ id: "1", name: "Download PNG" }]

  const downloadChart = async () => {
    if (areaRef.current === null) {
      return;
    }

    try {
        const png = await toPng(areaRef.current, {
        skipFonts: true,
      });
      saveAs(png, 'Grouped_Bar.png');
      setOpen(null)
    } catch (error) {
      console.error('Error exporting chart:', error);
    }
  };
console.log(data,'datadata')
    return( 
        (data.length > 0) ?
 
        <div className='flex'>


            <BarChart style={{marginLeft:isGreater ? undefined : "-10px"}} ref={areaRef} height={height} data={FinalData}  width={isGreater ? width :width + 75} >
                <CartesianGrid strokeDasharray="3 3" />
                {
                        uniquedata.map((x, i) => {
                            const renderBar = () => {
                                return x.show && <Bar type="monotone" dataKey={x.key} fill={uniColor[i]} 
                                isAnimationActive={false} />
                                    
                                    };

                            return renderBar();
                        })
                    }
                <XAxis dataKey="name"  tickFormatter={(unixTime) =>configParam.FORMAT_TIME(btGroupValue, unixTime)}/>
                <YAxis allowDataOverflow interval="preserveStartEnd"  domain={DomainValues ? DomainValues : [0, highestValue]}/>
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
                    color: uniColor[i],
                    active: pair.show
                  }))}
                content={renderCusomizedLegend}
                />
             
            </BarChart>  

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
   
        </div>
         </div>
        :
            <div style={{ textAlign: "center"}}>
                <Typography value={t("No Data")} variant="4xl-body-01" style={{color:'#0F6FFF'}} />
                <Typography value={t("EditORReload")} variant= "Caption1" />
                    
                
            </div>
        
    )
} 
export default GroupedBarCharts;