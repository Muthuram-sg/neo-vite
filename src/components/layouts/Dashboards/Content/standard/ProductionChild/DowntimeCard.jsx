/* eslint-disable array-callback-return */
import React, { useRef, useState,useEffect } from 'react';
import CircularProgress from "components/Core/ProgressIndicators/ProgressIndicatorNDL"; 
import { useRecoilState } from "recoil";
import { selectedPlant} from "recoilStore/atoms";
import { useTranslation } from 'react-i18next';
import moment from 'moment';  
import DowntimeCardList from './DowntimeCardList';
 import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import KpiCards from "components/Core/KPICards/KpiCardsNDL" 
import TypographyNDL from "components/Core/Typography/TypographyNDL"; 
// import DowntimeModalDialog from './DowntimeModal';
import LiveDowntimeModal from './LiveDowntimeModal';
import Download from 'assets/neo_icons/Menu/DownloadSimple.svg?react';  
import ButtonNDL from 'components/Core/ButtonNDL';
import ModalNDL from 'components/Core/ModalNDL';
import * as XLSX from 'xlsx'; // Importing XLSX for Excel download functionality

function DowntimeCardFunction(props) { 
    const [headPlant] = useRecoilState(selectedPlant);
    const { t } = useTranslation(); 
    // const downtimeModalRef = useRef();
    const [reasonDialog, setReasonDialog] = useState(false);
    const [downTimeFilter,setdownTimeFilter]= useState('showall')
    const [resultArray,setresultArray] = useState([]) 
    const [DowntimeLive,setDowntimeLive] = useState(false);
    const [LiveData, setLiveData] = useState('')  
    
    // const [modaldisplay,setmodaldisplay] = useState(false);
    let count = 0

    // useEffect(()=>{
    //     setmodaldisplay(false)
    //     setTimeout(()=>{setmodaldisplay(true)},500)
    // },[props.oeeConfigData,headPlant])

    useEffect(()=>{
        // console.log(resultArray,"resultArrayresultArray",props,props.ProdGroupRange,DowntimeLive)
        if(resultArray.length === 0 && (props.ProdGroupRange === 19 || props.ProdGroupRange === 11 || props.ProdGroupRange === 6)){
            setDowntimeLive(false)
            setLiveData('') 
        }else if((props.ProdGroupRange !== 19 && props.ProdGroupRange !== 11 && props.ProdGroupRange !== 6)){
            setDowntimeLive(false)
            setLiveData('') 
        }
    },[props.ProdGroupRange,resultArray])  

// it is used to filter downtime
    useEffect(()=>{
       const FilteredData = props.assetRawStatus.raw && props.assetRawStatus.raw.length > 0 && !props.assetRawStatus.isLong ? props.assetRawStatus.raw : [] 
    //    console.log(props.assetRawStatus,"FilteredDataFilteredData",props.assetRawStatus.isLong,props.ProdGroupRange,FilteredData,props.ProdGroupRange)
       if(!props.loading && !props.assetRawStatus.isLong && props.ProdGroupRange !== 17){
        setresultArray(FilteredData)  
       }else{
        setresultArray([])  
       }
       
       handleFilterChange(downTimeFilter)  
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.assetRawStatus.raw,props.headplantid,props.loading,props.ProdGroupRange])

    
    // reason dialog
    const handleReasonDialogClose = () => {
        setReasonDialog(false);        
    }

   
  
    const openReasonDialog = (value) => {
        props.openReasonDialog(value)
        // try {            
        //     setReasonDialog(true);
        //     setreasonEditData(value)
        //     setTimeout(()=>{
        //         downtimeModalRef.current.openReasonDialog(value)
        //     },200)
        // } catch (err) {
        //     console.log('downtime edit value binding', err)
        // }
    }
    // console.log("props.assetRawStatus",props.assetRawStatus)
    const DTFilertOption = [
        {id:"showall",value:"Show All"},
        {id:"classified",value:"Classified"},
        {id:"unclassified",value:"Unclassified"}
    ]

    const handleFilterChange=(type)=>{

        let filteredData
        if(type === 'classified'){ // it is used to filter classified alarms
         filteredData = props.assetRawStatus.raw && props.assetRawStatus.raw?.length > 0 ? props.assetRawStatus.raw.filter(obj => obj.hasOwnProperty('reason')) : [];
        }else if(type === 'unclassified'){ // it is used to filter unclassified alarms
         filteredData = props.assetRawStatus.raw && props.assetRawStatus.raw?.length > 0 ? props.assetRawStatus.raw.filter(obj => !('reason' in obj)) : [];
        }else{
         filteredData = props.assetRawStatus.raw && props.assetRawStatus.raw?.length > 0 ? props.assetRawStatus.raw : [] 

        }
        setresultArray(filteredData)
        setdownTimeFilter(type)
    }
    const handleExcelDownload = () => {
        // console.log(resultArray,"resultArray",props.reasons,ReasonTagsListData,props.oeeConfigData) 
        // return false
        if (resultArray && resultArray?.length > 0) {
            let SNo = 0 
            const excelfilteredData = resultArray.map((value, index) => {
            
            if (value.value !== "ACTIVE" && value.value !== "Active") {
                let Tagname =  value.reason_tags ? value.reason_tags.map(id => props.ReasonTagsListData.filter(r=> r.id === id)[0].reason_tag ) : []
                let AssetName = props.oeeConfigData[0].instrument.name
                let Classification = value.reason ? props.reasons.filter(f=> f.id === value.reason)[0].prod_reason_type.reason_type : 'UnClassified';
                let Reason = value.reason_name ? value.reason_name : '-';
                let Comments = value.comments ? value.comments : '-';
                let ReasonTag = Tagname?.length>0 ? Tagname.toString() : '-';
                let Endtime = moment(value.next).format("YYYY-MM-DD HH:mm:ss");
                let Starttime = moment(value.time).format("YYYY-MM-DD HH:mm:ss");
                let Duration = secondsToHHMMSS(value) 
                let next = value.next     
                let timediff = parseInt(moment.duration(moment(value.next).diff(moment(value.time))).asSeconds());  
                if(index === 0){
                    let active = props.partsData.filter(e=> moment(moment(e.time).format('YYYY-MM-DDTHH:mm:ss')).isBetween(moment(value.time),moment(value.next)))
                    next = active?.length> 0 ? active[active.length-1].time : next
                    if(props.workExecutionDetails?.length>0){
                        let WOExe = [...props.workExecutionDetails]
                        WOExe.sort((a, b) => new Date(b.jobStart) - new Date(a.jobStart));
                        
                        if(!WOExe[0].ended_at){
                            next = moment(next).format('YYYY-MM-DDTHH:mm:ss') 
                        }
                    }
                    timediff = parseInt(moment.duration(moment(next).diff(moment(value.time))).asSeconds());
                }                       
              if(props.oeeConfigData?.length > 0 && props.oeeConfigData[0].mic_stop_duration > timediff && index === 0){
                  return null
              } 
              count = count+1                  
              SNo = SNo + 1
              return {
                SNo,
                AssetName,
                Starttime,
                Endtime,
                Classification,
                Reason,
                ReasonTag,
                Duration,
                Comments
              };
            }
            return null; // Skip unwanted entries
          }).filter(Boolean);
      
          if (excelfilteredData?.length > 0) {
            downloadExcel(excelfilteredData, "Exported Data Table");
          }
        }
      };
   
      function secondsToHHMMSS(data) {
        let diffsec = moment(data.next).diff(moment(data.time), 'seconds') 
        let hours = Math.floor(diffsec / 3600);
        let minutes = Math.floor((diffsec % 3600) / 60);
        let seconds = diffsec % 60;

        // Add leading zeros if needed
        hours = String(hours).padStart(2, '0');
        minutes = String(minutes).padStart(2, '0');
        seconds = String(seconds).padStart(2, '0');
        
        return hours + ':' + minutes + ':' + seconds;
    }
  

  const downloadExcel = (data, name) => {
    const reportHeader = ["SNo","AssetName","Starttime","Endtime","Duration",
        "Classification",
        "Reason",
        "ReasonTag",
        "Comments"
    ]
    const worksheet = XLSX.utils.json_to_sheet(data, { header: reportHeader}); 

    worksheet['!cols'] = [{wch: 5},{wch: 15},{wch: 20},{wch: 20}, { wch: 8},{wch: 12},{wch: 15},{wch: 15},{wch: 20}]; // Adjusting the width and format of the time column
    const range = XLSX.utils.decode_range(worksheet['!ref']);

    for (let row = range.s.r + 1; row <= range.e.r; ++row) {
        // Format the 'duration' column (index 1) as a time value
        const durationCellAddress = XLSX.utils.encode_cell({ c: 4, r: row });
        if (worksheet[durationCellAddress]) {
            // Convert HH:mm:ss to a time value Excel can sum
            const timeParts = worksheet[durationCellAddress].v.split(':');
            const hours = parseInt(timeParts[0], 10);
            const minutes = parseInt(timeParts[1], 10);
            const seconds = parseInt(timeParts[2], 10);
            const excelTimeValue = (hours / 24) + (minutes / 1440) + (seconds / 86400);

            worksheet[durationCellAddress].v = excelTimeValue;  // Set the value to Excel's time value
            worksheet[durationCellAddress].t = 'n';            // Set type to number
            worksheet[durationCellAddress].z = '[h]:mm:ss';    // Custom time format for summation
        }
    }
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, name + ".xlsx");
  };
   
    return (
        <React.Fragment>
            <KpiCards fitContent >
                
                    <div className='flex  gap-4 justify-between' >
                        <div style={{display:'flex',alignItems:'center'}}>
                            <TypographyNDL  color='secondary' variant="heading-01-xs" value={t("Downtime")} />
                            {props.loading && <div style={{marginLeft:8}}><CircularProgress /></div>}
                            
                        </div>
                        <div className='flex gap-4 items-center min-w-[176px]'>
                        <SelectBox  
                            labelId="downTimeFilter"
                            id="downTimeFilter"
                            auto={false}
                            multiple={false}
                            value={downTimeFilter}
                            options={DTFilertOption}
                            isMArray={true}
                            checkbox={false}
                            onChange={(e)=>handleFilterChange(e.target.value)}
                            keyValue="value"
                            keyId="id"
                            
                        />
                        <ButtonNDL type='ghost' icon={Download} onClick={() => handleExcelDownload()} />
                            </div>
                    </div>
                    <div style={{ marginTop: 10, maxHeight: props.isDryer ? 662 : 426,  height: props.isDryer ? 661 :426,overflow: "auto", padding: 0 }}>
   
                        {resultArray && resultArray.length > 0 ? 
                            resultArray.map((value, index) => {
                                // console.log(value,index,"indexxxx")
                                if (value.value !== "ACTIVE" && value.value !== "Active") {
                                    let next = value.next
                                    let time = parseInt(moment.duration(moment(value.next).diff(moment(value.time))).asSeconds());
                                    if(index === 0){
                                        let active = props.partsData.filter(e=> moment(moment(e.time).format('YYYY-MM-DDTHH:mm:ss')).isBetween(moment(value.time),moment(value.next)))
                                        next = active.length> 0 ? active[active.length-1].time : value.next
                                        if(props.workExecutionDetails?.length>0){
                                            let WOExe = [...props.workExecutionDetails]
                                            WOExe.sort((a, b) => new Date(b.jobStart) - new Date(a.jobStart));
                                            
                                            if(!WOExe[0].ended_at){
                                                next = moment(next).format('YYYY-MM-DDTHH:mm:ss') 
                                            }
                                        }
                                        time = parseInt(moment.duration(moment(next).diff(moment(value.time))).asSeconds());
                                        // console.log(active,"activeactive",next,"next",value.time)
                                        // console.log(index,"indexxxx2",time,props.oeeConfigData[0].mic_stop_duration,value,props.oeeConfigData,active)
                                    }
                                    
                                    if(props.oeeConfigData.length > 0 && props.oeeConfigData[0].mic_stop_duration > time && !value.reason){
                                        return <div key={value.next}></div>
                                    }
                                    let min = time / 60;
                                

                                    let sec = time % 60;

                                    let mMin = min > 0 ? parseInt(min) + "m " : ""

                                    let mSec = sec > 0 ? parseInt(sec) + "s" : ""

                                    let finalTimeDiff = min === 0 && sec === 0 ? "0s" : mMin + mSec
                                    // console.log(finalTimeDiff,"finalTimeDifffinalTimeDiff",time,index,next,value.time)
                                    count = index 

                                        return (
                                            <DowntimeCardList
                                                key={value.time}
                                                roleid={props.currUserRole}
                                                finalTimeDiff={finalTimeDiff}
                                                time={value.time}
                                                next={next}
                                                value={value.value}
                                                openReasonDialog={openReasonDialog}
                                                reasonArray={props.reasons}
                                                reason={value.reason}
                                                comment={value.comments}
                                                outageid={value.outageid}
                                                reason_tags={value.reason_tags?value.reason_tags:[]}
                                                ProdGroupRange={props.ProdGroupRange}
                                                index={count}
                                                workExecutionDetails={props.workExecutionDetails}
                                                partsData={props.partsData}
                                                LiveDowntime={(e,data)=>{setDowntimeLive(e);setLiveData(data)}}
                                                Partloading={props.Partloading}
                                                isLong={props.assetRawStatus.isLong}
                                                isPlanned={value.isPlanned}
                                            />
                                        ); 
                                    
                                }
                            }) 
                        :
                            // <KpiCards style={{ height: "100%", backgroundColor: curTheme === 'light' ? "#FFFFFF" : "#1D1D1D" }}>
                                <div  className='flex flex-col items-center justify-center text-center p-4' >
                                     <br></br>
                                        <br></br>
                                        <br></br>
                                        <br></br>
                                    {
                                       downTimeFilter === "classified" && resultArray.length === 0 ? 
                                       <TypographyNDL variant="paragraph-s" value={t("No Downtime Classified")} />
                                       :
                                       <TypographyNDL variant="paragraph-s" value={t("nodtevent")} />

                                    }
                                 
                                </div>
                            // </KpiCards>
                        } 
                    </div>
            </KpiCards>
            {/* <ModalNDL onClose={handleReasonDialogClose} maxWidth={"xs"} open={reasonDialog}>
            <DowntimeModalDialog
            handleReasonDialogClose={handleReasonDialogClose}
            reasonDialog={reasonDialog}
            ref={downtimeModalRef}
            headplantid={props.headplantid}
            treiggerOEE={props.treiggerOEE}
            entity_id={props.entity_id}
            userid={props.userid}
            outGRData={outGRData}
            ReasonTagsListData={ReasonTagsListData} 
            />
            </ModalNDL>  */}
            <LiveDowntimeModal openModal={DowntimeLive} data={LiveData}  
            // dialogclose={(e)=>setDowntimeLive(e)}
            /> 
            
        </React.Fragment>
    )
}
 
export default DowntimeCardFunction;
