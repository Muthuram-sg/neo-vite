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
  snackType
} from "recoilStore/atoms";
import useSaveLineDetails from "./hooks/useUpdateLine";
import CustomCardHeader from "./components/CustomCardHeader";
import ConstomCardContent from "./components/cardContent";
import { useTranslation } from "react-i18next";
import useLineHeirarchy from './hooks/useLineHeirarchy'
import useUpdateChildLine from './hooks/useUpdateChildLine' 
 

export default function Line() {
  const [userDefaultline, setUserDefaultLines] =
    useRecoilState(userDefaultLines);
  const [selectedIndex] = useRecoilState(selectedPlantIndex);
  const [headPlant, setheadPlant] = useRecoilState(selectedPlant);
  const [lineDisable, setLinedDisable] = useState(true);
  const [ChildIDs,setChildIDs] = useState([]);
  const { LineHeirarchyLoading, LineHeirarchyData, LineHeirarchyError, getLineHeirarchy } = useLineHeirarchy() 
  const {  getUpdateChildLine } = useUpdateChildLine() 
  const [, SetMessage] = useRecoilState(snackMessage);
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
  const nameRef = useRef();
  useEffect(() => {
    if (nameRef.current && locationRef.current) {
      nameRef.current.value = headPlant.name;
      locationRef.current.value = headPlant.location;
    }
    if(headPlant.type === '1'){
      getLineHeirarchy(headPlant.id)
    } 

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headPlant.name, headPlant.location]);

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
  };
  const handleEditfunction = () => {
    if (lineDisable) {
      setLinedDisable(false);
    } else {
      setLinedDisable(true);
    }
  };

  const callsavelines = () => {
    if (
      headPlant.id &&
      locationRef.current && locationRef.current.value &&
      nameRef.current && nameRef.current.value 
      // headPlant.energy_asset &&
      
      
    ) 
    {
      getSaveLineDetails(
        headPlant.id,
        locationRef.current.value,
        nameRef.current.value,
        headPlant.energy_asset,
        headPlant.dash_aggregation,
        headPlant.mic_stop_duration,
        headPlant.shift
      );
      if(headPlant.type === '1'){
        getUpdateChildLine(headPlant.id,"{"+ChildIDs.map(e=> e.id).toString()+"}")
      } 
      window.location.reload();
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

        temp1[selectedIndex].line.name = data.returning[0].name;
        temp1[selectedIndex].line.location = data.returning[0].location;

        SetMessage(t("LineDetailsUpdate"));
        SetType("success");
        setOpenSnack(true);
        setheadPlant(temp);
        setUserDefaultLines(temp1);
        handlesaveClick(true);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outLineUpdateData]);

  return (
    <React.Fragment>
      {/* LINE DETAILS */}

      <div className="p-4">
            <CustomCardHeader
              lineDisable={lineDisable}
              onhandleEdit={handleEditfunction}
              onHandleSave={handlesaveClick}
              onHandleConfirmSave={callsavelines}
            />

        <div>
          <ConstomCardContent 
            backgroundColor={theme.palette.background.default}
            color={theme.palette.secondaryText.main}
            headPlantid={headPlant.id}
            activityName={headPlant.gaia_plants_detail && headPlant.gaia_plants_detail.activity_name}
            businessName={headPlant.gaia_plants_detail && headPlant.gaia_plants_detail.business_name}
            plantName={headPlant.gaia_plants_detail && headPlant.gaia_plants_detail.gaia_plant_name}
            isDisabled={lineDisable}
            lineName={headPlant.name}
            locationName={headPlant.location}
            nameRef={nameRef}
            locationRef={locationRef}
            type={headPlant.type}
            userDefaultline={userDefaultline}
            ChildLineID={ChildIDs}
            setChildLine={(e)=>setChildIDs(e)}
          />
        </div>
      </div>

      {/* ENTITY AND PROD TABLE */}
    </React.Fragment>
  );
}
