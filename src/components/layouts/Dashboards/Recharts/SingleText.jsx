import React from 'react';
import { AreaChart, Area,XAxis,CartesianGrid,Tooltip } from 'recharts';
import moment from 'moment';
import Typography from 'components/Core/Typography/TypographyNDL';
import { useTranslation } from 'react-i18next'; 
import { metricsArry,themeMode } from 'recoilStore/atoms';
import { useRecoilState } from 'recoil';


const SingleText =({data,width,height,meta,keys,showChart,...props})=>{ 

    const [,setvalue]=React.useState('')
    const [string,setstring]=React.useState('')
    const [variant,setVariant]=React.useState()
  const [metricList] = useRecoilState(metricsArry); 
  const [CurTheme] = useRecoilState(themeMode)

// console.log(metricList,"metricList")
    let janOffset = moment({M:0, d:1}).utcOffset(); //checking for Daylight offset
    let julOffset = moment({M:6, d:1}).utcOffset(); //checking for Daylight offset
    let stdOffset = Math.min(janOffset, julOffset);// Then we can make a Moment object with the current time at that fixed offset 

    const { t } = useTranslation();  
    let COLORS = [
    "#402060",
    "#ca244d",
    "#ce2c31",
    "#c2298a",
    "#3a5bc7",
    "#6550b9",
    "#00749e",
    "#dc3e42",
    "#cc4e00",
    "#71624b",
    "#8e4ec6",
    "#0d74ce",
    "#008573",
    "#107d98",
    "#e54666",
    "#ab6400",
    "#9e6c00",
    "#5c7c2f",
    "#ef5f00",
    "#0090ff",
    "#2b9a66",
    "#12a594",
    "#978365",
    "#60b3d7",
    "#dd93c2",
    "#ffba18",
    "#74daf8",
    "#7de0cb",
    "#b0e64c",
    "#ffdc00"
]
    
    let result = [] 
    // eslint-disable-next-line no-redeclare
    let keyValue = []; 
    const formatted = data.map(x=>{
        x.time = new Date(x.time).getTime();
        return x
    })
    let datavalue = ''
   
    formatted.forEach(x=>{
        const time = x.time;
        const key = x.key;
        const values = x.value ? (!isNaN(meta.decimalPoint) ? Number(x.value).toFixed(Number(meta.decimalPoint)) : x.value) : "";
        let obj = {};        
        obj[key] = values; 
        keyValue.push(key);
        const index = result.findIndex(y=>y.time === time);
        if(index >= 0){
            let exist = {...result[index]};
            exist = {...exist,...obj};
            result[index] = exist;
            if(result.length > 2 ){
                result.splice(0,result.length-2);
            }
        }else{
            obj['time'] = time;
            result.push(obj)
            if(result.length > 2){
                result.splice(0,result.length-2);
            }
        }
    })    
    const uniqueKeys =[...new Set(keyValue)];

    const lastValue = result.length > 0 ? result.filter((x)=> x[uniqueKeys[0]] !== null):[];
    let fontExp = "32px"
    if(width< 150){
        fontExp = "16px"
    } 


//   console.log(lastValue,"lastValue")
    function checkNumberSign(number) {
        if (number > 0) {
          return true;
        } else if (number < 0) {
          return false;
        } else {
          return true;
        }
      }
      React.useEffect(()=>{
        const variantMapping = {
            "heading1": "bold",
            "heading2": "semiBold",
            "paragraph": "normal"
        };

        setVariant(variantMapping[meta.displayStyle] || "body2");
        if(meta.isText){
          let colorValue = datavalue.toString()
          if(colorValue === meta.text1 && result.length>0 ){
            props.cardColor(meta.SingleValueColor1)
          }else if(colorValue === meta.text2 && result.length>0 ){
            props.cardColor(meta.SingleValueColor2)
          }else if(colorValue === meta.text3  && result.length>0 ){
            props.cardColor(meta.SingleValueColor3)
          }
          else{
            props.cardColor("#FFFFFF")
          }
          if(props.existData.length === 0){
            props.cardColor("#FFFFFF")
        }
          setstring(colorValue)
        }else{
 
        if((lastValue.length > 0 && !meta.isText)){
            let colorValueElse = Number(lastValue[lastValue.length-1][uniqueKeys[0]]?lastValue[lastValue.length-1][uniqueKeys[0]]:0).toFixed(2)
            if(colorValueElse <= meta.arc1 && checkNumberSign(colorValueElse) ){
                props.cardColor(meta.SingleValueColor1)
            }
            else if((colorValueElse > meta.arc1) && (colorValueElse <= meta.arc2) && checkNumberSign(colorValueElse) ){
                props.cardColor(meta.SingleValueColor2)
            }
           else if((colorValueElse > meta.arc2) && (colorValueElse <= meta.arc3) && checkNumberSign(colorValueElse)){
                props.cardColor(meta.SingleValueColor3)
            }
            else{
            props.cardColor("#FFFFFF")
          }
            setvalue(colorValueElse);
        }
        if(props.existData.length === 0){
            props.cardColor("#FFFFFF")
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[data,meta,props.existData])

    let textVariant = showChart ? "h3": "xl-body"

    // console.log(meta.SingleValueColor,'meta.SingleValueColor')
    const renderColourDarkDefault=()=>{
        if(meta.SingleValueColor === "#000000" && CurTheme === "dark"){
            return "#FFFFFF"
        }else{
            return meta.SingleValueColor
        }
    }

    const renderTextValue = ()=>{
        let textValue = lastValue[lastValue.length-1][uniqueKeys[0]]?lastValue[lastValue.length-1][uniqueKeys[0]]:0
        let MetricName = metricList.find(x=>x.name === uniqueKeys[0])
        MetricName = MetricName && Object.keys(MetricName).length > 0 ? MetricName.metricUnitByMetricUnit.unit : ''
        if(meta.isText){
            return(
                <React.Fragment>
                <Typography  nofontfamily variant={((width<150) || (height<150)) ? "Body4" : textVariant} style={{ textAlign: meta.textAlign,fontSize: Number(meta.textSize),color:(string === meta.text3 ) ? "#ffffff" : (CurTheme === "dark" ? "#FFFFFF" :"#000000"),fontFamily:meta.fontVariant === '7segmentdisplay' ? 'Seven Segment' : '' ,fontWeight:variant}} > {datavalue} </Typography> 
               <br></br>
                <Typography nofontfamily style={{ textAlign: meta.textAlign,color:string=== meta.text3 ? "#ffffff" : (CurTheme === "dark" ? "#FFFFFF" :"#000000"),fontFamily:meta.fontVariant === '7segmentdisplay' ? 'Seven Segment' : ''  }}>{lastValue.length > 0 ? moment(lastValue[lastValue.length-1]['time']).utcOffset(stdOffset).format('HH:mm'):""}</Typography>
             </React.Fragment>
            )

        }else{
        //    console.log(textValue,"textValue")
            return(
                <React.Fragment>
                <Typography  nofontfamily style={{ textAlign: meta.textAlign,fontSize: Number(meta.textSize),color:meta.SingleValueColor ? renderColourDarkDefault(meta.SingleValueColor): (CurTheme === "dark" ? "#FFFFFF" :"#000000") ,fontFamily:meta.fontVariant === '7segmentdisplay' ? 'Seven Segment' : '',fontWeight:variant}} >{lastValue.length > 0?(!isNaN(meta.decimalPoint)?Number(textValue).toFixed(Number(meta.decimalPoint)) : Number(textValue)):"No Data"} <span>{result.length>0&&meta.unit?meta.unit:""}</span></Typography>
              {
                MetricName && 
                <React.Fragment>
                    <div className='mt-3' />
                <Typography nofontfamily style={{ textAlign: meta.textAlign,color:meta.SingleValueColor ? renderColourDarkDefault(meta.SingleValueColor): (CurTheme === "dark" ? "#FFFFFF" :"#000000"),fontFamily:meta.fontVariant === '7segmentdisplay' ? 'Seven Segment' : '' }}>{MetricName}</Typography>
                </React.Fragment>
               
              }
                                    <div className='mt-3' />

                <Typography nofontfamily style={{ textAlign: meta.textAlign,color:meta.SingleValueColor ? renderColourDarkDefault(meta.SingleValueColor): (CurTheme === "dark" ? "#FFFFFF" :"#000000"),fontFamily:meta.fontVariant === '7segmentdisplay' ? 'Seven Segment' : '' }}>{lastValue.length > 0 ? moment(lastValue[lastValue.length-1]['time']).utcOffset(stdOffset).format('HH:mm'):""}</Typography>
                </React.Fragment> 
            )
        }
    }

    let isShowChart = showChart ? 'block':'flex'
    // console.log(height,"height")
    return( 
        result.length>0?(   
        <div style={{display:isShowChart,justifyContent:'center',alignItems:'center',height: '100%',padding:"16px"}}>
            <div style={{width:'100%'}}>
            {renderTextValue()}
            </div>
            {
                showChart && !meta.isText && (                    
                    <AreaChart width={width} height={height-50} data={result}>
                        <CartesianGrid vertical={false}  strokeDasharray="8 0" stroke="#E8E8E8" />  
                        {
                            uniqueKeys.map((x,i)=>{
                                return <Area type="monotone" key={x} dataKey={x} fill={COLORS[i]}/>       
                            })
                        }  
                        <Tooltip 
                        labelStyle={{ fontWeight: 'bold' }}  
                        labelFormatter={function(fvalue) {
                        return `${moment(fvalue).utcOffset(stdOffset).format('DD-MM-YYYY HH:mm')}`;
                        }}/> 
                        <XAxis tick={false} tickLine={false} axisLine={false} dataKey="time" />
                    </AreaChart>  
                )
            }
        </div>
        ):(
         
//             <div   style={{
//     overflowY: result.length > 0 ? 'auto' : 'hidden',
//     // overflowY: height === 80 ? 'auto' : 'hidden',
//     overflowY: 'hidden',
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center', 
//     alignItems: 'center',     
//     textAlign: 'center',
   
//   }}>
<div
  style={{
    display: width > 150 ? 'flex' : 'block', 
     flexDirection: 'column',
     overflowY: result.length > 0 ? 'auto' : 'hidden',    
    justifyContent: 'center',                     
    alignItems: 'center',                   
    textAlign: 'center',
    height: '100%',                           
    width: '100%',
  }}
>
                <Typography
    style={{
      color: '#0F6FFF',
      fontSize: width < 150 ? '16px' : '32px',     
      paddingBottom: '16px',
    }}
  >
    {t("No Data")}
  </Typography>
                <Typography variant="heading-02-sm" style={{ textAlign: "center" }}>
                    {t("EditORReload")}
                </Typography>
            </div>
        )
    )
} 
export default SingleText;