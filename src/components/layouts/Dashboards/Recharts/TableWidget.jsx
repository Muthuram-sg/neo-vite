import React,{useState,useEffect} from 'react';
import  useTheme from "TailwindTheme";
import Typography from 'components/Core/Typography/TypographyNDL';
import { useTranslation } from 'react-i18next'; 
import moment from 'moment';

function TableWidget(props){
    const theme = useTheme();
    const classes = {
        table:{
            borderCollapse: 'collapse',
            width: '100%',
            '& th':{
                borderCollapse: 'collapse',
                color: theme.colorPalette.primary,
                padding: 8
            },
            '& td':{
                borderCollapse: 'collapse',
                textAlign: 'center',
                color: theme.colorPalette.primary,
                padding: 8
            }
        }
    }
    const [formatted,setFormatted] = useState([]);
    const { t } = useTranslation(); 
    let janOffset = moment({M:0, d:1}).utcOffset(); //checking for Daylight offset
    let julOffset = moment({M:6, d:1}).utcOffset(); //checking for Daylight offset
    let stdOffset = Math.min(janOffset, julOffset);// Then we can make a Moment object with the current time at that fixed offset 
    useEffect(()=>{
        let formatData = []; 
        let result = [];
        let grouped = {};   
        if(props.dictdata && props.dictdata.length>0) {
            // eslint-disable-next-line array-callback-return
            // console.log(props.dictdata,"props.dictdata")
            props.dictdata.filter(x=>x.value !== null).forEach(item => {
              const { time, instrument, key, value } = item;
              if (!grouped[time]) {
                grouped[time] = { time };
              }
              const label = `${instrument}(${key})`;
            grouped[time][label] = value.toFixed(2);
               // rounded to 2 decimals
            });
            
            for (const key in grouped) {
              result.push(grouped[key]);
            }
            
        }   
        // console.log(result,"props.dictdata")     
        setFormatted(result);
    },[props]) 

    return(
        <React.Fragment>
            {
                formatted && formatted.length > 0 ? (
                    <div className='overflow-x-auto'  style={{width: props.width,height: (props.height),overflow: 'auto'}}>
                    <table style={classes.table}>
                        { 
                            <React.Fragment>
                                <thead>
                                    <th className='text-[16px] leading-[18px] text-Text-text-primary dark:text-Text-text-primary-dark ' style={{textAlign:'left'}}>Time</th>
                                    {
                                        // eslint-disable-next-line array-callback-return
                                        Object.keys(formatted[0]).map((x)=>{
                                            if(x !== 'time'){
                                                return(
                                                        <th key={x} className='text-[16px] leading-[18px] text-Text-text-primary dark:text-Text-text-primary-dark ' style={{textAlign:'left'}}>{x}</th>                                     
                                                )
                                            }               
                                        }) 
                                    } 
                                </thead>
                                <tbody>
                                    {
                                        formatted.map(x=>{
                                            return(
                                                <tr>
                                                    <td key={x.time} className='font-geist-mono text-Text-text-secondary dark:text-Text-text-secondary-dark'>{moment(x.time).utcOffset(stdOffset).format('YYYY-MM-DD HH:mm')}</td>
                                                    {
                                                    
                                                        Object.keys(formatted[0]).map((y,ind)=>{ 
                                                            if(y !== 'time'){                                                                    
                                                                return(
                                                                    <td key={x[y]}  className='font-geist-mono text-Text-text-secondary dark:text-Text-text-secondary-dark'>
                                                                        {x[y]}                                
                                                                    </td>
                                                                )
                                                            }
                                                        })  
                                                    }

                                                </tr>
                                            )
                                        })
                                        
                                    } 
                                </tbody>
                            </React.Fragment> 
                        }                        
                    </table>
                    </div>
                ):(
          
                        <div style={{ textAlign: "center" }}> 
                        <Typography value={t("No Data")} variant="4xl-body-01" style={{color:'#0F6FFF'}} />
                        
                        
                        <Typography value= {t("EditORReload")} variant="heading-02-sm"/>
                           
                        </div>
                  
                )
            }
        </React.Fragment>
        
    )
}
export default TableWidget