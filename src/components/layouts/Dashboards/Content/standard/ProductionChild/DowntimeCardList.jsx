import React, { useState,useEffect }  from 'react'; 
import Grid from 'components/Core/GridNDL'
import ToolTip from "components/Core/ToolTips/TooltipNDL";
import { useRecoilState } from "recoil";
import { ProdBtnGrp,adddtreasondisbale,customdates } from "recoilStore/atoms";  
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import Button from "components/Core/ButtonNDL";
// Icons   
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import PeriodIcon from 'assets/neo_icons/Dashboard/Period_new.svg?react';
import EditIcon from 'assets/neo_icons/Dashboard/EditIconNew.svg?react';
import AlarmIcon from 'assets/neo_icons/Dashboard/AlarmIconNew.svg?react';

function DowntimeCardFunction(props){  
    const [btnGroup] = useRecoilState(ProdBtnGrp);
    const [alarmicondisable]  = useRecoilState(adddtreasondisbale)
    const [partsTime,setpartsTime] = useState(new Date(props.time).getTime()); 
    const [LiveTime,setLiveTime] = useState(props.next);
    const [IsLiveDown,setIsLiveDown] = useState(false); 
    const { t } = useTranslation();   
    const reason = props.reasonArray.filter(x => x.id === props.reason);
    let janOffset = moment({M:0, d:1}).utcOffset(); //checking for Daylight offset
    let julOffset = moment({M:6, d:1}).utcOffset(); //checking for Daylight offset
    let stdOffset = Math.min(janOffset, julOffset);// Then we can make a Moment object with the current time at that fixed offset
    

   
    useEffect(()=>{
        // console.log(props.workExecutionDetails,"props.Partloading",props.partsData,btnGroup)
        let ExeDt 
        if(props.workExecutionDetails && props.workExecutionDetails.length>0){
            let WOExe = [...props.workExecutionDetails]
            WOExe.sort((a, b) => new Date(b.jobStart) - new Date(a.jobStart));
            ExeDt = WOExe[0].ended_at
        }
        if(props.partsData && props.partsData.length > 0){ 
            setpartsTime(new Date(props.partsData[0].time).getTime())
            let active = props.partsData.filter(e=> moment(new Date(e.time)).isBetween(moment(props.time),moment(props.next)))
            let nexttime = active.length> 0 ? active[active.length-1].time : props.next
            
            if (!props.reason || props.reason === 0) {
                
                if (!props.isLong && (props.index === 0) && !ExeDt && (btnGroup === 19 || btnGroup === 11 || btnGroup === 6) && (new Date(nexttime).getTime() >= new Date(props.partsData[0].time).getTime())) {
                    // console.log("Liveeeeeeeeeeeeeee")
                    LivePop()
                }else{
                    if(props.index === 0){ 
                        props.LiveDowntime(false,props  )
                    }
                }
            } 
            // console.log(props.index,nexttime,"workExecutionDetailsLive",ExeDt,props.reason,props.partsData)
            if (!props.isLong && (props.index === 0) && !ExeDt && (btnGroup === 19 || btnGroup === 11 || btnGroup === 6) && (new Date(nexttime).getTime() >= new Date(props.partsData[0].time).getTime())) {
                // console.log("Liveeeeeeeeeeeeeee")
               
                setIsLiveDown(true)
                UpdateTime(nexttime,new Date(props.partsData[0].time).getTime())
            }else{
                if(props.index === 0){
                    setIsLiveDown(false)
                }
            }
        } else{
            if(!props.isLong && ((btnGroup === 19 || btnGroup === 11 || btnGroup === 6) && !ExeDt && !props.Partloading)){
                setIsLiveDown(true)
                UpdateTime(props.next,new Date(props.time).getTime())
                LivePop()
            }else{
                props.LiveDowntime(false,props  )
                setIsLiveDown(false)
            }
            
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.partsData,props.Partloading])

    function LivePop (){
        setTimeout(()=>{
            props.LiveDowntime(true,props)
        },500)
    }

    function UpdateTime(time,parttime){
        setTimeout(()=>{
            UpdateTime(time,parttime)
        },IsLiveDown ? 500 : null)
        if ((props.index === 0) && (btnGroup === 19 || btnGroup === 11 || btnGroup === 6) && (new Date(time).getTime() >= parttime)) { 
            setLiveTime(moment().format('YYYY-MM-DDTHH:mm:ssZ')) 
        }else{
            setLiveTime(moment(time).format('YYYY-MM-DDTHH:mm:ssZ'))
        }
        
    }
 
   
    const renderEditButton = (starttime) =>{
           return (
                <Button id={'mark-dtime' + props.reason} style={{color: props.isPlanned ? '#4fb284' : ''}} type='ghost' icon={EditIcon} disableElevation size="small"   onClick={()=>props.openReasonDialog({time: props.time,next:props.next,comment: props.comment,outageid: props.outageid,reason: reason,reason_tags:props.reason_tags })}
                />
            ) 
    } 

    const renderButtonContent = () => {
        let ExeDt 
            if(props.workExecutionDetails?.length>0){
                let WOExe = [...props.workExecutionDetails]
                WOExe.sort((a, b) => new Date(b.jobStart) - new Date(a.jobStart));
                ExeDt = WOExe[0].ended_at
            }
            // console.log(props.index,"props.index,",props.next,reason && reason.length > 0?reason[0].reason:"")
        if (!props.reason || props.reason === 0) {
            
            if ((props.index === 0) && !ExeDt && (btnGroup === 19 || btnGroup === 11 || btnGroup === 6) && (new Date(props.next).getTime() > partsTime)) { 
                return <TypographyNDL variant="label-02-m" style={{ fontWeight: 400 }} value={t("Live")} />;
            } else {
                return moment(moment().format('YYYY-MM-DD')).diff(moment(moment(props.time).format('YYYY-MM-DD')),'days') < 7 && ( 
                       
                        ((props.index === 0) && !ExeDt && (btnGroup === 19 || btnGroup === 11 || btnGroup === 6) && (new Date(props.next).getTime() > partsTime)) ?
                        <TypographyNDL variant="label-02-m" style={{ fontWeight: 400 }} value={t("Live")} />
                        :
                        <React.Fragment>
                            <ToolTip title={t('Mark Downtime')} placement="right" arrow>
                                <Button id={'mark-dtime' + props.reason} type={"ghost"} disableElevation size="small" onClick={() => alarmicondisable ? "" : props.openReasonDialog({ time: props.time, next: props.next })} icon={AlarmIcon} />
                            </ToolTip>
                        </React.Fragment>
                        
                    )
                     
            }
        } else {
            return moment(moment().format('YYYY-MM-DD')).diff(moment(moment(props.time).format('YYYY-MM-DD')),'days') < 7 && (
                <React.Fragment>
                    {!IsLiveDown ?
                        
                            renderEditButton(props.time)  
                    :
                    ((props.index === 0) &&!ExeDt && (btnGroup === 19 || btnGroup === 11 || btnGroup === 6) && (new Date(props.next).getTime() > partsTime)) ?
                        <TypographyNDL variant="label-02-m" style={{ fontWeight: 400 }} value={t("Live")} />
                        :
                        renderEditButton(props.time)  
                    }
                </React.Fragment>
            );
        }
    };

    function LiveTimefnc(){
        if(IsLiveDown){
            return LiveTime
        }else{
            return props.next
        }
    }

    
    function capitalizeWords(text) {
        if (!text) return ''; // Handle empty or undefined input
        return text
          .toLowerCase() // Convert entire text to lowercase
          .split(' ') // Split by spaces to handle multiple words
          .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
          .join(' '); // Join the words back into a single string
      }



    return (
        <div className='p-2 rounded mb-2.5 cursor-pointer hover:bg-Seconary_Button-secondary-button-hover dark:hover:bg-Secondary_Button-secondary-button-hover-dark pr-0 pl-0'>
        <Grid  container spacing={1} >
            <Grid item xs={10} >
                <div className='flex gap-1 items-center'>
                <div style={{display:"flex",alignItems:"center",gap:5}}> 
                    <PeriodIcon /> 
                </div>
                <div  className ='flex flex-col gap-1'>
                    <div className='flex items-center gap-0.5'  style={{whiteSpace:"nowrap",overflow: 'hidden',textOverflow: 'ellipsis',width: '100%' }}>
                    <TypographyNDL variant="label-01-m" mono  value={`${props.finalTimeDiff}`}
                />
                <TypographyNDL variant="label-01-m"  value={reason && reason.length > 0?"•" + reason[0].reason:""}
/>
                    </div>
                <div className='flex gap-2 items-center' >
                <TypographyNDL variant="paragraph-s" color= 'secondary' value={props.value && (props.value === '1' || props.value === '0' || !isNaN(props.value)) ? "Idle" :capitalizeWords(props.value)} />
                    <TypographyNDL variant="paragraph-s" color='secondary'  mono
                    value={moment(props.time).utcOffset(stdOffset).format('HH:mm:ss') + " - " + moment((props.index === 0) ? LiveTimefnc() : props.next).utcOffset(stdOffset).format('HH:mm:ss') }
                    />
                </div>
                </div>
                </div>
               
            </Grid>
           
            <Grid item xs={2}>
  <div className="flex justify-end items-start h-full">
    {renderButtonContent()}
  </div>
</Grid>
        </Grid>
        </div>
    );   
}
const isRender = (prev,next)=>{
    return prev.time !== next.time || prev.next !== next.next || prev.reason !== next.reason || prev.reason_tags.length !== next.reason_tags.length || prev.partsData !== next.partsData ? false : true;
}
const DowntimeCardList = React.memo(DowntimeCardFunction,isRender)
export default DowntimeCardList;