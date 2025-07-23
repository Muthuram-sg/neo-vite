import React,{ forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import ListHeader from './ListHeader';
import ListItem from './ListItem'
import useHierarchyList from '../HierarchyView/Hooks/useHierarchyList';
import { useRecoilState } from "recoil";
import { useTranslation } from 'react-i18next';
import { currentUserRole,selectedPlant,user,hierarchyData,themeMode} from "recoilStore/atoms"; 
import ParagraphText from 'components/Core/Typography/TypographyNDL'; 
const classes = { 
    root:{        
        height: 'calc(100vh - 84px)',
        overflowY: 'auto'
    }
  }
const HierarchyList = forwardRef((props,ref)=>{ 
    const { t } = useTranslation();
    const[curTheme]=useRecoilState(themeMode)
    const [tabValue, setTabValue] = useState("");
    const [headPlant] = useRecoilState(selectedPlant);
    const [currUserRole] = useRecoilState(currentUserRole);
    const [currUser] = useRecoilState(user);
    const [HierarchyData, setHierarchyData] = useRecoilState(hierarchyData);
    const { hierarchyListLoading, hierarchyListData, hierarchyListError, hierarchyList }= useHierarchyList();
    const [selectedHierarchy,setselectedHierarchy] =useState({})
    
    useImperativeHandle(ref,()=>({
      fetchHierarchy: (updatedID)=>{         
        if(updatedID){
          setTabValue(updatedID); 
        }
        hierarchyList(headPlant.id)
      }
    }))
    useEffect(()=>{ 
        hierarchyList(headPlant.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[headPlant]) 
    useEffect(()=>{
      if(!hierarchyListLoading && !hierarchyListError && hierarchyListData){
        if(tabValue && tabValue !== 'deleted'){
          props.hierarchyList( hierarchyListData.filter(x=>x.id === tabValue)[0] , true) 
          setselectedHierarchy( hierarchyListData.filter(x=>x.id === tabValue)[0])
        }else{
          props.hierarchyList(hierarchyListData[0]) 
        }
        setHierarchyData(hierarchyListData)
        handleChange({},tabValue);
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[hierarchyListData])
  useEffect(()=>{
    if(!tabValue || tabValue === 'deleted' ){
      setselectedHierarchy(HierarchyData[0])
    }
  },[HierarchyData,tabValue])
    const handleChange = (event, newValue) => { 
        setTabValue(newValue);         
        let selectedHierarchy = JSON.parse(JSON.stringify(hierarchyListData)).filter(x=>x.id === newValue);
        if(selectedHierarchy && selectedHierarchy.length > 0)
            props.onTabChange(selectedHierarchy[0])
          setselectedHierarchy(selectedHierarchy[0])
            

    };
    const edithierarchyfn =(event, newValue)=>{    
        setTabValue(newValue);         
        let selectedHierarchy = JSON.parse(JSON.stringify(hierarchyListData)).filter(x=>x.id === newValue);
        if(selectedHierarchy && selectedHierarchy.length > 0)
            props.onHierarchyEdit(selectedHierarchy[0])
            setselectedHierarchy(selectedHierarchy[0])
      }
    const duplicateHierarchy = (val)=>{
      let selectedHierarchy = JSON.parse(JSON.stringify(hierarchyListData)).filter(x=>x.id === val); 
      if(selectedHierarchy && selectedHierarchy.length > 0)
          props.duplicateHierarchy(selectedHierarchy[0])
          setselectedHierarchy(selectedHierarchy[0])
    } 

  let paragraphTextValue;

      if (!hierarchyListLoading && !hierarchyListError) {
          paragraphTextValue = t("Please add hierarchy");
      } else if (hierarchyListLoading) {
          paragraphTextValue = t("Hierarchy Loading...");
      } else {
          paragraphTextValue = t("Hierarchy not loaded");
      }
    return(
      <React.Fragment>
        <div className='p-4 ' style={{backgroundColor:curTheme==='dark' ? "#262626" : "#fcfcfc",borderRight:"1px solid #E0E0E0"}} >
            {/* <ListHeader addHierarchy={props.addHierarchy}/>
            <HorizontalLine variant="divider1"   /> */}
            <div>
              <ul style={classes.root}>
                {(!hierarchyListLoading && !hierarchyListError && hierarchyListData && hierarchyListData.length > 0) ?
                 hierarchyListData.map((data, index) => {
                    return (
                        <ListItem  
                            key={data.id}
                            isSelected={tabValue === data.id} 
                            index={index} 
                            id={data && data.id?data.id:0}
                            name={data && data.name?data.name:""}
                            updatedUser={data.userByUpdatedBy && data.userByUpdatedBy.name ? t('UpdatedBy') + data.userByUpdatedBy.name : ""}
                            userid={currUser.id}
                            userroleid={currUserRole.id}
                            createdby={data && data.created_by?data.created_by:""}
                            selectedIndex={""}
                            handleChange={handleChange}
                            edithierarchyfn={edithierarchyfn}
                            duplicateHierarchy={duplicateHierarchy} 
                            deleteHierarhy={props.deleteHierarhy}
                            deleteHierarchyLoading={props.deleteHierarchyLoading}
                            selectedHierarchy={selectedHierarchy}
                            hierarchyListLength={hierarchyListData.length}
                        /> 
                        );
                    })
                :(
                <div style={{textAlign: "center"}}>
                    <ParagraphText variant={'Body2'} value={paragraphTextValue}/>
                </div>
                )
                }
              </ul>
            </div> 
          </div>
    
           </React.Fragment>
           )
})
export default React.memo(HierarchyList,()=>true);