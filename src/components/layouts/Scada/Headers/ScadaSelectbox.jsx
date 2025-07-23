import React, { useState, useEffect , useCallback, useMemo, useRef} from 'react';
//import Standard from 'assets/neo_icons/Menu/Standard.svg?react';
//import Custom from 'assets/neo_icons/Menu/Custom.svg?react';
import Grid from 'components/Core/GridNDL'
import { useTranslation } from 'react-i18next';
//search
import ClickAwayListener from "react-click-away-listener";
import InputFieldNDL from 'components/Core/InputFieldNDL';
// Icons
//import AddPlusBtn from 'assets/neo_icons/Menu/scada/Button.svg?react';
//import AddLight from 'assets/neo_icons/Menu/add.svg?react';
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
//import Delete from 'assets/neo_icons/Menu/ActionDelete.svg?react';
//import Edit from 'assets/neo_icons/Menu/ActionEdit.svg?react';
import Search from 'assets/neo_icons/Menu/scada/search.svg?react';
import Clear from 'assets/neo_icons/Menu/ClearSearch.svg?react';
// Recoil packages
import { useRecoilState } from 'recoil';
import { themeMode,selectedAccessTypeAtom, selectedPlant, userData, currentScadaJson, scadaHeaderFilter,defaultScadaView, currentScadaViewSkeleton, scadaViewEditMode, currentUserRole, currentScadaId ,searchTextAtom} from "recoilStore/atoms"; // Recoil variables
// core component
import SelectBox from 'components/Core/DropdownList/DropdownListNDL';
import Button from 'components/Core/ButtonNDL';
import Typography from 'components/Core/Typography/TypographyNDL';


