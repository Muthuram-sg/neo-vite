import React,{useState,useEffect} from 'react';
import ParagraphText from 'components/Core/Typography/TypographyNDL'; 
import Grid from 'components/Core/GridNDL'
import Charts from 'components/Charts_new/Chart'
import { useTranslation } from 'react-i18next';
import ContentSwitcherNDL from "components/Core/ContentSwitcher/ContentSwitcherNDL";


const DownTimeView = (props) => {
    const [isActive,SetIsActive] = useState(true);
    const [contentSwitchIndex, setContentSwitchIndex] = useState(1);
    const { t } = useTranslation();
     
    useEffect(() => {
        SetIsActive(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [props]);
   
    const buttonList = [
        {id:"MTTR", value:"MTTR", disabled:false},
        {id:"Downtime", value:"Downtime", disabled:false},
      ]
    
      const contentSwitcherClick = (e) =>{
        setContentSwitchIndex(e)

          if (e === 0) {
            SetIsActive(false)
          }
          else if (e === 1) {
            SetIsActive(true)
          }

    }


    const renderDowntimeChart = () =>{
        if( props.overviewYval.length > 0){
            if(isActive){
                return(
                    <React.Fragment>      
                    <Charts
                    height={345}
                    id={"trendChart"} 
                    type={"areaChart"}
                    data={ props.overviewYval}
                    xaxisval={ props.overviewXval}
                    xaxistype={""}
                    annotations={null}
                    rotate={'-25'} 
                    />                                      
                    
                    </React.Fragment>
                )

            }else{
                return(
                    <React.Fragment>
                    <Charts
                   height={345}
                   id={"trendChart"} 
                   type={"bar"}
                   data={[{type: "line", data: [], color: '#66B0FF'},{type: 'column', data: props.mttfXVal, color: '#66B0FF'}]}
                   xaxisval={props.mttfYVal}
                   annotations={props.mttfAvgVal}
                   />                
                   
                   </React.Fragment>
                )
            }

        }else{
            return(
                <React.Fragment>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <div className='flex items-center justify-center'>
                <ParagraphText variant="heading-02-sm" value={"No Data"} />

                </div>
                </React.Fragment>
               
            )
        }
    }
    return (
        <React.Fragment>
        <div style={{display:'flex',justifyContent: 'space-between',alignItems: 'center'}}>
            <ParagraphText  value={t("Downtime Overview")} variant="heading-01-xs" color='secondary'/>
            
                <div style={{ display: "flex" }}>
                    <ContentSwitcherNDL listArray={buttonList} contentSwitcherClick={contentSwitcherClick} switchIndex={contentSwitchIndex} ></ContentSwitcherNDL>
                </div>
        </div>
    
    <Grid container spacing={2}>
   
        <Grid item xs={12} sm={12} style={{ textAlign: 'center' }}>
        
            
            {renderDowntimeChart()}
        </Grid>
    </Grid>
        </React.Fragment>
    );
}

export default DownTimeView;
