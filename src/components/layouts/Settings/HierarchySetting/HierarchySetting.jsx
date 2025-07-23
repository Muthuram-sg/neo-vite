import React, { useEffect, useRef, useState } from 'react';
import Grid from 'components/Core/GridNDL'
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import { removeNodeAtPath,addNodeUnderParent} from '@nosferatu500/react-sortable-tree'; 
import { hierNodeName,selectedPlant,user,selectedNode,selectedPath, currentHierarchyData, snackToggle, snackMessage, snackType } from 'recoilStore/atoms';
import { useRecoilState } from 'recoil';
import HierarchyList from './HierarchyList/HierarchyList';
import HierarchyView from './HierarchyView/HierarchyView';
import NodeSetting from './NodeSetting/NodeSetting'; 
import useUpdateHierarchy from './Hooks/useUpdateHierarchy';
import useCreateHierarchy from './Hooks/useCreateHierarchy';
import useDeleteHierarchy from './Hooks/useDeleteHierarchy';
import AddHierarchy from './ModelAddHierarchy';
import HorizontalLineNDL from 'components/Core/HorizontalLine/HorizontalLineNDL';
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import useGetInstrumentCategory from 'components/layouts/Explore/ExploreMain/ExploreTabs/components/Trends/hooks/useGetInstrumentCategory';
import { useTranslation } from 'react-i18next';
import ButtonNDL from 'components/Core/ButtonNDL';
function HierarchySetting(){
  const { t } = useTranslation();
    const [isEdit,setIsEdit] = useState(false);
    const [nodeName] = useRecoilState(hierNodeName);
    const [headPlant] = useRecoilState(selectedPlant);
    const [currUser] = useRecoilState(user);
    const [cacheHierarchy, setCacheHierarchy] = useState([]);
    const [currentHierarchy,setCurrentHierarchy] = useRecoilState(currentHierarchyData);
    const [selectedNodes,setSelectedNode] = useRecoilState(selectedNode);
    const [selectedPaths,setSelectedPath] = useRecoilState(selectedPath);
    const [, setNotifyOpen] = useRecoilState(snackToggle);
    const [, setNotifyMessage] = useRecoilState(snackMessage);
    const [, setNotifyType] = useRecoilState(snackType);
    const [selectedIndex,setSelectedIndex] = useState('');
    const [instrumentcategory,setinstrumentcategory] =useState([])
    const listRef = useRef();
    const addRef = useRef();
    const { updateHierarchyLoading, updateHierarchyData, updateHierarchyError, updateHierarchy } = useUpdateHierarchy();
    const { createHierarchyLoading, createHierarchyData, createHierarchyError, createHierarchy } = useCreateHierarchy();
    const { deleteHierarchyLoading, deleteHierarchyData, deleteHierarchyError, deleteHierarchy } = useDeleteHierarchy();
    const { categoriesLoading, categoriesData, categoriesError, getInstrumentCategory} = useGetInstrumentCategory();
    const getNodeKey = ({ treeIndex }) => treeIndex; 
    useEffect(()=>{
        setCurrentHierarchy(null);
        setCacheHierarchy(null);
        getInstrumentCategory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[headPlant])
   useEffect(()=>{
    if(!categoriesLoading && categoriesData && categoriesData.length>0 && !categoriesError){
        setinstrumentcategory(categoriesData)
    }

   },[categoriesLoading, categoriesData, categoriesError])
    useEffect(()=>{
        if(!updateHierarchyLoading && !updateHierarchyError && updateHierarchyData){
            handleNotify(true,'success',t('Hierarchy has updated'))
            // setIsEdit(false)
            listRef.current.fetchHierarchy()
        }
        if(!updateHierarchyLoading && updateHierarchyError && !updateHierarchyData){
            handleNotify(true,'error',t('Unable to update hierarchy'))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[updateHierarchyData])
    useEffect(()=>{
        if(!createHierarchyLoading && !createHierarchyError && createHierarchyData){
            handleNotify(true,'success',t('Hierarchy has created'))
            listRef.current.fetchHierarchy(createHierarchyData.id)
        }
        if(!createHierarchyLoading && createHierarchyError && !createHierarchyData){
            handleNotify(true,'error',t('Unable to create hierarchy'))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[createHierarchyData])
    useEffect(()=>{
        if(!deleteHierarchyLoading && !deleteHierarchyError && deleteHierarchyData){
            handleNotify(true,'success',t('Hierarchy has deleted'))
            listRef.current.fetchHierarchy('deleted')
            setCurrentHierarchy(null);
            setCacheHierarchy(null);
        } 
        if(!deleteHierarchyLoading && deleteHierarchyError && !deleteHierarchyData){
            handleNotify(true,'error',t('Unable to delete hierarchy'))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[deleteHierarchyData])
    const handleNotify = (open,type,message)=>{
        setNotifyOpen(open);
        setNotifyMessage(message);
        setNotifyType(type)
    }
    const onTabChange = (selectedHierarchy) =>{  
        setSelectedNode(null);
        setSelectedPath(null)
        setCurrentHierarchy(selectedHierarchy);
        setCacheHierarchy(selectedHierarchy);
        setIsEdit(false);
    }
    const onHierarchyEdit = (selectedHierarchy) =>{
        setCurrentHierarchy(selectedHierarchy)
        setCacheHierarchy(selectedHierarchy);
        setIsEdit(!isEdit)
    }    
    const handleNodeClick = (node,path,treeIndex)=>{  
        setSelectedIndex(treeIndex)
        setSelectedNode(node);
        setSelectedPath(path)
    }
    const cancelUpdateClick = ()=>{
        setSelectedNode(null)
        setSelectedPath(null)
        setCurrentHierarchy(cacheHierarchy);
        setIsEdit(false);
    }
    const removenode = (event,node, path) => { 
        try{
            event.stopPropagation();        
            if(currentHierarchy && currentHierarchy.hierarchy){  
                let cloneCurrentHierarchy =  JSON.parse(JSON.stringify(currentHierarchy));
                const deleteHier = removeNodeAtPath({ treeData: cloneCurrentHierarchy.hierarchy, path, getNodeKey }); 
                cloneCurrentHierarchy['hierarchy'] = deleteHier; 
                setCurrentHierarchy(cloneCurrentHierarchy)
            }
        }catch(err){
            console.log('Hierarchy','HierarchySetting','removenode',err);
        }         
    } 
    const dragandChangeNode = (hier) => {  
        try{
            if(currentHierarchy && currentHierarchy.hierarchy){  
                let cloneCurrentHierarchy =  JSON.parse(JSON.stringify(currentHierarchy)); 
                cloneCurrentHierarchy['hierarchy'] = hier;
                setCurrentHierarchy(cloneCurrentHierarchy)
            }          
        }catch(err){
            console.log('Hierarchy','HierarchySetting','dragandChangeNode',err);
        }      
    } 
    const parentKey = () =>{ 
        return selectedNodes  && selectedNodes.type === 'instrument' ? selectedPaths[selectedPaths.length - 2] : selectedPaths[selectedPaths.length - 1] 
    }
    const addNode = (NEW_NODE)=>{
        try{
            if(currentHierarchy && currentHierarchy.hierarchy){   
                let newTree = addNodeUnderParent({
                    treeData: currentHierarchy.hierarchy,
                    newNode: NEW_NODE,
                    expandParent: true,
                    parentKey: !selectedPaths || selectedPaths.length === 0 ? undefined : parentKey(),
                    getNodeKey: ({ treeIndex }) => treeIndex,
                });            
                let cloneCurrentHierarchy =  JSON.parse(JSON.stringify(currentHierarchy)); 
                cloneCurrentHierarchy['hierarchy'] = newTree.treeData; 
                setCurrentHierarchy(cloneCurrentHierarchy) 
            }
        }catch(err){
            console.log('Hierarchy','HierarchySetting','addNode',err);
        } 
    }
    
    const updateNode = ()=>{
        if(currentHierarchy && currentHierarchy.hierarchy && headPlant.id && currUser.id && currentHierarchy.id){   
            updateHierarchy(nodeName, currentHierarchy.hierarchy, headPlant.id, currUser.id,currentHierarchy.id)  
        }
    } 
    const addHierarchy = ()=>{
        addRef.current.openDialog()
    }
    const initiateDuplicateHierarchy = (hier)=>{ 
        addRef.current.openDialog(hier)
    }
    const addNewHierarchy = (hiername) =>{ 
        if(hiername && headPlant && headPlant.id && currUser && currUser.id){
            const newHierObj =  [{ "id": headPlant.id, "type": "entity", "subtype": "plant", "name": headPlant.name, "actualname": headPlant.name, "expanded": true, "icon": 12, "children": [], "subnodeType": "", "subnode": {} }];
            createHierarchy(hiername,newHierObj,headPlant.id,currUser.id);             
            addRef.current.closeDialog()
        }
    }
    const addDuplicateHierarchy = (name,hier) =>{  
        if(name && headPlant && headPlant.id && currUser && currUser.id){
            createHierarchy(name,hier,headPlant.id,currUser.id);             
            addRef.current.closeDialog()
        }
    }
    const deleteHierarchies = (hierid)=>{  
        if(hierid){  
            //setHierarchyid(hierid)
            deleteHierarchy(hierid) 
            //getHierarchyReportSelect(hierid)
        }
    } 
    const hierarchyList =(list,edit)=>{
        if(edit){
            onHierarchyEdit(list)
        }else{
            onTabChange(list)
        }

    }
    return(
        <React.Fragment>  
              
                      <div className='flex items-center justify-between px-4 py-2 bg-Background-bg-primary dark:bg-Background-bg-primary-dark'>
                       <TypographyNDL variant="heading-02-xs" model value={t('Hierarchy')} />   
                       {
                        isEdit ? 
                        <React.Fragment>
                        <div className='flex gap-2 items-center'>
                        <ButtonNDL  value={"Cancel"} type={'secondary'}   onClick={cancelUpdateClick} />  
                        <ButtonNDL    value={"Update"} onClick={updateNode} />  
                        </div>
                        </React.Fragment>
                        :
                        <ButtonNDL  value={"Add Hierarchy"} type={'tertiary'}  icon={Plus} onClick={addHierarchy} />  

                       }
                       </div>

                <HorizontalLineNDL variant='divider1' /> 
                <AddHierarchy instrumentcategory={instrumentcategory} ref={addRef} addNewHierarchy={addNewHierarchy}  addDuplicateHierarchy={addDuplicateHierarchy}/> 
                <Grid container spacing={0}>
                    {/* HIERARCHY LIST */}
                        <Grid item xs={3} sm={3} style={{display:!isEdit ? "block" : 'none'}}>
                        <HierarchyList hierarchyList={(list,edit)=>hierarchyList(list,edit)} deleteHierarhy={deleteHierarchies} deleteHierarchyLoading={deleteHierarchyLoading} ref={listRef} addHierarchy={addHierarchy}  duplicateHierarchy={initiateDuplicateHierarchy} onTabChange={onTabChange} onHierarchyEdit={onHierarchyEdit}/>
                        </Grid>
                    
                 
                        {
                            currentHierarchy && currentHierarchy.id?(                                
                            <React.Fragment>
                                <Grid item xs={isEdit ? 9 : 6}>                                        
                                    <HierarchyView 
                                        isEdit={isEdit} 
                                        selectedNode={selectedNodes}
                                        selectedPath={selectedPaths}
                                        selectedIndex={selectedIndex}
                                        hiername={"hierarchy"} 
                                        currentHier={currentHierarchy} 
                                        handleNodeClick={handleNodeClick} 
                                        removeNode={removenode}
                                        ChangeNode={dragandChangeNode}
                                        addNewNode={addNode}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <NodeSetting updateNode={updateNode} cancelNode={cancelUpdateClick} isEdit={isEdit} selectedPaths={selectedPaths} selectedNode={selectedNodes}/>
                                </Grid>
                            </React.Fragment>         
                            ):(<React.Fragment></React.Fragment>)
                        }           
                </Grid> 
        </React.Fragment>
    )
}

export default HierarchySetting;