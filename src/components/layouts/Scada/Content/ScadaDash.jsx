import React, { useEffect, useState, forwardRef, useRef,useImperativeHandle} from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import { useParams,useLocation,useNavigate  } from "react-router-dom";
import { selectedPlant, userData, snackToggle, defaultScadaView,  snackMessage, snackType, searchTextAtom,
   selectedAccessTypeAtom, sortOrderAtom, scadaIdState, scadaContentVisibleState, selectedScadaViewState,
    scadaSelectedEditmodeType, scadaContentVisibleEditState,scadaHeaderFilter,currentScadaViewSkeleton,user} from "recoilStore/atoms";
import ScadaHeader from "components/layouts/Scada/Headers/ScadaHeader";
import ScadaModal from "components/layouts/Scada/Headers/ScadaModal";
import ScadaContent from "components/layouts/Scada/Content/ScadaContent";
import ScadaContentView from "components/layouts/Scada/Content/ScadaContentView";
import ScadaViewSelectbox from 'components/layouts/Scada/Headers/ScadaSelectbox';
import useScadaViewList from "components/layouts/Scada/hooks/useGetScadaViewList";
import useDeleteScadaView from 'components/layouts/Scada/hooks/useDeleteScadaView';
import useCreateScadaFavourite from 'components/layouts/Scada/hooks/useAddfavouritestar';
import useFavoriteStatus from "components/layouts/Scada/hooks/useFavoriteStatusstar";
import useFetchallfavdash from "components/layouts/Scada/hooks/useFetchallfavdash";
import TooltipNDL from 'components/Core/ToolTips/TooltipNDL';
import ModalNDL from 'components/Core/ModalNDL'; 
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL";

// import Grid from 'components/Core/GridNDL';
import Card from 'components/Core/KPICards/KpiCardsNDL';
import Button from 'components/Core/ButtonNDL';
import useTheme from 'TailwindTheme';
import ListNDL from 'components/Core/DropdownList/ListNDL.jsx';
// import Button from 'components/Core/ButtonNDL';
import Typography from 'components/Core/Typography/TypographyNDL';
// import Cardisplayicon from 'assets/neo_icons/Menu/scada/circuit-motor.svg';
// import Star from 'assets/neo_icons/Menu/scada/Star.svg?react';
// import GoldStar from 'assets/neo_icons/Menu/scada/star-filled.svg?react';
import useCheckdashboardFav from 'components/layouts/Scada/hooks/useCheckdashboardFav.jsx';
import useDeletefavstar from "components/layouts/Scada/hooks/useDeletefavstar";


import Menuvertical from 'assets/neo_icons/Menu/scada/Menu.svg?react';
import Usericon from 'assets/neo_icons/Menu/scada/users.svg?react';
import Lock from 'assets/neo_icons/Menu/scada/lock.svg?react';
import Globe from 'assets/neo_icons/Menu/scada/globe.svg?react';
import Edit from 'assets/neo_icons/Menu/scada/edit_bold.svg?react';
import Delete from 'assets/neo_icons/Menu/scada/delete_r.svg?react';
// import CardIcon from 'assets/neo_icons/Menu/scada/card_icon.svg?react';
import LoadingScreenNDL from "LoadingScreenNDL"

