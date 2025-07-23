import React, { useState , useEffect} from "react";
import CustomCardHeader from './NewCardHeader'
import GiaHierarchy from "./NewGiaHierarchy";
import { useTranslation } from "react-i18next";
import Typography from "components/Core/Typography/TypographyNDL";
import EditComp from "./EditComp";
import ModalNDL from "components/Core/ModalNDL";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
const ConstomCardContent = (props) => {
  const { t } = useTranslation();
  const [model, setModel] = useState(false)
  const [PlantID,setPlantID] = useState([])

  useEffect(()=>{
  
    setPlantID(props.ChildLineID)
  },[props.userDefaultline,props.ChildLineID])

  function handlePlants(value,option){
    
    props.setChildLine(value)
  }
  const handleEditfunction = (value) => {
  
    setModel(true)

  };

  function handleDialogClose() {
    setModel(false)
  }

  const handleSaveFunction = () => {
    props.onHandleConfirmSave();
    
  }

  return (
    
    <div >
     
    <div className="h-10" >
      <CustomCardHeader onhandleEdit={() => handleEditfunction()} />
      </div>
      <Typography value={t("LineName")} variant="paragraph-xs" color='secondary' />
      <div className="mt-0.5" />
      <Typography value={props.lineName} variant="label-01-s"  />
      <div className="mt-4" />
      <GiaHierarchy
        backgroundColor={props.backgroundColor}
        color={props.color}
        headPlantid={props.headPlantid}
        activityName={props.activityName}
        businessName={props.businessName}
        plantName={props.plantName}
      />

    {(props.type === '1') &&
          <div style={{ lineHeight: "0", marginTop: "10px" }}>
            <br></br>
            <Typography value={"Plants"} variant="paragraph-xs" color='secondary'  />
      <div className="mt-0.5" />
            <Typography value={PlantID.map(plant =>  `${props.lineName} - ${plant.name}`).join(', ')} variant="label-01-s" />
          </div>
          }
      

      <div className="mt-4" />

      <Typography value={t("Location")} variant="paragraph-xs" color='secondary' />
      <div className="mt-0.5" />
      <Typography value={props.locationName} variant="label-01-s"  />
      <ModalNDL disableEnforceFocus onClose={() => handleDialogClose()} aria-labelledby="entity-dialog-title" open={model}>
        <EditComp
          dialogMode={props.dialogMode}
          Editedvalue={props.Editedvalue}
          handleDialogClose={handleDialogClose}
          value={props}
          handleSaveFunction={handleSaveFunction}
        />
      </ModalNDL>

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
