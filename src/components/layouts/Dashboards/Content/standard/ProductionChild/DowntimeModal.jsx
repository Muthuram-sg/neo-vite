import React,{useRef,useState,forwardRef,useImperativeHandle,useEffect} from 'react';

import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import Button from "components/Core/ButtonNDL"
import InputFieldNDL from "components/Core/InputFieldNDL";
import { useTranslation } from 'react-i18next';
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import CustomSwitch from "components/Core/CustomSwitch/CustomSwitchNDL";
import RadioNDL from 'components/Core/RadioButton/RadioButtonNDL'; 
import DatePickerNDL from "components/Core/DatepickerNDL";
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import moment from 'moment';
import useReasonslistbyType from "components/layouts/Reports/DowntimeReport/hooks/useReasonslistbyType.jsx"; 
// import useReasonTypeList from "../../../../../../Hooks/useReasonTypeList"; 
import useEditDowntime from '../hooks/useEditDowntime';
import useAddDowntime from '../hooks/useAddDowntime';
import { useRecoilState } from "recoil";
import { adddtreasondisbale, snackMessage, snackType, snackToggle} from "recoilStore/atoms";
import useGetProdOutage from "components/layouts/Reports/DowntimeReport/hooks/useGetProdOutage"
import Grid from 'components/Core/GridNDL' 

