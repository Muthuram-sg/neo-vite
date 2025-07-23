import React, {useState, forwardRef, useEffect } from "react";
import ModalNDL from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import Button from "components/Core/ButtonNDL"
import RadioButtonNDL from "components/Core/RadioButton/RadioButtonNDL";
import Grid from "components/Core/GridNDL";
import KpiCards from "components/Core/KPICards/KpiCardsNDL";
import Typography from "components/Core/Typography/TypographyNDL";
import { useRecoilState } from "recoil";
import { themeMode, isSelectedIsProduct } from "recoilStore/atoms";
import OkCircle from 'assets/neo_icons/Dashboard/CheckCircle.svg?react';
import Toast from "components/Core/Toast/ToastNDL";
import moment from 'moment';
import useStopExecution from "../hooks/useStopExecution";
// import 


const WorkeOrderModels = forwardRef((props, ref) => {
    const [isProduct, setisProduct] = useState(false) 
    const [, setIsSelectedIsProduct] = useRecoilState(isSelectedIsProduct) 
        const [CurTheme] = useRecoilState(themeMode) 
    const [selectedWorkOrder, setselectedWorkOrder] = useState(null)
    const [selectedProduct, setselectedProduct] = useState(null)
    const [snackMessage, SetMessage] = useState('');
    const [snackType, SetType] = useState('');
    const [snackOpen, setOpenSnack] = useState(false);
    const [UniqWO,setUniqWO] = useState([]);
    const [ExecStop,setExecStop] = useState(false);
    const [StopExeID,setStopExeID] = useState('');
    const [StopConfirm,setStopConfirm] = useState(false);
    const [isloading,setisloading] = useState(false);
    const { StopExecutionLoading, StopExecutionData, StopExecutionError, getStopExecution } = useStopExecution() 
    

    useEffect(() => {
        if (!StopExecutionLoading && StopExecutionData && !StopExecutionError) { 
            if(StopExecutionData.affected_rows > 0 ){
                setExecStop(false)
                setStopConfirm(false) 
                setisloading(false)
                props.stopExec()
            } 
        } 
    }, [StopExecutionLoading, StopExecutionData, StopExecutionError])

    const handledialogClose = () => {
        setselectedWorkOrder(null)
        setselectedProduct(null)
        setExecStop(false)
        setStopConfirm(false)
        props.handleWorkDialogClose()
    }
    const handleFromtype = () => {
        setselectedWorkOrder(null)
        setselectedProduct(null)
        setisProduct(!isProduct)
        setIsSelectedIsProduct(!isProduct)
    }
    const handleWorkOrderSelect = (orderID) => { 
        console.log(orderID,"handleWorkOrderSelect")
        if(orderID.prod_execs.some(f=> !f.end_dt)){
            setExecStop(true)
            let ExecID = orderID.prod_execs.filter(e=> !e.end_dt)
            setStopExeID(ExecID[0].id) 
        }else{
            setExecStop(false)
        }
        setselectedWorkOrder(orderID.order_id)

    }
    const handleProductSelect = (prodID,data) => {
        // console.log(prodID,data,"handleProductSelect",data.prod_orders.filter(f=> !f.end_dt || moment().isBefore(f.end_dt)))
        if(data){
            let WOList = data.prod_orders.filter(f=> (!f.end_dt || moment().isBefore(f.end_dt)))
            // console.log(WOList.length,"WOList.length")
            if(WOList.length > 0){
                let ExecID = WOList[0].prod_execs.filter(e=> !e.end_dt)
                if(ExecID.length > 0){
                    setExecStop(true)
                    setStopExeID(ExecID[0].id)
                }else{
                    setExecStop(false)
                }
            }else{
                setExecStop(false)
            }
        }
        setselectedProduct(prodID)
    }
    useEffect(() => {
        if (props.dialogModeName && props.dialogModeName === 'product') {
            setisProduct(true)
            setIsSelectedIsProduct(true)
        } else {
            setisProduct(false)
            setIsSelectedIsProduct(false)
        }
        setisloading(false)
    }, [props.openWorkOrder])

    useEffect(()=>{
        if(props.workOrderLine && props.workOrderLine.length>0){
            const uniqueProd = props.workOrderLine.filter((obj, index) => { // Filter Unique metrics
                return index === props.workOrderLine.findIndex(o => obj.product_id === o.product_id );
            });
            // console.log(uniqueProd,"uniqueProd")
            let filWO = uniqueProd.map(v=>{
                let arr = props.workOrderLine.filter(f=> f.product_id === v.product_id) 
                let resentVal = arr.reduce((a, b) => { 
                    let prevCheck = !a.end_dt ? a : (new Date(a.end_dt) > new Date(b.end_dt) ? a : b)
                    return !b.end_dt ? b : prevCheck;
                  })
                  return resentVal
            })
            setUniqWO(filWO.filter(f=> moment().isAfter(f.start_dt)))
            // console.log(filWO,"uniqueProd")

        }
        
    },[props.workOrderLine])
 
    const handleProduct = ()=>{
        if(isProduct){
            if(selectedProduct){

                if(ExecStop){ 
                    if(StopConfirm){
                        // alert("Stopped EXE")
                        getStopExecution(StopExeID,moment().format('YYYY-MM-DDTHH:mm:ssZ'),3)
                    } 
                }else{
                    setisloading(true)
                    props.productTrigger(selectedProduct)
                } 
                setselectedProduct(null)
            }else{
                setisloading(false)
            setOpenSnack(true)
            SetMessage("Please select Product")
            SetType('warning')
    
            }
        }else{
                if(selectedWorkOrder && props.workOrderLine.length > 0){
                    let productArray = props.workOrderLine.filter(x=>x.order_id === selectedWorkOrder)[0].product_id   
                    // console.log(props.workOrderLine.filter(x=>x.order_id === selectedWorkOrder),"props.workOrderLine.filter(x=>x.id === selectedWorkOrder)")
                    if(productArray){
                        if(ExecStop){ 
                            if(StopConfirm){
                                // alert("Stopped EXE")
                                getStopExecution(StopExeID,moment().format('YYYY-MM-DDTHH:mm:ssZ'),3)
                                setisloading(true)
                            } 
                        }else{
                            setisloading(true)
                            props.productTrigger(productArray)
                        } 
                    } 
                    setselectedWorkOrder(null)
                }else{
                setOpenSnack(true)
                setisloading(false)
                SetMessage("Please select Product")
                SetType('warning')
        
                }
        }
      
    }
    return (
        <React.Fragment>
      <Toast type={snackType} message={snackMessage} toastBar={snackOpen}  handleSnackClose={() => setOpenSnack(false)} ></Toast>
              
            <ModalNDL onClose={props.handleWorkDialogClose} width={'800px'} open={props.openWorkOrder}>
                <ModalHeaderNDL>
                    <Typography value={StopConfirm ? "Confirmation": (ExecStop ? 'Stop':'Start'+" Execution")} variant='heading-02-xs' />
                    {/* <div id="reject-reaon-dialog-title" style={{ fontSize: 20, fontFamily: 'Inter', fontWeight: '600', wordWrap: 'break-word' }} >{StopConfirm ? "Confirmation": (ExecStop ? 'Stop':'Start'+" Execution")}</div> */}
                </ModalHeaderNDL>
                <ModalContentNDL>
                    {StopConfirm ?
                    <Typography value="Do you really want to Stop the execution? Confirming indicates your awareness and this action cannot be undone. Please review the execution carefully before proceeding." variant='paragraph-s' color='secondary' />
                    :
                    <React.Fragment>
                        <div className="flex items-center justify-around">
                            <RadioButtonNDL name={"From Product"} labelText={"From Product"} id={'fr_radio'} checked={isProduct} onChange={() => handleFromtype()} />
                            <RadioButtonNDL name={'From Work Order'} labelText={'From Work Order'} id={'fr_work'} checked={!isProduct} onChange={() => handleFromtype()} />
                        </div>
                        <br></br>
                        <div style={{ overflow: "overlay" }} className="h-[344px] p-2">
                            <Grid container spacing={4} >
                                {
                                    isProduct ?
                                        <React.Fragment>
                                            {
                                                props.productsList && props.productsList.length > 0 &&
                                                props.productsList.map(x => {
                                                    return <Grid key={x.id} sm={4} style={{ cursor: "pointer" }}>
                                                        <KpiCards key={x.id} onClick={() => handleProductSelect(x.id,x)} style={{ backgroundColor: selectedProduct === x.id ? (CurTheme === 'dark' ? "#313131" :"#E0E0E0") : undefined,height:"60px",padding:"8px 16px 8px 16px" }}>
                                                            <div  className="flex items-center justify-between">
                                                                <div  className="flex flex-col gap-0.5 justify-start">
                                                                    <Typography variant='label-01-s' style={{whiteSpace:"nowrap",overflow: 'hidden',textOverflow: 'ellipsis',width: '150px' }}  value={x.product_id} />
                                                                    <Typography variant='paragraph-xs' color="secondary" value={x.name} />
                                                                </div>
                                                                    <div className="ml-auto">
                                                                        { selectedProduct === x.id ?  
                                                                         <OkCircle />
                                                                         :
                                                                         <div width='16' height='16'>
                                                                         </div>
                                                                         }
                                                                    </div>
                                                            </div>
                                                        </KpiCards>
                                                    </Grid>
                                                })

                                            }
                                        </React.Fragment>
                                        :
                                        <React.Fragment>
                                            {
                                                UniqWO && UniqWO.length > 0 &&
                                                UniqWO.map(x => (
                                                    <Grid key={x.order_id} sm={4} style={{ cursor: "pointer" }}  >
                                                        <KpiCards key={x.order_id} onClick={() => handleWorkOrderSelect(x)} style={{ backgroundColor: selectedWorkOrder === x.order_id ?  (CurTheme === 'dark' ? "#313131" :"#E0E0E0") : undefined,height:"60px", }}>
                                                        <div  className="flex items-center justify-between">
                                                                <Typography variant='label-01-s' style={{whiteSpace:"nowrap",overflow: 'hidden',textOverflow: 'ellipsis',width: '150px' }} value={x.order_id} />
                                                                {
                                                                    selectedWorkOrder === x.order_id ?
                                                                <div className="ml-auto">
                                                                    <OkCircle /> 
                                                                    </div>
                                                                    :
                                                                     <div width='16' height='16'></div>
                                                                }
                                                            </div>
                                                            {/* <Typography  variant='lable-01-s' value='WO14847r98' /> */}
                                                        </KpiCards>
                                                    </Grid>
                                                ))

                                            }
                                        </React.Fragment>
                                }
                            </Grid>
                        </div>
                    </React.Fragment>
                    }

                </ModalContentNDL>
                <ModalFooterNDL>
                    <Button type="secondary"  value={'Cancel'} onClick={handledialogClose} />
                    {StopConfirm ? 
                    <Button  type="primary" danger value={'Stop'} onClick={()=> handleProduct()} loading={isloading}/>
                    :
                    <Button  value={ExecStop ? 'Stop':'Start'} onClick={()=> ExecStop ? setStopConfirm(true) : handleProduct()} loading={isloading}/>
                    }
                    
                </ModalFooterNDL>
            </ModalNDL>
        </React.Fragment>
    )
}
)
const isRender = (prev, next) => {
    return prev.openWorkOrder !== next.openWorkOrder ? false : true
}
const WorkeOrderModel = React.memo(WorkeOrderModels, isRender)
export default WorkeOrderModel;