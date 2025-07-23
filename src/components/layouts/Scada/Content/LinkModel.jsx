import React, { useState, useEffect, useRef } from 'react';
// Recoil packages
import { useRecoilState } from 'recoil';
import { selectedPlant, user,  scadaContentVisibleState , selectedScadaViewState , dashBtnGrp, fetchedDashboardDataState,userData} from "recoilStore/atoms"; // Recoil variables
import configParam from 'config';
import ContentSwitcherNDL from 'components/Core/ContentSwitcher/ContentSwitcherNDL';
import SelectBox from 'components/Core/DropdownList/DropdownListNDL'; 
import Grid from 'components/Core/GridNDL'; 
import TypographyNDL from 'components/Core/Typography/TypographyNDL';
import { useTranslation } from 'react-i18next';
import useAssetsFetch from '../hooks/useAssetFetch';
import useFetchallintrumentsbyEntityid from '../hooks/useFetchallintrumentsbyEntityid';
import useFetchMetricbyInstrumentId from '../hooks/useFetchMetricbyInstrumentId';
import useFetchInstrumentbyLine from '../hooks/useFetchInstrumentbyLine';
import Button from 'components/Core/ButtonNDL';
import Modal from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import InputFieldNDL from 'components/Core/InputFieldNDL';
import useFetchDashboardData from 'components/layouts/Dashboards/hooks/useFetchDashboardData';
import useScadaViewList from "components/layouts/Scada/hooks/useGetScadaViewList";
import useDashboardList from "components/layouts/Dashboards/hooks/useGetDashboardList.jsx"

