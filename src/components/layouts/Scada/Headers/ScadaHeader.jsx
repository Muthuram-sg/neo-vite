/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle} from 'react';
import useGetTheme from 'TailwindTheme';
import { useNavigate } from "react-router-dom";
import Grid from 'components/Core/GridNDL'
import ToolTip from "components/Core/ToolTips/TooltipNDL";
import { useTranslation } from 'react-i18next';
import ListNDL from 'components/Core/DropdownList/ListNDL.jsx';
import { socket } from 'components/socket';
// Components
import ScadaViewSelectbox from './ScadaSelectbox';
// Recoil packages
import { useRecoilState, useRecoilValue } from 'recoil';
import {
    selectedPlant, user, currentScadaJson, scadaViewEditMode, drawerMode, FullScreenmode, ProgressLoad, nodesAtom,
    currentScadaViewSkeleton, defaultScadaView, scadaInstance, snackToggle, snackMessage, snackType, searchTextAtom, selectedAccessTypeAtom, sortOrderAtom, 
    currentScadaId, scadaIdState, scadaContentVisibleState, selectedScadaViewState, scadaSelectedEditmodeType, scadaContentVisibleEditState,scadaContentVisibleDeleteState
} from "recoilStore/atoms"; // Recoil variables 
// Core Components
import InputFieldNDL from 'components/Core/InputFieldNDL';
import Button from 'components/Core/ButtonNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL";

