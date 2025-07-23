import React, { useState, useEffect } from "react"; 
import { useRecoilState } from "recoil";
import { currentUserRole, selectedPlant,   } from "recoilStore/atoms"; 
import EnhancedTable from "components/Table/Table";  
import AddChannel from "./components/ChannelModal"
import useChannelListForLine from './hooks/useChannelListForLine';  
import { useTranslation } from 'react-i18next';
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import TypographyNDL from "components/Core/Typography/TypographyNDL";


export default function Users() { 
  const { t } = useTranslation();
  const [headPlant] = useRecoilState(selectedPlant); 
  const [currUserRole] = useRecoilState(currentUserRole);  
  const [userDialog, setUserDialog] = useState(false);
  const [userDialogMode, setUserDialogMode] = useState("");
  const [selectRow, setSelectRow] = useState(''); 
  const [tabledata,setTableData] = useState([]);
  const { ChannelListLoading, ChannelListForLineData, ChannelListError, getChannelListForLine } = useChannelListForLine();
  

  useEffect(() => {  
    getChannelListForLine(headPlant.id)
   // eslint-disable-next-line react-hooks/exhaustive-deps
   },[headPlant])

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
      label: t('Name'),
      width: 100,
      
    },

    {
      id: 'parameter',
      numeric: false,
      disablePadding: false,
      label: t('Parameter'),
      width: 150,
    },
    {
      id: 'type',
      numeric: false,
      disablePadding: false,
      label: t('Type'),
      width: 120,
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
  },[ChannelListForLineData])

  const processedrows = () =>{
    var temptabledata = []
    if (!ChannelListLoading && !ChannelListError && ChannelListForLineData && ChannelListForLineData.length > 0) {
      temptabledata=temptabledata.concat(ChannelListForLineData.map((val, index) => {
          return [ index +1,val.name,val.parameter,
          val.notificationChannelType.name, val.id]
      })
      )
    }
    setTableData(temptabledata)
    

    
  } 

  const handleCreateDialogOpen = () => {
    setUserDialogMode("create")
    setUserDialog(true);
  };



  const handleDeleteDialogOpen = (id,value ,type) => {
     
    setSelectRow(value)
    setUserDialogMode(type)
    setUserDialog(true);
  };  
 
  return (
    <React.Fragment>
        <AddChannel
            UserDialog={userDialog}
            UserDialogMode={userDialogMode}
            UserDialogclose={(e)=>{setUserDialog(e);setSelectRow('')}} 
            SelectRow={selectRow}
            getChannelListForLine={(e)=> {getChannelListForLine(e)}}

        /> 
        <div className="h-[48px] py-3.5 px-4 border-b bg-Background-bg-primary dark:bg-Background-bg-primary-dark border-Border-border-50 dark:border-Border-border-dark-50">
                            <TypographyNDL value='Channels' variant='heading-02-xs'  />
                        </div>
                        <div className="p-4 min-h-[92vh] bg-Background-bg-primary dark:bg-Background-bg-primary-dark">
          <EnhancedTable 
            headCells={headCells}  
            data={tabledata}
            buttonpresent={t("Add Channel")}
            download={true}
            search={true}
            onClickbutton={handleCreateDialogOpen} 
            actionenabled={currUserRole.id === 2 ? true : false} 
            rawdata={!ChannelListLoading && !ChannelListError && ChannelListForLineData}
            handleEdit={(id,value)=>handleDeleteDialogOpen(id,value,"edit")}
            handleDelete={(id,value)=>handleDeleteDialogOpen(id,value,"delete")}
            enableDelete={true}
            enableEdit={true}
            Buttonicon={Plus}
            rowSelect={true}
            checkBoxId={"id"}
            />
         
       
      </div>  
    </React.Fragment>
  );
}
