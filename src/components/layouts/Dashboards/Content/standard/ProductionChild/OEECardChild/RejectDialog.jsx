import React,{ useEffect, useRef ,useState} from 'react';
import configParam from "config";
import { useRecoilState } from "recoil";
import {
     customdates
} from "recoilStore/atoms";
import moment from 'moment'; 
import gqlQueries from "components/layouts/Queries"  
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL"; 
import Button from "components/Core/ButtonNDL" 
import InputFieldNDL from "components/Core/InputFieldNDL";
import Grid from 'components/Core/GridNDL'; 
import { useTranslation } from 'react-i18next';
import DatePickerNDL from "components/Core/DatepickerNDL";
import SelectBox from "components/Core/DropdownList/DropdownListNDL"; 


function RejectDialog(props){
    const RejectRef = useRef(); 
    const {t} = useTranslation();
    const [partsReasonList, setPartsReasonList] = useState([]);
    const [rejectionType, setrejectionType] = useState([])
    const [selRejectReason, setSelRejectReason] = useState(''); 
    const [PartsVal,setPartsVal] = useState(''); 
    const [FromDT,setFromDT] = useState(null); 
    const [customdatesval] = useRecoilState(customdates);
    const [ToDT,setToDT] = useState(null); 
    const [Totalparts,setTotalparts] = useState(0); 
    const [BulkRejects,setBulkRejects]= useState([]); 

    useEffect(()=>{
        if(props.rejectPart){
            setPartsVal(props.rejectPart.count)
        } 
        setBulkRejects(props.BulkParts)
        setTotalparts(props.BulkParts.length)
    },[props.rejectPart,props.BulkParts])  

    function handleRejectReasonType(event) {
        setrejectionType(event.target.value)
        configParam.RUN_GQL_API(gqlQueries.getReasonsListbyTypeOnly, { reasonType: event.target.value })
            .then((reason) => {
                if (reason !== undefined && reason.neo_skeleton_prod_reasons && reason.neo_skeleton_prod_reasons.length > 0) {
                    setPartsReasonList(reason.neo_skeleton_prod_reasons)
                } else {
                    setPartsReasonList([]);
                }
            })
    }

    const handleQualReason = (e) => {
        setSelRejectReason(e.target.value);
    }

    const rejectParts=()=>{
        if(!rejectionType){
           props.openNotification('Please select a Reason Type', 'warning');
            return false
        }
        if(!selRejectReason){
            props.openNotification('Please select a Reason', 'warning');
        }
        if(!props.rejectPart){
            if(!PartsVal){
                props.openNotification('Please Enter Quantity', 'warning');
                return false
            }
            // console.log(BulkRejects.slice(0, PartsVal),"Totalpartsbefore",BulkRejects)  
            props.rejectParts(selRejectReason,RejectRef.current ? RejectRef.current.value : "", BulkRejects.slice(0, Number(PartsVal)));
            handleRejectDialogClose()
        }else{
            props.rejectParts(selRejectReason,RejectRef.current ? RejectRef.current.value : "" );
            handleRejectDialogClose()
        }
        
    }
    const handleRejectDialogClose =()=>{
        setrejectionType([])
        setSelRejectReason(0);
        setPartsReasonList([]);
        props.handleRejectDialogClose();
    }

    function PartsRejList(from,to){
        if(from && to){    
            let filterpart = props.BulkParts.filter(f=> moment(moment(f.time).format('YYYY-MM-DDTHH:mm:ss')).isBetween(moment(from), moment(to)) || moment(moment(f.time).format('YYYY-MM-DDTHH:mm:ss')).isSame(from) || moment(moment(f.time).format('YYYY-MM-DDTHH:mm:ss')).isSame(to) )
            setBulkRejects(filterpart)
            setTotalparts(filterpart.length)
            console.log(to,from,"FromDTFromDT",filterpart,props.BulkParts.map(d=> moment(d.time).format('YYYY-MM-DDTHH:mm:ss')),moment(from))
        }
    }

return(
    <React.Fragment>
       
    <ModalHeaderNDL>
    <TypographyNDL variant="heading-02-s" model value={t("RejectAPart")}/>           
    </ModalHeaderNDL>
    <ModalContentNDL >
        <Grid container>
            {!props.rejectPart &&
            <Grid item xs={6}>
                <DatePickerNDL
                    id="rej-start-date"
                    onChange={(dates) => {
                        
                        const dateStr = moment(customdatesval.StartDate).format("YYYY-MM-DD")
                        let timestr = moment(dates).format("HH:mm:ss")
                        let fromat = new Date(dateStr+' '+timestr)
                        // console.log(dates,"Reject a Part",fromat,dateStr,customdatesval.StartDate)
                        setFromDT(fromat);
                        PartsRejList(fromat,ToDT)
                    }} 
                    startDate={FromDT}
                    dateFormat={"HH:mm:ss"}
                    customRange={false}
                    showTimeSelect={true} 
                    timeFormat="HH:mm:ss"
                    placeholder={t("From")}
                    disabled={false}
                    showTimeSelectOnly
                    maxDate={new Date(ToDT ? ToDT : customdatesval.EndDate)} 
                    minDate={new Date(customdatesval.StartDate)}
                    minTime={new Date(customdatesval.StartDate)}
                    maxTime={new Date(ToDT ? ToDT : customdatesval.EndDate)} 
                />
            </Grid>}
            {!props.rejectPart &&
            <Grid item xs={6}>
                <DatePickerNDL
                    id="rej-to-date"
                    onChange={(dates) => {
                        const dateStr = moment(customdatesval.EndDate).format("YYYY-MM-DD")
                        let timestr = moment(dates).format("HH:mm:ss")
                        let fromat = new Date(dateStr+' '+timestr)
                        setToDT(fromat);
                        PartsRejList(FromDT,fromat)
                        
                    }} 
                    startDate={ToDT}
                    dateFormat={"HH:mm:ss"}
                    customRange={false}
                    showTimeSelect={true} 
                    timeFormat="HH:mm:ss"
                    placeholder={t("To")}
                    disabled={false}
                    showTimeSelectOnly
                    maxDate={new Date(customdatesval.EndDate)}
                    minDate={new Date(FromDT ? FromDT : customdatesval.StartDate)}
                    minTime={new Date(FromDT ? FromDT : customdatesval.StartDate)}
                    maxTime={new Date(customdatesval.EndDate)}
                />
            </Grid>}
            <Grid item xs={12}>
                <InputFieldNDL dynamic={Totalparts} onChange={(e)=> {if(Totalparts >= e.target.value){setPartsVal(e.target.value)}}} type='number' value={PartsVal} label={props.rejectPart ? "Parts" : "Enter Quantity"} disabled={props.rejectPart ? true : false} style={{ marginBottom: 10 }} />
                {!props.rejectPart &&
                <TypographyNDL variant="lable-01-s" value={`${"Note : Total parts produced under selected time range is " + Totalparts}`} />}
            </Grid>
            
            <Grid item xs={12}>
                <div style={{ marginBottom: 10 }}>
                    <SelectBox
                        labelId=""
                        id="combo-box-demo"
                        auto={false}
                        multiple={false}
                        label={t('RejectionType')}
                        options={props.filteredArrs && props.filteredArrs.length > 0 ? props.filteredArrs : []}
                        keyValue="reason_type"
                        keyId="id"
                        // inputRef={partsRejectType}
                        value={rejectionType}
                        isMArray={true}
                        onChange={handleRejectReasonType}

                    />
                </div>
            </Grid>

           
            <Grid item xs={12}>
                <div style={{ marginBottom: 10 }}>
                    <SelectBox
                        labelId=""
                        id="combo-box-demo"
                        auto={true}
                        multiple={false}
                        label={t('RejectReason')}
                        options={partsReasonList.length > 0 ? partsReasonList : []}
                        keyValue="reason"
                        keyId="id"
                        // inputRef={partsRejectType}
                        value={selRejectReason}
                        isMArray={true}
                        onChange={handleQualReason}

                    />
                </div>
            </Grid>
            
            <Grid item xs={12}>
            <InputFieldNDL 
                        inputRef={RejectRef}
                        label={"Comments"}
                        id="Comments"
                        multiline
                        maxRows={2}
                        placeholder={t("Type here")}
                    />
               
              
            </Grid>
        </Grid>
    </ModalContentNDL>
     
    <ModalFooterNDL>
        <Button type="secondary" value={t("Cancel")} onClick={handleRejectDialogClose} />
        <Button danger value={t('Reject')} onClick={()=>rejectParts()} color={"#DA1E28"} />
    </ModalFooterNDL> 
    </React.Fragment>
)
}
const isRender = (prev, next) => {
    return prev.rejectDialog !== next.rejectDialog ? false : true
}
const PartRejectDialog = React.memo(RejectDialog, isRender)
export default RejectDialog;