import React, { useState, useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { useTranslation } from 'react-i18next';
import {useParams} from "react-router-dom"
import { selectedPlant, user, lineEntity, snackToggle, snackMessage, snackType,customdates } from "recoilStore/atoms";
import InputFieldNDL from "components/Core/InputFieldNDL";
import EnhancedTable from "components/Table/Table";
import usegetOrderList from "./hooks/useExecutionList";
import useUpdateExecution from "./hooks/useUpdateExecution";
import moment from 'moment';
import Grid from 'components/Core/GridNDL'
import Button from 'components/Core/ButtonNDL';
import EditWorkOrderExecution from "./components/ModalExecution";
import useGetMultipleAssetOEEConfig from "components/layouts/Reports/ProductionWorkOrder/hooks/useMultipleAssetOEEConfig";
import useExecutionPartCount from "./hooks/useExecutionPartCount";
import ModalNDL from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL"; 
import LoadingScreenNDL from 'LoadingScreenNDL';
import AlarmsDateRange from 'components/layouts/Alarms/components/AlarmsDateRange.jsx'
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";

export default function Execution() {
    const { t } = useTranslation();
    const [headPlant] = useRecoilState(selectedPlant);
    const [tabledata, setTableData] = useState([]);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [ReasonVal, setReasonVal] = useState({
        id: '', value: '', valid: false, start_dt: '', info: '',
        operator_id: '', end_dt: ''
    });
    const [entityDialog, setentityDialog] = useState(false);
    let {moduleName,subModule1} = useParams()
    const ReasonRef = useRef();
    const EditExecutionRef = useRef()
    const { outOLLoading, outOLData, outOLError, getOrderList } = usegetOrderList(); //getexecution list hook
    const { updateExecutionLoading, updateExecutionData, updateExecutionError, getupdateExecution } = useUpdateExecution();
    const { multipleAssetOEEConfigLoading, multipleAssetOEEConfigData, multipleAssetOEEConfigError, getMultipleAssetOEEConfig } = useGetMultipleAssetOEEConfig()
    const { executionPartCountLoading, executionPartCountData, executionPartCountError, getExecutionPartCount } = useExecutionPartCount();
    const [currUser] = useRecoilState(user)
    const [uneditableexecutions, setuneditableexecutions] = useState([])
    const [currentstatus, setcurrentstatus] = useState(0)
    const [executiondata, setexecutiondata] = useState([])
    const [entities] = useRecoilState(lineEntity)
    const [loading, setLoading] = useState(true)
    const [Customdatesval] = useRecoilState(customdates);


    useEffect(() => {
        if(headPlant.id && Customdatesval && Customdatesval.StartDate ){ 
            getOrderList(headPlant.id,Customdatesval.StartDate,Customdatesval.EndDate);
            // setLoading(true) 

        }
        if(moduleName === "execution" && subModule1 === "new"){
            setentityDialog(true)
        }

    }, [headPlant.id,Customdatesval]) // eslint-disable-line react-hooks/exhaustive-deps    
  

    useEffect(() => { 
        processedrows()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [executiondata])
    const headCells = [
        {
            id: 'sno',
            label: 'S.No',
            disablePadding: false,
            width: 100
        },
        {
            id: 'entity',
            numeric: false,
            disablePadding: true,
            label: t('Asset'),
            width: 100
        },
        {
            id: ' order_id',
            numeric: false,
            disablePadding: false,
            label: t('WorkOrder'),
            width: 100
        },
        {
            id: 'qty',
            numeric: false,
            disablePadding: false,
            label: t('Targeted Quantity'),
            width: 150
        },
        {
            id: 'mfd-qty',
            numeric: false,
            disablePadding: false,
            label: t('Manufactured Quantity'),
            width: 200
        },
     
        {
            id: 'production_time',
            numeric: false,
            disablePadding: false,
            label: t('Production Time(Hrs)'),
            width: 180
        },
        {
            id: 'start_time',
            numeric: false,
            disablePadding: false,
            label: t('Start Time'),
            width: 120
        },
        {
            id: 'end_time',
            numeric: false,
            disablePadding: false,
            label: t('End Time'),
            width: 120
        },
        {
            id: 'delivery_date',
            numeric: false,
            disablePadding: false,
            label: t('Delivery Date'),
            hide: true,
            display: 'none',
            width: 120
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

    useEffect(() => {
        if (!outOLLoading && !outOLError && outOLData) {
            getMultipleAssetOEEConfig(entities.map(val => val.id)) 
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [outOLLoading, outOLData, outOLError])

    useEffect(() => {
        if (!multipleAssetOEEConfigLoading && !multipleAssetOEEConfigError && multipleAssetOEEConfigData && multipleAssetOEEConfigData.length>0 ) {

            setLoading(true)
            var temp = []
            // eslint-disable-next-line array-callback-return

            outOLData.map(val => {
                if ((new Date(val.end_dt).getTime() - new Date(val.start_dt).getTime()) / (24 * 60 * 60 * 1000) < 20)
                    temp.push({
                        "start_date": val.start_dt,//new Date(val.jobStart).getTime() <= new Date(rangeStart).getTime() ? (rangeStart) : new Date(val.jobStart).getTime() >= new Date(rangeStart).getTime() ? (val.jobStart) : rangeStart,
                        "end_date": val.end_dt,//new Date(val.jobEnd).getTime() <= new Date(rangeEnd).getTime() ? (val.jobEnd) : new Date(val.jobEnd).getTime() >= new Date(rangeEnd).getTime() ? (rangeEnd) : val.jobEnd,
                        "execid": val.id
                    })
            })
            getExecutionPartCount(headPlant.schema, multipleAssetOEEConfigData, temp)

        }
            else{
                setLoading(false)

            }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [multipleAssetOEEConfigLoading, multipleAssetOEEConfigData, multipleAssetOEEConfigError])

    useEffect(() => {
        if (!executionPartCountLoading && !executionPartCountError && executionPartCountData) {

            if (executionPartCountData[0]) {
                var newexecutiondata = outOLData.map((val) => {
                    var index = executionPartCountData[0].findIndex(p => p.execid === val.id)
                    if (index >= 0 ){
                        if (executionPartCountData[0][index].partsdata && executionPartCountData[0][index].partsdata.data && (executionPartCountData[0][index].partsdata.data.length>0) && executionPartCountData[0][index].partsdata.data.length === Number(val.prod_order.qty) && val.status !== 3) {
                            
                            getupdateExecution({
                            id: val.id, status: 3, decline_reason: '', end_dt: val.end_dt, start_dt: val.start_dt, info: val.info,
                            operator_id: val.userByOperatorId.id, user_id: currUser.id
                        })
                    }
                    return Object.assign({}, val, {
                        info: { "Quantity": executionPartCountData[0][index].partsdata && executionPartCountData[0][index].partsdata.data ? executionPartCountData[0][index].partsdata.data.length : 0 },
                        status: executionPartCountData[0][index].partsdata && executionPartCountData[0][index].partsdata.data && (executionPartCountData[0][index].partsdata.data.length === Number(val.prod_order.qty)) ? 3 : val.status
                    })
                }
                else {
                    return Object.assign({}, val, {
                        info: { "Quantity": 0 },
                        status: val.status
                    })
                }
        })
        
        setexecutiondata(newexecutiondata)
        }
    
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [executionPartCountLoading, executionPartCountData, executionPartCountError])

useEffect(() => {
    if (!updateExecutionLoading && !updateExecutionError && updateExecutionData) {

        if (updateExecutionData >= 1) {
            SetMessage(t("Execution Status Updated Successfully"))
            SetType("success")
            setOpenSnack(true)
            getOrderList(headPlant.id,Customdatesval.StartDate,Customdatesval.EndDate);
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [updateExecutionLoading, updateExecutionData, updateExecutionError])

const processedrows = () => {

    var temptabledata = []
    var tempuneditableexecutions = []
    if (executiondata && executiondata.length > 0) {
        temptabledata = executiondata.map((val, index) => {
        
            const stdrate = val.prod_order.prod_product.unit
            
            const roundQty = Math.floor(((new Date(moment(val.end_dt).set('seconds',0).set('milliseconds',0))-
            new Date(moment(val.start_dt).set('seconds',0).set('milliseconds',0)))/1000/60 ) * (Number(Math.floor(stdrate))/60))
            const delivery_date = val.delivery_date ? moment(val.delivery_date).format("DD/MM/YYYY ") : '';
            const prodHour = Number(roundQty / val.prod_order.prod_product.unit).toFixed(2)
            let roundvalue = isNaN(prodHour) || !isFinite(prodHour) || !prodHour ? 0 : prodHour;
            const manquantity = val.info && val.info.Quantity ? val.info.Quantity : 0
            // console.log(val,roundQty,"roundQty")
            const status = Number(roundQty) === Number(manquantity) ? 3 : val.status
            if (status === 2 || status === 3) {
                tempuneditableexecutions.push(index)
            }
           
            return [index+1,val.entity.name, val.prod_order.order_id, roundQty ? roundQty : '-', manquantity,
             roundvalue,
            val.start_dt ? moment(val.start_dt).format("DD/MM/YYYY HH:mm") : null,
            val.end_dt ? moment(val.end_dt).format("DD/MM/YYYY HH:mm") : null,
                delivery_date, status, val.id
            ]
        })
        setLoading(false)

    }
    else{

        setLoading(false)
    }
    setuneditableexecutions(tempuneditableexecutions)
    setTableData(temptabledata)



}

const StatusOption = [{ id: 1, name: t("In process") }, { id: 2, name: t("Declined") }, { id: 3, name: t("Completed") }, { id: 4, name: t("Held") }]

function statusChange(e, val, id) {
    
    setcurrentstatus(e)
    // return false
    if (e === 2) {

        setentityDialog(true)
        setReasonVal({
            id: val.id, value: e, valid: false, start_dt: val.start_dt, info: val.info,
            operator_id: val.userByOperatorId.id, end_dt: val.end_dt
        })
    } else {
        getupdateExecution({
            id: val.id, status: e, decline_reason: '', end_dt: val.end_dt, start_dt: val.start_dt, info: val.info,
            operator_id: val.userByOperatorId.id, user_id: currUser.id
        })
        setLoading(true) 
    }

}

function saveDecline() {
    if (currentstatus === 2) {
        const trimmedReasonRef=ReasonRef.current.value.trim()
        if (trimmedReasonRef) {
            getupdateExecution({       
                id: ReasonVal.id, status: 2, decline_reason: trimmedReasonRef, end_dt: ReasonVal.end_dt,
                start_dt: ReasonVal.start_dt, info: ReasonVal.info,
                operator_id: ReasonVal.operator_id, user_id: currUser.id
            })
            setLoading(true) 
            setReasonVal({
                id: ReasonVal.id, value: ReasonVal.value, valid: false, start_dt: ReasonVal.start_dt, info: ReasonVal.info,
                operator_id: ReasonVal.operator_id, end_dt: ReasonVal.end_dt
            })
            handleExeDialogClose()
        }
        else {
            setReasonVal({
                id: ReasonVal.id, value: ReasonVal.value, valid: true, start_dt: ReasonVal.start_dt, info: ReasonVal.info,
                operator_id: ReasonVal.operator_id, end_dt: ReasonVal.end_dt

            })
        }
    }


}

function handleExeDialogClose() {
    setentityDialog(false)
}

const handleEditExecution = (row,id) => {
    EditExecutionRef.current.handleEditWorkOrderExecutionDialogOpen(row)
}


return (
    <React.Fragment>
        {loading && <LoadingScreenNDL />}
        
        <ModalNDL open={entityDialog} onClose={handleExeDialogClose} size="lg"> 
            <ModalHeaderNDL>
            <TypographyNDL variant="heading-02-xs" model value={currentstatus === 2 ? t("Are you sure want to decline?") :
                t("Kindly Enter the Manufactured Quantity value")}/>           
            </ModalHeaderNDL>
            <ModalContentNDL>
                
            <TypographyNDL  variant='paragraph-s' color='secondary' value={currentstatus === 2 ? t("Do you really want to decline the execution? This action cannot be undone") :
                        ""} />
                {currentstatus === 2 &&
                    <InputFieldNDL
                        id="reason"
                        label={t("Reason")}
                        multiline={true}
                        maxRows={4}
                        type={"text"}
                        inputRef={ReasonRef}
                        error={ReasonVal.valid}
                        helperText={ReasonVal.valid ? t('Please Enter Reason') : ''}
                    />
                }
            </ModalContentNDL>
            <ModalFooterNDL>
                <Button type="secondary" danger value={t('Cancel')} onClick={() => handleExeDialogClose()} />
                {currentstatus === 2 ? <Button type="primary" danger value={t('Decline')} onClick={() => saveDecline()} /> :
                    <Button type="primary" value={t('Complete')} onClick={() => saveDecline()} />
                }
            </ModalFooterNDL>
        </ModalNDL> 
        <EditWorkOrderExecution
            ref={EditExecutionRef}
            getUpdatedWorkOrderExecutionList={() => {getOrderList(headPlant.id,Customdatesval.StartDate,moment().format('YYYY-MM-DDTHH:mm:ss'));setLoading(false)}}
            setLoading={val=>setLoading(val)}
            executiondata = {outOLData}

        />
        <div className="bg-Background-bg-primary dark:bg-Background-bg-primary-dark">
        <Grid container spacing={3} style={{padding:"12px 16px 12px 16px",alignItems:"center"}}>
            <Grid item xs={9}>
            <TypographyNDL value='Executions' variant='heading-02-xs'  />
            </Grid>
            <Grid item xs={3} > 
                    <AlarmsDateRange btnValue={15} Dropdowndefine={'ProductionDateRange'}/>  
            </Grid> 
        </Grid>
        </div>
        <HorizontalLine variant={"divider1"} /> 
        <Grid container spacing={3} style={{padding:"16px " }}>
            <Grid item xs={12}>
                <EnhancedTable
                    headCells={headCells.filter(x=>!x.hide)}
                    data={tabledata}
                    search={true}
                    download={true}
                    rawdata={executiondata}
                    actionenabled={true}
                    statusUpdate={true}
                    StatusOption={StatusOption}
                    statusChange={statusChange}
                    enableEdit={true}
                    handleEdit={(id, value) => handleEditExecution(value, id)}
                    disablededit={uneditableexecutions}
                    rowSelect={true}
                    checkBoxId={"sno"}
                    FilterCol
                    verticalMenu={true}
                    groupBy={'Execution'}
                />
            </Grid>
        </Grid> 
    </React.Fragment>
)

}