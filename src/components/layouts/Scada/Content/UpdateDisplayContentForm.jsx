import React, { useState, useEffect,useRef } from 'react';
// Recoil packages
import { useRecoilState } from 'recoil';
import { selectedPlant, user,  scadaContentVisibleState , selectedScadaViewState , dashBtnGrp, fetchedDashboardDataState} from "recoilStore/atoms"; // Recoil variables
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
import useFetchDashboardData from 'components/layouts/Dashboards/hooks/useFetchDashboardData';
const UpdateDisplayContentForm = ({ props, onAddDisplay, open, onClose,selectedNode, onUpdateDisplayData ,nodeType }) => {
  const { t } = useTranslation();
  const [currUser] = useRecoilState(user);
  const [headPlant] = useRecoilState(selectedPlant);
  const [switchIndex, setSwitchIndex] = useState(0);  // To switch between tabs
  const [selectedAsset, setSelectedAsset] = useState(null);  // To store selected asset
  const [selectedAssetByName, setSelectedAssetByName] = useState(null);

  const [selectedInstrument, setSelectedInstrument] = useState(null);  // To store selected instrument
  const [selectedMetric, setSelectedMetric] = useState([]);  // To store selected metric
  const [selectedMetric2, setSelectedMetric2] = useState(null);  // To store selected metric
  const [selectedInstrumentlist, setSelectedInstrumentlist] = useState(null);
  const [saveDetails,setSavedDetails] =useState(null);
  const { AssetsFetchLoading, AssetsFetchError, AssetsFetchData, getAssetsFetch }=useAssetsFetch();
  const [assets, setAssets] = useState([]);  // State to store fetched assets
  const [instruments, setInstruments] = useState([]);
  const [instrumentslist, setInstrumentslist] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [metrics2, setMetrics2] = useState([]);
  const [btGroupValue] = useRecoilState(dashBtnGrp);
  const [AssetErr,setAssetErr] = useState(false);
  const [InstruErr,setInstruErr] = useState(false);
  const [InstruErr2,setInstruErr2] = useState(false);
  const [MetricErr,setMetricErr] = useState(false);
  const [MetricErr2,setMetricErr2] = useState(false);
 // console.log('selected node details',selectedNode)
const { FetchallintrumentsbyEntityidLoading, FetchallintrumentsbyEntityidError,FetchallintrumentsbyEntityidData, getFetchallintrumentsbyEntityid }=useFetchallintrumentsbyEntityid();
const { FetchMetricbyInstrumentIdLoading, FetchMetricbyInstrumentIdError,FetchMetricbyInstrumentIdData, getFetchMetricbyInstrumentId }=useFetchMetricbyInstrumentId();
const { FetchInstrumentbyLineLoading, FetchInstrumentbyLineError,FetchInstrumentbyLineData, getFetchInstrumentbyLine }=useFetchInstrumentbyLine();
const {  fetchDashboardLoading, fetchDashboardData, fetchDashboardError, getfetchDashboard } = useFetchDashboardData();  
const [fetchedDashboardData, setFetchedDashboardData] = useRecoilState(fetchedDashboardDataState);
const instrumentsFetchedRef = useRef(false);
const metricFetchedRef = useRef(false);
const assetsFetchedRef = useRef(false);

 // ContentSwitcher data for tab selection
 const contentSwitcher = [
    { label: 'Assets', value: 'Assets' },
    { label: 'Instruments', value: 'Instruments' }
  ];

function Oncancel(){  
    setSwitchIndex(0)
    setSelectedInstrument(null)
    setSelectedMetric([]);
    setSelectedAsset(null)
    setSelectedMetric2(null)
    setSelectedInstrumentlist(null)
    setAssetErr(false)
    setInstruErr(false)
    setMetricErr(false)
    setInstruErr2(false)
    setMetricErr2(false)
    onClose()
    
}

// useEffect(() => {
//     if (selectedNode && assets.length > 0) {
//       console.log('Prefilling the form...');
//      console.log('selected metric',selectedNode.data.details.metric)
//       console.log('selected ins',selectedNode.data.details.instrument)
//       const matchingAsset = assets.find(asset => asset.name.trim().toLowerCase() === selectedNode.data.details.assets.trim().toLowerCase());  // Case insensitive and trimmed matching
//      // console.log('Matching assets:', matchingAsset);
//       if (matchingAsset) {
//         setSelectedAsset(matchingAsset);  // Set the selected asset with id and name
//       }
//       const matchingInstrument = instruments.find(instruments => instruments.name.trim().toLowerCase() === selectedNode.data.details.instrument.trim().toLowerCase());  // Case insensitive and trimmed matching
//       console.log('Matching matchingInstrument:', matchingInstrument);
//        if (matchingInstrument) {
//         setSelectedInstrument(matchingInstrument);  // Set the selected asset with id and name
//        }
 

//       const matchingMetric = assets.find(metrics => metrics.name.trim().toLowerCase() === selectedNode.data.details.metric.trim().toLowerCase());  // Case insensitive and trimmed matching
//       console.log('Matching matchingMetric:', matchingMetric);
//       if (matchingMetric) {
//         setSelectedMetric(matchingMetric);  // Set the selected asset with id and name
//       }
  
//      // setSelectedInstrument(selectedNode.data.details.instrument);
//      // setSelectedMetric(selectedNode.data.details.metric);
//     }
//   }, [selectedNode, assets]);

//working code
// useEffect(() => {
//     if (selectedNode ) {
//       console.log('Prefilling the form...');
//       console.log('selected metric', selectedNode.data.details.metric);
//       console.log('selected instrument', selectedNode.data.details.instrument);
      
//       const matchingAsset = assets.find(
//         asset => asset.name.trim().toLowerCase() === selectedNode.data.details.assets.trim().toLowerCase()
//       );
//       console.log('Matching asset:', matchingAsset);
//       if (matchingAsset) {
//         setSelectedAsset(matchingAsset);  // Set the selected asset
//       }
  
//       const matchingInstrument = instruments.find(
//         instrument => instrument.name.trim().toLowerCase() === selectedNode.data.details.instrument.trim().toLowerCase()
//       );
//       console.log('Matching instrument:', matchingInstrument);
//       if (matchingInstrument) {
//         setSelectedInstrument(matchingInstrument);  // Set the selected instrument
//       }
  
//       const matchingMetric = metrics.find(
//         metric => metric.name.trim().toLowerCase() === selectedNode.data.details.metric.trim().toLowerCase()
//       );
//       console.log('Matching metric:', matchingMetric);
//       if (matchingMetric) {
//         setSelectedMetric(matchingMetric);  // Set the selected metric
//       }
//     }
//   }, [selectedNode, assets, instruments, metrics]);  


useEffect(() => {
    if (selectedNode && nodeType==='display' && open) {
      console.log('Prefilling the form...',selectedNode.data);
      console.log('selected metric', selectedNode.data.details.metric);
      console.log('selected instrument', selectedNode.data.details.instrument);
      
     
      if(selectedNode.data.details.assets && selectedNode.data.details.assets && selectedNode.data.details.assets !=='N/A'){
        setSwitchIndex(0)
        // Match the asset first
        const matchingAsset = assets.find(
          asset => asset.name.trim().toLowerCase() === selectedNode.data.details.assets.trim().toLowerCase()
        );
        console.log('Matching asset:', matchingAsset);
        if (matchingAsset) { 
              setSelectedAsset(matchingAsset);  
          // Set the selected asset
          // console.log('matching asset ',matchingAsset.id)
          if (matchingAsset.id) {
              // instrumentsFetchedRef.current = true;  // Mark instruments as fetched
              getFetchallintrumentsbyEntityid(matchingAsset.id);  // Fetch instruments only once
            }
          //getFetchMetricbyInstrumentId(matchingAsset.id);
          setSelectedMetric(selectedNode.data.details.metric)
        }
      }else{
        setSwitchIndex(1)
        const matchingInstrument = instrumentslist.find(
          instrument => instrument.name.trim().toLowerCase() === selectedNode.data.details.instrument.trim().toLowerCase()
        );
        console.log('Matching instrument:', matchingInstrument);
        if (matchingInstrument) {
          setSelectedInstrumentlist(matchingInstrument);  // Set the selected instrument
          if (matchingInstrument.id) {
              getFetchMetricbyInstrumentId(matchingInstrument.id);  // Fetch instruments only once
            }
          
        }
      }
     
    }
  }, [selectedNode, assets,open,instrumentslist]);
  

    // Dependency array makes sure it runs when selectedNode changes
  useEffect(() => {
    if (headPlant.id) {
      getAssetsFetch(headPlant.id)
      getFetchInstrumentbyLine(headPlant.id)  
    }
  }, [headPlant.id]);
 
  

//   useEffect(() => {
//     if (selectedNode) {
//         console.log('this block exe')
//       // Prefill the form if selectedNode is available
//       setSelectedAsset(selectedNode.data.asset);
//       setSelectedInstrument(selectedNode.data.instrument);
//       setSelectedMetric(selectedNode.data.metric);
//     }
//   }, [selectedNode]);
 
   // Transform the fetched data for SelectBox
   useEffect(() => {
    if (AssetsFetchData) {
      const transformedAssets = AssetsFetchData.map((data) => ({
        id: data.id, // Use `id` as keyId
        name: data.name, // Use `name` as keyValue
      }));
      setAssets(transformedAssets);
    }
  }, [AssetsFetchData]);

  useEffect(() => {
    if (FetchInstrumentbyLineData) {
      const transformedInstru = FetchInstrumentbyLineData.map((data) => ({
        id: data.id, // Use `id` as keyId
        name: data.name, // Use `name` as keyValue
      }));
      setInstrumentslist(transformedInstru);
    }
  }, [FetchInstrumentbyLineData]);

  useEffect(() => { 
    if (FetchallintrumentsbyEntityidData) {
      // Transform the response to match SelectBox format
      const transformedInstruments = FetchallintrumentsbyEntityidData.map((item) => ({
        id: item.instrument.id, // Use instrument ID
        name: item.instrument.name, // Use instrument name
      }));
      const matchingInstrument = transformedInstruments.find(
        instrument => instrument.name.trim().toLowerCase() === selectedNode.data.details.instrument.trim().toLowerCase()
      );
      console.log('Matching instrument:', matchingInstrument);
      if (matchingInstrument) {
        setSelectedInstrument(matchingInstrument);  // Set the selected instrument
        if (matchingInstrument.id) {
            getFetchMetricbyInstrumentId(matchingInstrument.id);  // Fetch instruments only once
          }
        
      }
      setInstruments(transformedInstruments); // Set instruments state
    }
  }, [FetchallintrumentsbyEntityidData]);

  
  useEffect(() => {
    if (FetchMetricbyInstrumentIdData) {
      console.log(FetchMetricbyInstrumentIdData,"FetchMetricbyInstrumentIdData")
      // Transform the response to match SelectBox format
      const transformedMetrics = FetchMetricbyInstrumentIdData.map((item) => ({
        id: item.metric.id, // Use Metrics ID
        name: item.metric.name, // Use Metrics name
        title:item.metric.title,
        unit:item.metric.metricUnitByMetricUnit.unit,
      }));
      console.log(transformedMetrics,"FetchMetricbyInstrumentIdData")
      
        // console.log('Matching metric:', matchingMetric);
      
        if(selectedNode.data.details.assets && selectedNode.data.details.assets !=='N/A' && switchIndex === 0){
          // setSelectedMetric(matchingMetric)
        }else{
          let selectedMetric = selectedNode.data.details.metric
          if(Array.isArray(selectedMetric)){
            selectedMetric= ''
          }
          const matchingMetric = transformedMetrics.find(
            metric => metric.name.trim().toLowerCase() === selectedMetric.trim().toLowerCase()
          );
          if(matchingMetric) {
            setSelectedMetric2(matchingMetric);  // Set the selected metric
          }
        }
        
      if(switchIndex === 1){
        setMetrics2(transformedMetrics); // Set Metrics state  
      }else{
        setMetrics(transformedMetrics.filter(f=> f.name !== 'execution')); // Set Metrics state
      }
    }
  }, [FetchMetricbyInstrumentIdData]);


  useEffect(() => {
    // Only execute when the dashboard is not loading, and there is no error
    if (!fetchDashboardError && !fetchDashboardLoading && fetchDashboardData) {
        // Log the fetched data for debugging purposes
       // console.log('Fetched Dashboard Data:', fetchDashboardData);

        // Set the fetched dashboard data to state, or default to an empty array if no data is available
        setFetchedDashboardData(fetchDashboardData || []);
    } else {
        // Log if the data is still loading or there's an error
        if (fetchDashboardLoading) {
            console.log('Loading data...');
        } else if (fetchDashboardError) {
            console.log('Error fetching data:', fetchDashboardError);
        } else {
            console.log('No data available.');
        }
    }
}, [fetchDashboardLoading, fetchDashboardData, fetchDashboardError]);
const handleAssetChange = (event) => {
    const selectedId = event.target.value; // Get the selected ID
    const selectedOption = assets.find((asset) => asset.id === selectedId); // Find the selected option from assets
    setSelectedInstrument(null)
    setSelectedMetric([]);
    setSelectedAsset(selectedOption); // Set the selected option in state
    setAssetErr(false)
    if (selectedOption) {
      // Fetch instruments based on selected entity_id
      getFetchallintrumentsbyEntityid(selectedOption.id);
    }
  };

  const handleInstrumentslistChange = (event) => {
    const selectedinlistId = event.target.value; // Get the selected ID
    const selectedinlistOption = instrumentslist.find((instrumentslist) => instrumentslist.id === selectedinlistId); // Find the selected option from assets
    setSelectedInstrumentlist(selectedinlistOption); // Set the selected option in state
     setSelectedMetric2(null);
     setInstruErr2(false)
    if (selectedinlistOption) {
      // Fetch instruments based on selected entity_id
      getFetchMetricbyInstrumentId(selectedinlistOption.id);
    }
  };


  const handleInstrumentChange = (event) => {
    const selectedId = event.target.value;  // Get the selected instrument ID
  
    const selectedInstrumentOption = instruments.find((instrument) => instrument.id ===selectedId);  // Find the selected instrument
     setSelectedInstrument(selectedInstrumentOption);  // Update the selectedInstrument state
    setSelectedMetric([])
    setInstruErr(false)
    if (selectedInstrumentOption) {
      // Fetch instruments based on selected entity_id
      getFetchMetricbyInstrumentId(selectedInstrumentOption.id);
    }
};


  const handleMetricChange = (event) => {
    
    if(switchIndex === 0){
      setSelectedMetric(event); 
      setMetricErr(false)
    }else{
      const selectedmetricId = event.target.value; 
      let opt = switchIndex === 0 ? metrics : metrics2
      const selectedMetricOption = opt.find((metric) => metric.id === parseInt(selectedmetricId));
      setSelectedMetric2(selectedMetricOption); 
      setMetricErr2(false)
    }
    
    // console.log(metrics);// Ensure null if no valid selection
  };

  function formatWithOffset(date) {
    let isoString = date.toISOString();
    let offset = '+05:30'; // Specify the required offset
    return isoString.replace('Z', offset); // Replace 'Z' (UTC) with the desired offset
}

  

  // Handle save
  const handleSave = () => {
    if (switchIndex === 0 && selectedAsset && selectedInstrument && selectedMetric.length) {
      
      const lastTime = configParam.DATE_ARR(btGroupValue, headPlant);

      let url = "/dashboards/getdashboard"; 
      let to = new Date();
      let from = new Date(to.getTime() - 2 * 60 * 60 * 1000); // Two hours ago;
      let type ="singleText";
      let startrange = formatWithOffset(from);
      let endrange = formatWithOffset(to);

      let params = { 
          schema: headPlant.schema,
          instrument: selectedInstrument ? selectedInstrument.id : null,
          metric: selectedMetric,
          type: type,
          from: startrange,
          to: endrange,
          isConsumption: false
      }
    //  console.log(url,params);
   //  getfetchDashboard(url,params, [], false, [], '', lastTime );
     // API Call
    getfetchDashboard(
      url,
      params,
      [],
      false,
      [],
      '',
      lastTime,
    );
 

      const selectedFields = {
        asset: { name: selectedAsset.name }, // Replace with the actual selected asset
        instrument: { name: selectedInstrument.name, id: selectedInstrument.id }, // Replace with the actual selected instrument
        metric: selectedMetric,  // Replace with actual metric data
      };
     // console.log(selectedFields);
      //onAddDisplay(selectedFields); 
      onUpdateDisplayData(selectedFields);
    
      Oncancel(); // Close the modal after saving
      
      // Reset the selected values after save
    setSelectedAsset(null);
    setSelectedInstrument(null);
    setSelectedMetric([]);
    setSelectedInstrumentlist(null);
    } else if (switchIndex === 1 && selectedInstrumentlist && selectedMetric2) {
      // const details = {
      //   instrumentName: selectedInstrumentlist.name,
      //   metricName: selectedMetric.name,
      //   metricUnit: selectedMetric.unit,
      // };
      // setSavedDetails(details);
      //onAddDisplay(details);
      const selectedFields = {
        asset: { name: 'N/A' },
        instrument: { name: selectedInstrumentlist.name, id: selectedInstrumentlist.id }, // Replace with the actual selected instrument
        metric: { 
          name: selectedMetric2.name, 
          title: selectedMetric2.title, 
          unit: selectedMetric2.unit || 'N/A' // Correctly access the unit
        },  // Replace with actual metric data
      };
     // console.log(selectedFields);
     // onAddDisplay(selectedFields); 
      onUpdateDisplayData(selectedFields);
    
      Oncancel(); // Close the modal after saving
          // Reset the selected values after save
    setSelectedInstrumentlist(null);
    setSelectedMetric([]);
    } else {
      if(switchIndex === 0){
        if(!selectedAsset){
          setAssetErr(true)
        }else{
          setAssetErr(false)
        }
        if(!selectedInstrument){
          setInstruErr(true)
        }else{
          setInstruErr(false)
        }
        if(selectedMetric.length === 0){
          setMetricErr(true)
        }else{
          setMetricErr(false)
        }
      }else{
        if(!selectedInstrumentlist){
          setInstruErr2(true)
        }else{
          setInstruErr2(false)
        }
        if(!selectedMetric2){
          setMetricErr2(true)
        }else{
          setMetricErr2(false)
        }
      }
    }
  };

  //console.log('all assets',assets)
 


  return (
    <React.Fragment>

    <Modal open={open} onCancel={Oncancel}>
      <ModalHeaderNDL>
        <div className="flex">
          <div>
            <TypographyNDL variant="heading-01-xs" value="Update Data Display" />
            <TypographyNDL variant="paragraph-xs" value="Add a display to visualize instrument data in real-time"   color="tertiary"/>
          </div>
        </div>
      </ModalHeaderNDL>

      <ModalContentNDL>
    <div>
        
      {/* ContentSwitcher - Tabs */} 
       <div className="">
      <ContentSwitcherNDL 
        type="tab" // Add the 'type' prop here
        listArray={contentSwitcher}
        noMinWidth 
        switchIndex={switchIndex}
        contentSwitcherClick={(index) => {
            // setSelectedMetric(null)
            setSwitchIndex(index);
          }}
      
      />
      </div>

      {/* Conditionally render dropdowns based on selected tab */}
      {switchIndex === 0 && (
        <div className="mt-4">
              
          {/* Asset Dropdown */}
          <Grid item xs={6} sm={6}>
      
                <SelectBox
                                id="assets-options"
                                label="Assets"
                                placeholder="Select Assets"
                                edit
                                options={assets}  // Pass fetched user data here
                                keyValue="name"
                                keyId="id"
                                
                                onChange={handleAssetChange}
                                value={selectedAsset?.id || ''}
                                auto
                                error={AssetErr}
                                msg= {AssetErr ? 'please select Entity to link under this component': ''}
                            />

            {!AssetErr &&
              <TypographyNDL variant="paragraph-xs" value="Select Entity to link under this component"   color="tertiary"/>
            }
          </Grid>

          {/* Instrument Dropdown (Dependent on selected Asset) */}
          <div className="mt-4">
          <Grid item xs={6} sm={6}>

          
                      <SelectBox
              id="instruments-option"
              label={t('Instrument')}
              options={instruments}
              onChange={handleInstrumentChange}
              value={selectedInstrument?.id || ''}
              keyValue="name"
              keyId="id"
              auto
              disabled={!selectedAsset || FetchallintrumentsbyEntityidLoading}
              error={InstruErr}
              msg= {InstruErr ? 'please select Instruments to link under this component': ''}
            />
            {FetchallintrumentsbyEntityidLoading && !InstruErr && (
              <TypographyNDL variant="paragraph-xs" value="Loading instruments..." />
            )}


              {!InstruErr &&
              <TypographyNDL variant="paragraph-xs" value="Select Instruments to link under this component"    color="tertiary"/>}
          </Grid>
          </div>

          {/* Metric Dropdown (Dependent on selected Instrument) */}
          <div className="mt-4">
          <Grid item xs={6} sm={6}>
            <SelectBox
            id="metric-option"
              label={t('Metric')}
              options={metrics}
              multiple
              onChange={handleMetricChange}
              keyValue="title"
              keyId="id"
              auto
              value={selectedMetric}
              disabled={!selectedInstrument} // Disable if no instrument is selected
              error={MetricErr}
              msg= {MetricErr ? 'please select Metric to link under this component': ''}
            />
              {!MetricErr &&
              <TypographyNDL variant="paragraph-xs" value="Select Metric to link under this component"   color="tertiary" />}
          </Grid>
          </div>
          <div className='flex mt-4  float-right gap-2'>
            <Button type="secondary" onClick={Oncancel} value="Cancel" />
       
          <Button type="primary" value="Update" onClick={handleSave} />
          </div>
        </div>
      )}

      {/* Conditionally render Instruments dropdown */}
      {switchIndex === 1 && (
      <div className="mt-4">
          {/* Instrument Dropdown (Independent of Asset) */}

          <Grid item xs={6} sm={6}>
            <SelectBox
            id="instru-option"
              label={t('Instrument')}
              options={instrumentslist}
              value={selectedInstrumentlist?.id || ''}
              onChange={handleInstrumentslistChange}
              keyValue="name"
              keyId="id"
              auto
              error={InstruErr2}
              msg= {InstruErr2 ? 'please select Instruments to link under this component': ''}
            />
            {FetchInstrumentbyLineLoading && !InstruErr2 &&
              <TypographyNDL variant="paragraph-xs" value="Loading instruments..." />}

              
            {!InstruErr2 &&
              <TypographyNDL variant="paragraph-xs" value="Select Instruments to link under this component"   color="tertiary" />}
             
              
          </Grid>
        
          {/* Metric Dropdown (Dependent on selected Instrument) */}
          <div className="mt-4">
          <Grid item xs={6} sm={6}>
            <SelectBox
            id="metr-option"
              label={t('Metric')}
              options={metrics2}
              value={selectedMetric2 ? selectedMetric2.id : ''}
              onChange={handleMetricChange}
              keyValue="title"
              keyId="id"
              disabled={!selectedInstrumentlist} // Disable if no instrument is selected
              auto
            />
             {FetchMetricbyInstrumentIdLoading && !MetricErr2 &&
              <TypographyNDL variant="paragraph-xs" value="Loading instruments..." /> }
            {!MetricErr2 &&
              <TypographyNDL variant="paragraph-xs" value="Select Metric to link under this component"    color="tertiary"/>}
          </Grid>
          </div>

          <div className='flex mt-4  float-right gap-2'>
          <Button type="secondary" onClick={Oncancel} value="Cancel" />
          <Button type="primary" value="Update" onClick={handleSave} />
          </div>
         
        </div>
      )}
    </div>
    </ModalContentNDL>
    </Modal>
   
   </React.Fragment>
  );
};

export default UpdateDisplayContentForm;
