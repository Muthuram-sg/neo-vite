/* eslint-disable array-callback-return */
import React, { useState, useEffect, useRef } from "react";
import {useParams} from 'react-router-dom'
import moment from "moment";
import { useRecoilState } from "recoil";
import { selectedPlant,WorkOrders, ErrorPage, snackToggle, snackMessage, snackType } from "recoilStore/atoms";
import "components/style/instrument.css";
import EnhancedTable from "components/Table/Table";
import AddWorkOrder from "./components/WorkOrderModal";

import useWorkOrderList from "./hooks/useWorkOrderList";
import AddWorkOrderExecution from "./components/WOExeModal";
import { useTranslation } from 'react-i18next';
import LoadingScreenNDL from 'LoadingScreenNDL';
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import Play from 'assets/neo_icons/Menu/newTableIcons/play.svg?react';

export default function RealInstrument() {
    const { t } = useTranslation();
    const [headPlant] = useRecoilState(selectedPlant);
    const [loading, setLoading] = useState(false)
    const [,setErrorPage] = useRecoilState(ErrorPage)
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [, setSearch] = useState("");
    const [tabledata, setTableData] = useState([])
    const [disabledWorkOrderIDs, setdisabledWorkOrderIDs] = useState([])
    const [uneditableWorkOrderIDs, setuneditableworkOrderIDS] = useState([])
    const [,setworkorderdata] = useRecoilState(WorkOrders)
    let {moduleName,subModule1,subModule2} = useParams()
    const WorkOrderRef = useRef();
    const WorkOrderExecutionRef = useRef()

    //Hooks
    const { workorderListLoading, workorderListData, workorderListError, getWorkOrderList } = useWorkOrderList();

//    useEffect(() => {
//     if(moduleName === 'execution' && subModule1 === 'new' && subModule2 && workorderListData){
//         console.log(workorderListData,"list")
//         const row = workorderListData.filter(item => item.order_id === subModule2);
//         WorkOrderExecutionRef.current.handleWorkOrderExecutionDialog(row[0])
//     }
//    },[moduleName,subModule1,workorderListData])
    const headCells = [
        {
            id: 'sno',
            label: 'S.No',
            disablePadding: false,
            width: 100
        },
        {
            id: 'WorkOrderID',
            numeric: false,
            disablePadding: true,
            label: t('Work Order ID'),
            width: 120
        },
        {
            id: 'createdon',
            numeric: false,
            disablePadding: false,
            label: t('Created On'),
            width: 120
        },
        {
            id: 'product',
            numeric: false,
            disablePadding: false,
            label: t('Product'),
            width: 120
        },
        {
            id: 'startdate',
            numeric: false,
            disablePadding: false,
            label: t('Start Date'),
            width: 120
        },
        {
            id: 'enddate',
            numeric: false,
            disablePadding: false,
            label: t('End Date'),
            width: 120
        },
        {
            id: 'quantity',
            numeric: false,
            disablePadding: false,
            label: t('Quantity'),
            width: 120
        },

        {
            id: 'PlannedProductionTime',
            numeric: false,
            disablePadding: false,
            label: t('Planned Production Time(Hrs)'),
            width: 200
        },

        {
            id: 'Deliverydate',
            numeric: false,
            disablePadding: false,
            label: t('Delivery Date'),
            width: 150
        },
        {
            id: 'id',
            numeric: false,
            disablePadding: false,
            label: t('ID'),
            hide: true,
            display: "none",
            width: 100

        }
    ];
function NewExecutionParam(){
    // console.log(tabledata,headCells,uneditableWorkOrderIDs,disabledWorkOrderIDs,"tabledata")
    
//     if(moduleName === 'execution' && subModule1 === 'new' && subModule2 && workorderListData && workorderListData.length > 0 && tabledata.length > 0 && uneditableWorkOrderIDs.length > 0 && disabledWorkOrderIDs.length > 0){
//         console.log(workorderListData,"list")
//         const row = workorderListData.filter(item => item.order_id === subModule2);
        
//    }
   if(moduleName && moduleName.includes('=') && workorderListData && workorderListData.length > 0 && tabledata.length > 0 && disabledWorkOrderIDs.length > 0){
    const WOID = moduleName.split('='); 
    const row = workorderListData.filter(item => item.order_id === WOID[1]);
    let idx = workorderListData.findIndex(item => item.order_id === WOID[1]);
    
    if(row.length>0){
        if(disabledWorkOrderIDs.includes(idx)){
            setOpenSnack(true)
            SetType('warning')
            SetMessage("Execution creation is unavailable at the moment. Please check the Work Orders page for more details.")
        }else{
            setTimeout(()=>{
                WorkOrderExecutionRef.current.handleWorkOrderExecutionDialog(row[0])
            },5000)
            
        }
    }else{
        setErrorPage(true)
    }
    
    // console.log(WOID,"queryParamsWork",workorderListData,row,disabledWorkOrderIDs,idx,disabledWorkOrderIDs.includes(idx))
   }
}
    const processedrows = (moduleName,subModule1,subModule2) => {
     
        var temptabledata = []
        var tempdisabledworkorders = []
        var tempuneditableworkorders = []
        if (workorderListData && workorderListData.length > 0) {
         
            temptabledata = temptabledata.concat(workorderListData.map((val, index) => {
                let EndDT = val.end_dt ? val.end_dt : new Date()
                var workorder_duration = new Date(EndDT).getTime() - new Date(val.start_dt).getTime()
                
                var existing_exec_durations = 0
                val.prod_execs.map(p => {
                    let EndDTexe = p.end_dt ? p.end_dt : new Date()
                    if(!p.end_dt){
                        tempdisabledworkorders.push(index)
                    }
                     existing_exec_durations = existing_exec_durations + new Date(EndDTexe).getTime() - new Date(p.start_dt).getTime()
                })
                console.log(val.prod_execs,"val.prod_execs",val.prod_product,val,existing_exec_durations,workorder_duration)
                if (val) {
                    if ((val.prod_execs.map(p => p.status).findIndex(s => s === 1 || s === 4) >= 0) ||
                        (workorder_duration <= existing_exec_durations)  || 
                        (new Date().getTime() < new Date(val.start_dt).getTime())  
                    ) {
                        tempdisabledworkorders.push(index)
                    }
                    if (val.prod_execs.length > 0 ){
                        tempuneditableworkorders.push(index)
                    } 
                    if(val.end_dt && new Date().getTime() > new Date(val.end_dt).getTime()){
                        tempuneditableworkorders.push(index)
                        tempdisabledworkorders.push(index)
                    }
                    let result;

                    if (val.prod_product && val.prod_product.unit && val.qty) {
                        if (isNaN(val.qty / val.prod_product.unit)) {
                            result = 0;
                        } else {
                            result = (val.qty / val.prod_product.unit).toFixed(2);
                        }
                    } else {
                        result = 0;
                    }
                       
                
                return [ index+1,val.order_id ? val.order_id : "-",
                val.created_ts ? moment(val.created_ts).format("DD/MM/YYYY") : "-",
                (val.prod_product && val.prod_product.name) ? val.prod_product.name : "",
                val.start_dt ? moment(val.start_dt).format("DD/MM/YYYY HH:mm") : "",
                val.end_dt ? moment(val.end_dt).format("DD/MM/YYYY HH:mm") : "",
                val.qty ? val.qty : "",
                result,
                val.delivery_date ? moment(val.delivery_date).format("DD/MM/YYYY HH:mm") : "",
                val.id
                ]
                }
                else return []
            })
            )
        }
        console.log(temptabledata,"temp",tempdisabledworkorders)
        setdisabledWorkOrderIDs(tempdisabledworkorders)
        setuneditableworkOrderIDS(tempuneditableworkorders)
        setTableData(temptabledata)
        setLoading(false)   
       
    }

    

    useEffect(() => {

        if (!workorderListLoading && !workorderListError && workorderListData) {
           
            setworkorderdata(workorderListData)
            processedrows(moduleName,subModule1,subModule2) 
            setSearch("")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [workorderListLoading, workorderListData, workorderListError])

    useEffect(() => {
        if(tabledata.length>0){
            setTimeout(()=>{
                NewExecutionParam()
            },1000)
            
        } 
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabledata,subModule1,moduleName,subModule2])



    useEffect(() => {
        getWorkOrderList()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant])


    const handleCreateOrder = () => {
        WorkOrderRef.current.handleWorkOrderDialog()
    }
    const handleEditOrder = (row,id) => {
        WorkOrderRef.current.handleEditWorkOrderDialogOpen(row)
    }
    const handleDeleteOrder = (val,id) => {
        WorkOrderRef.current.handleDeleteDialogOpen(val)
    }


    const handleCreateExecution = (row,id) => {
      //  console.log(row,id,"row")
        WorkOrderExecutionRef.current.handleWorkOrderExecutionDialog(row)
    }

    return (
        <React.Fragment>
            {loading && <LoadingScreenNDL />}
                <AddWorkOrder
                    ref={WorkOrderRef}
                    workordernames={workorderListData ? workorderListData.map(val => val.order_id) : []}
                    getUpdatedWorkOrderList={() => getWorkOrderList()}

                />
                <AddWorkOrderExecution
                    ref={WorkOrderExecutionRef}
                    getUpdatedWorkOrderList={() => getWorkOrderList()}
                    workorderlist={workorderListData}

                />
                <div className="h-[48px] py-3 px-4 border-b bg-Background-bg-primary dark:bg-Background-bg-primary-dark border-Border-border-50 dark:border-Border-border-dark-50">
                            <TypographyNDL value='Work Orders' variant='heading-02-xs'  />
                        </div>
                        <div className="p-4 bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark">
                <EnhancedTable
                    headCells={headCells.filter(x=>!x.hide)}
                    data={tabledata}
                    buttonpresent={"Add Workorder"}
                    download={true}
                    search={true}
                    onClickbutton={handleCreateOrder}
                    actionenabled={true}
                    rawdata={workorderListData}
                    handleEdit={(id, value) => handleEditOrder(value, id)}
                    handleDelete={(id, value) => handleDeleteOrder(value, id)}
                    enableDelete={true}
                    enableEdit={true}
                    enableButton={t("Execute")}
                    enableButtonIcon={Play}
                    handleCreateTask={(id, value) => handleCreateExecution(value, id)}
                    buttoncolor={"#558B2F"}
                    buttonhoverColor={"#33691E"}
                    disabledbutton={disabledWorkOrderIDs}
                    disablededit={uneditableWorkOrderIDs}
                    Buttonicon={Plus}
                    rowSelect={true}
                    checkBoxId={"sno"}
                    FilterCol
                        verticalMenu={true}
                        groupBy={'Workorder'}

                />

            </div>
        </React.Fragment>
    )
}
