import React, { useState, useEffect,useRef } from "react"; 
import { useRecoilState } from "recoil";
import { currentUserRole, selectedPlant, user, snackToggle, snackMessage, snackType } from "recoilStore/atoms";  
import useGeneratedReport from 'components/layouts/Reports/hooks/useGeneratedReport';  
import useDownloadReport from 'components/layouts/Reports/hooks/useDownloadReport'; 
import useReportDelete from 'components/layouts/Reports/hooks/useReportDelete';  
import moment from 'moment'; 
import { useTranslation } from 'react-i18next';
import { useAuth } from "components/Context";
import Typography from "components/Core/Typography/TypographyNDL"
import Status from "components/Core/Status/StatusNDL";
import Button from "components/Core/ButtonNDL";  
import Delete from 'assets/neo_icons/NewReportIcons/btn_delete.svg?react';
import Cancel from 'assets/neo_icons/NewReportIcons/cancel_cross.svg?react';


 

export default function GeneratedReport() {
  const { t } = useTranslation();
  const { HF } = useAuth();
  const [headPlant] = useRecoilState(selectedPlant); 
  const [currUserRole] = useRecoilState(currentUserRole);
  const [currUser] = useRecoilState(user);  
  const [,setTableData] = useState([]); 
  const [, setOpenSnack] = useRecoilState(snackToggle);
  const [, setSnackMessage] = useRecoilState(snackMessage);
  const [, setSnackType] = useRecoilState(snackType);
  const { GeneratedReportLoading, GeneratedReportData, GeneratedReportError, getGeneratedReport } = useGeneratedReport();
  const { DownloadReportLoading, DownloadReportData, DownloadReportError, getDownloadReport } = useDownloadReport();
  const { ReportDeleteLoading, ReportDeleteData, ReportDeleteError, getReportDelete } = useReportDelete(); 
  

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
    getGeneratedReport(headPlant.id,currUser.id)
  }, 60000);

  useEffect(() => {  
    getGeneratedReport(headPlant.id,currUser.id)
   // eslint-disable-next-line react-hooks/exhaustive-deps
   },[headPlant])




   useEffect(()=>{
        if (!DownloadReportLoading && !DownloadReportError && DownloadReportData) { 
          if(DownloadReportData === 'success'){
            setSnackMessage(t("Report Downloaded successfully"));
            setSnackType("success");
            setOpenSnack(true);
          }else{
            setSnackMessage(t("Problem in download this report"));
            setSnackType("error");
            setOpenSnack(true);
          }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[DownloadReportLoading, DownloadReportData, DownloadReportError])

    useEffect(()=>{
      if (!ReportDeleteLoading && !ReportDeleteError && ReportDeleteData) { 
         if(ReportDeleteData.type === 'refresh'){
              getGeneratedReport(headPlant.id,currUser.id)
         }else{ 
              getGeneratedReport(headPlant.id,currUser.id) 
              setSnackMessage(t("Report Deleted successfully")); 
              setSnackType("success");
              setOpenSnack(true);
         }  
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ReportDeleteLoading, ReportDeleteData, ReportDeleteError])


 
  useEffect(()=>{
    processedrows() 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[GeneratedReportLoading, GeneratedReportData, GeneratedReportError])

  const processedrows = () =>{
    let temptabledata = []
    if (GeneratedReportData && GeneratedReportData.length > 0) {
      var Idarry = []
      // eslint-disable-next-line array-callback-return
      GeneratedReportData.map((val)=>{
        let diff = moment().diff(moment(val.created_at),'months');
        if(diff > 3){
          Idarry.push(val.id)
        }
      })
      if(Idarry.length > 0){
        getReportDelete(Idarry,"refresh")
      }
      temptabledata=temptabledata.concat(GeneratedReportData.map((val, index) => {
          return [val.report.name,moment(val.start).format("YYYY-MM-DD "+HF.HMS),moment(val.end).format("YYYY-MM-DD "+HF.HMS),val.report_gen_status_master.title,moment(val.created_at).format("YYYY-MM-DD "+HF.HMS),val.status
          ,val.id]
      })
      )
    }
    setTableData(temptabledata)  
  } 

  const handleDownload = (id,value ) => {
    if(value.status === 2){
      getDownloadReport(value.report.name ? value.report.name : "Reports",value.id) 
    }else{
      setSnackMessage(t("Unable to Download report in this status"));
      setSnackType("warning");
      setOpenSnack(true);
    } 
  }; 

  const handleDeleteDialogOpen = (id,value ) => {
    if(value.status >= 2){
      getReportDelete(value.id)
    }else if(value.status === 0){
      getReportDelete(value.id)
    }else{
      setSnackMessage(t("Unable to Delete Report in this status"));
      setSnackType("warning");
      setOpenSnack(true);
    } 
  };  
 
  return (
    <div className="p-4 w-[500px] min-h-[400px]" >
     

      {
        GeneratedReportData && GeneratedReportData.length > 0 ? 
      GeneratedReportData.map((x,index)=>{
        console.log("xcreated_at",x.created_at)
          return(
            <React.Fragment key={index}>
              <div className="h-[68px] border-b mb-4  border-Border-border-50">
              <div className="flex items-center justify-between">
                <div className="flex flex-col  justify-start  gap-0.5">
                  <Typography value={x.report && x.report.name ? x.report.name : '-'} variant="label-01-s" />
                  <Typography mono color="secondary" value={`${moment(x.start).format("DD/MM/YYYY")}-${moment(x.end).format("DD/MM/YYYY")}`} variant="paragraph-xs" />
                  <Typography mono color="tertiary" variant="paragraph-xs">
                   Generated at {moment(x.created_at).format("HH:mm:ss DD/MM/YYYY")}
                  </Typography>

                </div>
                <div className="flex items-center gap-4">
                  {
                    x.status === 0 ? 
                        <React.Fragment>
                          <Status
                            name={'Queued'}
                            colorbg={'neutral'}
                            lessHeight
                          />
                          {
                            currUserRole.id === 2 &&
                            <Button icon={Cancel} danger type="ghost" onClick={() => handleDeleteDialogOpen(x.id, x)} />
                          }

                        </React.Fragment>
                    :x.status === 1 ? 
                    <Status
                        name={'Generating'}
                        colorbg={'neutral'}
                        lessHeight
                    />
                    :x.status === 3 ?
                    <React.Fragment>
                    <Status
                    name={'failed'}
                    colorbg={'error'}
                    lessHeight
                />
                {
                  currUserRole.id === 2 && 
                  <Button icon={Delete} danger type="ghost" onClick={()=>handleDeleteDialogOpen(x.id,x)} />
                    }
                    </React.Fragment>
                    :
                  <React.Fragment>
<Button value="Download" type="ghost" onClick={()=>handleDownload(x.id,x)} />
  {
currUserRole.id === 2 && 
<Button icon={Delete} danger type="ghost" onClick={()=>handleDeleteDialogOpen(x.id,x)} />
  }
                  </React.Fragment>
                  
                  }
                  


                </div>


              </div>
              </div>
            </React.Fragment>
          )
        })

        :
        <div className="flex items-center justify-center h-[50vh]">
        {  GeneratedReportLoading ?
      <Typography  color="secondary" value={"Loading..."} variant="paragraph-xs" />
      :
      <Typography  color="secondary" value={"No active reports are currently being generated in bulk."} variant="paragraph-xs" />
      }
        </div>
       
      }
        
     
    </div>
  );
}