const getRelativeTime = (providedTime)=> {
  const givenTime = new Date(providedTime);
  const currentTime = new Date();

  const timeDifferenceInMilliseconds = currentTime - givenTime;
  const minutesDifference = Math.floor(timeDifferenceInMilliseconds / (1000 * 60));

  if (minutesDifference < 1) {
    return "Moments ago";
  } else if (minutesDifference < 60) {
    return `${minutesDifference} minute${minutesDifference > 1 ? "s" : ""} ago`;
  } else if (minutesDifference < 1440) { // 1440 minutes in a day
    const hoursDifference = Math.floor(minutesDifference / 60);
    return `${hoursDifference} hour${hoursDifference > 1 ? "s" : ""} ago`;
  } else if (minutesDifference < 2880) { // Between 24 hours and 48 hours
    return "Yesterday";
  } else if (minutesDifference < 10080) { // Less than 7 days
    const daysDifference = Math.floor(minutesDifference / (60 * 24));
    return `${daysDifference} day${daysDifference > 1 ? "s" : ""} ago`;
  } else if (minutesDifference < 20160) { // Between 7 and 14 days
    return "Last week";
  } else if (minutesDifference < 43200) { // Less than 30 days (approx)
    const weeksDifference = Math.floor(minutesDifference / (60 * 24 * 7));
    return `${weeksDifference} week${weeksDifference > 1 ? "s" : ""} ago`;
  } else if (minutesDifference < 525600) { // Less than 12 months (365 days * 24 hours * 60 minutes)
    const monthsDifference = Math.floor(minutesDifference / (60 * 24 * 30));
    return `${monthsDifference} month${monthsDifference > 1 ? "s" : ""} ago`;
  } else {
    return "A while ago";
  }
}

