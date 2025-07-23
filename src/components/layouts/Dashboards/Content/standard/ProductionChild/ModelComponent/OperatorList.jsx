import React,{useEffect, useState,useRef} from 'react'
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import Typography from "components/Core/Typography/TypographyNDL";
import Grid from "components/Core/GridNDL";
import KpiCards from "components/Core/KPICards/KpiCardsNDL";
import OkCircle from 'assets/neo_icons/Dashboard/CheckCircle.svg?react'; 
import Button from "components/Core/ButtonNDL"
import Toast from "components/Core/Toast/ToastNDL";
import moment from 'moment';
import { useRecoilState } from "recoil";
import { themeMode } from "recoilStore/atoms"


const OperatorList = (props) => {
    const dateObj = new Date();
    const dateStr = dateObj.toISOString().split('T').shift();
    const [CurTheme] = useRecoilState(themeMode) 
    const [selectedUser, setselectedUser] = useState(null)
    const [snackMessage, SetMessage] = useState('');
    const [snackType, SetType] = useState('');
    const [snackOpen, setOpenSnack] = useState(false);
    
    const [WaitingT,setWaitingT]= useState(moment(dateStr +' 00:05:00')); 

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
    useInterval(() => {
        
        if(moment(WaitingT).format('mm:ss') !== "00:00"){
            setWaitingT(moment(WaitingT).subtract(1,'seconds'))
        }else{
            if(props.BeforeShift){
                props.handleShiftEndFalse(props.BeforeShift)
            }
            
        }
    }, 1000);

    useEffect(()=>{
        if(props.selectedOpt && props.selectedOpt.operator_id){
            setselectedUser(props.selectedOpt.operator_id)
        } 
    },[props.selectedOpt ])

    const handledialogClose = () => {
        props.handledialogClose()
    }
    const handleSelectedProduct = (userId) => {
        setselectedUser(userId)
    }

    const handleAddOperator=()=>{
      if(selectedUser){
        let existID = props.selectedOpt && props.selectedOpt.id ? props.selectedOpt.id : null
        props.handleOperatorData(selectedUser,existID)
      }else{
        setOpenSnack(true)
        SetMessage("Please select operator")
        SetType('warning')

      }
    }
    
    let remainderMsg = props.BeforeShift ? "Shift Ending Reminder" : "Operator Change Confirmation"

  return (
    <React.Fragment>
         <Toast type={snackType} message={snackMessage} toastBar={snackOpen}  handleSnackClose={() => setOpenSnack(false)} ></Toast>
      <ModalHeaderNDL>
        <Typography value={props.isShiftChange ? remainderMsg : "Sign In"} variant='heading-02-xs' style={{wordWrap: 'break-word' }} />
                    {/* <div id="reject-reaon-dialog-title" style={{ fontSize: 20, fontFamily: 'Inter', fontWeight: '600', wordWrap: 'break-word' }} >{ props.isShiftChange ? remainderMsg : "Sign In"}</div> */}
                </ModalHeaderNDL>
                <ModalContentNDL>
                    
                    {
                        props.isShiftChange ? 
                       <div>
                            {
                                props.BeforeShift ? 
                                <React.Fragment>
                                    <div className='flex gap-1'>
                                    <Typography value={"The ongoing shift will conclude in"} variant='paragraph-s' color='secondary' />
                                    <Typography value={WaitingT ? moment(WaitingT).format('mm:ss') : '0' + " minutes"} variant='paragraph-s' mono color='secondary' />
                                    </div>
                                    <br></br>
                                    <Typography value={`${"Please ensure the classification of the unclassified downtimes before the shift concludes, or you may choose to classify them at any time using the downtime report."}`} variant='paragraph-s' mono color='secondary' />
                                </React.Fragment>
                                :
                                <Typography value="Do you want to assign a new operator for the upcoming execution ?" variant='paragraph-s' color='secondary' />
                            }
                            
                            
                       </div> 

                        :
                        <div style={{ overflow: "overlay" }} className="h-[344px] p-2">
                        <Grid container spacing={4} >
                            <React.Fragment>
                                {
                                    props.UserforLine && props.UserforLine.length > 0 &&
                                    props.UserforLine.map(x => (

                                        <Grid key={x.userByUserId.sgid} sm={4}>

                                            <KpiCards key={x.userByUserId.sgid} onClick={() => handleSelectedProduct(x.userByUserId.id)} style={{ backgroundColor: selectedUser === x.userByUserId.id ?  (CurTheme === 'dark' ? "#313131" :"#E0E0E0") : undefined }}>
                                                {/* <TooltipNDL placement="bottom" title={x.userByUserId.name}> */}
                                                <div  className="flex items-center justify-between">
                                                <div  className="flex flex-col gap-0.5 justify-start">
                                                            <Typography variant='label-01-s' value={x.userByUserId.name} style={{
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                                width: "150px"
                                                                //curTheme === "light" ? "#242424" : "#A6A6A6"
                                                            }} />
                                                            <Typography variant='paragraph-xs' color='secondary' value={x.userByUserId.sgid} />
                                                        </div>
                                                        {
                                                            selectedUser === x.userByUserId.id ? <div className="ml-auto">
                                                            <OkCircle /> 
                                                            </div>
                                                            : <div></div>
                                                        }
                                                {/* </TooltipNDL> */}
                                              </div>
                                            </KpiCards>
                                        </Grid>
                                    ))

                                }
                            </React.Fragment>

                        </Grid>
                    </div>

                    }
                    
                    <br></br>
                    {!props.isShiftChange &&
                    <div className="flex gap-1">
                        <Typography variant='label-02-s' value={"Current Shift"} />
                        <Typography variant='lable-01-s' value={"Starts at" } />
                        <Typography variant='lable-01-s' mono value={props.startTime} />

                    </div>}

                </ModalContentNDL>
                {
                    props.isShiftChange ? 
                    <ModalFooterNDL>
                        {!props.BeforeShift &&
                        <Button type="secondary"  value={props.BeforeShift ? 'No' : 'Cancel'} onClick={props.handledialogCloseTriger} />}
                        <Button  value={props.BeforeShift ? 'Ok' : 'yes'} onClick={()=>{props.handleShiftEndFalse(props.BeforeShift)}} />
                    </ModalFooterNDL>
                :
                    <ModalFooterNDL>
                        <Button type="secondary"  value={'Cancel'} onClick={handledialogClose} />
                        <Button  disabled={selectedUser === (props.selectedOpt ? props.selectedOpt.operator_id : 0)} value={'Sign In'} onClick={handleAddOperator} />
                    </ModalFooterNDL>
                }
    </React.Fragment>
  )
}

export default OperatorList
