import React, { useState, useEffect } from 'react';
import Card from "components/Core/KPICards/KpiCardsNDL";
import CircularProgress from 'components/Core/ProgressIndicators/ProgressIndicatorNDL'
import Typography from 'components/Core/Typography/TypographyNDL';  
import { useTranslation } from 'react-i18next';
import CustomizedProgressBars from "components/Core/ProgressBar/Progress";  
import moment from 'moment'; 

function DowntimeCardForLongRange(props) { 
    const { t } = useTranslation(); 
    const [downtimeReasons, setDowntimeReasons] = useState([]);
    const [totalDowntime, setTotalDowntime] = useState(0);

    useEffect(() => {
        setDowntimeReasons([])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.entity_id, props.startDate, props.endDate])

    useEffect(() => {
        let DowntimeReasonsGroup = []
        let totalDowntimes = 0

        if (props.assetRawStatus.raw && props.assetRawStatus.raw.length > 0) {
            // eslint-disable-next-line array-callback-return
            props.assetRawStatus.raw.map(x => {
                let specificDowntime = 0
                let reason_name = ""

                // it is used to filter unclassified alarms
                if(!('reason' in x) && (x.value !== "ACTIVE")){
                    // Unclassified downtime calculation
                    reason_name = "Un Classified"
                    specificDowntime = parseInt(moment.duration(moment(x.next).diff(moment(x.time))).asSeconds());
                }
                // it is used to filter classified alarms
                if(x.hasOwnProperty('reason') && (x.value !== "ACTIVE")){
                    // Classified downtime calculation
                    reason_name = x.reason_name
                    specificDowntime = parseInt(moment.duration(moment(x.next).diff(moment(x.time))).asSeconds());
                } 

                if (props.oeeConfigData.length > 0 && props.oeeConfigData[0].mic_stop_duration < specificDowntime) {
                    //Find index of specific object using findIndex method.    
                    const index = DowntimeReasonsGroup.findIndex(obj => obj.reason === reason_name)

                    if (index >= 0) {
                        //Update object's time property.
                        DowntimeReasonsGroup[index].time = DowntimeReasonsGroup[index].time + specificDowntime
                    } else {
                        DowntimeReasonsGroup.push({ reason: reason_name, time: specificDowntime })
                    }
                    totalDowntimes = totalDowntimes + specificDowntime
                }
            })

        }
        DowntimeReasonsGroup.sort((a, b) => b.time - a.time)
        setTotalDowntime(totalDowntimes)
        setDowntimeReasons(DowntimeReasonsGroup)
    }, [props.assetRawStatus])

    const renderDownTime =()=>{
        if(props.isLongRange){
            if(downtimeReasons && downtimeReasons.length > 0){
                return(
                    downtimeReasons.map((s) => {
                        return (
                            <div key={s.time} style={{ marginTop: "8px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography variant="label-02-s" value={s.reason}/>
                                    <Typography variant="label-02-s" value={(isNaN((s.time / totalDowntime) * 100) ? 0 : (s.time / totalDowntime) * 100).toFixed(2) + "%"}/>
                                </div>
                                <CustomizedProgressBars value={isNaN((s.time / totalDowntime) * 100) ? 0 : (s.time / totalDowntime) * 100} color={"#0F6FFF"} />
                            </div>
                        )
                    })
                )
            }else{
                return(
                    <Typography style={{ padding: 10, textAlign: "center" }} variant="label-02-s" value={t("nodtevent")}/>

                )

            }
        }else{
            return(
                <React.Fragment></React.Fragment>
            )
        }

    }

    return (
        <Card >
            <div >
                <div style={{display: "flex",gap: 40}}>
                    
                        <div style={{display:'flex',alignItems:'center'}}> 
                            <Typography color='secondary' variant="heading-01-xs" value={t("Downtime")}/>         
                            {props.loading && <div style={{  marginLeft: 10 }}><CircularProgress disableShrink size={15} color="primary" /></div>}
                        </div> 
                </div> 
                <div style={{  maxHeight: props.isDryer ? 662 : 310, height: props.isDryer ? 661 : 308, overflow: "auto", padding: 0 }}>
                    {renderDownTime()}
                </div>
            </div>
        </Card>
    )
}
export default DowntimeCardForLongRange;