const ScadaDashboard = forwardRef((props, ref) => {
  const navigate = useNavigate(); 
  const  {moduleName} = useParams();
  const { ScadaViewListLoading, ScadaViewListData, getScadaViewList } = useScadaViewList();
  const [formType, setFormType] = useState(null);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [selectedStars, setSelectedStars] = useState([]); 
  const [open, setOpen] = useState(false);
  // const [searchText, setSearchText] = useState('');
      const [currUser] = useRecoilState(user);
  
  // const [selectedAccessType, setSelectedAccessType] = useState(null);
  // const [sortOrder, setSortOrder] = useState('');
  const [, setOpenSnack] = useRecoilState(snackToggle);
  const [, SetMessage] = useRecoilState(snackMessage);
  const [, SetType] = useRecoilState(snackType);
  const [headPlant] = useRecoilState(selectedPlant);
  const [userDetails] = useRecoilState(userData);
  const mainTheme = useTheme();
  const { t } = useTranslation();
  const formRef = useRef();
  // Handlers to update filter states
  const [searchText, setSearchText] = useRecoilState(searchTextAtom);
  const [selectedAccessType, setSelectedAccessType] = useRecoilState(selectedAccessTypeAtom);
  // console.log('access type',selectedAccessType);
  const [sortOrder, setSortOrder] = useRecoilState(sortOrderAtom);
  const handleSearchChange = (text) => setSearchText(text);
  const handleAccessTypeChange = (type) => setSelectedAccessType(type);
  const handleSortOrderChange = (order) => setSortOrder(order);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteItemId, setSelectedDeleteItemId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [DefaultScadaViewID, setDefaultScadaViewID] = useRecoilState(defaultScadaView);
  const { DeleteScadaViewLoading, DeleteScadaViewData, DeleteScadaViewError, getDeleteScadaView } = useDeleteScadaView();
const{ CreateScadaFavouriteLoading, CreateScadaFavouriteData, CreateScadaFavouriteError, getCreateScadaFavourite } = useCreateScadaFavourite()
  const deleteScadaView = () => { formRef.current.openDialog('delete') }
 // const [isScadaContentVisible, setScadaContentVisible] = useState(false);
const [currentScadaId, setCurrentScadaId] = useState(null);
const [scadaId, setScadaId] = useRecoilState(scadaIdState);
    const [isScadaContentVisible, setScadaContentVisible] = useRecoilState(scadaContentVisibleState);
    const [isScadaContentVisibleEdit, setScadaContentVisibleEdit] = useRecoilState(scadaContentVisibleEditState);
    const { FetchallfavdashLoading, FetchallfavdashError, FetchallfavdashData, getFetchallfavdash } = useFetchallfavdash(headPlant.id, userDetails.id);
    const [selectedScadaView, setSelectedScadaView] = useRecoilState(selectedScadaViewState);
        const [selectedScadaViewSkeleton, setSelectedScadaViewSkeleton] = useRecoilState(currentScadaViewSkeleton);
    
    const [listUpdated, setListUpdated] = useState(false);
// const setScadaId = useSetRecoilState(scadaIdState);
  const scadaFormRefs = useRef();
  const scadaDelRef = useRef();
  const [showOptions, setShowOptions] = useState(false);
 // const editScadaView = () => { formRef.current.openDialog('edit') }
 const [DashID,setDashID]= useState('');
 const [reload, setReload] = useState(false);
 const [loadingStates, setLoadingStates] = useState({}); 
 const refreshData = () => setReload(prev => !prev);
 const [isEditCanvasMode, setEditCanvasMode] = useState(false);
 const [isEditCanvasType, setEditCanvasType] = useRecoilState(scadaSelectedEditmodeType);
    const [scadaFilter] = useRecoilState(scadaHeaderFilter)
    const [DeleteDialog,setDeleteDialog] = useState(false)
    const { CheckdashboardFavLoading, CheckdashboardFavError, CheckdashboardFavData, getCheckdashboardFav } = useCheckdashboardFav();
    const { DeletefavstarLoading, DeletefavstarError, DeletefavstarData, getDeletefavstar } = useDeletefavstar();

    useEffect(()=>{
      // console.log("routeObj",ScadaViewListData,moduleName)
      if(ScadaViewListData && moduleName ){
        let choosenSchema = localStorage.getItem('plantid') 
        setDashID(moduleName)
        navigate(`/${choosenSchema}/scada`) 
      }
      if(DashID){
        let DataID = ScadaViewListData?.all?.find((item) => item.id === DashID);
        if(DataID){
          setDashID('')
          handleCardClick(DataID)
        }else{
          setDashID('')
          handleSnackbar('Dashboard not found or deleted.', 'warning');
        }
        
      } 
    },[ScadaViewListData,moduleName])

    useEffect(()=>{
       
        setScadaContentVisible(false);
        setScadaContentVisibleEdit(false);
        setScadaId(null)  
    },[])

    useImperativeHandle(ref, () => ({
      getScadaViewList: (h,u) => getScadaViewList(h,u)  
    }))

    
 
 const openDialog = (action) => {
  //console.log("Dialog action:", action);
  // Any additional logic to open the dialog
};

const setLoadingForScada = (scadaId, isLoading) => {
  setLoadingStates(prevState => ({
    ...prevState,
    [scadaId]: isLoading
  }));
};
 
  const handleCardClick = (itemId) => {
    if (!anchorEl) {
   setCurrentScadaId(itemId.id);
   setDefaultScadaViewID(itemId.id);
  // setSelectedScadaView(scadaId);
     // Pass scadaId to ScadaSelectBox if needed
    setScadaId(itemId.id); // Set the selected scadaId
    setScadaContentVisible(true); // Show ScadaContent
    setScadaContentVisibleEdit(false);
    //console.log(scadaId);
    setEditCanvasMode(false); 
    setEditCanvasType(false);
    setSelectedScadaView(itemId);
   // console.log('set item id',itemId)
  }
  };
  
  const handleSnackbar = (message, type) => {
    SetMessage(message);
    SetType(type);
    setOpenSnack(true)
}

const togglePopper = (e) => {
  e.stopPropagation();
  setOpen(open ? null : e.currentTarget); // Toggle the menu
};

const handleMenuToggle = (e, item) => {
  e.stopPropagation(); // Prevents propagation to card click
  setAnchorEl(e.currentTarget); // Open menu
  setSelectedItem(item); // Set selected item for later use
};
// const togglePopper = (e, value) => {
//   console.log("Popper toggled for item:", value);
//   setOpen(open ? null : e.currentTarget); // Toggle the menu
// };


// const menuOption = [
//   { id: "1", name: "Edit" },
//   { id: "2", name: "Delete" }
// ];


const menuOption = [
  {id:"1",name:"Edit",icon:Edit,toggle: false,stroke:'#0090FF',},
  {id:"2",name:"Delete",icon:Delete,color:"#CE2C31",stroke:'#CE2C31',toggle: false},
]

useEffect(()=>{
        // console.log(DeletefavstarLoading, DeletefavstarError, DeletefavstarData,"DeletefavstarLoading, DeletefavstarError, DeletefavstarData")
        if(!DeletefavstarLoading && !DeletefavstarError && DeletefavstarData){
            let selectedScada = selectedScadaView ? selectedScadaView : selectedScadaViewSkeleton[0]
            getDeleteScadaView({ scada_id: selectedScada.id });
        }
    },[DeletefavstarLoading, DeletefavstarError, DeletefavstarData])


const handleOptionChange = (e, option, itemId) => {
 
   
//  console.log("scadaDelRef.current:", scadaDelRef.current); // Check if defined
//     if (!scadaDelRef.current) {
//         console.error("scadaDelRef.current is undefined");
//         return;
//     }

  if (e === "1") {
   // console.log('Handling Edit for item:', itemId.name);
    setCurrentScadaId(itemId.id);
    setSelectedScadaView(itemId);
    setDefaultScadaViewID(itemId.id);
    setScadaId(itemId.id); // Set the selected scadaId
    setScadaContentVisible(false); // Show ScadaContent
    setScadaContentVisibleEdit(true);
    setEditCanvasMode(true); 
    setEditCanvasType(true);
  } else if (e === "2") {
   // console.log('Handling Delete for item:', itemId);
   setFormType("delete"); 
   props.DeleteDialog('delete')
  //  scadaDelRef.current.openDialog('delete');
    setSelectedScadaView(itemId); // Set itemId in Recoil state for delete
   
      //console.log('Handling state for item:', selectedScadaView.id);
    
  
  }
 
  setAnchorEl(null); // Close menu after option is selected
};


const handleDeleteConfirm = () => {
  // Perform delete action for selectedItem
  console.log("Deleting item:", selectedItem);
  setDeleteDialogOpen(false);
};

const handleDeleteCancel = () => {
  setDeleteDialogOpen(false);
};

 useEffect(()=>{
        if(!CheckdashboardFavLoading && !CheckdashboardFavError && CheckdashboardFavData){
            console.log(CheckdashboardFavData,"CheckdashboardFavDataCheckdashboardFavData")
            
            if(CheckdashboardFavData.length>0){
                let selectedScada = selectedScadaView ? selectedScadaView : selectedScadaViewSkeleton[0]
                let OtherUser = CheckdashboardFavData.findIndex(f=> f.user_id !== currUser.id)
                console.log(OtherUser,"OtherUser")
                if(OtherUser >= 0){
                    props.handleSnackbar(
                        'Scada Dashboard you selected to delete is marked as a favorite by some shared users.',
                        'warning'
                    );
                    setSelectedScadaView(null) 
                    props.handleDialogClose();
                }else{
                    getDeletefavstar({
                        scada_id: selectedScada.id,
                        user_id: currUser.id,
                        line_id: headPlant.id
                    });
                }
                // props.getscadaviewList(headPlant.id, currUser.id)
                
            }else{
                let selectedScada = selectedScadaView ? selectedScadaView : selectedScadaViewSkeleton[0]
                getDeleteScadaView({ scada_id: selectedScada.id });
                
            }
        }
    },[CheckdashboardFavLoading, CheckdashboardFavError, CheckdashboardFavData])

  useEffect(() => {
    if (!isDataFetched && headPlant.id && userDetails.id && !isScadaContentVisible && !isScadaContentVisibleEdit) {
      setIsLoading(true); // Start loading
      getScadaViewList(headPlant.id, userDetails.id)
        .then((data) => {
          if (data) {
            setIsDataFetched(true);
            setListUpdated(false)
          }
          setIsLoading(false); // End loading
        })
        .catch((error) => {
          setIsDataFetched(false);
          setIsLoading(false); // End loading on error as well
        });
    }
  }, [headPlant.id, userDetails.id, isDataFetched, listUpdated,isScadaContentVisible,isScadaContentVisibleEdit]);

  

  useEffect(() => {
    if (headPlant.id && userDetails.id) {
      getFetchallfavdash(headPlant.id, userDetails.id); // Call the hook function to fetch favorite dashboards
      //getScadaViewList(headPlant.id, userDetails.id)
    }
  }, [headPlant.id, userDetails.id]);

  useEffect(() => {
    if (!DeleteScadaViewLoading && !DeleteScadaViewError && DeleteScadaViewData) {
      getDeleteScadaView({ scada_id: scadaId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DeleteScadaViewLoading, DeleteScadaViewData]);

  // Log the updated list of favorite dashboards every time selectedStars changes
  // useEffect(() => {
  //   console.log("Updated list of favorite dashboards:", selectedStars);
  // }, [selectedStars]); // Trigger effect whenever selectedStars changes

  if (isLoading === true) {
    return (
      <React.Fragment>
    <LoadingScreenNDL />
    </React.Fragment>
    ) // Display the loader while loading
  }

   // Check if a dashboard is a favorite
   const isFavorite = (scadaIdval) => {
    return FetchallfavdashData?.some(fav => fav.scada_id === scadaIdval);
  };

  // Get color based on favorite status
  //const getStrokeColor = (scadaId) => (isFavorite(scadaId) ? 'gold' : 'gray');
  const getStarColor = (scadaId) => (isFavorite(scadaId) ? 'gold' : 'gray');

  // Toggle favorite status


  const handleStarClick = async (scadaId) => {
    setLoadingForScada(scadaId, true);
    try {
      if (isFavorite(scadaId)) {
        await getCreateScadaFavourite({ scada_id: scadaId, user_id: userDetails.id, line_id: headPlant.id });
        handleSnackbar('Removed from favorites', 'success');
      } else {
        await getCreateScadaFavourite({ scada_id: scadaId, user_id: userDetails.id, line_id: headPlant.id });
        handleSnackbar('Added to favorites', 'success');
      }
      // Refresh favorite list after toggle
      getFetchallfavdash();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      handleSnackbar('Failed to update favorite status', 'error');
    }finally {
      setLoadingForScada(scadaId, false);
    }
  };

  // Apply filters and sorting->old logic accesstype ->filter
  // const filteredData = ScadaViewListData?.all
  //   ?.filter((item) =>
  //     selectedAccessType ? item.access_type === parseInt(selectedAccessType) : true
  //   )
  //   .filter((item) =>
  //     searchText ? item.name.toLowerCase().includes(searchText.toLowerCase()) : true
  //   )
  //   .sort((a, b) => {
  //     if (sortOrder === 'atoz') return a.name.localeCompare(b.name);
  //     if (sortOrder === 'ztoa') return b.name.localeCompare(a.name);
  //     if (sortOrder === 'lastopened') return new Date(b.updated_ts) - new Date(a.updated_ts);
  //     return 0;
  //   });



  const userId = userDetails.id; // Assume this is the logged-in user's ID
//console.log('user',userId)
// Apply access type filters
let filteredData = [];
if (scadaFilter.Filter === 'onlyme') {
    // Show only dashboards created by the current user
    filteredData = ScadaViewListData?.all?.filter((item) => item.created_by === userId);
  //  console.log('filterd data',filteredData)
} else if (scadaFilter.Filter === 'starred') {
    // Ensure FetchallfavdashData is available and non-empty before filtering
    if (FetchallfavdashData && FetchallfavdashData.length > 0) {
        
        // Filter dashboards where the user's favorites match the dashboard's scada_id
        filteredData = ScadaViewListData?.all?.filter((item) =>
            FetchallfavdashData.some((fav) => fav.scada_id === item.id && fav.user_id === userId)
        );
    } else {
        console.warn("Favorite data is empty or not loaded yet.");
        filteredData = []; // No favorites found
    }
} else {
    // Show all dashboards if no specific filter is selected
    filteredData = ScadaViewListData?.all;
}


// console.log(filteredData,"filteredData",ScadaViewListData)
// Step 2: Apply search filter
if (scadaFilter.Search !== '') {
filteredData = filteredData
    ?.filter((item) =>
        searchText ? item.name.toLowerCase().includes(searchText.toLowerCase()) : true
    );
   }
  // else{
  //   filteredData = ScadaViewListData?.all;
    
  // }
// Step 3: Apply sorting
filteredData = filteredData?.sort((a, b) => {
    if (scadaFilter.Sort === 'atoz') return a.name.localeCompare(b.name);
    if (scadaFilter.Sort === 'ztoa') return b.name.localeCompare(a.name);
    if (scadaFilter.Sort === 'lastopened') return new Date(b.updated_ts) - new Date(a.updated_ts);
    if (scadaFilter.Sort === 'leastopened') return new Date(a.updated_ts) - new Date(b.updated_ts);
    return 0;
});
// console.log(props,"props")

const deletescadaview = () => {
  // Check if the dashboard exists in favorites
  // console.log(selectedScadaViewSkeleton,"deletescadaview",selectedScadaView)
  // return false
  console.log("enter",selectedScadaView)

  let selectedScada = selectedScadaView ? selectedScadaView : selectedScadaViewSkeleton[0]
  if (selectedScada.created_by !== currUser.id) {
      handleSnackbar(
          'You are not authorized to delete this SCADA Dashboard as it was created by others or shared with you.',
          'error'
      );
      setSelectedScadaView(null) 
      handleDialogClose();
      return;
  }

  getCheckdashboardFav(headPlant.id, selectedScada.id);
  // Proceed with the delete action if not a favorite
   
};

const handleDialogClose =()=>{
  setDeleteDialog(false)
} 
return (
  <>
    <div>
      {/* <ScadaModal
        ref={scadaDelRef}
        handleSnackbar={handleSnackbar}
        getscadaviewList={(headid,userid)=>getScadaViewList(headid,userid)}
       // setListUpdated={setListUpdated}
        // onReload={refreshData}
      /> */}
     
    </div>

    <div className="">
    {isScadaContentVisibleEdit ? (
    // When isScadaContentVisibleEdit is true, show the ScadaContent
    <ScadaContent
    scadaId={scadaId}
    handleSave={props.handleSave}
   // listUpdated={listUpdated}
    onBack={() => {
      setScadaContentVisible(false); // Keep the visibility of content when switching back
      setScadaContentVisibleEdit(false); // Set edit flag to true
      setEditCanvasMode(false); // Disable edit canvas mode
    }}
    
  />
  ) : isScadaContentVisible ? (
    // When isScadaContentVisible is true, show ScadaContentView
    <ScadaContentView
    scadaId={scadaId}
  //  listUpdated={listUpdated}
    onBack={() => {
      setScadaContentVisible(false); // Hide content view when going back
      setScadaContentVisibleEdit(false); // Hide edit view flag
      setEditCanvasType(false); // Reset edit canvas type
    }}
  />
    
      ) : (
        <div className="m-4" >
        
          {filteredData && filteredData.length > 0 ? (
            <div
            className="
              grid gap-4
              grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
          >
            {filteredData.map((item) => (
              <div key={item.id}>
                <Card
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "1rem",
                    cursor: "pointer",
                  }}
                  onClick={() => handleCardClick(item)}
                >
                  <div className="bg-Background-bg-tertiary rounded-lg h-[106px]">
                    <div className="flex justify-end items-center">
                      {loadingStates[item.id] ? (
                            <div class="reportStarloader"></div>
                      ):(
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click
                          handleStarClick(item.id); // Mark as favorite
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.4953 12.8933L9.242 13.5099L9.16666 13.5253C9.05262 13.5556 8.94866 13.6156 8.86539 13.6991C8.78212 13.7827 8.72253 13.8869 8.6927 14.0011C8.66288 14.1153 8.66388 14.2353 8.69561 14.3489C8.72735 14.4626 8.78867 14.5658 8.87333 14.6479L11.9547 17.6473L11.228 21.8839L11.2193 21.9573C11.2123 22.0752 11.2368 22.1929 11.2903 22.2983C11.3438 22.4037 11.4243 22.4929 11.5236 22.557C11.6229 22.621 11.7374 22.6575 11.8554 22.6627C11.9735 22.6679 12.0908 22.6416 12.1953 22.5866L15.9993 20.5866L19.7947 22.5866L19.8613 22.6173C19.9714 22.6606 20.091 22.6739 20.2078 22.6558C20.3247 22.6377 20.4346 22.5888 20.5264 22.5141C20.6181 22.4395 20.6884 22.3418 20.7299 22.231C20.7714 22.1203 20.7827 22.0005 20.7627 21.8839L20.0353 17.6473L23.118 14.6473L23.17 14.5906C23.2443 14.4991 23.293 14.3896 23.3111 14.2731C23.3293 14.1567 23.3163 14.0375 23.2734 13.9278C23.2305 13.818 23.1593 13.7216 23.067 13.6483C22.9747 13.575 22.8646 13.5275 22.748 13.5106L18.4947 12.8933L16.5933 9.03995C16.5383 8.9283 16.4531 8.83429 16.3475 8.76855C16.2418 8.70281 16.1198 8.66797 15.9953 8.66797C15.8709 8.66797 15.7489 8.70281 15.6432 8.76855C15.5375 8.83429 15.4523 8.9283 15.3973 9.03995L13.4953 12.8933Z"
                          fill={getStarColor(item.id)}
                        />
                      </svg>
                      
                      
                      )}
                    </div>
                    <div className="flex justify-center items-center">
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M8 8H20V24H8V8Z" fill="#8D8D8D" />
                        <path d="M8 32H20V40H8V32Z" fill="#8D8D8D" />
                        <path d="M28 24H40V40H28V24Z" fill="#8D8D8D" />
                        <path d="M28 8H40V16H28V8Z" fill="#8D8D8D" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-2" />
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                      <div>
                      <TooltipNDL title={item.name} placement="bottom" arrow   >
                        <Typography
                          variant="label-01-m"
                          style={{
                            maxWidth: "160px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          value={item.name}
                        />
                      </TooltipNDL>
                      </div>
                      {/* <div className="flex justify-center gap-1"> */}
                        <Typography
                          variant="paragraph-xs" color='tertiary'
                        >
                          {item.access_type === 1 && (
                            <>
                              <Globe /> Public   •  {" "}
                              {getRelativeTime(item.updated_ts)}
                            </>
                          )}
                          {item.access_type === 2 && (
                            <>
                              <Lock /> Private   •  {" "}
                              {getRelativeTime(item.updated_ts)}
                            </>
                          )}
                          {item.access_type === 3 && (
                            <>
                              <Usericon /> Shared   •  {" "}
                              {getRelativeTime(item.updated_ts)}
                            </>
                          )}
                        </Typography>
                      {/* </div> */}
                    </div>
                    <div>
                    {/* <div style={{ float: 'right' }} className="cursor-pointer" 
                     onClick={(e) => handleMenuToggle(e, item)} >
                       <Menuvertical/>
                       </div> */}
                       
                       <Button icon={Menuvertical}  type='ghost'    onClick={(e) => handleMenuToggle(e, item)}/>
                       {anchorEl && selectedItem?.id === item.id && (
                        <ListNDL
                          options={menuOption}
                          Open={Boolean(anchorEl)}
                          keyValue="name"
                          keyId="id"
                          id="menu-options"
                          onclose={() => {
                            setAnchorEl(null);
                            setSelectedItem(null);
                          }}
                          anchorEl={anchorEl}
                          IconButton
                          isIcon
                          width="150px"
                          optionChange={(e, option) => handleOptionChange(e, option, item)} // Pass option.id and item.id
                        />
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            ))}
            </div>
          ) : (
            <div className="flex justify-center items-center min-h-screen">
              <Typography
                variant="paragraph-s"
                color="Secondary"
                align="center"
                value={t("nodatainscadadashboard")}
              />
            </div>
          )}
        </div>
      )}
    </div>
  </>
);



});

export default ScadaDashboard;
