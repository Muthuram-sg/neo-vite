import React, { useEffect, useRef, useState } from "react";
import Typography from "components/Core/Typography/TypographyNDL";
import { useRecoilState } from "recoil";
import { executionData,themeMode, executionDetails, selectedPlant, user, userLine, snackMessage, snackType, snackToggle, customdates,ProductList,SelectedWOExe } from "recoilStore/atoms";
import moment from 'moment';
import KpiCards from "components/Core/KPICards/KpiCardsNDL"
import useGetTheme from 'TailwindTheme'; 
import { useTranslation } from 'react-i18next';
import WorkeOrderModel from "./ModelComponent/WorkOrderModel";
import OperatorModel from "./ModelComponent/OperatorModel";
import useInsertProdOperator from "./hooks/useInsertProdOperator";
import useUpdateProdOperator from "./hooks/useUpdateProdOperator";
import useGetCurrentOperator from "./hooks/useGetCurrentOperator";
import useGetWorkOrderAndExecution from "./hooks/useGetWorkOrderAndExecution";
import useGetWorkOrderWithStart from "./hooks/useGetWorkOrderWithStart";
import useGetExecutionOrderWithStart from "./hooks/useGetExecutionWithStart";
import useGetProductsList from 'Hooks/useGetProductsList'
import SelectorLocation from 'assets/neo_icons/Logos/selector_location.svg?react';


