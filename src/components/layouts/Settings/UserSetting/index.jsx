import React, { useState, useEffect } from "react"; 
import moment from 'moment';
import { useRecoilState } from "recoil";
import { currentUserRole, selectedPlant, userLine,user} from "recoilStore/atoms";  
import EnhancedTable from "components/Table/Table"; 
import AddUser from "./components/UserModal";
import { useTranslation } from 'react-i18next';
import Plus from 'assets/neo_icons/Menu/plus.svg?react';

  
export default function Users() {
    const { t } = useTranslation();
    const [currUser] = useRecoilState(user);
    const [headPlant,] = useRecoilState(selectedPlant); 
    const [currUserRole] = useRecoilState(currentUserRole); 
    const [userForLineData] = useRecoilState(userLine); 
    const [userDialog, setUserDialog] = useState(false);
    const [userDialogMode, setUserDialogMode] = useState("");
    const [selectRow, setSelectRow] = useState([]); 
    const [uneditableuser,setuneditableuser]= useState([]); 
    const [tabledata,setTableData] = useState([]);

  const headCells = [
    {
      id: 'S.NO',
      numeric: false,
      disablePadding: true,
      label:  t("SNo"),
      width:100
  },
    {
      id: 'name',
      numeric: false,
      disablePadding: false,
      label: t('Name'),
      width:100
    },

    {
      id: 'role',
      numeric: false,
      disablePadding: false,
      label: t('Role'),
      width:100
    },
    {
      id: 'activity',
      numeric: false,
      disablePadding: false,
      label: t('Activity'),
      width:120
    },
    {
      id: 'id',
      numeric: false,
      disablePadding: false,
      label: t('User ID'),
      hide: true,
      display: "none",
      width: 100

  }
     

  ];  

  useEffect(()=>{
    setTableData([])
    processedrows()
   
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[userForLineData,headPlant])

  const processedrows = () =>{
    var temptabledata = []
    var uneditableUser = []
    if (userForLineData.length > 0) {
      temptabledata=temptabledata.concat(userForLineData.map((val, index) => {
          if(val.user_id === currUser.id){
            uneditableUser.push(index)
          }
          return [ index+1 ,val.userByUserId.name,val.role.role,moment(val.updated_ts).fromNow(),val.user_id]
      })
      )
    }
   
    setuneditableuser(uneditableUser)
    setTableData(temptabledata)
  } 

  const handleCreateDialogOpen = () => {
    setUserDialogMode("create")
    setUserDialog(true);
  }; 

  const handleDeleteDialogOpen = (id,value) => {
    setSelectRow(value)
    setUserDialogMode("delete")
    setUserDialog(true);
  };

  const handleUserRoleChange = (id,value) => {
    setSelectRow(value)
    setUserDialogMode("edit")
    setUserDialog(true);
  }
 
  
  return (
    <React.Fragment>
        <AddUser
            UserDialog={userDialog} 
            UserDialogMode={userDialogMode}
            UserDialogclose={(e)=>{setUserDialog(e);}}  
            SelectRow={selectRow}
            SelectedRow={(e)=>setSelectRow(e)}
        /> 

      <div className="p-4">
          <EnhancedTable 
            headCells={headCells}  
            data={tabledata}
            download={true}
            search={true}
            buttonpresent={currUserRole.id === 2 ? t("New User") : false}
            onClickbutton={handleCreateDialogOpen} 
            actionenabled={currUserRole.id === 2 ? true : false} 
            rawdata={userForLineData}
            handleEdit={(id,value)=>handleUserRoleChange(id,value)}
            handleDelete={(id,value)=>handleDeleteDialogOpen(id,value)}
            enableDelete={true}
            enableEdit={true}
            disablededit={uneditableuser}
            disableddelete={uneditableuser}
            Buttonicon={Plus}
            rowSelect={true}
            checkBoxId={"id"}
            />
          
    </div>    
    </React.Fragment>
  );
}
