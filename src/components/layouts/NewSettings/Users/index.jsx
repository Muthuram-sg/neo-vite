import React, { useState, useEffect } from "react"; 
import moment from 'moment';
import { useRecoilState } from "recoil";
import { currentUserRole, selectedPlant, userLine,user} from "recoilStore/atoms";  
import EnhancedTable from "components/Table/Table"; 
import AddUser from "./components/UserModal";
import { useTranslation } from 'react-i18next';
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import Typography from "components/Core/Typography/TypographyNDL";
import useGetTheme from 'TailwindTheme';
import Tag from 'components/Core/Tags/TagNDL'; 

  
export default function Users() {
  const theme = useGetTheme();
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
    const [downloadabledata, setdownloadabledata] = useState([]);


  const headCells = [
    
    {
      id: 'S.NO',
      numeric: false,
      disablePadding: true,
      label: t('S.NO'),
    },
    {
      id: 'name',
      numeric: false,
      disablePadding: false,
      label: t('Name'),
    },

    {
      id: 'role',
      numeric: false,
      disablePadding: false,
      label: t('Role'),
    },
    {
      id: 'activity',
      numeric: false,
      disablePadding: false,
      label: t('Activity'),
    } 
     

  ];  

  useEffect(()=>{
    setTableData([])
    processedrows()
   
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[userForLineData,headPlant])

  const processedrows = () =>{
    let temptabledata = []
    let downloadableData =[]
    let uneditableUser = []
    if (userForLineData.length > 0) {
      temptabledata=temptabledata.concat(userForLineData.map((val, index) => {
          if(val.user_id === currUser.id){
            uneditableUser.push(index)
          }
          // NOSONAR  -  skip next line
          return [index + 1,val.userByUserId.name,
            <Tag 
            lessHeight
            noWidth='80px'
            style={{ 
                textAlign: "center" 
            }} 
            colorbg={"neutral"}
            name={val.role.role} 
        />
        ,moment(val.updated_ts).fromNow()]
      })
      )
      downloadableData = userForLineData.map((val, index) => {
        if(val.user_id === currUser.id){
          uneditableUser.push(index)
        }
        return [index + 1,val.userByUserId.name,val.role.role,moment(val.updated_ts).fromNow()]
    })
    
    }
    setdownloadabledata(downloadableData)
    console.log("uneditableUser", uneditableUser)
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
          <div className='bg-Background-bg-primary dark:bg-Background-bg-primary-dark h-[48px] px-4 py-2 flex justify-between items-center ' style={{ borderBottom: '1px solid ' + theme.colorPalette.divider, zIndex: '20', width: `calc(100% -"253px"})` }}>
          <Typography value='Users' variant='heading-02-xs' />
          </div>

          <div className='bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark  p-4 h-[93vh] overflow-y-auto' >
          <EnhancedTable 
            headCells={headCells}  
            data={tabledata}
            download={true}
            search={true}
            buttonpresent={currUserRole.id === 2 ? t("New User") : false}
            onClickbutton={handleCreateDialogOpen} 
            // NOSONAR  -  skip next line
            actionenabled={currUserRole.id === 2 ? true : false} //NOSONAR
            rawdata={userForLineData}
            handleEdit={(id,value)=>handleUserRoleChange(id,value)}
            handleDelete={(id,value)=>handleDeleteDialogOpen(id,value)}
            enableDelete={true}
            enableEdit={true}
            disablededit={uneditableuser}
            disableddelete={uneditableuser}
            Buttonicon={Plus}
            tagKey={["role"]}    
            downloadabledata={downloadabledata}
            downloadHeadCells={headCells}
            
            />
          
    </div>    
    </React.Fragment>
  );
}
