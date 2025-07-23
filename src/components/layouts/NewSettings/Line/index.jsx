/* eslint-disable no-unused-vars */
import React, { useState, useRef,useEffect } from "react";
import useTheme from "TailwindTheme";  
import "components/style/customize.css";
import { useRecoilState } from "recoil";
import {
  userDefaultLines,
  selectedPlant,
  selectedPlantIndex,
  snackToggle,
  snackMessage,
  snackType,
  snackDesc
} from "recoilStore/atoms";
import useSaveLineDetails from "./hooks/useUpdateLine";
import ConstomCardContent from "./components/NewCardContent";
import { useTranslation } from "react-i18next";
import useLineHeirarchy from './hooks/useLineHeirarchy'
import useUpdateChildLine from './hooks/useUpdateChildLine' 

export default function LineComponent(props) {
  const [userDefaultline, setUserDefaultLines] =
    useRecoilState(userDefaultLines);
  const [selectedIndex] = useRecoilState(selectedPlantIndex);
  const [headPlant, setheadPlant] = useRecoilState(selectedPlant);
  const [lineDisable, setLinedDisable] = useState(true);
  const [customName, setCustomName] = useState('')
  const [ChildIDs,setChildIDs] = useState([]);
  const { LineHeirarchyLoading, LineHeirarchyData, LineHeirarchyError, getLineHeirarchy } = useLineHeirarchy() 
  const { getUpdateChildLine } = useUpdateChildLine() 
  const [, SetMessage] = useRecoilState(snackMessage);
  const [, setSnackDesc] = useRecoilState(snackDesc);
  const [, SetType] = useRecoilState(snackType);
  const [, setOpenSnack] = useRecoilState(snackToggle);
  const {
    outLineUpdateLoading,
    outLineUpdateData,
    outLineUpdateError,
    getSaveLineDetails,
  } = useSaveLineDetails();
  const theme = useTheme();
  const { t } = useTranslation();
  const locationRef = useRef();
  const customNameRef = useRef();
  const nameRef = useRef();
  useEffect(() => {
    if (nameRef.current && locationRef.current && customNameRef.current) {
      nameRef.current.value = headPlant.name;
      locationRef.current.value = headPlant.location;
      customNameRef.current.value = headPlant.custom_name;
    }
    if(headPlant.type === '1'){
      getLineHeirarchy(headPlant.id)
    } 

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headPlant.name, headPlant.location, headPlant.custom_name]);
  useEffect(() => {
    if (!LineHeirarchyLoading && !LineHeirarchyError && LineHeirarchyData) {
        if(LineHeirarchyData.length>0){
          let ChildLine=[]
          // eslint-disable-next-line array-callback-return
          LineHeirarchyData[0].child_line_ids.map(v=>{
            let formatted = userDefaultline.map(x => x.line);
            let fromIndex = formatted.findIndex(x => x.id === v)
            if(fromIndex >= 0){
              ChildLine.push(userDefaultline.map(e=> {return e.line}).filter(x=> x.id === v)[0])
            }
            
          })
          setChildIDs(ChildLine)
        }
        
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [LineHeirarchyLoading, LineHeirarchyData, LineHeirarchyLoading])  

  const handlesaveClick = (value) => {
    setLinedDisable(value);
    nameRef.current.value = headPlant.name;
    locationRef.current.value = headPlant.location;
    customNameRef.current.value = headPlant.custom_name;
    
  };

  const callsavelines = () => {
    if (
      headPlant.id &&
      locationRef.current && locationRef.current.value &&
      nameRef.current && nameRef.current.value  
      
      
    ) 
    {

      console.log(customName, customNameRef.current.value)
      localStorage.setItem('custom_name', ( customNameRef.current.value !== undefined && customNameRef.current.value !== null) ? customNameRef.current.value : 'Neo')
     
      getSaveLineDetails(
        headPlant.id,
        locationRef.current.value,
        nameRef.current.value,
        headPlant.energy_asset,
        headPlant.dash_aggregation,
        headPlant.mic_stop_duration,
        headPlant.shift,
        headPlant.node,
        (customNameRef.current.value !== '' && customNameRef.current.value !== undefined && customNameRef.current.value !== null) ? customNameRef.current.value : ''
      );
      if(headPlant.type === '1'){
        getUpdateChildLine(headPlant.id,"{"+ChildIDs.map(e=> e.id).toString()+"}")
      }
    } else {
      console.log("NEW MODEL", "IDT", "undefined", "Line Setting", new Date());
    }
  };

  useEffect(() => {
    if (
      outLineUpdateData !== null &&
      outLineUpdateData.update_neo_skeleton_lines &&
      outLineUpdateData.update_neo_skeleton_lines.affected_rows > 0 &&
      !outLineUpdateError &&
      !outLineUpdateLoading
    ) {
      let data = outLineUpdateData.update_neo_skeleton_lines;
      if (data.affected_rows >= 1) {
        let temp = JSON.parse(JSON.stringify(headPlant));
        let temp1 = JSON.parse(JSON.stringify(userDefaultline));

        temp.name = data.returning[0].name;
        temp.location = data.returning[0].location;
        temp.customName = data.returning[0]?.custom_name

        temp1[selectedIndex].line.name = data.returning[0].name;
        temp1[selectedIndex].line.location = data.returning[0].location;
        temp1[selectedIndex].line.customName = data.returning[0].custom_name

        SetMessage('Updated');
        setSnackDesc('Line Info updated successfully')
        SetType("success");
        setOpenSnack(true);
        setheadPlant(temp);
        setUserDefaultLines(temp1);
        handlesaveClick(true);
        window.location.reload();


      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outLineUpdateData]);

  return (
    <React.Fragment>
      {/* LINE DETAILS */}
          <ConstomCardContent 
            backgroundColor={theme.palette.background.default}
            color={theme.palette.secondaryText.main}
            headPlantid={headPlant.id}
            activityName={headPlant && headPlant.gaia_plants_detail?headPlant.gaia_plants_detail.activity_name:""}
            businessName={headPlant && headPlant.gaia_plants_detail?headPlant.gaia_plants_detail.business_name:""}
            plantName={headPlant && headPlant.gaia_plants_detail?headPlant.gaia_plants_detail.gaia_plant_name:""}
            isDisabled={lineDisable}
            lineName={headPlant.name}
            locationName={headPlant.location}
            nameRef={nameRef}
            locationRef={locationRef}
            customNameRef={customNameRef}
            customName={headPlant.custom_name}
            type={headPlant.type}
            userDefaultline={userDefaultline}
            ChildLineID={ChildIDs}
            setChildLine={(e)=>setChildIDs(e)}
            onHandleConfirmSave={callsavelines}
            outLineUpdateLoading={outLineUpdateLoading}
          />
      {/* ENTITY AND PROD TABLE */}
    </React.Fragment>
  );
}
