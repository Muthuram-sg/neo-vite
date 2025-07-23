import React, {useState,useEffect,useRef} from "react";
import CircularProgress  from 'components/Core/ProgressIndicators/ProgressIndicatorNDL';
import Dialog from 'components/Core/ModalNDL';
import DialogTitle from 'components/Core/ModalNDL/ModalHeaderNDL';
import DialogContent from 'components/Core/ModalNDL/ModalContentNDL';
import DialogActions from 'components/Core/ModalNDL/ModalFooterNDL'
import Grid from 'components/Core/GridNDL'
import EnhancedTable from "components/Table/Table";
import useDeleteQuality from "components/layouts/Reports/QualityReport/hooks/useDelQuality"
import { snackMessage,snackType, snackToggle,currentUserRole,reportProgress,stdDowntimeAsset,stdReportAsset,customdates,selectedPlant,oeeAssets,user  } from "recoilStore/atoms";
import { useRecoilState } from "recoil";
import moment from 'moment';
import ConfirmDelete from "components/layouts/Reports/QualityReport/components/ConfirmDelete"
import { useTranslation } from 'react-i18next'; 
import usePartsProduction from "../hooks/useGetPartsProduction";
import Filter from 'assets/neo_icons/Charts/filter.svg?react';
import ListNDL from 'components/Core/DropdownList/ListNDL.jsx';
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import TextField from "components/Core/InputFieldNDL"
import Button from "components/Core/ButtonNDL/index";
import useReasonTypeList from "Hooks/useReasonTypeList";
import useReason from "Hooks/useGetReasonTypeByID";
import useAddQualityDefects from "Hooks/useAddQualityDefects";
import ParagraphText from 'components/Core/Typography/TypographyNDL';
import { set } from "lodash";