const DowntimeModalDialog = forwardRef((props,ref)=>{
    const {t} = useTranslation(); 
    let reasonDescRef = useRef();
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [CommentsRmk,setCommentsRmk] = useState('')
    const [reasontagNames, setReasonTagNames] = useState([])
    const [reasonID, setReasonID] = useState(0)
    const [reasontagID, setReasonTagID] = useState([])
    const [ReasonList, setReasonList] = useState([]);
    const [reasonStart, setReasonStart] = useState(null);
    const [ActualStart,setActualStart] = useState(null);
    const [ActualEnd,setActualEnd] = useState(null);
    const [reasonStartExtend, setReasonStartExtend] = useState(false);
    const [reasonEnd, setReasonEnd] = useState(null);
    const [reasonEndExtend, setReasonEndExtend] = useState(false);
    const [downtimeObj, setDowntimeObj] = useState({});
    const [ReasonTagList, setReasonTagList] = useState([]);
    const [selectedreasontype, setselectedreasontype] = useState('') 
    const [prodReasonType,setprodReasonType]=useState([]) 
    const [ splitDownTime,setsplitDownTime] = useState(true)
    const [isEdit,setEdit] = useState(false)
    const [outageID,setOutageID] = useState('');     
    const [,setalarmicondisable]  = useRecoilState(adddtreasondisbale)    
    // const { reasonTypeLoading, reasonTypeData, reasonTypeError, getReasonTypeList } = useReasonTypeList();
    const {  EditDowntimeLoading, EditDowntimeData, EditDowntimeError, getEditDowntime } = useEditDowntime();
    const {  AddDowntimeLoading, AddDowntimeData, AddDowntimeError, getAddDowntime } = useAddDowntime();  
    const { outlistbytypeLoading, outlistbytypeData, outlistbytypeError, getReasonListbyTypes } = useReasonslistbyType();
    const { productoutagelistLoading, productoutagelistdata, productoutagelisterror, getProductOutageList } = useGetProdOutage()
    useImperativeHandle(ref,()=>({
        openReasonDialog : (value)=>openReasonDialog(value)
    })) 
    
    useEffect(()=>{
        // getReasonTagsbyLine(props.headplantid)
        // getReasonTypeList();  
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.headplantid])
    useEffect(() => {
        if (!EditDowntimeLoading && EditDowntimeData && !EditDowntimeError) {
            props.treiggerOEE();
            emptyCurrentState();
            SetMessage(t('Edited a downtime '))
            SetType("success")
            setOpenSnack(true);
            props.handleReasonDialogClose();
            setDowntimeObj({})
        }
        if (!EditDowntimeLoading && !EditDowntimeData && EditDowntimeError) {
            SetMessage(t('Downtime edit failed'))
            SetType("warning")
            setOpenSnack(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [EditDowntimeData])
    useEffect(() => {
        // console.log(AddDowntimeData,"AddDowntimeDataAddDowntimeData")
        if (!AddDowntimeLoading && AddDowntimeData && !AddDowntimeError) {
            props.treiggerOEE();
            emptyCurrentState();
            props.handleReasonDialogClose();
            SetMessage(t('Added a new Downtime '))
            SetType("success")
            setOpenSnack(true);
            
            setDowntimeObj({})
        }
        // if (!AddDowntimeLoading && !AddDowntimeData && AddDowntimeError) {
        //     SetMessage(t('Failed to add the downtime '))
        //     SetType("warning")
        //     setOpenSnack(true);
        // }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [AddDowntimeData])

    // useEffect(() => {
    //     if (!reasonTypeLoading && reasonTypeData && !reasonTypeError) {
    //         setprodReasonType(reasonTypeData.filter(x => (x.id === 3) || (x.id === 17)))
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [reasonTypeLoading, reasonTypeData, reasonTypeError])

    useEffect(() => {
        // console.log(props.reasonTypeData,"props.reasonTypeData")
        if (props.reasonTypeData) {
            setprodReasonType(props.reasonTypeData.filter(x => (x.id === 3) || (x.id === 17)))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.reasonTypeData])


    useEffect(() => {
        if (outlistbytypeData && !outlistbytypeLoading && !outlistbytypeError) {
            setReasonList(outlistbytypeData)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[outlistbytypeData]);
    
    // excute notification with dynamic content
    const openNotification = (content, type) => {
        SetMessage(content); SetType(type); setOpenSnack(true);
    }
 
    const openReasonDialog = (value) =>{
        try {
            // console.log(value,"DowntimeModalDialog")
            setActualStart(new Date(value.time))
            setActualEnd(value.next ? new Date(value.next) : null)
            setReasonStart(new Date(value.time));
            setReasonEnd(value.next ? new Date(value.next) : null);
            if (value.reason && value.reason.length > 0) {
                handleReasontype(value.reason[0].reason_type_id)
                handleReason(value.reason[0].id)
                bindReason(value.reason_tags)
                setCommentsRmk(value.comment ? value.comment : '')
                setOutageID(value.outageid);
                setEdit(true);
            } else {
                setEdit(false)
            }
            setDowntimeObj(value)
        } catch (err) {
            console.log('downtime edit value binding', err)
        }
    }
    const handleReasonTag = (e) => {
        setReasonTagID(e.map(x=>x.id))
        setReasonTagNames(e)

    }
    const handledialogClose = () =>{
        emptyCurrentState()
        props.handleReasonDialogClose()
    }
    const emptyCurrentState = () =>{
        setReasonStart(new Date());
        setReasonEnd(new Date());
        setReasonStartExtend(false);
        setReasonEndExtend(false);
        setselectedreasontype(0)
        setReasonID('');
        setReasonTagID([]);
        setReasonTagNames([]);
        setOutageID('');
        setDowntimeObj({})
    }
    const handleReasontype = (value) => {
        setselectedreasontype(Number(value))
        getReasonListbyTypes(value)
       
        setReasonID('');
        setReasonTagID([]);
        setReasonTagNames([]);
    }
    const changeReasonStart = (e) => {
        const value = moment(e);
        const start = moment(downtimeObj.time);
        const end = moment(downtimeObj.next);
        if (value.isBefore(start) || value.isAfter(end)) {
            setReasonStartExtend(true);
        } else {
            setReasonStartExtend(false);
        }
        setReasonStart(e);
    }
    const changeReasonEnd = (e) => {
        const value = moment(e);
        const start = moment(downtimeObj.time);
        const end = moment(downtimeObj.next);
        if (value.isBefore(start) || value.isAfter(end)) {
            setReasonEndExtend(true);
        } else {
            setReasonEndExtend(false);
        }
        setReasonEnd(e);
    }
    const createDownTime = () => {
        const currentStart = moment(reasonStart);
        const currentEnd = moment(reasonEnd);
        const actualStart = moment(downtimeObj.time);
        const actualEnd = moment(downtimeObj.next);
        
        if (!reasontagID) {
            openNotification('Please select a reason tag', 'warning');
            return;
        }
        if (!reasonID) {
            openNotification('Please select a reason', 'warning');
            return;
        }
        if (currentStart.isBefore(actualStart) || currentStart.isAfter(actualEnd)) {
            openNotification('Start time is exceeds', 'warning');
            return;
        }
        if (currentEnd.isBefore(actualStart) || currentEnd.isAfter(actualEnd)) {
            openNotification('End time is exceeds', 'warning');
            return;
        }
        // const downtimeDesc = reasonDescRef.current ? reasonDescRef.current.value : "";
        const stDate = new Date(reasonStart).toISOString();
        const eddate = reasonEnd ? new Date(reasonEnd).toISOString() : null; 
        setalarmicondisable(true)
        getAddDowntime({start_dt: moment(stDate).format("YYYY-MM-DDTHH:mm:ssZ"), end_dt: moment(eddate).format("YYYY-MM-DDTHH:mm:ssZ"), entity_id: props.entity_id, reason_id: reasonID, comments: CommentsRmk, user_id: props.userid, line_id: props.headplantid,reason_tags: "{" + reasontagID.toString() + "}" })
        setsplitDownTime(true)
        props.treiggerOEE();
        emptyCurrentState();
        props.handleReasonDialogClose();
        SetMessage(t('Added a new Downtime '))
        SetType("success")
        setOpenSnack(true);
    } 
    useEffect(()=>{
        if(!productoutagelistLoading && productoutagelistdata && !productoutagelisterror){
            if(productoutagelistdata.Data.length > 0){
            SetMessage(t("Already Exist"))
            SetType("warning")
            setOpenSnack(true);
            props.treiggerOEE();
            emptyCurrentState();
            props.handleReasonDialogClose();
            setDowntimeObj({})
              }
              else{
             createDownTime()
              }
        }

    },[productoutagelistLoading, productoutagelistdata, productoutagelisterror])
    const editDowntime = () => {
        getEditDowntime({ id: outageID, comments: reasonDescRef.current.value, end_dt: reasonEnd, start_dt: reasonStart, reason_tags: "{" + reasontagID.toString() + "}", reason_id: reasonID })
        setsplitDownTime(true) 
    }
    const bindReason = (tags) => {
        const tagID = [];
        const tagReason = [];
        if (tags && tags.length > 0) {
            tags.map(a => {
                let arr = props.ReasonTagsListData.length > 0 ? props.ReasonTagsListData.filter(x => x.id === a) : []
                if (arr.length > 0) {
                    tagID.push(arr[0].id);
                    tagReason.push(arr[0])
                }
            })
        }
        setReasonTagID(tagID)
        setReasonTagNames(tagReason)
    }
    
    const handleReason = (value) => {
       
        setReasonID(value);
        if (props.outGRData && props.outGRData.length > 0) {
            let Taglist = props.outGRData.filter(x => x.id === value)[0].reason_tag
            let Tagarr = [] 
            Taglist.map((val) => {
                let arr = props.ReasonTagsListData.length > 0 ? props.ReasonTagsListData.filter(x => x.id === val) : []
                if(arr.length > 0){
                    Tagarr.push(arr[0])
                } 
            })
            // console.log(Tagarr,Taglist,ReasonTagsListData,"ReasonTagsListData")
            setReasonTagList(Tagarr)
        }
    }


    const ButtonClick =()=>{
        if(AddDowntimeLoading){
              return ''
        }else{
            if(isEdit){
                editDowntime()
            }else{
                getProductOutageList(moment(reasonStart).format('YYYY-MM-DDTHH:mm:ssZ'),moment(reasonEnd).format('YYYY-MM-DDTHH:mm:ssZ'),props.entity_id)
            }
        }

    }
    return (
        <React.Fragment>
        {/* <ModalNDL onClose={props.handleReasonDialogClose} maxWidth={"xs"} open={props.reasonDialog}> */}
            <ModalHeaderNDL>
                                    <TypographyNDL value={isEdit?"Edit Downtime":"Classify Downtime"} variant='heading-02-xs' />
                
                {/* <div id="reject-reaon-dialog-title" style={{fontSize: 20, fontFamily: 'Inter', fontWeight: '600', wordWrap: 'break-word'}} onClose={props.handleReasonDialogClose}>{isEdit?"Edit Downtime":"Classify Downtime"}</div> */}
            </ModalHeaderNDL>
            <ModalContentNDL >
                
                <div style={{display:'flex',justifyContent:"space-around"}}>
                    
                {
                        prodReasonType && prodReasonType.length > 0 && prodReasonType.map((value,key)=>{
                            return(
                                <RadioNDL key={value.id} name={value.reason_type} labelText={value.reason_type} id={value.id} checked={selectedreasontype === value.id} onChange={()=>handleReasontype(value.id)}/>

                            )
                        })
                } 
                </div>
                    
                
              <Grid container spacing={2} >
                <Grid item xs={6} >
                <div style={{ marginBottom: 10 }}>
                        <TypographyNDL value={t("Starting Time")}></TypographyNDL>
                        <DatePickerNDL
                            id="work-start-date"
                            onChange={(dates) => {
                                changeReasonStart(dates);
                            }} 
                            startDate={reasonStart}
                            dateFormat={"HH:mm:ss"}
                            customRange={false}
                            showTimeSelect={true} 
                            timeFormat="HH:mm:ss"
                            placeholder={t("Start Date")}
                            disabled={!splitDownTime ? true : false}
                            showTimeSelectOnly
                            minTime={new Date(ActualStart)}
                            maxTime={new Date(moment(new Date(reasonEnd ? reasonEnd : ActualEnd)).subtract(1,'minutes').format('YYYY-MM-DDTHH:mm:ss'))} 
                        />
                            
                        {reasonStartExtend && <span style={{ color: 'red', fontSize: '12px' }}>Time is exceeds</span>}
                    </div>
                </Grid>
                <Grid item xs={6} >
                <div style={{ marginBottom: 10 }}>
                        <TypographyNDL value={t("Ending Time")}></TypographyNDL>
                        <DatePickerNDL
                            id="work-end-date"
                            onChange={(dates) => {
                                changeReasonEnd(dates);
                            }} 
                            startDate={reasonEnd}
                            dateFormat={"HH:mm:ss"}
                            customRange={false}
                            showTimeSelect={true} 
                            timeFormat="HH:mm:ss"
                            placeholder={t("Start Date")}
                            disabled={!splitDownTime ?  true : false}
                            showTimeSelectOnly
                            minTime={new Date(moment(new Date(reasonStart ? reasonStart : ActualStart)).add(1,'minute').format('YYYY-MM-DDTHH:mm:ss'))}
                            maxTime={new Date(ActualEnd)} 
                        />
                            
                        {reasonEndExtend && <span style={{ color: 'red', fontSize: '12px' }}>Time is exceeds</span>}
                    </div>
                    </Grid>
              </Grid>
             
                  
                    
                <CustomSwitch
                    id={'SplitDowntime'}
                    switch={false}
                    checked={splitDownTime}
                    onChange={(e)=>setsplitDownTime(e.target.checked)}
                    primaryLabel={"Split Downtime"}
                />

                <div style={{ marginBottom: 10 }}>
                <SelectBox
                    id="combo-Reason"
                    label={t("Reason")}
                    auto={false}
                    options={ReasonList}
                    onChange={(e)=>handleReason(e.target.value)} 
                    value={reasonID}
                    isMArray={true}
                    keyValue={"reason"}
                    keyId={"id"} 
                    multiple={false} 
                />
                </div>
                    <div style={{ marginBottom: 10 }}>
                <SelectBox
                    id="combo-box-demo"
                    label={t("Reason Tags")}
                    auto={true}
                    options={ReasonTagList}
                    onChange={(e) => handleReasonTag(e)}
                    value={reasontagNames}
                    edit={true}
                    isMArray={true}
                    keyValue={"reason_tag"}
                    keyId={"id"}
                    multiple={true}


                />
                </div>
                    
                <InputFieldNDL 
                    label={t("CommentsRemarks")}
                    maxRows={5}
                    inputRef={reasonDescRef} 
                    onChange={(e)=>setCommentsRmk(e.target.value)}
                    value={CommentsRmk}
                    multiline={true} 
                    placeholder={t("Type here...")}
                />
                
            </ModalContentNDL> 
            <ModalFooterNDL>
                <Button type="secondary" value={t('Cancel')} onClick={handledialogClose} />
                <Button  value={AddDowntimeLoading ? "Loading..." : t("Submit")} onClick={ButtonClick} />
            </ModalFooterNDL>
            </React.Fragment> 
    );
})
const isRender = (prev, next) => {
    return prev.reasonDialog !== next.reasonDialog ? false : true
}
const DowntimeModal = React.memo(DowntimeModalDialog, isRender)
export default DowntimeModal;
