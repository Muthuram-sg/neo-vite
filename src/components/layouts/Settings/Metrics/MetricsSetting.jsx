import React, { useState, useEffect, useRef } from "react"; 
import Grid from 'components/Core/GridNDL' 
import { useRecoilState } from "recoil";
import {  currentUserRole } from "recoilStore/atoms"; 
import EnhancedTable from "components/Table/Table";   
import useMetricsList from "Hooks/useMetricsList"; 
import ModalMetrics from "./MetricsModel";
import { t } from "i18next";
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import TypographyNDL from "components/Core/Typography/TypographyNDL";


export default function MetricsSetting() {  
  const [currUserRole] = useRecoilState(currentUserRole);  
  const [tabledata,setTableData] = useState([]);
  const { metricsListLoading, metricsListData, metricsListError, metricsList } = useMetricsList();
  const dialogRef = useRef();

  useEffect(() => {  
    metricsList()
   // eslint-disable-next-line react-hooks/exhaustive-deps
   },[])

  const headCells = [
    {
      id: 'sno',
      label: 'S.No',
      disablePadding: false,
      width: 100,
  },
    {
      id: 'name',
      numeric: false,
      disablePadding: false,
      label: t('Tag'),
      width:100
    },
    {
      id: 'title',
      numeric: false,
      disablePadding: false,
      label: t('Title'),
      width:100
    },
    {
      id: 'metricDatatype',
      numeric: false,
      disablePadding: false,
      label: t('Metric Data Type'),
      width:150
    },
    {
      id: 'metricUnit',
      numeric: false,
      disablePadding: false,
      label: t('Metric Unit'),
      width:120
    },
    {
      id: 'metricType',
      numeric: false,
      disablePadding: false,
      label: t('Metric Type'),
      width:120
    },
    {
      id: 'instrumentCategory',
      numeric: false,
      disablePadding: false,
      label: t('Instrument Category'),
      width:160
    },
    {
      id: 'instrumentType',
      numeric: false,
      disablePadding: false,
      label: t('Instrument Type'),
      width:150
    },
    {
      id: 'id',
      numeric: false,
      disablePadding: false,
      label: t('Matric ID'),
      hide: true,
      display: "none",
      width: 100

  }    

  ]; 
  
   
 
  useEffect(()=>{
    processedrows()
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[metricsListData])

  const processedrows = () =>{
    var temptabledata = []
    if (!metricsListLoading && !metricsListError && metricsListData && metricsListData.length > 0) {
      temptabledata=temptabledata.concat(metricsListData.map((val, index) => {
          return [ index +1 ,val.name,val.title,val.metricDatatypeByMetricDatatype.type,val.metricUnitByMetricUnit.unit,val.metric_type.type,
          val.instrumentTypeByInstrumentType.instrument_category.name,val.instrumentTypeByInstrumentType.name, val.id]
      })
      )
    }
    setTableData(temptabledata) 
  } 


  const handleCreateDialogOpen = () => {
    dialogRef.current.openDialog();
  };

  const handleEditDialogOpen = (id,value,edit) => {
    dialogRef.current.editDialog(value);
  };
 
 
  return (
    <React.Fragment> 
      <ModalMetrics ref={dialogRef} metricsList={metricsList} metricsListData={metricsListData}/>
      
      <Grid container spacing={1} >
        
        <Grid item xs={12} sm={12}> 
        <div className="h-[48px] py-3.5 px-4 border-b bg-Background-bg-primary dark:bg-Background-bg-primary-dark border-Border-border-50 dark:border-Border-border-dark-50">
                            <TypographyNDL value='Metrics' variant='heading-02-xs'  />
                        </div>
                        <div className="p-4 min-h-[92vh] bg-Background-bg-primary dark:bg-Background-bg-primary-dark">
          <EnhancedTable 
            headCells={headCells}  
            data={tabledata}
            buttonpresent={t('addmetrics')}
            download={true}
            search={true}
            onClickbutton={handleCreateDialogOpen} 
            actionenabled={currUserRole.id === 2 ? true : false} 
            rawdata={!metricsListLoading && !metricsListError && metricsListData}
            handleEdit={(id,value)=>handleEditDialogOpen(id,value,"edit")}        
            // enableDelete={true}
            enableEdit={true}
            Buttonicon={Plus}
            rowSelect={true}
            checkBoxId={"id"}
            /> 
            </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