export default function Tabledata(props) {
    const { t } = useTranslation();
    const [headPlant,] = useRecoilState(selectedPlant);
    const [, setProgress] = useRecoilState(reportProgress);
    const [downtimeAsset] = useRecoilState(stdDowntimeAsset);  
    const [oeeAssetsArray] = useRecoilState(oeeAssets);
    const [tableDataTotal, SetTableDataTotal] = useState([]); 
    const [enableactions, setEnableactions] = useState(true);
    const [defectID, setDefectID] = useState('');
    const [defectName, setDefectName] = useState('');
    const [deleteDigalog, setDeleteDialog] = useState(false);
    const { delqualitywithoutIDLoading, delqualitywithoutIDData, delqualitywithoutIDError, getadelqualitywithoutID } = useDeleteQuality()   
    // eslint-disable-next-line no-unused-vars
    const { reasonTypeLoading, reasonTypeData, reasonTypeError, getReasonTypeList } = useReasonTypeList();
    // eslint-disable-next-line no-unused-vars
    // eslint-disable-next-line no-unused-vars
    const { partProductionLoading, partProductionData, partProductionError, getPartsProduction } = usePartsProduction()
    // eslint-disable-next-line no-unused-vars
    const { ReasonListLoading, ReasonListData, ReasonListError, getReason } = useReason();
    const { AddQualityDefectsLoading, AddQualityDefectsData, AddQualityDefectsError, getAddQualityDefects } = useAddQualityDefects();
    const [, setSnackMessage] = useRecoilState(snackMessage);
    const [, setType] = useRecoilState(snackType);
    const [, setOpenSnack] = useRecoilState(snackToggle); 
    const [Page,setPage] = useState(0)
    const [PerPage,setPerPage] = useState(10)
    const [RangeFrom,setRangeFrom] = useState('')
    const [RangeTo,setRangeTo] = useState('')
    const [,setNoOfDays] = useState(0)
    const [currUserRole] = useRecoilState(currentUserRole);
    const [selectedAsset] = useRecoilState(stdReportAsset);
    const [customdatesval,] = useRecoilState(customdates);  
    const [anchorEl,setAnchorEl] = useState(null);
    const [openParts,setopenParts] = useState(false);
    const [filterOpt,setFilterOpt] = useState('all');
    const [aggregateParts,setAggregateParts] = useState(1);
    const [reasonTypeID,setReasonTypeID] = useState("")
    const [reasonID,setReasonID] = useState("");
    const [rejectDialog,setRejectDialog] = useState(false);
    const [rejectObj,setRejectObj] = useState("");
    const [currUser] = useRecoilState(user); 
    const [disableDelete,setDisableDelete] = useState([]);
    const [revertPart,setRevertPart] = useState([]) 
    const [dataLoading,setDataLoading] = useState(false);
    const [isMaxDays,] = useState(false);
    const [AggreChange,setAggreChange]= useState('');
    const [aggregateList,setAggregateList] = useState([
        {id: 1,name: "All"},
        {id: 2,name: "Daywise"},
        {id: 3,name: "Shiftwise"}
    ])
    const descriptionRef = useRef()
    
   
    const headCells = [
        {
            id: 'serial',
            numeric: false,
            disablePadding: true,
            label: t("SNo"),
        },
        {
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: t('AssetName'),
        },
        {
            id: 'part_number',
            numeric: false,
            disablePadding: true,
            label: t('Part Count'),
        },
        {
            id: 'marked_at',
            numeric: false,
            disablePadding: true,
            label: t('Date'),
        },
        {
            id: 'Time',
            numeric: false,
            disablePadding: true,
            label: t('Time'),
        },
        {
            id: 'prod_order_product',
            numeric: false,
            disablePadding: false,
            label: t('Product'),
        },
        {
            id: 'prod_order_work_order',
            numeric: false,
            disablePadding: false,
            label: t('WorkOrder'),
        },
        {
            id: 'prod_reason',
            numeric: false,
            disablePadding: false,
            label: t('Defect Details'),
        },
        {
            id: 'user',
            numeric: false,
            disablePadding: false,
            label: t('Logged By'),
        }
        
    ];
    const aggregateCells = [
        {
            id: 'serial',
            numeric: false,
            disablePadding: true,
            label: t("SNo"),
        },
        {
            id: 'entity',
            numeric: false,
            disablePadding: true,
            label: t("Asset"),
        },
        {
            id: 'date',
            numeric: false,
            disablePadding: true,
            label: t("Date"),
        },
        {
            id: 'total',
            numeric: false,
            disablePadding: true,
            label: t("Manufactured Qty"),
        },
        {
            id: 'defect',
            numeric: false,
            disablePadding: true,
            label: t("Defective Qty"),
        },
        {
            id: 'qualified',
            numeric: false,
            disablePadding: false,
            label: t("Qualified Qty"),
        } 
    ];
    
    const aggregateShiftCells = [
        {
            id: 'serial',
            numeric: false,
            disablePadding: true,
            label: t("SNo"),
        },
        {
            id: 'entity',
            numeric: false,
            disablePadding: true,
            label: t("Asset"),
        },
        {
            id: 'date',
            numeric: false,
            disablePadding: true,
            label: t("Date"),
        },
        {
            id: 'shift',
            numeric: false,
            disablePadding: true,
            label: t("Shift"),
        },
        {
            id: 'total',
            numeric: false,
            disablePadding: true,
            label: t("Manufactured Qty"),
        },
        {
            id: 'defect',
            numeric: false,
            disablePadding: true,
            label: t("Defective Qty"),
        },
        {
            id: 'qualified',
            numeric: false,
            disablePadding: false,
            label: t("Qualified Qty"),
        } 
    ];
    useEffect(()=>{ 
        if(isMaxDays){
            setAggregateList([
                {id: 1,name: "All"} 
            ])
        }else{
            setAggregateList([
                {id: 1,name: "All"},
                {id: 2,name: "Daywise"},
                {id: 3,name: "Shiftwise"}
            ])
        }
    },[isMaxDays]) 
    
    useEffect(() => {
        SetTableDataTotal([])
        if(oeeAssetsArray.length>0){
            getDefectsList('general')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedAsset,customdatesval,oeeAssetsArray])
    useEffect(()=>{
        getReasonTypeList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    useEffect(() => {
        if (currUserRole.id === 2) {
            setEnableactions(true)
        } else {
            setEnableactions(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currUserRole]) 
    useEffect(()=>{  
        if(!partProductionLoading && partProductionData && !partProductionError){  
            processedrows(isMaxDays?1:filterOpt,isMaxDays?1:aggregateParts);
            setAggreChange(partProductionData)
        }
        if(!partProductionLoading && !partProductionData && partProductionError){
            setDataLoading(false);
            SetTableDataTotal([])
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[partProductionData,partProductionLoading])
    useEffect(() => {
        if (!AddQualityDefectsLoading && AddQualityDefectsData && !AddQualityDefectsError){
                    setSnackMessage(t("Part rejected successfully"));
                    setType("success");
                    setOpenSnack(true);
                    handleRejectDialogClose();  
                    getDefectsList('general');              
        }
    if(!AddQualityDefectsLoading && !AddQualityDefectsData && AddQualityDefectsError){
            setSnackMessage(t("Part rejection failed"));
            setType("warning");
            handleRejectDialogClose();  
            setOpenSnack(false);
        } 
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [AddQualityDefectsData]) 
    useEffect(() => {
        if (!delqualitywithoutIDLoading && delqualitywithoutIDData && !delqualitywithoutIDError){
                    setSnackMessage(t("Part reverted successfully"));
                    setType("success");
                    setOpenSnack(true);
                    handleDeleteDialogClose();  
                    getDefectsList('general');              
        }
    if(!delqualitywithoutIDLoading && !delqualitywithoutIDData && delqualitywithoutIDError){
            setSnackMessage(t("Reverting rejected parts failed"));
            setType("warning");
            handleDeleteDialogClose();  
            setOpenSnack(false);
        } 
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [delqualitywithoutIDData]) 
     
    const getDefectsList = (type) => {
        setDataLoading(true)
        try{
            SetTableDataTotal([])
            if (type !== 'trends' && type !== 'overview') {
                setProgress(true);
            }
            let selectedDate =moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ssZ")
            let to = moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ssZ")
            
            
            const noofDay = moment(to).diff(selectedDate,'days');  
            setRangeFrom(selectedDate)
            setRangeTo(to)
            setNoOfDays(noofDay)
            setPage(0)
            if(downtimeAsset.length >0){
                
                const assetList = oeeAssetsArray.filter(x=>downtimeAsset.includes(x.entity.id));
                getPartsProduction(headPlant,assetList,{From: selectedDate, To:to} ,filterOpt,PerPage,0,aggregateParts) 
            }else{                
                setDataLoading(false);
                SetTableDataTotal([])
            }
            props.refresh()
            
        }catch(err){
            console.log('err',err)
            setDataLoading(false);
            SetTableDataTotal([])
        }
    }
    const handleDeleteDialog = (id, rowData) => {
       setRejectObj(rowData);
       setRejectDialog(true);
    }
    const handleDeleteDialogClose = () => {
        setDeleteDialog(false);
        setDefectName('');
        setDefectID('');
    }
    
    const triggerDeleteDefects = () => {
        getadelqualitywithoutID(defectID)
    } 
    
    
    const processedrows = async (filter,aggregate) => { 
        let data = [...partProductionData.Data];
        if(data && data.length > 0){ 
            try{ 
                let temptabledata = []
                let partData = [];
                let disabledDeleteArr = [];
                let revertPartArr = [];
                    partData = [...data];
                if(aggregate === 2){
                    temptabledata = temptabledata.concat(partData.map((val, index) => {
                        return [index+1,val.entity,moment(val.date).format('DD-MM-YYYY'),val.total,val.defect,val.qualified]
                    })
                    ) 
                }else if(aggregate === 3){
                    temptabledata = temptabledata.concat(partData.map((val, index) => {
                        return [index+1,val.entity,moment(val.date).subtract(moment(val.date).isDST() ? 1 : 0,'hour').format('DD-MM-YYYY HH:mm:ss'),val.shift,val.total,val.defect,val.qualified]
                    }))
                }else{
                    temptabledata = temptabledata.concat(partData.map((val, index) => {
                        const yesterday = moment().subtract(1,'day').startOf('day');                    
                            if(val.defect || moment(val.time).isBefore(yesterday)){
                                disabledDeleteArr.push(index);
                            }
                            if(!val.defect || moment(val.time).isBefore(yesterday)){
                                revertPartArr.push(index);
                            } 
                            let partCnt = partProductionData.count - (index + (Page * PerPage))
                            let Sno = partProductionData.count - (partProductionData.count - (index + (Page * PerPage)))
                            let partNumberVal=val['instrument_type']===9?val.value:partCnt
                        return [Sno+1,val["entity"]?val["entity"]:"",val.part_number?val.part_number:partNumberVal,moment(val.time).format('DD/MM/YYYY'),moment(val.time).subtract(moment(val.time).isDST() ? 1 : 0,'hour').format('HH:mm:ss'), val.product ? val.product : "-", val.workorder ? val.workorder : "-",
                        val.reason ? val.reason : "-", val.user ? val.user : "-"]
                    })
                    ) 
                }  
                setDisableDelete(disabledDeleteArr);
                setRevertPart(revertPartArr);
                SetTableDataTotal(temptabledata)
                setDataLoading(false);
            }catch(err){
                setDataLoading(false);
                setDisableDelete([]);
                setRevertPart([]);
                SetTableDataTotal([])
            }
        }else{ 
            setDataLoading(false);
            setDisableDelete([]);
            setRevertPart([]);
            SetTableDataTotal([])
        }
    }  
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setopenParts(!openParts)
    };
    const handleClose = () =>{setAnchorEl(null);setopenParts(!openParts)};
    const filterParts = (val) =>{
        setDataLoading(true);
        SetTableDataTotal([])
        setPage(0) 
        const assetList = oeeAssetsArray.filter(x=>downtimeAsset.includes(x.entity.id));
        getPartsProduction(headPlant,assetList,{From: RangeFrom, To:RangeTo},val,PerPage,0,aggregateParts) 
        setFilterOpt(val)
        setAnchorEl(null)
        setopenParts(!openParts)

    }
    const handleAggregateParts = (e) =>{
        setDataLoading(true);
        if(e.target.value > 1){ 
            setFilterOpt("all");
        } 
        setPage(0)     
        SetTableDataTotal([]) 
        const assetList = oeeAssetsArray.filter(x=>downtimeAsset.includes(x.entity.id));
        getPartsProduction(headPlant,assetList,{From: RangeFrom, To:RangeTo},filterOpt,PerPage,0,e.target.value) 
        setAggregateParts(e.target.value)        
    }
    const handleRejectDialogClose = (e)=>{
        setRejectDialog(false)
        setReasonID('');
        setReasonTypeID('');
    }
    const rejectParts = () => { 
        getAddQualityDefects(rejectObj,reasonID,currUser.id,descriptionRef.current && descriptionRef.current.value?descriptionRef.current.value:"",headPlant.id)
    } 
    const handleReasonType = (e) =>{
        getReason(e.target.value)
        setReasonTypeID(e.target.value);
    }   
    const handleReason = (e) =>{
        setReasonID(e.target.value)
    }
    const revertPartsDialog = (id,val)=>{
        setDefectName(val.reason);
        setDefectID(val.rejected_id);
        setDeleteDialog(true);
    }

    function onChangePage(e,perpage){
        
        if((filterOpt !== 'rejected') && (aggregateParts===1)){
            const assetList = oeeAssetsArray.filter(x=>downtimeAsset.includes(x.entity.id));
            SetTableDataTotal([])
            setDataLoading(true);
            getPartsProduction(headPlant,assetList, {From: RangeFrom, To:RangeTo},filterOpt,perpage,e,aggregateParts) 
        }
        
        setPage(e)
        setPerPage(perpage)
        setAggreChange(perpage)
    }

    const popperOption=[{id: "all",name:"All"},{id: "approved",name:"Approved"},{id: "rejected",name:"Rejected"}]

    function headCellFnc(){
        if(aggregateParts===2){
            return aggregateCells
        }else if(aggregateParts === 3){
            return aggregateShiftCells
        }else{return headCells}
    }

    return (
        <div>
            <div  >
               
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12}>
                    {dataLoading && <CircularProgress style={{ float: 'right'}} disableShrink size={15} color="primary" />}
                        <div style={{ float: "right", width: "10%",padding:"8px 16px 8px 0px" }}>
                        <div className="flex items-center gap-2">
                            <Button type="ghost" icon={Filter}  onClick={handleClick}  />
                        <ListNDL 
                            options={popperOption}  
                            Open={openParts} 
                            optionChange={filterParts}
                            keyValue={"name"}
                            selectedOpt={[{id:filterOpt}]}
                            keyId={"id"}
                            id={"popper-Parts"}
                            onclose={handleClose}
                            anchorEl={anchorEl}
                            width="120px"
                        />
                        <div style={{width: '140px'}}>
                        <SelectBox
                            labelId="assetSelect-label"
                            id="assetSelect"
                            auto={false}
                            multiple={false}
                            options={aggregateList}
                            isMArray={true}
                            checkbox={false}
                            value={aggregateParts}
                            onChange={(e)=>handleAggregateParts(e)}
                            keyValue="name"
                            keyId="id"
                            dynamic={AggreChange}
                        />
                        </div>
                    </div>
                        </div>
                       
                            <EnhancedTable
                                headCells={headCellFnc()}
                                data={tableDataTotal}
                                rawdata={partProductionData ? partProductionData.Data : partProductionData}
                                search={true}
                                download={true}
                                actionenabled={(enableactions && aggregateParts===1) ? true : false}
                                handleDelete={(id, value) => handleDeleteDialog(id, value)}
                                enableDelete={aggregateParts===1?true:false}
                                disableddelete={disableDelete}
                                enableButton="Revert"
                                buttontype="ghost"
                                handleCreateTask={revertPartsDialog}
                                disabledbutton={revertPart}
                                rowsPerPage={PerPage}
                                PerPageOption={[10,50,100]}
                                onPageChange={onChangePage}
                                page={Page}
                                serverside={((filterOpt !== 'rejected') && (aggregateParts===1)) ?  true : false}
                                count={(partProductionData && (tableDataTotal.length>0)) ? partProductionData.count : 0}
                                verticalMenu={true}
                                        groupBy={'quality_report'}
                                        heading={"Quality Details"}
                            />
                            <ConfirmDelete
                                deleteDigalog={deleteDigalog}
                                handleDeleteDialogClosefn={() => handleDeleteDialogClose()}
                                defectName={defectName}
                                triggerDeleteDefectsfn={() => triggerDeleteDefects()}
                            />
                        </Grid>
                    </Grid>
            </div>
            <Dialog onClose={handleRejectDialogClose} maxWidth={"xs"} open={rejectDialog}>
                <DialogTitle >
                 <ParagraphText  variant='heading-02-xs' value={t("RejectAPart")} />
                    </DialogTitle>
                <DialogContent > 
                        <SelectBox
                            labelId="assetSelect-label"
                            label={t("Reason Type")}
                            id="assetSelect"
                            auto={false}
                            multiple={false}
                            options={!reasonTypeLoading && !reasonTypeError && reasonTypeData && reasonTypeData.length > 0 ?reasonTypeData.filter(x=>x.id===2):[]}
                            isMArray={true}
                            checkbox={false}
                            value={reasonTypeID}
                            onChange={handleReasonType}
                            keyValue="reason_type"
                            keyId="id"
                        /> 
                        <div className="mb-3" />
                        <SelectBox
                            labelId="assetSelect-label"
                            label={t("Reasons")}
                            id="assetSelect"
                            auto={false}
                            multiple={false}
                            options={!ReasonListLoading && !ReasonListError && ReasonListData && ReasonListData.length>0?ReasonListData:[]}
                            isMArray={true}
                            checkbox={false}
                            value={reasonID}
                            onChange={handleReason}
                            keyValue="reason"
                            keyId="id"
                        /> 
                        <div className="mb-3" />

                    <TextField
                        id="title"
                        label={t("Description")}
                        inputRef={descriptionRef}
                        placeholder={t("Enter a description")}
                    
                    />
                </DialogContent>
                <DialogActions>
                    <Button type="secondary" value={t('Cancel')} onClick={handleRejectDialogClose} />
                    <Button type="primary" danger value={t("Reject")} onClick={rejectParts} />
                </DialogActions>
            </Dialog>
        </div>
    )
}