// use hooks
import useScadaViewList from '../hooks/useGetScadaViewList';
import ScadaViewForm from './ScadaModal';
import useSetCurrentScadaView from '../hooks/useSetCurrentScadaView';
//import useScadaViewList from "components/layouts/Scada/hooks/useGetScadaViewList";
//import { faPlus } from '@fortawesome/free-solid-svg-icons';
function ScadaSelectbox(props) {
    // state variables
    const [currTheme] = useRecoilState(themeMode) 
    const [headPlant] = useRecoilState(selectedPlant);
    const [userDetails] = useRecoilState(userData);
    const [formType, setFormType] = useState(null);
    // const [selectedScadaView, setSelectedScadaView] = useRecoilState(currentScadaJson)
    // const [, setSelectedScadaViewSkeleton] = useRecoilState(currentScadaViewSkeleton);
    const [ScadaSelectlist, setScadaSelectlist] = useState([]);
    const [editMode, setEditMode] = useRecoilState(scadaViewEditMode);
    const [DefaultScadaViewID, setDefaultScadaViewID] = useRecoilState(defaultScadaView);
    const [currUserRole] = useRecoilState(currentUserRole);
    const [Enabledelete, setEnabledelete] = useState()
    const { ScadaViewListLoading, ScadaViewListData, ScadaViewListError, getScadaViewList } = useScadaViewList();
    const { CurrentScadaViewLoading, CurrentScadaViewData, CurrentScadaViewError, getCurrentScadaView } = useSetCurrentScadaView();
    const [newScadaId, setnewScadaId] = useState('')
    const formRef = useRef()
    const { t } = useTranslation();
    const [AccessType] = useRecoilState(selectedAccessTypeAtom);
    const [selectedAccessType, setSelectedAccessType] = useState(AccessType); // e.g., '1', '2', '3'
const [sortOrder, setSortOrder] = useState(props.sortOrder); // 'atoz', 'ztoa', 'lastOpened'
   //search 
   const [homeInput, setHomeInput] = useState(false);
   const [homeSearchText, setHomeSearchText] = useState('');
    const [searchText, setSearchText] = useRecoilState(searchTextAtom);
   const scadaId = useRecoilState(currentScadaId);
   const [scadaFilter,setscadaFilter] = useRecoilState(scadaHeaderFilter)

//select box
    const dashboardFilterOption = [
        { id: "", name: ("All Dashboard") },
        { id: "onlyme", name: ("Only Me") },
        { id: "starred", name: ("Starred") },
        // { id: "1", name: ("Public") },
        // { id: "2", name: ("Only Me") },
        // { id: "3", name: ("Shared") },
    ]
    const dashboardSortOption = [
        { id: "atoz", name: ("Albhabetical-A to Z") },
        { id: "ztoa", name: ("Albhabetical-Z to A") },
        { id: "lastopened", name: ("Frequently Opened") },
        { id: "leastopened", name: ("Rarely Opened") },
    ]
 
//   const [debouncedHomeSearchText, setDebouncedHomeSearchText] = useState('');
    // It triggers while changing line
    useEffect(() => {
        getScadaViewList(headPlant.id, userDetails.id)
        setnewScadaId('')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant.id])

   
    // if (props.getScadaViewList) {
    //     console.log("getScadaViewList is available");
    // } else {
    //     console.log("getScadaViewList is not available in props");
    // }

    // It triggers whild scada list updates
    // useEffect(() => {
    //     try {
    //         if (!ScadaViewListError && !ScadaViewListLoading && ScadaViewListData) {
    //             let standard = ScadaViewListData.all.length > 0 ? ScadaViewListData.all.filter(x => x.standard) : [];
    //             let custom = ScadaViewListData.all.length > 0 ? ScadaViewListData.all.filter(x => !x.standard && x.userByCreatedBy.id === userDetails.id) : [];

    //             const currentScada = ScadaViewListData.default && Object.keys(ScadaViewListData.default) ? ScadaViewListData.default : null;
    //             if ((currentScada && currentScada.scada_dashboard)) {
    //                 let scadaid = "";
    //                 scadaid = newScadaId ? newScadaId : currentScada.scada_dashboard.id
    //                 setDefaultScadaViewID(scadaid)
    //                 const scada = ScadaViewListData.all.filter(x => x.id === scadaid);
    //                 const editAccess = scada[0].userByCreatedBy.id === userDetails.id ? true : currUserRole.id === 2 ? true : false;
    //                 props.editAccess(editAccess)
    //                 changeScada(scada);
    //             } else {
    //                 const scada = ScadaViewListData.all.filter(x => x.id === newScadaId);
    //                 if (scada.length > 0) {
    //                     const editAccess = scada[0].userByCreatedBy.id === userDetails.id ? true : currUserRole.id === 2 ? true : false;
    //                     props.editAccess(editAccess)
    //                     changeScada(scada)
    //                 };
    //             }
    //             // eslint-disable-next-line array-callback-return
    //             standard = standard.map(val => {
    //                 if (val.standard) {
    //                     return { ...val, "updated_by": '', "updated_ts": '', icon: Standard, RightIcon: true }
    //                 }
    //             })
    //             let ScadaDropDown = [...standard, ...custom.map(m => { return { ...m, icon: Custom, RightIcon: true, updated_by: t("UpdatedBy") + ' ' + m.updated_by } })]
    //             setScadaSelectlist(ScadaDropDown)
    //         }
    //         else {
    //             console.log("NODATA")
    //         }
    //     } catch (err) {
    //         console.log('error', err);
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [ScadaViewListData])
    // It triggers while set current scada
    // useEffect(() => {
    //     if (!CurrentScadaViewLoading && !CurrentScadaViewError && CurrentScadaViewData) {
    //         let obj = {"nodes":[],"edges":[],"viewport":{"x":0,"y":0,"zoom":1.5}};
    //         if (CurrentScadaViewData.scada_dashboard) {
    //             obj = CurrentScadaViewData.scada_dashboard.data;
    //             setDefaultScadaViewID(CurrentScadaViewData.scada_dashboard.id)
    //         }
    //         setSelectedScadaViewSkeleton(obj);
    //         localStorage.setItem('scada_layout', JSON.stringify(obj));
    //     } else {
    //         setSelectedScadaViewSkeleton({});
    //         if (selectedScadaView.length === 0) {
    //             setSelectedScadaView([])
    //         }

    //         localStorage.setItem('scada_layout', JSON.stringify({}));
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [CurrentScadaViewData, CurrentScadaViewError])

    // useEffect(() => {
    //     if (selectedScadaView.length > 0) {
    //         // Becaue of applying same recoil state object in to responsivelayout causing page crashing error               
    //         setSelectedScadaViewSkeleton({});
    //         let selectedDashObj = {
    //             line_id: headPlant.id,
    //             user_id: userDetails.id,
    //             scada_id: selectedScadaView[0].id
    //         }

    //         getCurrentScadaView(selectedDashObj)
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [selectedScadaView])

    //change scada
    // const changeScada = (scada) => {
    //     const editAccess = scada[0].userByCreatedBy.id === userDetails.id ? true : currUserRole.id === 2 ? true : false;
    //     const enableDelete = scada[0].userByCreatedBy.id === userDetails.id ? true : false
    //     setEnabledelete(enableDelete)
    //     props.editAccess(editAccess)
    //     setSelectedScadaView(scada);
    //     // console.log(scada,"changeDashboardchangeDashboard")
    //     setEditMode(false);
    // }
    // // it triggers while change a scada
    // const handleScadaChange = (e) => {
    //     try {
    //         const id = e.target.value;
    //         const scada = ScadaViewListData.all.filter(x => x.id === id);
    //         if (scada && scada.length > 0) {
    //             changeScada(scada)
    //         }
    //     } catch (err) {
    //         console.log('scada select error', err)
    //     }
    // }
    // console.log(formRef,"formRef")
    // enables a create dashboard modal
    const createScadaView = () => { formRef.current.openDialog('add') }
   const editScadaView = () => { formRef.current.openDialog('edit') }
    const deleteScadaView = () => { formRef.current.openDialog('delete') }

    //search icon
    const clickAwayHomeSearch = () => {
        if (scadaFilter.Search === '')
          setscadaFilter({...scadaFilter,SearchOpen:false})
        else
            setscadaFilter({...scadaFilter,SearchOpen:true})
    }

