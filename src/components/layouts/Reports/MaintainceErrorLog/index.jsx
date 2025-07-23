import React,{useState,useEffect} from 'react';
import Grid from 'components/Core/GridNDL'  
import { useRecoilState } from "recoil";
import moment from 'moment';    
import EnhancedTable from "components/Table/Table";
import useMaintainceLog from "components/layouts/Reports/MaintainceErrorLog/hooks/useMaintainceLog";
import {stdReportAsset,customdates,selectedPlant  } from "recoilStore/atoms";
import { useTranslation } from 'react-i18next';



export default function MaintenanceErrorLogs(){
const { t } = useTranslation();
const [tableDataTotal, SetTableDataTotal] = useState([]);
const {  outMaintainceData,  getMaintainceLogdata } = useMaintainceLog();
const [selectedAsset] = useRecoilState(stdReportAsset);
const [customdatesval,] = useRecoilState(customdates); 
const [headPlant,] = useRecoilState(selectedPlant);



useEffect(() => {
  callmaintaincelogfn()
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [selectedAsset, customdatesval])

const callmaintaincelogfn=()=>{
  let selectedDate = moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ssZ")
        let to = moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ssZ")
        

        getMaintainceLogdata(headPlant.id, selectedDate, to)
}
useEffect(() => {
  processedrows();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [outMaintainceData])
const columns = [
    {
      id: "LineID",
      numeric: false,
      disablePadding: false,
      label: t("Line"),
      
    },{
      id: "AssetID",
      numeric: false,
      disablePadding: false,
      label: t("Asset"),
      
    },
    {
      name: "Description",
      numeric: false,
      disablePadding: false,
      label: t("Description"),
    },
    {
      id: "CreatedOn",
      numeric: false,
      disablePadding: false,
      label: t("Created On"),    
    },
    {
      id: "CreatedBy",
      numeric: false,
      disablePadding: false,
      label: t("Created By"),
     }
  ];


const processedrows = () => {
  let temptabledata = []
  if (outMaintainceData) {
      temptabledata = temptabledata.concat(outMaintainceData.map((val, index) => {
          return [val.line.name, val.entity.name,val.log, moment(val.created_ts).format('DD/MM/YYYY HH:mm:ss') ,val.user.name]
      })
      )
  }
  SetTableDataTotal(temptabledata)
}  
return( 
    <Grid container style={{padding:"16px"}} > 
        <Grid item xs={12}>
            <EnhancedTable
                 headCells={columns}
                 data={tableDataTotal}
                 rawdata={outMaintainceData}
                 search={true}
                 download={true}
                 actionenabled={false} 

                />
               
        </Grid>            
    </Grid> 
)
}
