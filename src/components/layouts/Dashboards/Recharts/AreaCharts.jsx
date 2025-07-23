import React,{useState,useEffect,useCallback} from 'react';
import { AreaChart, Area,XAxis,YAxis,CartesianGrid,Tooltip,Legend,ResponsiveContainer,ReferenceLine } from 'recharts';
import moment from 'moment'; 
import ListNDL from 'components/Core/DropdownList/ListNDL.jsx';
import Typography from 'components/Core/Typography/TypographyNDL';
import  useTheme from "TailwindTheme";
import { useTranslation } from 'react-i18next'; 
import { useRecoilState } from 'recoil';
import { dashBtnGrp,dashboardHideGap,metricsList } from 'recoilStore/atoms';
import configParam from 'config';
import { useCurrentPng } from "recharts-to-png";
import FileSaver from "file-saver";
import MenuList from 'assets/neo_icons/Dashboard/MenuList.svg?react';  

const CustomizedLabel = (props) => {
    const { x, y, stroke, value } = props;
  
    return (
      <text x={x} y={y} dy={-4} fill={stroke} fontSize={12} textAnchor="middle">
        {value}
      </text>
    );
};
const AreaCharts =({data,width,height,meta,cwValues})=>{ 
   
    const mainTheme = useTheme();
    const [btGroupValue] = useRecoilState(dashBtnGrp); 
    const [hideGap] = useRecoilState(dashboardHideGap);
    const [metrics] = useRecoilState(metricsList);
    const [uniquedata,setuniquedata] = useState([]);
    const [uniquelegend,setuniquelegend] = useState([]);
    const [FinalData,setFinalData] = useState([]);
    const [open,setOpen] = useState(null);
    const { t } = useTranslation();
    const [,setconsumption] = useState([])
    const [getAreaPng, { ref: areaRef }] = useCurrentPng();
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
    
    let janOffset = moment({M:0, d:1}).utcOffset(); //checking for Daylight offset
    let julOffset = moment({M:6, d:1}).utcOffset(); //checking for Daylight offset
    let stdOffset = Math.min(janOffset, julOffset);// Then we can make a Moment object with the current time at that fixed offset 
    const [stats, setStats] = useState({
        min: null,
        max: null,
        average: null,
    });
    useEffect(()=>{
        let result = [] 
        let keysArr = [];
    let formatData = [];
    let isKWH = []
        // eslint-disable-next-line array-callback-return
        data.map(x=>{
            const keyVal = displayKey(x.key);
            const exist = formatData.findIndex(y=>y.time === x.time); 
            if(exist>=0){
                let obj2 = {...formatData[exist]}
                obj2[keyVal] = x.value?parseFloat(x.value).toFixed(2):"";
                formatData[exist] = obj2;
            }else{
                let obj1 ={}; 
                obj1['time'] = moment(x.time).utcOffset(stdOffset).format('YYYY-MM-DD HH:mm');
                obj1[keyVal] = x.value?parseFloat(x.value).toFixed(2):""; 
                formatData.push(obj1)
            } 
        })
    const formatted = data.map(x=>{
        x.time = new Date(x.time).getTime();
        return x
    })
    if(!hideGap){
        formatted.forEach(x=>{
            const key = meta.formulaName ? meta.formulaName : displayKey(x.key);
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
            }
        })        
    }else{
        formatted.forEach(x=>{
            const key = meta.formulaName ? meta.formulaName : displayKey(x.key);
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
    setconsumption(isKWH)
        setuniquedata(uniqueKeys)
        setuniquelegend(uniqueKeys)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[data,hideGap])

    useEffect(() => {
        if (meta.isDataStats) {
            const filteredData = FinalData.filter(entry => typeof entry === 'object' && entry !== null);
            const allProperties = filteredData.flatMap(entry => Object.keys(entry).filter(key => key !== 'time' && key !== 'LCL' && key !== 'LSL' && key !== 'USL' && key !== 'UCL' && key !== 'Normal'));
            const allValues = allProperties.flatMap(prop => filteredData.map(entry => entry[prop]))
        
           
            if (allValues.length > 0) {
                const min = Math.min(...allValues);
                const max = Math.max(...allValues);
                // Convert string elements to numbers
                const numbers = allValues.map(Number);
                const sum = numbers.reduce((acc, curr) => acc + curr, 0);
                const average = sum / numbers.length;
               
                const current = allValues[allValues.length - 1]
                console.log(min, max, average,current,"min, max, average,current")
                setStats({ min, max, average,current });
            } else {
                // If there are no valid values, set stats to null
                setStats({ min: null, max: null, average: null,current:null });
            }
        }
    }, [FinalData, meta.isDataStats]);

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
        const metricArr = metrics && metrics.length >0? metrics.filter(y=>key?.trim()===y.name):[]; 
        return  metricArr.length>0?metricArr[0].title:key;
    }
    const handleAreaDownload = useCallback(async () => {
        const png = await getAreaPng();
        if (png) {
          FileSaver.saveAs(png, "area-chart.png");
        }
      }, [getAreaPng]);

    const togglePopper = (e) =>{
        setOpen(e.currentTarget);
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
              {payload.map((entry) => {
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
    return( 
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
       { FinalData.length>0?(   
               <div className='flex'>
               <ResponsiveContainer width={isGreater ? width :width + 75} style={{marginLeft:isGreater ? undefined : "-44px"}} height={(meta.isDataStats && width >= 339) ? height-70 : height-15}>
        <AreaChart data={FinalData} ref={areaRef} margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 10
                }}>
            <CartesianGrid vertical={false}  strokeDasharray="8 0" stroke="#E8E8E8" /> 
            {renderReferenceLines()} 
            {
                uniquedata.map((x,i)=>{
                    return x.show && <Area type="monotone" dataKey={x.key} fill={COLORS[i]} isAnimationActive={false} label={meta.isLabel ? <CustomizedLabel />: ""}>
                       
                    </Area>
                })
            }  
            <Tooltip   
            labelStyle={{ fontWeight: 'bold' }}  
            labelFormatter={function(value) {
              return `${moment(value).utcOffset(stdOffset).format('DD-MM-YYYY HH:mm')}`;
            }}/>
            <Legend
            verticalAlign="bottom"
            height={36}
            align="center"
            payload={uniquelegend.map((pair,i) => ({
                dataKey: pair.key,
                color: COLORS[i],
                active: pair.show
                }))}
            content={renderCusomizedLegend}
            />
            {/* <Legend /> */}
            <XAxis  tickLine={false} axisLine={false} dataKey="time"               
                tickFormatter={(unixTime) =>configParam.FORMAT_TIME(btGroupValue, unixTime)} 
            />
            <YAxis 
                allowDecimals={allowDecimals} 
                allowDataOverflow
                domain={YaxisDomain} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(val)=>tickFormaterYaxis(val)}
                width={chartWidth}
            />
        </AreaChart>  
        </ResponsiveContainer>

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
            <div style={{ textAlign: "center" }}>
                <Typography value={t("No Data")} variant="4xl-body-01" style={{color:'#0F6FFF'}} />
                <Typography value={t("EditORReload")} variant="heading-02-sm" />
                    
                
            </div>
        )}
        </>
    )
} 
export default AreaCharts;