// useEffect(() => {
//         const timer = setTimeout(() => {
//             setDebouncedHomeSearchText(homeSearchText);
//         }, 500); // Adjust the delay as needed
//         return () => clearTimeout(timer);
//     }, [homeSearchText]);

    const updateHomeSearch =(e) => {
       // setHomeSearchText(e.target.value);
       const text = e.target.value;
       setscadaFilter({...scadaFilter,Search:e.target.value})
      //  setHomeSearchText(text);
        props.onSearchChange(text); // Pass search text to parent
    }

    const handleAccessTypeChange = (e) => {
        const type = e.target.value;
        setscadaFilter({...scadaFilter,Filter:e.target.value})
        // setSelectedAccessType(type);
        props.onAccessTypeChange(type); // Pass access type to parent
    };

    const handleSortOrderChange = (e) => {
        const order = e.target.value;
        setscadaFilter({...scadaFilter,Sort:e.target.value})
        // setSortOrder(order);
        props.onSortOrderChange(order); // Pass sort order to parent
    };

    return (
        // <React.Fragment>
             
        //     <Grid container  spacing={2}>
        //     <Grid item lg={2} md={2}>
        //                 <div className='p-1'>
        //                 <Typography variant="heading-01-xs" value={"SCADA"} colors="secondary" />
                     
        //                 </div>
        //             </Grid>
                
                   
        //             <Grid item lg={2} md={2}>
        //                 {/* search */}

        //                 <div className="flex items-center" style={{ justifyContent: "right" }}>

        //                 <ClickAwayListener onClickAway={clickAwayHomeSearch}>

        //                     {homeInput ? <div><InputFieldNDL
        //                         autoFocus
        //                         id="Table-search"
        //                         placeholder={t("Search")}
        //                         size="small"
        //                         value={homeSearchText}
        //                         type="text"
        //                         onChange={updateHomeSearch}
        //                         disableUnderline={true}
        //                         startAdornment={<Search stroke={'#525252'} />}
        //                         endAdornment={homeSearchText !== '' ? <Clear onClick={() => { setHomeSearchText(''); setHomeInput(false) }} /> : ''}

        //                     /></div> : <Button type={"secondary"} icon={Search} onClick={() => { setscadaFilter({...scadaFilter,SearchOpen:true}); }} />}
        //                 </ClickAwayListener>
        //                 </div>
        //                 </Grid>
        //                 <Grid item lg={3} md={3}>
        //                 {/* <SelectBox
        //                     labelId="dashboardSelect-label"
        //                     label=""
        //                     id="dashboardSelect-NDL"
        //                     options={ScadaSelectlist}
        //                     value={DefaultScadaViewID}
        //                     onChange={handleScadaChange}
        //                     keyValue="name"
        //                     keyId="id"
        //                     subtext="updated_by"
        //                     timestamp="updated_ts"
        //                     isIconRight
        //                     placeholder={t("All Dashboard")}
        //                 /> */}
        //                 <SelectBox
        //                     labelId="dashboardSelect-label"
        //                     label=""
        //                     id="dashboardSelect-NDL"
        //                     options={dashboardFilterOption}
        //                     value={selectedAccessType}
                          
        //                     keyValue="name"
        //                     keyId="id"
        //                     onChange={handleAccessTypeChange}
        //                   //  onChange={(e) => setSelectedAccessType(e.target.value)} 
        //                     isIconRight
        //                     placeholder={t("All Dashboard")}
        //                 />
        //                 </Grid>
        //                 <Grid item lg={3} md={3}>
        //                 <SelectBox
        //                     labelId="dashboardSelect-update-label"
        //                     label=""
        //                     id="dashboardSelect-update-NDL"
        //                     options={dashboardSortOption}
        //                     value={sortOrder}
        //                     //onChange={(e) => setSortOrder(e.target.value)}
        //                      onChange={handleSortOrderChange}
        //                     keyValue="name"
        //                     keyId="id"
        //                     // subtext="updated_by"
        //                     // timestamp="updated_ts"
        //                     isIconRight
        //                     placeholder={t("Sort By")}
        //                 />
        //                 </Grid>
        //                 <Grid item lg={2} md={2}>

        //                 {(headPlant.type === '2') &&
        //                  <Button id='dashboard-add' type={"primary"}  label={"New Dashboard"}   icon={Plus} value={"New Dashboard"} 
        //                  //onClick={createScadaView}
        //                  onClick={() => {
        //                     setFormType('add');
        //                     createScadaView();
        //                   }}
        //                  ></Button>}
                   
        //         </Grid>
               
        //         {/* <Grid item xs={2} style={{ display: 'flex', justifyContent: "flex-start" }}>
        //             {
        //                 editMode && (
        //                     <Button id='dashboard-edit' type={"ghost"} icon={Edit} onClick={editScadaView}></Button>
        //                 )
        //             }
        //             {
        //                 editMode && Enabledelete && (
        //                     <Button id='dashboard-delete' type={"ghost"} icon={Delete} onClick={deleteScadaView}></Button>
        //                 )
        //             }
        //         </Grid> */}
        //     </Grid>
        //     <ScadaViewForm handleSnackbar={props.handleSnackbar} ref={formRef}
        //         getScadaViewList={(headplant, userid) => { getScadaViewList(headplant, userid); }}
        //     />
        // </React.Fragment>

        <React.Fragment>
  <div className="flex justify-between items-center space-x-2 " style={{padding:'8px 16px'}}>
    {/* Left-aligned label */}
    <div className="flex-1 ">
      <Typography variant="heading-02-xs" value={"SCADA"} colors="secondary" />
    </div>

    {/* Right-aligned search box */}
    <div className="flex items-center  justify-end">
      <ClickAwayListener onClickAway={clickAwayHomeSearch}>
        {scadaFilter.SearchOpen ? (
          <div>
            <InputFieldNDL
              autoFocus
              id="Scadadash-search"
              placeholder={t("Search")}
              size="small"
              value={scadaFilter.Search}
              type="text"
              onChange={updateHomeSearch}
              disableUnderline={true}
              startAdornment={<Search stroke={currTheme === 'dark' ? "#b4b4b4" : '#202020'}/>}
              // endAdornment={homeSearchText !== '' ? '' : ''}
            endAdornment={scadaFilter.Search !== '' ? <Clear stroke={currTheme === 'dark' ? "#b4b4b4" : '#202020'} onClick={() => { setscadaFilter({...scadaFilter,Search:'',SearchOpen:true});props.onSearchChange(''); setHomeInput(true) }} /> : ''}
            />
          </div>
        ) : (
          <Button type={"ghost"} icon={Search} onClick={() => { setscadaFilter({...scadaFilter,SearchOpen:true}); }} />
        )}
      </ClickAwayListener>
    </div>

    {/* Right-aligned Access Type dropdown */}
    <div className="flex items-center justify-end min-w-[200px] max-w-[200px]">
      <SelectBox
        labelId="dashboardSelect-label"
        label=""
        id="dashboardSelect-NDL"
        options={dashboardFilterOption}
        value={scadaFilter.Filter}
        keyValue="name"
        keyId="id"
        onChange={handleAccessTypeChange}
        isIconRight
        placeholder={t("All Dashboard")}
      />
    </div>

    {/* Right-aligned Sort Order dropdown */}
    <div className="flex items-center justify-end min-w-[200px] max-w-[200px]">
      <SelectBox
        labelId="dashboardSelect-update-label"
        label=""
        id="dashboardSelect-update-NDL"
        options={dashboardSortOption}
        value={scadaFilter.Sort}
        onChange={handleSortOrderChange}
        keyValue="name"
        keyId="id"
        isIconRight
        placeholder={t("Sort By")}
      />
    </div>

    {/* Right-aligned New Dashboard button */}
    <div className="flex items-center justify-end ">
      {headPlant.type === '2' && (
        <Button 
          id='dashboard-add' 
          type={"primary"}  
          label={"New Dashboard"}   
          icon={Plus} 
          value={"New Dashboard"} 
          onClick={() => {
            setFormType('add');
            // createScadaView();
            props.CreateNewDash()
          }}
        />
      )}
    </div>
  </div>

  {/* Scada View Form */}
  {/* <ScadaViewForm 
    handleSnackbar={props.handleSnackbar} 
    ref={formRef}
    getScadaViewList={(headplant, userid) => { getScadaViewList(headplant, userid); }}

  /> */}
</React.Fragment>

    )
}
export default ScadaSelectbox;