export default function MachineStatus(props) {
    const { t } = useTranslation();
    const theme = useGetTheme();
    const [UserforLine] = useRecoilState(userLine);
    const [CurTheme] = useRecoilState(themeMode) 
    const [selectDashval,setWorkExecutionDetails] = useRecoilState(executionDetails)
    const [customdatesval] = useRecoilState(customdates);

    const { InsertProdOperatorLoading, InsertProdOperatorData, InsertProdOperatorError, getInsertProdOperator } = useInsertProdOperator()
    const { UpdateProdOperatorLoading, UpdateProdOperatorData, UpdateProdOperatorError, getUpdateProdOperator } = useUpdateProdOperator()
    const { GetCurrentOperatorLoading, GetCurrentOperatorData, GetCurrentOperatorError, getGetCurrentOperator } = useGetCurrentOperator()
    const { WorkOrderAndExecutionLoading, WorkOrderAndExecutionData, WorkOrderAndExecutionError, getWorkOrderAndExecution } = useGetWorkOrderAndExecution()
    const { GetWorkOrderWithStartLoading, GetWorkOrderWithStartData, GetWorkOrderWithStartError, getWorkOrderWithStart } = useGetWorkOrderWithStart() //NOSONAR
    const { GetExecutionOrderWithStartLoading, GetExecutionOrderWithStartData, GetExecutionOrderWithStartError, getExecutionOrderWithStart } = useGetExecutionOrderWithStart() //NOSONAR
    const { ProductListLoading, ProductListData, ProductListError, getProductList } = useGetProductsList();  
    const renderBackGround = (status) => {

        if (status === 'ACTIVE') {
            return "#30a46e"
        } else if (status === 'IDLE') {
            return '#0074CB'
        } else {
            return '#FFFFFF'
        }

    }
    const classes = {
        cardTheme: {
            height: "100%",
            width: "100%",
            backgroundColor: theme.colorPalette.cards,
            paddingTop: 20,
            paddingBottom: 16,
            paddingRight: 16, 
            borderRadius: 4,

        },

        cardContentAlign: {
            display: "flex",
            alignItems:"center",
            justifyContent: "space-between",
            paddingTop: 8,
            paddingBottom: 8,

        },
        gridview: {
            display: "grid",
            padding: "8px",
            gap:'8px'
        },
        cardItems: {
            display: "grid",
            // borderRight: "1px solid  #E0E0E0",
            paddingRight: "16px",
            padding: "8px",
            gap:"8px"

        },
        borderCard: {
            display: "grid",
            backgroundColor: "#F4F4F4",
            paddingRight: "16px",
            cursor: "pointer",
            padding: "8px",
            borderRadius: "12px",
            gap:"8px"
            


        },
        tag: {
            height: 24,
            padding:8,
            borderRadius: 6,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 4,
            display: 'inline-flex', 
        },
        heading: {
            display: "flex",
            alignItems:'center',
            gap: "11px"

        },
        parentHeading: {
            display: "flex",
            justifyContent: "space-between"
        }



    }
    const [executionList] = useRecoilState(executionData);
    
    const [headPlant] = useRecoilState(selectedPlant);
    const [productsList,setProducts] = useRecoilState(ProductList)
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [curruser] = useRecoilState(user);  
    const [openWorkOrder, setopenWorkOrder] = useState(false)
    const [dialogModeName, setdialogModeName] = useState('')
    const [openOperatorOrder, setopenOperatorOrder] = useState(false)
    const [currentOperator, setCurrentOperator] = useState({})
    const [prevOperator, setprevOperator] = useState({})
    const [shiftEndingSoon, setshiftEndingSoon] = useState(false)
    const [WorkOrderExeCutionList, setWorkOrderExeCutionList] = useRecoilState(SelectedWOExe) 
    const [CurrentShiftTime,setCurrentShiftTime] = useState('')
    const [BeforeShift,setBeforeShift] = useState(false)
    
    const WorkOrderRef = useRef()
    const OperatorRef = useRef()

    let janOffset = moment({ M: 0, d: 1 }).utcOffset(); //checking for Daylight offset
    let julOffset = moment({ M: 6, d: 1 }).utcOffset(); //checking for Daylight offset
    let stdOffset = Math.min(janOffset, julOffset);// Then we can make a Moment object with the current time at that fixed offset
     
    useEffect(()=>{
        let shift = headPlant.shift.shifts
        // console.clear()
        const day = moment(props.startRange).format("YYYY-MM-DD")
        shift = shift.map(x => {
            let startDT = new Date(moment().format(day + "T" + x.startDate) + "Z")
            let endDT = new Date(moment().format(day + "T" + x.endDate) + "Z")
            if(moment(endDT).isBefore(moment(startDT))){
                return { ...x, startDate: moment(startDT).format("YYYY-MM-DDTHH:mm:ss"), endDate: moment(endDT).add(1,'day').format("YYYY-MM-DDTHH:mm:ss")}
            }else{
                return { ...x, startDate: moment(startDT).format("YYYY-MM-DDTHH:mm:ss"), endDate: moment(endDT).format("YYYY-MM-DDTHH:mm:ss")}
            }
        })
        let currShift = []
        shift.forEach(x => {
        
            const isBetween = moment().isBetween(moment(x.startDate), moment(x.endDate));
            if (isBetween) {
                currShift.push(x);
            }

        });
        if(currShift.length > 0){
            
            setCurrentShiftTime(currShift[0].startDate)
        }
    },[headPlant]) 

    useEffect(() => {
        if(selectDashval.length > 0){
            const firstProductName = selectDashval[0]?.productname;
            const allSameProductName = selectDashval.every(obj => obj?.productname === firstProductName);
      
            if (allSameProductName) {
                const orderIds = selectDashval[0]?.orderid
              
                setWorkOrderExeCutionList({ ...selectDashval[0],WOrder: orderIds, product: firstProductName });
            } else {
                setWorkOrderExeCutionList({ WOrder: "--", product: "--" });
            }
        }else{
            setWorkOrderExeCutionList({})
        }
    },[selectDashval]) 
     

    useEffect(() => {
        if (props.assertName && props.assertName.length > 0 && props.assertName[0].entity.id) {
            if (props.ProdGroupRange === 6 || props.ProdGroupRange === 11) {
              
                getGetCurrentOperator(props.assertName[0].entity.id, moment(customdatesval.StartDate).format('YYYY-MM-DDTHH:mm:ssZ'), moment().endOf('day').format('YYYY-MM-DDTHH:mm:ssZ'))
                getExecutionOrderWithStart(props.assertName[0].entity.id, moment(customdatesval.StartDate).format('YYYY-MM-DDTHH:mm:ssZ'),null,props.ProdGroupRange)
            } else {
            
                getGetCurrentOperator(props.assertName[0].entity.id, moment(customdatesval.StartDate).format('YYYY-MM-DDTHH:mm:ssZ'), moment(customdatesval.EndDate).format('YYYY-MM-DDTHH:mm:ssZ'))
                getExecutionOrderWithStart(props.assertName[0].entity.id, moment(customdatesval.StartDate).format('YYYY-MM-DDTHH:mm:ssZ'), moment(customdatesval.EndDate).format('YYYY-MM-DDTHH:mm:ssZ'),props.ProdGroupRange)

            }
            getWorkOrderWithStart(headPlant.id, moment(customdatesval.StartDate).format('YYYY-MM-DDTHH:mm:ssZ'),)
            
            // setshiftEndingSoon(false)

        }

    }, [customdatesval])

    useEffect(() => {
        getProductList()
    }, [])

    useEffect(() => {
        if (!ProductListLoading && ProductListData && !ProductListError) { 
            setProducts(ProductListData) 
        } 
    }, [ProductListLoading, ProductListData, ProductListError])

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
        handleCheckShiftEnd()
    }, 1000);

    useEffect(() => {
        if (!WorkOrderAndExecutionLoading && WorkOrderAndExecutionData && !WorkOrderAndExecutionError) {
            
            if(WorkOrderAndExecutionData.workOrder && WorkOrderAndExecutionData.workOrder.length > 0 && productsList.length > 0){
                
                let workOrder = WorkOrderAndExecutionData.workOrder.map(x=>{
                    return {WOrder:x.order_id ,product:productsList.filter(y=>y.id === x.product_id)[0].name,id:WorkOrderAndExecutionData.execution[0].id}
                })[0]
                if(WorkOrderAndExecutionData.msg !== 'Work Order and Execution already Exist,based on the selected Product or Workorder.'){
                    props.TriggerExec()
                    getProductList()
                }else{
                    setWorkExecutionDetails(executionList.filter(f=> f.id === workOrder.id))
                }
                
                setWorkOrderExeCutionList(workOrder)
            }else{
                setWorkOrderExeCutionList({})

            }
            
            
            setOpenSnack(true)
            SetMessage(WorkOrderAndExecutionData.msg)
            SetType("success")
            handleWorkDialogClose()

        }

    }, [WorkOrderAndExecutionLoading, WorkOrderAndExecutionData, WorkOrderAndExecutionError])
     

    useEffect(() => {
        if (!GetCurrentOperatorLoading && GetCurrentOperatorData && !GetCurrentOperatorError) {
         
            if (GetCurrentOperatorData.length > 0) {
                let shift = headPlant.shift.shifts
                const day = moment(props.startRange).format("YYYY-MM-DD")
                let currentOperatorData = []
                let PrevOperatorData = []
                let PrevOperatorname
                if (headPlant.shift.ShiftType === 'Daily') {
                    shift = shift.map(x => {
                        let startDT = new Date(moment().format(day + "T" + x.startDate) + "Z")
                        let endDT = new Date(moment().format(day + "T" + x.endDate) + "Z")
                        if(moment(endDT).isBefore(moment(startDT))){
                            return { ...x, startDate: moment(startDT).format("YYYY-MM-DDTHH:mm:ss"), endDate: moment(endDT).add(1,'day').format("YYYY-MM-DDTHH:mm:ss")}
                        }else{
                            return { ...x, startDate: moment(startDT).format("YYYY-MM-DDTHH:mm:ss"), endDate: moment(endDT).format("YYYY-MM-DDTHH:mm:ss")}
                        }
                        
                    }) 
                    
                    shift.forEach((s,idx) => {
                        const isBetween = moment().isBetween(moment(s.startDate), moment(s.endDate));
                        if (isBetween) {
                            let prevTime = moment()
                            if(idx > 0){
                                prevTime = moment(shift[idx-1].startDate).add(5,'minute')
                            }else{
                                prevTime = moment(shift[shift.length -1].startDate).add(5,'minute')
                            }
                            GetCurrentOperatorData.forEach(l => {
                                const PrevisBetween = moment(prevTime).isBetween(moment(l.start), moment(l.end));
                                if (PrevisBetween) {
                                    PrevOperatorData.push(l)
                                    if(l.operator_id){
                                        PrevOperatorname = UserforLine.find(x => x.user_id === l.operator_id).userByUserId.name
                                    }
                                }
                            })
                        }
                    })
                    GetCurrentOperatorData.forEach(l => {
                        const isBetween = moment().isBetween(moment(l.start), moment(l.end));
                        if (isBetween) {
                            currentOperatorData.push(l)
                        }
                    })

                    let Operatorname
                    if (currentOperatorData.length > 0) {
                        if (currentOperatorData[0].operator_id !== '') {
                            Operatorname = UserforLine.find(x => x.user_id === currentOperatorData[0].operator_id).userByUserId.name
                        }

                    }
                    setCurrentOperator(Operatorname ? { ...currentOperatorData[0], name: Operatorname } : currentOperatorData[0])
                    setprevOperator(PrevOperatorname ? { ...PrevOperatorData[0], name: PrevOperatorname } : PrevOperatorData[0])

                } else {
                    setCurrentOperator({})

                }



            } else {
                setCurrentOperator({})

            }

        }
    }, [GetCurrentOperatorLoading, GetCurrentOperatorData, GetCurrentOperatorError])

    useEffect(() => {
        if (!InsertProdOperatorLoading && InsertProdOperatorData && !InsertProdOperatorError) {
            setCurrentOperator({ ...InsertProdOperatorData[0], name: UserforLine.find(x => x.user_id === InsertProdOperatorData[0].operator_id).userByUserId.name })
            setprevOperator({ ...InsertProdOperatorData[0], name: UserforLine.find(x => x.user_id === InsertProdOperatorData[0].operator_id).userByUserId.name })
            handleOperatorDialogClose()
            setOpenSnack('true')
            SetType('success')
            SetMessage("Operator Added for the Current Shift")
            

        }

    }, [InsertProdOperatorLoading, InsertProdOperatorData, InsertProdOperatorError])

    useEffect(() => {
        if (!UpdateProdOperatorLoading && UpdateProdOperatorData && !UpdateProdOperatorError) {
            setCurrentOperator({ ...UpdateProdOperatorData[0], name: UserforLine.find(x => x.user_id === UpdateProdOperatorData[0].operator_id).userByUserId.name })
            setprevOperator({ ...UpdateProdOperatorData[0], name: UserforLine.find(x => x.user_id === UpdateProdOperatorData[0].operator_id).userByUserId.name })
            handleOperatorDialogClose()
            setOpenSnack('true')
            SetType('success')
            SetMessage("Operator Updated for the Current Shift")
            

        }

    }, [UpdateProdOperatorLoading, UpdateProdOperatorData, UpdateProdOperatorError])

    const handleCheckShiftEnd = () => {
        let End_date = currentOperator && currentOperator.end ? currentOperator.end : new Date()
        let prevEnd = prevOperator && prevOperator.end ? prevOperator.end : new Date()
         if (moment().format("YYYY-MM-DDTHH:mm:ss") === moment(End_date).subtract(5,'minute').format("YYYY-MM-DDTHH:mm:ss") && !shiftEndingSoon && !openOperatorOrder) {
             setshiftEndingSoon(true)
            setopenOperatorOrder(true)
            setBeforeShift(true)
        }
        if (moment().format("YYYY-MM-DDTHH:mm:ss") === moment(prevEnd).add(5,'minute').format("YYYY-MM-DDTHH:mm:ss") && !shiftEndingSoon && !openOperatorOrder) {
            setshiftEndingSoon(true)
            setopenOperatorOrder(true)
            setBeforeShift(false)
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

    function AssetStatus(type) { 
        
        if (props.assetStatusData && props.assetStatusData.data && props.assetStatusData.data.length > 0) {
            // alert("HEROS")
            let Runtime = props.assetStatusData.data.filter(f => f.name === type)
            let ActiveArr =[]
            if(Runtime.length>0 && Runtime[0].data.length > 0){
                ActiveArr = Runtime[0].data.map(x => {
                    return moment(x.y[1]).diff(moment(x.y?.[0]))
                })
            }
            let TimeF = moment.duration(ActiveArr.reduce((tot, i) => tot + i, 0))
            if(ActiveArr.length>0){
                return secondsToHHMMSS(props.OEEData.downtime)
            }else{
                return '00:00:00'
            }
        } else {
             if((type === 'ACTIVE') && (props.totalParts > 0)){
                let startDT = props.startRange
                let endDT = props.endRange
                if(props.workExecutionDetails.length>0){
                    startDT = props.workExecutionDetails[props.workExecutionDetails.length-1].jobStart
                    let Ended_at = props.workExecutionDetails[0].ended_at ? props.workExecutionDetails[0].jobEnd : new Date()
                    endDT = Ended_at
                }
                return secondsToHHMMSS(props.OEEData.runTime)
            }
            return '00:00:00'
        }
    }
    function secondsToHHMMSS(totalSeconds) {
        if( Number(totalSeconds) < 0){
            return "00:00:00"
        }else{
            let hours = Math.floor(totalSeconds / 3600);
            let minutes = Math.floor((totalSeconds % 3600) / 60);
            let seconds = totalSeconds % 60;
    
            // Add leading zeros if needed
            hours = String(hours).padStart(2, '0');
            minutes = String(minutes).padStart(2, '0');
            seconds = String(seconds).padStart(2, '0');
    
            return hours + ':' + minutes + ':' + seconds;
        }
      
    }
    let borderStyle = CurTheme === 'dark' ? "1px solid #2a2a2a"  : "1px solid #E8e8e8";

    if (
        props.assetStatusData &&
        props.assetStatusData.status &&
        props.assetStatusData.status !== '' &&
        (props.ProdGroupRange === 6 || props.ProdGroupRange === 11)
    ) {
        if (props.assetStatusData.status === "ACTIVE") {
            borderStyle = "1px solid #24AD6E";
        } else if (props.assetStatusData.status === "IDLE") {
            borderStyle = "1px solid #0074CB";
        }
    }

    let shiftLabel = "";
    if (props.ProdGroupRange === 19) {
        shiftLabel = "Today shift";
    } else if (props.ProdGroupRange === 20) {
        shiftLabel = "Yesterday shift";
    } else if (props.ProdGroupRange === 21) {
        shiftLabel = "Last shift";
    } else if (props.ProdGroupRange === 11) {
        shiftLabel = "Current shift";
    } else if (props.ProdGroupRange === 7 || props.ProdGroupRange === 6) {
        shiftLabel = "Day";
    }
 

    const renderStatusValue = () => {
        const formatExpCycle = (expCycle) => {
            if (expCycle) {
                if (isNaN(expCycle) || !isFinite(expCycle)) {
                    return '0 sec';
                } else {
                    return `${parseFloat(expCycle).toFixed(2)} sec`;
                }
            } else {
                return '0 sec';
            }

        };
        if (props.isLongRange) {
            if (props.isDryer) {
                return (
                    <React.Fragment>
                        <div style={classes.cardItems}>

                            <Typography variant={'label-01-xs'} color='secondary' value={capitalizeWords(t('TOTAL SAND DRIED (Tons)'))} />
                            <Typography variant={'paragraph-s'} mono value={props.sandDried} />
                        </div>
                        <div style={classes.cardItems}>
                            <Typography variant={'label-01-xs'} color='secondary' value={capitalizeWords(t('TOTAL SAND SCRAPPED (Tons)'))} />
                            <Typography variant={'paragraph-s'} mono value={props.sandScrapped} />
                        </div>
                    </React.Fragment>
                )
            } else {
                return (
                    <React.Fragment>
                        <div style={classes.cardItems}>
                            <Typography variant={'label-01-xs'} color='secondary' value={capitalizeWords(t('TOTAL PARTS'))} />
                            <Typography variant={'paragraph-s'} mono value={props.totalParts} />
                        </div>
                        <div style={classes.cardItems}>
                            <Typography variant={'label-01-xs'} color='secondary' value={capitalizeWords(t('TOTAL REJECTIONS'))} />
                            <Typography variant={'paragraph-s'} mono value={props.rejectedParts} />

                        </div>
                    </React.Fragment>
                )
            }

        } else {
            return (
                <React.Fragment>
                    <div style={classes.cardItems}>
                        <Typography variant={'label-01-xs'} color='secondary' value={capitalizeWords(t('STANDARD CYCLE TIME'))} />
                        <Typography variant={'paragraph-s'} mono value={formatExpCycle(props.OEEData.expCycle)} />
                    </div>
                    <div style={classes.cardItems}>
                        <Typography variant={'label-01-xs'}  color='secondary' value={capitalizeWords('ACTUAL CYCLE TIME')} />
                        <Typography variant={'paragraph-s'} mono value={formatExpCycle(props.OEEData.actcycle)} />

                    </div>
                    {/* <div style={classes.cardItems}>
                                <Typography variant={'label-01-xs'} value={t('Parts')} />
                                <div style={{ color: '#525252' }} className="font-geist-sans  text-base font-normal leading-snug ">Good-0 Reject-0</div>
                            </div> */}


                </React.Fragment>
            )
        }
    }
    const renderWorkOrderDetail = () => {


        return (
            <React.Fragment>
                <div >
                <button className="flex items-center justify-between p-2 border   min-w-[150px] bg-Secondary_Interaction-secondary-default dark:bg-Secondary_Interaction-secondary-default-dark border-Border-border-50 dark:border-Border-border-dark-50 focus:border-Focus-focus-primary text-Text-text-secondary focus:bg-Secondary_Interaction-secondary-hover dark:focus:bg-Secondary_Interaction-secondary-hover-dark dark:text-Text-text-secondary-dark dark:focus:border-Focus-focus-primary-dark hover:bg-Secondary_Interaction-secondary-hover dark:hover:bg-Secondary_Interaction-secondary-hover-dark  active:bg-Secondary_Interaction-secondary-active text-left  dark:active:bg-Secondary_Interaction-secondary-active-dark active:text-Text-text-primary dark:active:text-Text-text-primary-dark rounded-md" onClick={() => { setopenWorkOrder(true); setdialogModeName('workOrder')}}>
                      <div className="flex flex-col  gap-2">
                      <Typography variant={'label-01-xs'} color='secondary' value={'Work Order'} />
                        {
                            WorkOrderExeCutionList && WorkOrderExeCutionList.WOrder ?
                        <Typography variant={'paragraph-s'} style={{whiteSpace:"nowrap",overflow: 'hidden',textOverflow: 'ellipsis',width: '140px' }}  value={WorkOrderExeCutionList.WOrder} />
                                :
                        <Typography variant={'paragraph-s'} color='secondary' value={"No WorkOrder"} />

                        }
                      </div>
                      
                         <div>
                        <SelectorLocation/>
                       </div>
                        
                    </button>
                </div>
                <div >
                <button className="flex items-center justify-between p-2 border    min-w-[150px] bg-Secondary_Interaction-secondary-default dark:bg-Secondary_Interaction-secondary-default-dark border-Border-border-50 dark:border-Border-border-dark-50 focus:border-Focus-focus-primary text-Text-text-secondary focus:bg-Secondary_Interaction-secondary-hover dark:focus:bg-Secondary_Interaction-secondary-hover-dark dark:text-Text-text-secondary-dark dark:focus:border-Focus-focus-primary-dark hover:bg-Secondary_Interaction-secondary-hover dark:hover:bg-Secondary_Interaction-secondary-hover-dark  active:bg-Secondary_Interaction-secondary-active text-left  dark:active:bg-Secondary_Interaction-secondary-active-dark active:text-Text-text-primary dark:active:text-Text-text-primary-dark rounded-md" onClick={() => { setopenWorkOrder(true); setdialogModeName('product') }}>
                      <div className="flex flex-col gap-2">
                       
                        <Typography variant={'label-01-xs'} color='secondary' value={'Product'} />
                        {
                             WorkOrderExeCutionList && WorkOrderExeCutionList.product ?
                        <Typography variant={'paragraph-s'} style={{whiteSpace:"nowrap",overflow: 'hidden',textOverflow: 'ellipsis',width: '140px' }}  value={ WorkOrderExeCutionList.product} />
                                :
                        <Typography variant={'paragraph-s'} color='secondary'  value={"No Product"} />
                        }
                        </div>
                        <div>

<SelectorLocation/>
</div>
                    </button>
                </div>
                <div >
                <button className="flex items-center justify-between p-2 border  min-w-[150px] bg-Secondary_Interaction-secondary-default dark:bg-Secondary_Interaction-secondary-default-dark border-Border-border-50 dark:border-Border-border-dark-50 focus:border-Focus-focus-primary text-Text-text-secondary focus:bg-Secondary_Interaction-secondary-hover dark:focus:bg-Secondary_Interaction-secondary-hover-dark dark:text-Text-text-secondary-dark dark:focus:border-Focus-focus-primary-dark hover:bg-Secondary_Interaction-secondary-hover dark:hover:bg-Secondary_Interaction-secondary-hover-dark  active:bg-Secondary_Interaction-secondary-active text-left  dark:active:bg-Secondary_Interaction-secondary-active-dark active:text-Text-text-primary dark:active:text-Text-text-primary-dark rounded-md" onClick={() => { setopenOperatorOrder(true) }} >
                      <div className="flex flex-col gap-2">
                        
                        <Typography variant={'label-01-xs'} color='secondary' value={'Operator'} />
                        {
                            currentOperator && currentOperator.name ?
                        <Typography variant={'paragraph-s'} style={{whiteSpace:"nowrap",overflow: 'hidden',textOverflow: 'ellipsis',width: '140px' }}  value={currentOperator.name} />
                                :
                                <Typography variant={'paragraph-s'} color='secondary'  value={"No operator"} />
                        }
                        </div>
<div>

<SelectorLocation/>
</div>
                    </button>
                </div>


            </React.Fragment>

        )
    }

    const handleWorkDialogClose = () => {
        setopenWorkOrder(false)
    }
    const handleOperatorDialogClose = () => {
        setopenOperatorOrder(false)
    }
   
    const handleOperatorData = (operatorID,existID) => {
        let shift = headPlant.shift.shifts
        const day = moment(props.startRange).format("YYYY-MM-DD")
        shift = shift.map(x => {
            let startDT = new Date(moment().format(day + "T" + x.startDate) + "Z")
            let endDT = new Date(moment().format(day + "T" + x.endDate) + "Z")
            if(moment(endDT).isBefore(moment(startDT))){
                return { ...x, startDate: moment(startDT).format("YYYY-MM-DDTHH:mm:ss"), endDate: moment(endDT).add(1,'day').format("YYYY-MM-DDTHH:mm:ss")}
            }else{
                return { ...x, startDate: moment(startDT).format("YYYY-MM-DDTHH:mm:ss"), endDate: moment(endDT).format("YYYY-MM-DDTHH:mm:ss")}
            }
            
        })
        
        let currShift = []
        shift.forEach(x => {
         
            const isBetween = moment().isBetween(moment(x.startDate), moment(x.endDate));
            if (isBetween) {
                currShift.push(x);
            }

        });
        // return false
        if (currShift.length > 0) {
            let body = {
                operator_id: operatorID ? operatorID : '',
                entity_id: props.assertName[0].entity.id,
                start: currShift[0].startDate,
                end: currShift[0].endDate,
                created_by: curruser.id,
                updated_by: curruser.id
            }
            if(operatorID){
                if(existID){
                    getUpdateProdOperator({id:existID, operator_id : operatorID,updated_by: curruser.id})
                }else{
                    getInsertProdOperator(body)
                }
            }else{
                handleOperatorDialogClose()
            } 
            
        }
        else{
            setOpenSnack(true)
            SetMessage("Can't set Operator for previous shift")
            SetType("warning")
        }

    }
    const handleShiftEndFalse = (beforeShift) => {
        if(beforeShift){
            setopenOperatorOrder(false)
        }
        setshiftEndingSoon(false)
    }
    const handledialogCloseTriger = () => {
        handleOperatorData(prevOperator && prevOperator.operator_id ? prevOperator.operator_id : '')
        setopenOperatorOrder(false)
        setshiftEndingSoon(false)
    }
    const productTrigger = (prodID, type) => {
        let bodyObj = {
            line_id: headPlant.id,
            product_id: prodID,
            start_date: moment().format("YYYY-MM-DDTHH:mm:ss"),
            entity_id: props.assertName[0].entity.id,
            user_id: curruser.id,
            operator_id: currentOperator && currentOperator.operator_id ? currentOperator.operator_id : undefined
        }
        getWorkOrderAndExecution(bodyObj)
    }

    function stopExec(){
        handleWorkDialogClose()
        setOpenSnack(true)
        SetMessage("Execution has been stopped,based on selected Work Order")
        SetType("success")
        props.TriggerExec()
        getProductList()
    }

    return (
        <React.Fragment>
            <WorkeOrderModel
                ref={WorkOrderRef}
                openWorkOrder={openWorkOrder}
                handleWorkDialogClose={handleWorkDialogClose}
                workOrderLine={props.workOrderLine}
                dialogModeName={dialogModeName}
                productTrigger={(prodID) => productTrigger(prodID)}
                productsList={productsList}
                stopExec={()=> stopExec()}
            />


            <OperatorModel
                UserforLine={UserforLine}
                ref={OperatorRef}
                isShiftChange={shiftEndingSoon}
                openOperatorOrder={openOperatorOrder}
                handleShiftEndFalse={handleShiftEndFalse}
                handledialogCloseTriger={handledialogCloseTriger}
                handleOperatorDialogClose={handleOperatorDialogClose}
                startTime={moment(CurrentShiftTime).format("HH:mm:ss")}
                // startTime={CurrentShiftTime}
                handleOperatorData={(operatorID,updateID) => handleOperatorData(operatorID,updateID)}
                selectedOpt = {currentOperator && currentOperator.operator_id ? currentOperator : null}
                BeforeShift={BeforeShift}

            />
            <KpiCards style={{ border: borderStyle }}>
                <div >
                    <div style={classes.parentHeading}>
                        <div style={classes.heading}>

                            {
                                props.assetStatusData && (props.ProdGroupRange === 6 || props.ProdGroupRange === 11) &&
                                <div style={{ ...classes.tag, background: renderBackGround(props.partData.length && moment(props.assetStatusData?.raw?.[0]?.time).isBefore(moment(props.partData?.[0].time))  ? "ACTIVE" : "IDLE") }}>
                                    <Typography color ="#FFFFFF" value={(props.partData.length && moment(props.assetStatusData.raw?.[0]?.time).isBefore(moment(props.partData?.[0]?.time)))  ? "Active" : "IDLE"} variant={'paragraph-xs'} />
                                </div>
                            }

                            <Typography  color='secondary' variant="heading-01-xs"  value={props.assertName[0] ? props.assertName[0].entity.name : ""} />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <Typography variant="paragraph-xs" color='secondary' value={`Started at : `} />
                                    <Typography variant="paragraph-xs" mono value={currentOperator && currentOperator.start ? moment(currentOperator.start).format("DD/MM/YYYY HH:mm:ss") : '--'} />

                                </div>
                                <span className="text-Text-text-primary dark:text-Text-text-primary-dark">|</span>
                                <div className="flex items-center gap-1">
                                    <Typography variant="paragraph-xs" color='secondary' value="Ended at :" />
                                    <Typography variant="paragraph-xs" mono value={currentOperator && currentOperator.end ? moment(currentOperator.end).format("DD/MM/YYYY HH:mm:ss") : '--'} />
                                </div>
                            </div>
                            {/* <div style={{ color: '#525252' }} className=" font-geist-sans text-base font-normal leading-snug item-center flex items-center ">{displayText}</div> */}
                        </div>
                    </div>

                    <div style={classes.cardContentAlign} >
                        
                        <div style={classes.gridview} >
                            <Typography variant={'label-01-xs'} color='secondary' value={capitalizeWords(t('TOTAL RUNTIME'))} />
                            <Typography variant={'paragraph-s'} mono  value={secondsToHHMMSS(props.OEEData.runTime.toFixed(0))} />
                        </div>
                        <div style={classes.cardItems}>
                            <Typography variant={'label-01-xs'} color='secondary'  value={capitalizeWords(t('TOTAL DOWNTIME'))} />
                            <Typography variant={'paragraph-s'} mono value={secondsToHHMMSS(props.OEEData.downTime.toFixed(0))} />
                        </div>
                        {renderStatusValue()}
                        {renderWorkOrderDetail()}
                        {/* <div style={classes.cardItems}>
                        <Typography variant={'label-01-xs'} value={t('PRODUCT')} />
                        <div style={{ color: '#525252' }} className=" text-base font-normal leading-snug ">{props.workExecutionDetails ? props.workExecutionDetails.productname : "--"}</div>
                    </div> */}
                    </div>



                </div>
            </KpiCards>
        </React.Fragment>
    )

}
