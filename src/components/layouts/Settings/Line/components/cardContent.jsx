import React, { useEffect,useState } from "react";
import InputFieldNDL from "components/Core/InputFieldNDL";
import GiaHierarchy from "./giaHierarchy";
import { useTranslation } from "react-i18next"; 
import SelectBox from "components/Core/DropdownList/DropdownListNDL";

const ConstomCardContent = (props) => {
  const { t } = useTranslation(); 
  const [PlantID,setPlantID] = useState([])

  useEffect(()=>{
  
    setPlantID(props.ChildLineID)
  },[props.userDefaultline,props.ChildLineID])

  function handlePlants(value,option){
    
    props.setChildLine(value)
  }

  return (
    <div >
      <GiaHierarchy
        backgroundColor={props.backgroundColor}
        color={props.color}
        headPlantid={props.headPlantid}
        activityName={props.activityName}
        businessName={props.businessName}
        plantName={props.plantName}
      />
    <br></br>
      <InputFieldNDL
        id="line-plant"
        defaultValue={props.lineName}
        inputRef={props.nameRef}
        disabled={props.isDisabled}
        label={t("LineName")}
      />
      {(props.type === '1') &&
      <div style={{ lineHeight: "0", marginBottom: "10px" }}>
        <SelectBox 
              label={t("Plants")}
              id="select-part-signal" 
              edit={true}
              disabled={props.isDisabled}
              auto={true}
              multiple={true}
              options={props.userDefaultline.map(e=> {return e.line}).filter(f=> f.type === "2")}
              isMArray={true}
              checkbox={false}
              value={PlantID} 
              onChange={(e, option) => handlePlants(e,option)} 
              keyValue="name"
              keyId="id" 
        />
      </div>
      }
     
<br></br>
      <InputFieldNDL
        id="line-location"
        defaultValue={props.locationName}
        inputRef={props.locationRef}
        disabled={props.isDisabled}
        label={t("Location")}
      />

    </div>
  );
};
const isRender = (prev, next) => {
  return prev.locationRef !== next.locationRef ||
    prev.disabled !== next.disabled ||
    prev.isDisabled !== next.isDisabled ||
    prev.nameRef !== next.nameRef ||
    prev.headPlantid !== next.headPlantid ||
    prev.activityName !== next.activityName ||
    prev.businessName !== next.businessName ||
    prev.plantName !== next.plantName ||
    prev.backgroundColor !== next.backgroundColor ||
    prev.className !== next.className ||
    prev.userDefaultline !== next.userDefaultline ||
    prev.ChildLineID !== next.ChildLineID
    ? false
    : true;
};
export default React.memo(ConstomCardContent, isRender);
