/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useState, useEffect, forwardRef } from 'react';
import Standard from 'assets/neo_icons/Menu/Standard.svg?react';
import Custom from 'assets/neo_icons/Menu/Custom.svg?react';
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import { useRecoilState } from "recoil";
import { useTranslation } from 'react-i18next';
import {
  hierarchyvisible,
  hierarchyData,
  defaultHierarchyData,
  hierarchyExplore,
  exploreSelectetdHierarchy,
  onlineTrendsChipArr,
  onlineTrendsMetrArr,
  onlineTrendsData,
  parameterListExplore,
  selectedMeterName,
  selectedPlant,
  userData,
  snackMessage,
  snackToggle,
  snackType,
  assetHierarchy,
  metricGroupHierarchy,
  instrumentHierarchy,
  selectedHierarchy
} from "recoilStore/atoms";
import useAddorUpdateUserDefaultHierarchy from '../hooks/useAddorUpdateUserDefaultHierarchy';
import useLineHierarchy from '../hooks/useLineHierarchy';




const BrowserSelect = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const [hierarchyView] = useRecoilState(hierarchyData);
  const [instrumentHier, setInstrumentHier] = useState(hierarchyView);
  const [defaultHierarchy] = useRecoilState(defaultHierarchyData);
  const [seletedHierarchy, setSeletedHierarchy] = useRecoilState(exploreSelectetdHierarchy);
  const [, setShowHierarchy] = useRecoilState(hierarchyvisible)
  const [, setHierarchyArr] = useRecoilState(hierarchyExplore);
  const [, setSelectedChipArr] = useRecoilState(onlineTrendsChipArr);
  const [, setselectedMeterAndChip] = useRecoilState(onlineTrendsMetrArr);
  const [, setTrendsData] = useRecoilState(onlineTrendsData);
  const [, setParameterList] = useRecoilState(parameterListExplore);
  const [, setMeterName] = useRecoilState(selectedMeterName);
  const [, SetMessage] = useRecoilState(snackMessage);
  const [, SetType] = useRecoilState(snackType);
  const [, setOpenSnack] = useRecoilState(snackToggle);
  const [headPlant] = useRecoilState(selectedPlant);
  const [currUser] = useRecoilState(userData);
  const [, setDefaultHierarchyView] = useRecoilState(defaultHierarchyData)
  const [, setSelectedBrowserHierarchy]= useRecoilState(selectedHierarchy)
  const [hierarchyAsset, ] = useRecoilState(assetHierarchy);
  const [metricGroupAsset, ] = useRecoilState(metricGroupHierarchy);
  const [hierarchyInstrument, ] = useRecoilState(instrumentHierarchy);
  const { addOrUpdateUserDefaultHierarchyLoading, addOrUpdateUserDefaultHierarchyData, addOrUpdateUserDefaultHierarchyError, getAddorUpdateUserDefaultHierarchy } = useAddorUpdateUserDefaultHierarchy()
  const { linehierarchyLoading, linehierarchyData, linehierarchyError, getLineHierarchy } = useLineHierarchy();
  const [, setStandardBrowserList] = useState([]);
  const [, setCustomBrowserList] = useState([]);
  const addedFeature = [{ id: 'instrument', name: 'All Instruments',icon:Standard, line_id: headPlant.id, hierarchy: buildInstrumentHierarchy() }, { id: 'asset', name: "All Assets",icon:Standard, line_id: headPlant.id, hierarchy: buildAssetHierarchy() }, { id: 'metricgroup', name: "All Metric Group",icon:Standard, line_id: headPlant.id, hierarchy: buildGroupHierarchy() }];

  useEffect(() => {
    setStandardBrowserList(addedFeature);
    console.log("addedFeature",addedFeature)
    setCustomBrowserList(hierarchyView);
    let customHierachy = hierarchyView.map(e=> {return {...e,icon:Custom}})
    let finalHierarchyView=[...addedFeature,...customHierachy];
    setInstrumentHier(finalHierarchyView)
   
  },[hierarchyView]) 

  function buildInstrumentHierarchy() {

    const hierarchy = {
      "type": "entity",
      "icon": 12,
      "nodeId": 1,
    };

    hierarchy['id'] = headPlant.id;
    hierarchy['name'] = headPlant.name;

    hierarchy['children'] = [{
      "type": "entity",
      "icon": 12,
      "nodeId": 1,
      "id": "instruments",
      "name": "All Instruments",
      "children": hierarchyInstrument.length > 0 ? hierarchyInstrument : []
    }];

    return hierarchy;
  }

  function buildAssetHierarchy() {

    const hierarchy = {
      "type": "entity",
      "icon": 12,
      "nodeId": 0,
    };

    hierarchy['id'] = headPlant.id;
    hierarchy['name'] = headPlant.name;
    hierarchy['children'] = hierarchyAsset.length > 0 ? hierarchyAsset : [];
    return hierarchy;
  }

  function buildGroupHierarchy() {

    const hierarchy = {
      "type": "entity",
      "icon": 12,
      "nodeId": 0,
    };

    hierarchy['id'] = headPlant.id;
    hierarchy['name'] = headPlant.name;
    hierarchy['children'] = metricGroupAsset.length > 0 ? metricGroupAsset : [];
   
    return hierarchy;
  }



  const handleChange = (e, child) => {
    setSelectedBrowserHierarchy(e.target.value)
    if (e.target.value === 'instrument') {
      localStorage.setItem('exploreSelectetdHierarchy', JSON.stringify({ id: e.target.value, "type": "standard" }))
      const hierarchyInstrumentObj = buildInstrumentHierarchy();

      setHierarchyArr(hierarchyInstrumentObj);
      setSeletedHierarchy({ id: e.target.value, type: "standard" })
    }

    else if (e.target.value === 'asset') {
      localStorage.setItem('exploreSelectetdHierarchy', JSON.stringify({ id: e.target.value, "type": "standard" }))
  
      const hierarchyAssetObj = buildAssetHierarchy();

      setHierarchyArr(hierarchyAssetObj);
      setSeletedHierarchy({ id: e.target.value, type: "standard" })
    }

    else if (e.target.value === 'metricgroup') {
      localStorage.setItem('exploreSelectetdHierarchy', JSON.stringify({ id: e.target.value, "type": "standard" }))
  
      const hierarchyAssetObj = buildGroupHierarchy();

      setHierarchyArr(hierarchyAssetObj);
      setSeletedHierarchy({ id: e.target.value, type: "standard" })
    }

    else {
      localStorage.setItem('exploreSelectetdHierarchy', JSON.stringify({ id: e.target.value, "type": "custom" }))
      let tempProps1 = JSON.parse(JSON.stringify(hierarchyView));

      let tempProps2 = tempProps1.filter((value, index) => value.id === e.target.value);
      let selectedArr = tempProps2[0].hierarchy[0];
      setHierarchyArr(selectedArr)
      setSeletedHierarchy({ id: e.target.value, type: "custom" })
    }



    setShowHierarchy(false)
    setSelectedChipArr([])
    setselectedMeterAndChip([])
    setParameterList([])
    setTrendsData([])
    setMeterName([])
    getAddorUpdateUserDefaultHierarchy({ hier_id: e.target.value, user_id: currUser.id, line_id: headPlant.id })
    localStorage.setItem('MetricName', "")
    localStorage.setItem('selectedChildrenObj', JSON.stringify([]))
    localStorage.setItem('selectedParamDet', JSON.stringify({}))
    localStorage.setItem('selectedMeterExplore', "")
  }


  useEffect(() => {
    if (!addOrUpdateUserDefaultHierarchyLoading && addOrUpdateUserDefaultHierarchyData && !addOrUpdateUserDefaultHierarchyError) {
      getLineHierarchy(headPlant.id, currUser.id)
    }

  }, [addOrUpdateUserDefaultHierarchyLoading, addOrUpdateUserDefaultHierarchyData, addOrUpdateUserDefaultHierarchyError])


  useEffect(() => {
    if (!linehierarchyLoading && linehierarchyData && !linehierarchyError) {
      if (linehierarchyData.length > 0) {
        setDefaultHierarchyView(linehierarchyData);
        SetMessage(t('Updated') + headPlant.name + t('DefaultHierarchy') + linehierarchyData[0].hierarchy.name)
        SetType("success")
        setOpenSnack(true)
      } else {
        console.log("GetUserLineHierarchy returndata undefined");
      }
    }

  }, [linehierarchyLoading, linehierarchyData, linehierarchyError])


  useEffect(() => {

    const storedData = localStorage.getItem('exploreSelectetdHierarchy');
    const parsedData = JSON.parse(storedData);
    if (parsedData && ((parsedData.type === 'standard') || ((parsedData.type === 'custom') && hierarchyView.length > 0))) {
      let finalHier = parsedData.type === 'standard' ? addedFeature : hierarchyView;
      if (headPlant.id === finalHier[0].line_id) {
        let tempProps1 = JSON.parse(JSON.stringify(finalHier));
        let localSelectedHierarchy =JSON.parse(localStorage.getItem('exploreSelectetdHierarchy'))
        let finalHierarchyFromLocal;
        if (finalHier[0].id !== "" && finalHier[0].id !== undefined) {
          if (localSelectedHierarchy !== "" && localSelectedHierarchy !== undefined && localSelectedHierarchy !== null) {
            finalHierarchyFromLocal = tempProps1.filter((value, index) => value.id === localSelectedHierarchy.id);
            
          }
          if (finalHierarchyFromLocal !== "" && finalHierarchyFromLocal !== undefined && finalHierarchyFromLocal.length > 0) {
            let selectedArr = finalHierarchyFromLocal[0].hierarchy;
            setHierarchyArr(selectedArr)
            setSelectedBrowserHierarchy(localSelectedHierarchy)
            setSeletedHierarchy(localSelectedHierarchy)
          } else {
            let finalHierarchyFromAtom = tempProps1.filter((value, index) => value.id === finalHier[0].id);
            if (finalHierarchyFromAtom !== "" && finalHierarchyFromAtom !== undefined && finalHierarchyFromAtom.length > 0) {
              let selectedArr = finalHierarchyFromAtom[0].hierarchy[0];
              setHierarchyArr(selectedArr)
              setSelectedBrowserHierarchy(finalHier[0].id)
              setSeletedHierarchy({ id: finalHier[0].id, type: parsedData.type == 'standard' ? 'standard' : 'custom' })

              localStorage.setItem('exploreSelectetdHierarchy', JSON.stringify({ id: finalHier[0].id, "type": parsedData.type == 'standard' ? 'standard' : 'custom' }))

              //clearing all explore data - as page is loaded for new hierarchy
              setSelectedChipArr([])
              setselectedMeterAndChip([])
              setParameterList([])
              setTrendsData([])
              setMeterName([])
              localStorage.setItem('MetricName', "")
              localStorage.setItem('selectedChildrenObj', JSON.stringify([]))
              localStorage.setItem('selectedParamDet', JSON.stringify({}))
              localStorage.setItem('selectedMeterExplore', "")
            }
          }
        } else {
          if (defaultHierarchy !== "" && defaultHierarchy !== undefined && defaultHierarchy.length > 0) {
            let selectedArr = defaultHierarchy[0].hierarchy.hierarchy[0];
            setHierarchyArr(selectedArr)

            if (seletedHierarchy === "" || seletedHierarchy === undefined || seletedHierarchy === null) {
              setSelectedBrowserHierarchy(defaultHierarchy[0])
              setSeletedHierarchy({id:defaultHierarchy[0].hierarchy.id,type:'standard'})

            }
          }

        }
      } else {
        console.log("hierarchy view old");
      }
    }
  }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    , [hierarchyView, headPlant.id])
  // defaultHierarchy

  return (
    <div className='px-4 pt-3 pb-2'>
      
      <SelectBox
          labelId="hierarchyList-label"
          id="hierarchyList-NDL"
          options={instrumentHier} 
          value={seletedHierarchy.id ? seletedHierarchy.id : ""}
          onChange={handleChange}
          keyValue="name"
          keyId="id"
          isIconRight
          auto
      />
    </div>
  );
})
export default BrowserSelect;