const LinkModel = ({ onAddDisplay, open, onClose,selectedNode,nodeType  }) => {
  const { t } = useTranslation();   
  const [headPlant] = useRecoilState(selectedPlant);
  const [userDetails] = useRecoilState(userData);
  const [switchIndex, setSwitchIndex] = useState(0);  // To switch between tabs 
  const [selectedDashboard, setSelectedDashboard] = useState(null);  // To store selected instrument 
  const [name, setName] = useState(''); // State for the dashboard name 
  const [DashboardErr,setDashErr] = useState(false); 
  const [nameError,setnameError] = useState(false);
  const [ListDashboard,setListDashboard] = useState([]);
  const { ScadaViewListLoading, ScadaViewListData, getScadaViewList } = useScadaViewList();
  const { DashboardListLoading, DashboardListData, DashboardListError, getDashboardList } = useDashboardList();
     

  useEffect(() => {
    if (headPlant.id) {
        getScadaViewList(headPlant.id, userDetails.id)
        getDashboardList(headPlant.id, userDetails.id)
    }
  }, [headPlant.id]);

  useEffect(()=>{
    // console.log(selectedNode,nodeType,"selectedNode,nodeType")
    if(selectedNode && nodeType === 'Link'){
        setName(selectedNode.data.details.name)
        setSelectedDashboard(selectedNode.data.details.LinkData)

    }
  },[selectedNode,nodeType,open])

  useEffect(()=>{
    
    let custom = [];
    if (headPlant.type === '2' && DashboardListData) {
        custom = DashboardListData.length > 0 && DashboardListData[0].dashboardList
            ? DashboardListData[0].dashboardList.filter(
                x => x.id !== "7e68b1cc-d842-4ea1-ab97-c425f4ac7be2" &&
                (x.userByCreatedBy.id === userDetails.id || 
                (x.standard === true 
                    ? x.user_access_list && x.user_access_list.length > 0 
                        ? x.user_access_list.includes(userDetails.id) 
                        : true 
                    : false))
            ) 
            : [];
            if(custom.length> 0){
                custom = custom.map((val) => {
                return ({
                    ...val,
                    discText: 'Dashboard',
                    accessType:val.standard === true && val.custome_dashboard === true && !val.user_access_list ? "Public" : val.standard === false && val.custome_dashboard === true ? "Private" :"Shared",
                })
                })
                // console.log('tilelist',custom)

            }
    }
    if(custom.length && ScadaViewListData){
        // console.log(ScadaViewListData,"ScadaDashboardList",DashboardListData,custom)
        setListDashboard([...ScadaViewListData.all.map(s=> {return {...s,discText:'SCADA'}}),...custom])
    }
    
  },[ScadaViewListData,DashboardListData,DashboardListError])

  


    const handleInstrumentChange = (event,data) => {
        const selectedId = event.target.value;  // Get the selected instrument ID
        const selectedInstrumentOption = data.find((dash) => dash.id === selectedId);  // Find the selected instrument
        console.log(selectedInstrumentOption,"selectedInstrumentOption",data,selectedId)
        setSelectedDashboard(selectedInstrumentOption);  // Update the selectedDashboard state
        setDashErr(false)
    
    };  

  

  // Handle save
  const handleSave = () => { 
        if(!name){
            setnameError(true)
            return false
        }
        if(!selectedDashboard){
            setDashErr(true)
            return false
        }
      const selectedFields = {
        name: name,
        LinkData: selectedDashboard
      };
    //  console.log(selectedFields,"selectedFields",selectedDashboard);
      onAddDisplay(selectedFields,'link');    
      onClose()
  };  

    const handleNameChange = (e) => {
        //nameRef.current.value = e.target.value;  // Update the value directly via the ref
        if(e.target.value){
            setnameError(false)
        }
        setName(e.target.value);
    };

    function Oncancel(){ 
        setSelectedDashboard(null); 
        setDashErr(false)
        setName('')
        onClose()
    
      }


  return (
    <React.Fragment>

    <Modal open={open} onCancel={Oncancel} id="AddLinkMDL">
      <ModalHeaderNDL>
        <div className="flex">
          <div>
            <TypographyNDL variant="heading-01-xs" value={(selectedNode ? "Edit" : "Add") +" Link Panel"} />
          </div>
        </div>
      </ModalHeaderNDL>

      <ModalContentNDL>
    <div> 

      {/* Conditionally render dropdowns based on selected tab */} 
        <div className="mt-4">
              
          {/* Asset Dropdown */}
          <Grid item xs={6} sm={6}>
      
            <InputFieldNDL
                autoFocus
                id="displayname-id"
                label="Display Name"
                maxLength={'50'}
                placeholder="Type Here" 
                value={name} // Optional: bind value to state if you want to manage the input value
                onChange={handleNameChange} // Update state on change
                helperText={nameError ? 'Please Enter the name' : ''}
                error={nameError}
            /> 
            {!nameError &&
              <TypographyNDL variant="paragraph-xs" value="This will be displayed in the dashboard, Maximum 50 Characters"   color="tertiary"/>}
         
          </Grid>

          {/* Instrument Dropdown (Dependent on selected Asset) */}
          <div className="mt-4">
          <Grid item xs={6} sm={6}>

          
          <SelectBox
            id="instruments-option"
            label={'Dashboard'}
            options={ListDashboard}
            onChange={handleInstrumentChange}
            value={selectedDashboard?.id || ''}
            keyValue="name"
            keyId="id"
            auto
            error={DashboardErr}
            msg= {DashboardErr ? 'please select Dashboard to link under this component': ''}
            isDescription
          />
            {ScadaViewListLoading && (
              <TypographyNDL variant="paragraph-xs" value="Loading Dashboard..." />
            )}

              {!DashboardErr &&
              <TypographyNDL variant="paragraph-xs" value="Select a Dashboard to link under this "    color="tertiary"/>}
          </Grid>
          </div>
 
          
          <div className='flex mt-4  float-right gap-2'>
            <Button type="secondary" onClick={Oncancel} value="Cancel" />
       
          <Button type="primary" value={selectedNode ? "Update" : "Save"} onClick={handleSave} />
          </div>
        </div> 
    </div>
    </ModalContentNDL>
    </Modal>
   
   </React.Fragment>
  );
};

export default LinkModel;
