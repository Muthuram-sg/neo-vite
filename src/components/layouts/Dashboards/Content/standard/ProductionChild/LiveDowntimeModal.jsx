import React,{useState,forwardRef,useEffect, useRef} from 'react';
import ModalNDL from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import Button from "components/Core/ButtonNDL" 
import moment from 'moment';
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import { useTranslation } from 'react-i18next'; 

function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

const LiveDowntimeModalDialog = forwardRef((props,ref)=>{
    const {t} = useTranslation(); 
    const [OpenDialog, setOpenDialog] = useState(false)  
    const [LiveTime,setLiveTime]= useState("00:00:00:00")   
    const [Timer,setTimer] = useState(null)
    
    useEffect(()=>{
        // getReasonTagsbyLine(props.headplantid)  
            setOpenDialog(props.openModal)   
            console.log(props.openModal,"resultArrayresultArray")
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.openModal])

    useEffect(()=>{
        if(OpenDialog){
            setTimer(200)
            if(props.data){
                secondsToHHMMSS(props.data)
            }
        }
    },[OpenDialog,props.data]) 
   
    const handleDialogClose = () => { 
        setOpenDialog(false); 
        // props.dialogclose(false)   
        setTimer(null)  
    }

    function secondsToHHMMSS(data,live) {
        let diffsec = moment(live ? new Date():data.next).diff(moment(data.time), 'seconds')
        let days = moment(live ? new Date():data.next).diff(moment(data.time), 'days')
        // console.log(diffsec,"diffsecdiffsec",data)
        let hours = Math.floor(diffsec / 3600);
        let minutes = Math.floor((diffsec % 3600) / 60);
        let seconds = diffsec % 60;

        // Add leading zeros if needed
        hours = String(hours).padStart(2, '0');
        minutes = String(minutes).padStart(2, '0');
        seconds = String(seconds).padStart(2, '0');
        setLiveTime('0'+ days + ':'+ hours + ':' + minutes + ':' + seconds)
        
    }

    useInterval(() => {
        // Your custom logic here  
        secondsToHHMMSS(props.data,"live")
    }, Timer);

    return (
        <ModalNDL onClose={handleDialogClose} maxWidth={"xs"} open={OpenDialog}>
            <ModalHeaderNDL>
               <TypographyNDL  variant={'heading-02-xs'} value={"New Downtime"} />
            </ModalHeaderNDL>
            <ModalContentNDL >
                
                <div className='flex items-center justify-center mb-2' > 
                    <TypographyNDL variant="display-lg" mono
                        value={LiveTime}
                    />  
                </div> 
                <div className=' mb-4' style={{display:'flex',justifyContent:'center',columnGap:'40px'}}>
                    <TypographyNDL variant="label-01-s" color="secondary" value="Days" />
                    <TypographyNDL variant="label-01-s" color="secondary" value="Hrs" />
                    <TypographyNDL variant="label-01-s" color="secondary" value="Mins" />
                    <TypographyNDL variant="label-01-s" color="secondary" value="Secs" />
                </div>  
                <div className='flex gap-2 justify-center items-center  mb-2'>
                <TypographyNDL variant="paragraph-xs"
                    value={"Last Active on"}
                /> <TypographyNDL variant="paragraph-xs" mono value={moment(props.data.time).format("DD/MM/YYYY HH:mm:ss")} />
                </div>
                
                
            </ModalContentNDL> 
            <ModalFooterNDL>
                <Button type="secondary" value={t('Dismiss')} onClick={handleDialogClose} />
                {/* <Button  value={t("Classify")} onClick={ButtonClick} /> */}
            </ModalFooterNDL>
        </ModalNDL>
    );
})
 
export default LiveDowntimeModalDialog;