import Plus from 'assets/neo_icons/Menu/scada/edit_b.svg?react';
//import FullScreenLight from 'assets/neo_icons/Menu/fullscreen.svg?react';
//import ExitFullScreenLight from 'assets/neo_icons/Menu/exit_fullscreen.svg?react';
import World from 'assets/neo_icons/Menu/scada/world.svg?react';
//import RefreshLight from 'assets/neo_icons/Menu/refresh.svg?react';
import Menuvertical from 'assets/neo_icons/Menu/scada/Menu.svg?react';
import DuplicateIcon from 'assets/neo_icons/Equipments/Duplicate.svg?react';
import Edit from 'assets/neo_icons/Menu/scada/edit_bold.svg?react';
import Delete from 'assets/neo_icons/Menu/scada/delete_r.svg?react';
import useScadaViewList from "components/layouts/Scada/hooks/useGetScadaViewList";
import useUpdateScadaNodes from '../hooks/useUpdateScadaData.jsx';
import useCurrentScadadetails from '../hooks/useGetcurentScadadetails';
import LoadingScreenNDL from 'LoadingScreenNDL';
import ConfirmationModal from '../Content/ConfirmationModal'; 
import EditScadaDashModal from '../Content/EditScadaDashModal'; 
import ScadaContent from "components/layouts/Scada/Content/ScadaContent";
import ScadaContentView from "components/layouts/Scada/Content/ScadaContentView";
import ScadaModal from "components/layouts/Scada/Headers/ScadaModal";
import BredCrumbsND from 'components/Core/Bredcrumbs/BredCrumbsNDL'; 
import Breadcrumbs from "components/Core/Bredcrumbs/BredCrumbsNDL";
const ScadaHeader = forwardRef((props, ref) => {
//function ScadaHeader(props) {
    // state variables
    const navigate = useNavigate();
    const mainTheme = useGetTheme();
    const theme = useGetTheme();
    const [headPlant] = useRecoilState(selectedPlant);
    const [ProgressBar] = useRecoilState(ProgressLoad);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [currUser] = useRecoilState(user);
   const [selectedScadaView] = useRecoilState(selectedScadaViewState);
   // console.log('selected scada view', selectedScadaView.name)
    const [editMode, setEditMode] = useRecoilState(scadaViewEditMode);
    const [isEditingDashboard, setIsEditingDashboard] = useState(false); // Track if we are in edit mode
    const [isFullScreen, setFullScreen] = useRecoilState(FullScreenmode);
    const [DefaultScadaViewID] = useRecoilState(defaultScadaView);
    const [rfInstance] = useRecoilState(scadaInstance);
    const [openCharts, setopenCharts] = useState(false);
    const [AnchorPos, setAnchorPos] = useState(null);
   const [breadcrump, setBreadcrump] = useState([{ index: 0, name: 'SCADA /' }]);
   //console.log('bred',breadcrump)
    const [, setSelectedScadaViewSkeleton] = useRecoilState(currentScadaViewSkeleton);
    const [scadaviewDel,setscadaviewDel] = useRecoilState(scadaContentVisibleDeleteState);
   // const [selectedScadaView, setSelectedScadaView] = useRecoilState(selectedScadaViewState);
   // console.log('Header page',selectedScadaView)
   const [reload, setReload] = useState(false);
   const refreshData = () => setReload(prev => !prev);
   // const isEditCanvasMode = useRecoilValue(scadaSelectedEditmodeType);
     const [isEditCanvasMode, setEditCanvasMode] = useRecoilState(scadaSelectedEditmodeType);
    const [open,] = useRecoilState(drawerMode);
    const [editAccess, setEditAccess] = useState(false);
    const { UpdateScadaDataLoading, UpdateScadaDataData, UpdateScadaDataError, getUpdateScadaData } = useUpdateScadaNodes();
    const { ScadaViewListLoading, ScadaViewListData, getScadaViewList } = useScadaViewList();
    const { t } = useTranslation();
    const nameRef = useRef();
    // States for search and select box values
    
    const [searchText, setSearchText] = useRecoilState(searchTextAtom);
    const [selectedAccessType, setSelectedAccessType] = useRecoilState(selectedAccessTypeAtom);
    const [sortOrder, setSortOrder] = useRecoilState(sortOrderAtom);
    // const scadaId = useRecoilState(currentScadaId);
//     const [, setScadaId] = useRecoilState(scadaIdState);
//   const [, setScadaContentVisible] = useRecoilState(scadaContentVisibleState);
    const [scadaId, setScadaId] = useRecoilState(scadaIdState);
    const [isScadaContentVisible, setScadaContentVisible] = useRecoilState(scadaContentVisibleState);
    const { CurrentscadaUserLoading, CurrentscadaUserError, CurrentscadaUserData, getCurrentScadadetails } = useCurrentScadadetails();
    const [scadaName, setScadaName] = useState('');
     const { onSearchChange, onAccessTypeChange, onSortOrderChange } = props;
     const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
     const [isModalOpen, setIsModalOpen] = useState(false);
     const [isUpModalOpen, setUpIsModalOpen] = useState(false);
     const [selectedItem, setSelectedItem] = useState(null);
     const [anchorEl, setAnchorEl] = useState(null); 
     const [page,setPage]=useState('home');
     const [isEditCanvasType, setEditCanvasType] = useState(false);
     const [isScadaContentVisibleEdit, setScadaContentVisibleEdit] = useRecoilState(scadaContentVisibleEditState);
     const [scadaaccessType, setscadaaccessType] = useState('');
     const [selectedUsers, setSelectedUsers] = useState([]); 
     const [, setNodesAtom] = useRecoilState(nodesAtom); 
 //   console.log('userlist',selectedUsers);
const formRef = useRef()
const scadaFormRef = useRef(null);
const bredcrumbList=[{ index: 0, name: "SCADA" }, { index: 1, name: scadaName }]
const openDialog = (action) => {
  console.log("Dialog opened with action:", action);
  // Add any additional logic needed for opening dialog
};

useImperativeHandle(ref, () => ({
  openDialog: (type) => handleDialogOpen(type),
  Save:()=>handleSaveChanges(),
  
 
}))
  const handleDialogOpen = (type) => { 
    if (type === 'edit') {
        setTimeout(() => {
            nameRef.current.value = selectedScadaView.name
        }, 100)
    }else if(type === 'delete'){
      scadaFormRef.current.openDialog('delete');
    }
  }

    
    // Call the parent functions whenever a filter value changes
  useEffect(() => {
    if (onSearchChange) onSearchChange(searchText);
  }, [searchText, onSearchChange]);

  useEffect(() => {
    if (onAccessTypeChange) onAccessTypeChange(selectedAccessType);
  }, [selectedAccessType, onAccessTypeChange]);

  useEffect(() => {
    if (onSortOrderChange) onSortOrderChange(sortOrder);
  }, [sortOrder, onSortOrderChange]);

  // useEffect(() => {
  //     if (headPlant.id && currUser.id) {
       
  //       getScadaViewList(headPlant.id, currUser.id)
  //     }
  //   }, [headPlant.id, currUser.id]);

  //const openModal = () => setConfirmModalVisible(true);
  
  const menuOption = [
    {id:"3",name: "Duplicate",icon:DuplicateIcon, stroke: mainTheme.colorPalette.primary, toggle: false},
    {id:"1",name:"Edit",icon:Edit,toggle: false, stroke: mainTheme.colorPalette.primary,},
    {id:"2",name:"Delete",icon:Delete,color:"#CE2C31",stroke:'#CE2C31',toggle: false},
  ]
//   const handleMenuToggle = (e, item) => {
//    // console.log('menu clicked')
//    // e.stopPropagation(); // Prevents propagation to card click
//     setAnchorEl(e.currentTarget); // Open menu
//     setSelectedItem(item); // Set selected item for later use
//   };

const handleMenuToggle = (e, scadaId) => {
    //console.log('event',e)
    e.stopPropagation(); // Prevent propagation to parent elements
     
    if (selectedItem?.id === scadaId) {
        // Close menu if already open for the same item
        setAnchorEl(null);
        setSelectedItem(null);
    } else {
        // Open menu for a different item
        setAnchorEl(e.currentTarget);
        setSelectedItem({ id: scadaId });
    }
};
  const handleOptionChange = (e, option, itemId) => {

 //console.log(e )
   
    
     if (e === "1") {
     //  console.log('Handling Edit for item:', itemId);
       setScadaContentVisible(true); // Show the ScadaContent for editing
       setEditCanvasMode(true); // Set the canvas to edit mode
       setEditCanvasType(true); // Ensure it's in edit mode
       setScadaContentVisibleEdit(true);
        // setEditCanvasMode(true); 
  
     } else if (e === "2") { 
        setEditCanvasMode(false);
        setEditMode(false) 
        setNodesAtom([])
      // console.log('Handling Delete for item:', itemId);
    
     
      //setSelectedScadaView(itemId); // Set itemId in Recoil state for delete
      setscadaviewDel(true);
      // console.log('Handling state for item:', selectedScadaView);
       
       scadaFormRef.current.openDialog('delete');
       
       //getScadaViewList(headPlant.id, currUser.id)
       // Open the delete dialog in ScadaModal using the ref
    //    if (scadaFormRef.current) {
    //     scadaFormRef.current.openDialog('delete'); // Make sure this function exists in ScadaModal
    // }
     
     }
     else if(e=== '3'){
      scadaFormRef.current.openDialog('duplicate',selectedScadaView);
     }
     popClose()
    // setAnchorEl(null); // Close menu after option is selected
  };



//   useEffect(() => {
//     if (scadaId) {
//         console.log("Fetching data for scadaId:", scadaId);
//         getCurrentScadadetails(scadaId); 
//     }
// }, [scadaId,getCurrentScadadetails]);

// useEffect(() => {
//     if (CurrentscadaUserData) {
//         console.log("Fetched data:", CurrentscadaUserData);
//       setScadaName(CurrentscadaUserData.name); 
//     }
//   }, [CurrentscadaUserData]);


    const enableEditMode = () => setEditMode(true)
    const cancelEditMode = () => {
       
        setScadaContentVisible(true);
        setScadaContentVisibleEdit(false);
        // setScadaId(null)
        // setSelectedScadaViewSkeleton([]);
       // props.getScadaViewList(headPlant.id, currUser.id)
      //  setSelectedScadaViewSkeleton(JSON.parse(localStorage.getItem('scada_layout')))
        setEditMode(false)
        setNodesAtom([])
        // setScadaName('')
       // props.refresh(true)
      // props.setListUpdated(true)
    //  window.location.reload(); 
       setIsModalOpen(false);
  
    }

    // const handleClearCanvas = () => {
    //     setNodes([]); // Clear all nodes
    //     setEdges([]); // Optionally clear all edges
    // };

    const handleCancelClick = () => {
        setIsModalOpen(true);  // Open the modal when cancel is clicked
      };

      const handleUpdateClick = () => {
        setUpIsModalOpen(true);  // Open the modal when cancel is clicked
      };
    
    
      const handleCloseModal = () => {
        setIsModalOpen(false);  // Close the modal
      };

      const handleUpCloseModal = (type) => { 
        if(type){
        //   setScadaContentVisible(false);
        //   setScadaContentVisibleEdit(false);
        //   setScadaId(null)
        //   setSelectedScadaViewSkeleton([]);
          setScadaName(type)
          getCurrentScadadetails(scadaId);
        }
        setUpIsModalOpen(false);  // Close the modal
      };

      const SaveEditMode = () => {
        console.log('update clicked')  // Close the modal
      };

      const handleClearclick = () => {
        setIsModalOpen(false);  // Close the modal
      };

    // useEffect(() => {
    //     if (!UpdateScadaDataError && !UpdateScadaDataLoading && UpdateScadaDataData) {
    //         setSelectedScadaViewSkeleton(JSON.parse(JSON.stringify(rfInstance.toObject())))
    //      //   localStorage.setItem('scada_layout', JSON.stringify(rfInstance.toObject()));
    //         SetMessage(t('scadaUpSuccess'))
    //         SetType("success")
    //         setOpenSnack(true)
    //     }
    //     if (UpdateScadaDataError && !UpdateScadaDataLoading && !UpdateScadaDataData) {
    //         SetMessage(t('scadaUpFailed'))
    //         SetType("error")
    //         setOpenSnack(true)
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [UpdateScadaDataData])

    useEffect(() => {
        if (!UpdateScadaDataError && !UpdateScadaDataLoading && UpdateScadaDataData && UpdateScadaDataData.returning.length>0) {
            console.log('Save successful:', UpdateScadaDataData,UpdateScadaDataData.returning[0].id);
            setSelectedScadaViewSkeleton([JSON.parse(JSON.stringify(rfInstance.toObject()))]);
            
            SetMessage(t('scadaUpSuccess'));
            SetType("success");
            setOpenSnack(true);
            setEditCanvasMode(true);
            setScadaContentVisibleEdit(false);
            setScadaContentVisible(true);
            //getScadaViewList(headPlant.id, currUser.id)
          
            //window.location.reload(); 
            // getscadaviewList(headPlant.id, currUser.id);
            getCurrentScadadetails(UpdateScadaDataData.returning[0].id);
        } else if (UpdateScadaDataError && !UpdateScadaDataLoading) {
            console.error('Save failed with error:', UpdateScadaDataError);
            setScadaContentVisibleEdit(true);
            setScadaContentVisible(false);
            SetMessage(t('scadaUpFailed'));
            SetType("error");
            setOpenSnack(true);
        }
        
    }, [UpdateScadaDataData, UpdateScadaDataError, UpdateScadaDataLoading]);
    

    useEffect(() => {
        if (document.addEventListener) {
            document.addEventListener('webkitfullscreenchange', exitHandler, false);
            document.addEventListener('mozfullscreenchange', exitHandler, false);
            document.addEventListener('fullscreenchange', exitHandler, false);
            document.addEventListener('MSFullscreenChange', exitHandler, false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function exitHandler() {
        if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
            setFullScreen(false);
        }
    }

    const handleSaveChanges = () => {
        console.log(' ', DefaultScadaViewID);
    setIsModalOpen(false);
    getUpdateScadaData({ 
        data: JSON.parse(JSON.stringify(rfInstance.toObject())), 
        scada_id: DefaultScadaViewID, 
        user_id: currUser.id 
    });
  //  setEditMode(false);
    setScadaContentVisible(false);
    setScadaContentVisibleEdit(true);
    setNodesAtom([])
        // setIsModalOpen(false); 
        // getUpdateScadaData({ data: JSON.parse(JSON.stringify(rfInstance.toObject())), scada_id: DefaultScadaViewID, user_id: currUser.id })
        // setEditMode(false)
        // setScadaContentVisible(false);
        // setIsModalOpen(false); 
    };

    const handleClick = (event) => {
        setAnchorPos(event.currentTarget);
        setopenCharts(!openCharts)
    };

  //   const handleActiveIndex = (index) => {
  //     const existBreadcrump = [...breadcrump];
  //     setScadaContentVisible(false);
  //   setScadaContentVisibleEdit(false);
  //    setBreadcrump(existBreadcrump);
     
  // };

  const handleActiveIndex = (index, item) => {
    // console.log(index,item,"item")
    // const existBreadcrump = [...breadcrump];
    //    //setPage('home')
    //    // setListArray([{ index: 0, name: Home}])
    //     setScadaContentVisible(false);
    //     setScadaContentVisibleEdit(false);
    //   //  let newBreadCrumb = []
    //     setBreadcrump(existBreadcrump);
    if(index === 0){
      setPage('home')
      setScadaContentVisible(false);
      setScadaContentVisibleEdit(false);
      setScadaId(null)
      setSelectedScadaViewSkeleton([]);
      setScadaName('')
      let choosenSchema = localStorage.getItem('plantid')
      navigate(`/${choosenSchema}/scada`)
      // window.location.reload();
      socket.removeListener('mqtt_message');
    }

};

    const handleClose = () => {
        setopenCharts(false)
        setAnchorPos(null)
    };

    // const chartOption = [
    //     { name: "Feeder", type: "feeder", icon: FeederIcon, stroke: theme.colorPalette.primary },
    //     { name: "Mixer", type: "mixer", icon: MixerIcon, stroke: theme.colorPalette.primary },
    //     { name: "Mud Mixer", type: "mudmixer", icon: MudMixerIcon, stroke: theme.colorPalette.primary },
    //     { name: "Quench Tank", type: "quenchtank", icon: QuenchTankIcon, stroke: theme.colorPalette.primary },
    //     { name: "Feeder Stand (Left)", type: "feederStandL", icon: FeederStandLeftIcon, stroke: theme.colorPalette.primary },
    //     { name: "Feeder Stand (Right)", type: "feederStandR", icon: FeederStandRightIcon, stroke: theme.colorPalette.primary }
    // ]

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            setFullScreen(true)
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                setFullScreen(false)
                document.exitFullscreen();
            }
        }
    }

    const handleSnackbar = (message, type) => {
        SetMessage(message);
        SetType(type);
        setOpenSnack(true)
    }

    function handleGridAdd(graphType) {
        try {
            var tempNodes = JSON.parse(JSON.stringify(rfInstance.toObject()))
            var len = 0
            if (tempNodes.nodes.length !== 0) {
                len = parseInt(tempNodes.nodes[tempNodes.nodes.length - 1].id) + 1
            }
            tempNodes.nodes.push({
                id: len.toString(),
                type: graphType,
                data: { label: '', device: graphType },
                position: {
                    x: Math.random() * window.innerWidth - 100,
                    y: Math.random() * window.innerHeight,
                  },
                sourcePosition: 'right',
            });
            setSelectedScadaViewSkeleton(tempNodes)
            SetMessage(t('newNodeAdded'))
            SetType("success")
            setOpenSnack(true)
            handleClose()
        } catch (err) {
            console.log('handle grid add', err);
        }
    }

    useEffect(() => {
        if (scadaId) {
            getCurrentScadadetails(scadaId);
        }
    }, [scadaId]); // Only trigger this when scadaId changes
    
    useEffect(() => {
      //  console.log("CurrentscadaUserData:", CurrentscadaUserData); // Log this to see the structure
    
        if (CurrentscadaUserData && CurrentscadaUserData.length > 0) {
            const fetchedName = CurrentscadaUserData[0]?.name || '';
            const acctype=CurrentscadaUserData[0]?.access_type || ''
            const detail = CurrentscadaUserData[0];
             // Set selected users by ID
             if (detail.scada_user_access_list && Array.isArray(detail.scada_user_access_list)) {
              setSelectedUsers(detail.scada_user_access_list);  // Assuming users have `id`
          }
           // console.log("Fetched SCADA Name:", detail);
            setScadaName(fetchedName);
            setscadaaccessType(acctype);
          
            setSelectedScadaViewSkeleton(CurrentscadaUserData);
            if (nameRef.current) {
                nameRef.current.value = fetchedName; // This should set the input value directly
              }
        }
    }, [CurrentscadaUserData]);
    

    function popClose(){
      setAnchorEl(null);
      setSelectedItem(null);
    }

    const CreateNewDash =()=>{
      scadaFormRef.current.openDialog('add');
    }

    return (
     
        <React.Fragment>
            <>
            <div className='bg-Background-bg-primary dark:bg-Background-bg-primary-dark  ' style={{borderBottom: '1px solid ' + theme.colorPalette.divider, zIndex: '20', width: `calc(100% -"253px"})` }}>
               
              {/* Check if the page is in edit mode or view mode */}
              {isScadaContentVisibleEdit ? (
                // If in edit mode
                <div className="flex justify-between items-center w-full" style={{padding:'8px 16px'}}>
                  <TypographyNDL class="max-w-[400px] text-ellipsis whitespace-nowrap overflow-hidden" variant="heading-02-xs" value={scadaName} />
                  {/* Edit Mode Controls */}
                  <div className="flex space-x-2 pl-2" >
                    <Button icon={Plus} onClick={handleUpdateClick} type="ghost" />
                  </div>
                  <div className="ml-auto flex space-x-2 ">
                    <Button value={t('Cancel')} onClick={handleCancelClick} type="secondary" />
                    <Button value={t('Save')} onClick={handleSaveChanges}  loading={UpdateScadaDataLoading}  type="primary"/>
                  </div>
                  {/* Confirmation Modal */}
                  <ConfirmationModal
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    oncancelClick={cancelEditMode}
                  />
                  {/* Edit Scada Dash Modal */}
                  <EditScadaDashModal
                    open={isUpModalOpen}
                    onClose={handleUpCloseModal}
                    oncancelClick={SaveEditMode}
                    currentscadadetail={CurrentscadaUserData}
                    scadaaccessType={scadaaccessType}
                    selectedUserslist={selectedUsers}
                    scadaId={scadaId}
                    existingScadaName={scadaName}
                  />
                </div>
              ) : isScadaContentVisible ? (
                // If in view mode
                <div className="flex justify-between items-center w-full" style={{padding:'8px 16px'}}>
                  <div className="">
                  {/* <Breadcrumbs breadcrump={breadcrump}  onActive={handleActiveIndex} /> */}
                  <Breadcrumbs breadcrump={bredcrumbList}  onActive={handleActiveIndex} maxwidth={'400px'}/>
                    {/* <BredCrumbsND breadcrump={breadcrump} onActive={handleActiveIndex} /> */}
                  </div>
                  {/* <TypographyNDL variant="heading-01-xs" value={scadaName} /> */}
                  <div className="ml-auto flex space-x-2">
                    <Button icon={Menuvertical} type="ghost" onClick={(e) => handleMenuToggle(e, scadaId)} />
                    {anchorEl && selectedItem?.id === scadaId && (
                      <ListNDL
                        options={menuOption}
                        Open={Boolean(anchorEl)}
                        keyValue="name"
                        keyId="id"
                        id="menu-options"
                        onclose={() => {
                          popClose() 
                        }}
                        anchorEl={anchorEl}
                        IconButton
                        isIcon
                        width="150px"
                        optionChange={(e, option) => handleOptionChange(e, option, scadaId)}
                      />
                    )}
                  </div>
                </div>
              ) : (
                // Default view when neither edit nor view mode is active
                <Grid container spacing={0}>
                  <Grid item lg={12} xs={12}>
                    <div>
                      <ScadaViewSelectbox
                        handleSnackbar={handleSnackbar}
                        editAccess={(access) => setEditAccess(access)}
                        onSearchChange={(text) => setSearchText(text)}
                        onAccessTypeChange={(type) => setSelectedAccessType(type)}
                        onSortOrderChange={(order) => setSortOrder(order)}
                        sortOrder={sortOrder}
                        CreateNewDash={CreateNewDash}
                      />
                    </div>
                  </Grid>
                </Grid>
              )}
            
          </div>
    
          {ProgressBar && <LoadingScreenNDL />}
           <ScadaModal
                  ref={scadaFormRef}
                  handleSnackbar={handleSnackbar}
                  getscadaviewList={(h,u)=>{props.getScadaViewList(h,u);handleUpCloseModal('delete')}}
                 // getscadaviewList={props.getScadaViewList}
                //  setListUpdated={props.setListUpdated}
                //  onReload={refreshData}
                  // selectedScadaView={selectedScadaView}
                />
          {/* <ScadaModal ref={scadaFormRef} handleSnackbar={handleSnackbar} selectedScadaView={selectedScadaView}/> */}
        </>
      </React.Fragment>
    );
    
})
export default ScadaHeader;